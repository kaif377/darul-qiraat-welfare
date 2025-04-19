import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Mail, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactFormSchema = insertContactSchema;

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  const contactMutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      const res = await apiRequest('POST', '/api/contact', values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "Thank you for contacting us. We will respond to your inquiry as soon as possible.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "An error occurred while sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: ContactFormValues) => {
    contactMutation.mutate(values);
  };
  
  return (
    <div className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-neutral-600">
              Have questions? Get in touch with our team for more information.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">Our Location</h3>
                  <p className="text-neutral-600">123 Islamic Center Avenue<br/>New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">Email Address</h3>
                  <p className="text-neutral-600">info@islamiccommittee.org<br/>support@islamiccommittee.org</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">Phone Number</h3>
                  <p className="text-neutral-600">(123) 456-7890<br/>(987) 654-3210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">Office Hours</h3>
                  <p className="text-neutral-600">
                    Monday - Friday: 9:00 AM - 5:00 PM<br/>
                    Saturday: 10:00 AM - 2:00 PM<br/>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
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
                      name="email"
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
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject*</FormLabel>
                          <FormControl>
                            <Input placeholder="Subject of your message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
