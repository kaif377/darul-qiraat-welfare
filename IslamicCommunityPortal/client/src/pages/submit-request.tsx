import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertRequestSchema } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const requestFormSchema = insertRequestSchema.extend({
  files: z.instanceof(FileList).optional(),
  consent: z.boolean().refine(val => val === true, {
    message: "You must consent to the processing of your personal data",
  }),
}).omit({ fileUrls: true });

type RequestFormValues = z.infer<typeof requestFormSchema>;

export default function SubmitRequest() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      requestType: "",
      subject: "",
      description: "",
      consent: false,
    },
  });
  
  const requestMutation = useMutation({
    mutationFn: async (values: RequestFormValues) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'files' && key !== 'consent') {
          formData.append(key, value as string);
        }
      });
      
      // Add files
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const res = await apiRequest('POST', '/api/submit-request', undefined, {
        headers: {}, // No Content-Type header for multipart/form-data
        body: formData,
        method: 'POST',
      });
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted successfully",
        description: "Thank you for your submission. A committee member will review your request and contact you soon.",
      });
      form.reset();
      setSelectedFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit request",
        description: error instanceof Error ? error.message : "An error occurred while submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      if (fileArray.length + selectedFiles.length > 5) {
        toast({
          title: "Too many files",
          description: "You can upload a maximum of 5 files",
          variant: "destructive",
        });
        return;
      }
      setSelectedFiles(prev => [...prev, ...fileArray]);
      e.target.value = ''; // Reset input to allow selecting the same file again
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = (values: RequestFormValues) => {
    requestMutation.mutate(values);
  };
  
  return (
    <div className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">Submit a Request</h1>
            <p className="text-neutral-600">
              If you're facing challenges or need assistance, please fill out the form below. All submissions are confidential.
            </p>
          </div>
          
          <Card className="bg-white">
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-neutral-200 pb-2">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
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
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number*</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Request Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-neutral-200 pb-2">Request Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="requestType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a request type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="complaint">Complaint</SelectItem>
                              <SelectItem value="assistance">Financial Assistance</SelectItem>
                              <SelectItem value="counseling">Spiritual Counseling</SelectItem>
                              <SelectItem value="mediation">Conflict Mediation</SelectItem>
                              <SelectItem value="education">Educational Support</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input placeholder="Subject of your request" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide as much detail as possible about your situation" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide as much detail as possible about your situation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-neutral-200 pb-2">Supporting Documents</h3>
                    
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-50 border-neutral-300 hover:bg-neutral-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-neutral-500" />
                            <p className="mb-2 text-sm text-neutral-500">
                              <span className="font-medium text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-neutral-500">
                              PNG, JPG, PDF, DOC up to 10MB (Max 5 files)
                            </p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 border rounded">
                              <div className="flex items-center">
                                <div className="ml-2 text-sm text-neutral-700">{file.name}</div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Consent */}
                  <FormField
                    control={form.control}
                    name="consent"
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
                            I consent to the processing of my personal data
                          </FormLabel>
                          <FormDescription>
                            Your information will be kept confidential and only used for processing your request.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={requestMutation.isPending}
                  >
                    {requestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
