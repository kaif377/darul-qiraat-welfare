import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertDonationSchema } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isStripeAvailable } from "@/lib/stripe";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key. Checkout will not work.');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : 
  null;

const donationFormSchema = insertDonationSchema.extend({
  customAmount: z.string().optional(),
  predefinedAmount: z.enum(['25', '50', '100', 'custom']).default('100'),
}).refine((data) => {
  // If predefined amount is 'custom', custom amount must be provided
  if (data.predefinedAmount === 'custom') {
    return !!data.customAmount && !isNaN(parseInt(data.customAmount));
  }
  return true;
}, {
  message: "Please enter a valid custom amount",
  path: ["customAmount"]
}).transform(data => {
  // Calculate final amount based on predefined or custom amount
  const finalAmount = data.predefinedAmount === 'custom' 
    ? parseInt(data.customAmount as string) * 100 // Convert to cents
    : parseInt(data.predefinedAmount) * 100; // Convert to cents
  
  return {
    ...data,
    amount: finalAmount
  };
});

type DonationFormValues = z.input<typeof donationFormSchema>;
type TransformedDonationValues = z.output<typeof donationFormSchema>;

// The checkout form component
const CheckoutForm = ({
  clientSecret,
  donationSuccess
}: {
  clientSecret: string;
  donationSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your generous donation!",
      });
      donationSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : "Complete Donation"}
      </Button>
      <p className="text-xs text-neutral-500 text-center">
        Your donation is secure and encrypted. By donating, you agree to our terms and privacy policy.
      </p>
    </form>
  );
};

export default function Donate() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donorName: "",
      donorEmail: "",
      anonymous: false,
      frequency: "one-time",
      predefinedAmount: "100",
    },
  });
  
  const showCustomAmount = form.watch('predefinedAmount') === 'custom';
  
  // State for development mode without Stripe
  const [devModeSuccess, setDevModeSuccess] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [donationId, setDonationId] = useState<number | null>(null);
  
  // Donation/Payment Intent creation mutation
  const donationMutation = useMutation({
    mutationFn: async (values: TransformedDonationValues) => {
      setDonationAmount(values.predefinedAmount === 'custom' 
        ? `$${values.customAmount}` 
        : `$${values.predefinedAmount}`);
      const res = await apiRequest('POST', '/api/create-payment-intent', values);
      return res.json();
    },
    onSuccess: (data) => {
      setDonationId(data.donationId);
      
      // Handle development mode (no Stripe)
      if (data.development) {
        toast({
          title: "Development Mode",
          description: "Donation recorded successfully in development mode (no payment processing)",
        });
        setDevModeSuccess(true);
        setShowPaymentForm(true);
      } 
      // Handle normal mode with Stripe
      else if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentForm(true);
      }
      // Unexpected response
      else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. The server did not return the expected data.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to create donation",
        description: error instanceof Error ? error.message : "An error occurred while processing your donation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: DonationFormValues) => {
    try {
      const transformedValues = donationFormSchema.parse(values);
      donationMutation.mutate(transformedValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      }
    }
  };
  
  const donationSuccess = () => {
    form.reset();
    setShowPaymentForm(false);
    setClientSecret(null);
  };
  
  return (
    <div className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">Support Our Cause</h1>
            <p className="text-neutral-600">
              Your generous donations help us continue our work in the community. 
              All contributions are used responsibly and transparently.
            </p>
          </div>
          
          <Card className="bg-white">
            <CardContent className="p-6 md:p-8">
              {!showPaymentForm ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Donation Amount */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold border-b border-neutral-200 pb-2">Donation Amount</h3>
                      
                      <FormField
                        control={form.control}
                        name="predefinedAmount"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Select Amount</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                              >
                                <FormItem className="flex items-center space-x-0 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="25" className="sr-only" />
                                  </FormControl>
                                  <FormLabel className={`flex-1 border-2 rounded-md py-3 px-4 text-center font-medium cursor-pointer transition-colors ${field.value === '25' ? 'bg-primary text-white border-primary' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                                    $25
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="50" className="sr-only" />
                                  </FormControl>
                                  <FormLabel className={`flex-1 border-2 rounded-md py-3 px-4 text-center font-medium cursor-pointer transition-colors ${field.value === '50' ? 'bg-primary text-white border-primary' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                                    $50
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="100" className="sr-only" />
                                  </FormControl>
                                  <FormLabel className={`flex-1 border-2 rounded-md py-3 px-4 text-center font-medium cursor-pointer transition-colors ${field.value === '100' ? 'bg-primary text-white border-primary' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                                    $100
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="custom" className="sr-only" />
                                  </FormControl>
                                  <FormLabel className={`flex-1 border-2 rounded-md py-3 px-4 text-center font-medium cursor-pointer transition-colors ${field.value === 'custom' ? 'bg-primary text-white border-primary' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                                    Custom
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {showCustomAmount && (
                        <FormField
                          control={form.control}
                          name="customAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter Amount ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter custom amount" 
                                  min="1" 
                                  step="1" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Donation Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="one-time">One-time donation</SelectItem>
                                <SelectItem value="monthly">Monthly donation</SelectItem>
                                <SelectItem value="quarterly">Quarterly donation</SelectItem>
                                <SelectItem value="yearly">Yearly donation</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold border-b border-neutral-200 pb-2">Personal Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="donorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="donorEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address*</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email address" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="anonymous"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Make my donation anonymous
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={donationMutation.isPending}
                    >
                      {donationMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : "Proceed to Payment"}
                    </Button>
                  </form>
                </Form>
              ) : devModeSuccess ? (
                <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">Thank You for Your Donation!</h3>
                    <p className="text-neutral-600 max-w-md">
                      Your donation of {donationAmount} has been recorded successfully.
                      (Donation ID: {donationId})
                    </p>
                    <p className="text-sm text-neutral-500 mt-2">
                      You are currently running in development mode without Stripe payment processing.
                      In production, payment would be processed securely through Stripe.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowPaymentForm(false);
                      setDevModeSuccess(false);
                      setDonationId(null);
                      form.reset();
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Make Another Donation
                  </Button>
                </div>
              ) : clientSecret && stripePromise ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b border-neutral-200 pb-2">Payment Information</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-700">Secure payment powered by</span>
                    <svg 
                      viewBox="0 0 60 25" 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="60" 
                      height="25"
                      className="h-6"
                    >
                      <path 
                        fill="#635BFF" 
                        d="M59.64 14.18h-8.06v-1.93h8.05v1.93h.01zm0-3.15h-8.06V9.09h8.05v1.94h.01zM18.52 9.95c0-.5-.43-.91-.96-.91s-.96.41-.96.9c0 .5.43.9.96.9s.96-.4.96-.9zm-9.6 0c0-.5-.43-.91-.96-.91s-.96.41-.96.9c0 .5.43.9.96.9s.96-.4.96-.9zm19.2 0c0-.5-.43-.91-.96-.91s-.96.41-.96.9c0 .5.43.9.96.9s.96-.4.96-.9zM33 10.85h1.92c.07-.44.32-.8.69-1.05a2.2 2.2 0 011.3-.41c1.11 0 1.78.55 1.78 1.41 0 .76-.67 1.28-1.65 1.28h-1.61v1.6h1.61c1.11 0 1.9.56 1.9 1.4 0 .93-.76 1.43-1.89 1.43-.63 0-1.1-.16-1.43-.48-.32-.28-.53-.67-.6-1.13h-1.96c.11 1.06.56 1.93 1.27 2.53.75.61 1.7.95 2.72.95 2.27 0 3.87-1.13 3.87-2.98 0-1.1-.76-2.05-1.8-2.35.86-.35 1.44-1.13 1.44-2.09 0-1.62-1.45-2.66-3.33-2.66-1.98 0-3.22 1.1-3.33 2.67l.1.38zm-28.16 1.1H.35v-1.6h4.5c-.01-1.62 1.33-2.95 2.95-2.95.8 0 1.56.33 2.11.9a3.02 3.02 0 01.83 2.07h4.5v1.6h-4.5a2.96 2.96 0 01-2.95 2.95c-1.62 0-2.94-1.33-2.95-2.95v-.02zM58.6 4.7h-7.02v1.93h7.01V4.7h.01zm-49.12 0H1.4v1.93h8.06V4.7h.01zm40.29 5.25c0-.5-.43-.91-.96-.91s-.96.41-.96.9c0 .5.43.9.96.9s.96-.4.96-.9zm-6.52 5.76c-.07.4-.22.76-.43 1.06-.2.3-.47.58-.78.79a3.25 3.25 0 01-1.03.51c-.37.12-.77.18-1.19.18-.41 0-.81-.06-1.18-.18-.37-.12-.7-.29-1.02-.51-.31-.21-.57-.48-.77-.79-.2-.3-.35-.65-.43-1.06h-2.02c.1.78.35 1.47.73 2.08.4.61.89 1.12 1.48 1.53.6.41 1.28.71 2.02.92.75.2 1.52.31 2.31.31.8 0 1.57-.1 2.32-.31.74-.21 1.42-.52 2.01-.92a5.55 5.55 0 001.47-1.53c.38-.61.62-1.3.73-2.08h-2.02zm-2.33-14H40.9v4.24h-4.24v9.51h4.24v4.24h.03l8.48-8.5-8.48-9.5zm-18.97 5.94v7.81h3.09c.42 0 .83-.06 1.2-.17A2.87 2.87 0 0127.35 15c.32-.21.58-.48.77-.8.21-.3.35-.67.43-1.06h2.02c-.09.78-.34 1.48-.73 2.1-.39.61-.9 1.12-1.5 1.52a6.92 6.92 0 01-2.03.9A9.2 9.2 0 0124 18c-.8 0-1.56-.1-2.3-.3a6.63 6.63 0 01-2.05-.9 5.64 5.64 0 01-1.53-1.55c-.4-.64-.69-1.42-.84-2.34V9.7c.15-.91.44-1.7.83-2.34a5.64 5.64 0 011.54-1.55 6.63 6.63 0 012.05-.9 9.2 9.2 0 012.3-.3c.8 0 1.57.1 2.31.31.75.2 1.42.51 2.03.92.6.4 1.1.9 1.49 1.52.39.61.64 1.32.73 2.1h-2.01c-.08-.4-.22-.76-.43-1.07a3.16 3.16 0 00-.77-.8 2.87 2.87 0 00-1.02-.5c-.38-.11-.78-.17-1.2-.17h-3.1v.03zm-8.76 0V9.1H8.93V7.65h9.6v1.44h-4.28v7.81h-1.95l-.01.01zm-3.42 0V7.65h1.94v7.81h-1.94zm-4.62 0V9.1H1.95V7.65h9.6v1.44H7.27v7.81H5.32l-.01.01z" 
                      />
                    </svg>
                  </div>
                  
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret={clientSecret} donationSuccess={donationSuccess} />
                  </Elements>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>Preparing payment form...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
