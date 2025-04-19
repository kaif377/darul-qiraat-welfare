import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRequestSchema, insertContactSchema, insertDonationSchema } from "@shared/schema";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';

// Configure file upload
const storage_dir = path.join(process.cwd(), 'uploads');
// Create the directory if it doesn't exist
if (!fs.existsSync(storage_dir)) {
  fs.mkdirSync(storage_dir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storage_dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, PDFs, and documents
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'video/quicktime',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, PDFs, and documents are allowed.') as any);
    }
  }
});

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
let stripe: Stripe | null = null;

// Only initialize Stripe if we have a secret key
if (stripeSecretKey) {
  try {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any // Type casting to avoid version mismatch error
    });
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
} else {
  console.log('Stripe not initialized: No STRIPE_SECRET_KEY provided');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit a request/complaint
  app.post('/api/submit-request', upload.array('files', 5), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const fileUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
      
      // Validate request data
      const requestData = { ...req.body, fileUrls };
      const validatedData = insertRequestSchema.parse(requestData);
      
      // Store the request
      const result = await storage.createRequest(validatedData);
      
      res.status(201).json({
        message: "Request submitted successfully",
        data: result
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to submit request" 
      });
    }
  });
  
  // Create payment intent for donation
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      // Validate donation data
      const validatedData = insertDonationSchema.parse(req.body);
      
      // Create donation record
      const donation = await storage.createDonation(validatedData);
      
      // If Stripe is configured, create a real payment intent
      if (stripe) {
        try {
          // Create payment intent
          const paymentIntent = await stripe.paymentIntents.create({
            amount: validatedData.amount,
            currency: 'usd',
            metadata: {
              donationId: donation.id.toString(),
            }
          });
          
          // Update donation with stripe payment ID
          if (paymentIntent.id) {
            await storage.updateDonationStripeId(donation.id, paymentIntent.id);
          }
          
          res.json({ 
            clientSecret: paymentIntent.client_secret,
            donationId: donation.id
          });
        } catch (stripeError) {
          console.error("Stripe error:", stripeError);
          res.status(400).json({ 
            message: stripeError instanceof Error ? stripeError.message : "Failed to process payment with Stripe"
          });
        }
      } else {
        // Development mode - no Stripe available
        // Create a mock payment for development/testing
        console.log('Running in development mode without Stripe. Recording donation without payment processing.');
        
        // Use a fake/mock payment ID
        const mockPaymentId = `dev_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await storage.updateDonationStripeId(donation.id, mockPaymentId);
        
        // Return a mock response - this won't work with actual Stripe Elements in frontend
        // but allows backend functionality to be tested
        res.json({
          development: true,
          message: "Donation recorded in development mode (no payment processing)",
          donationId: donation.id,
          mockPaymentId
        });
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process donation" 
      });
    }
  });
  
  // Submit a contact message
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate contact data
      const validatedData = insertContactSchema.parse(req.body);
      
      // Store the contact message
      const result = await storage.createContactMessage(validatedData);
      
      res.status(201).json({
        message: "Message sent successfully",
        data: result
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to send message" 
      });
    }
  });
  
  // Serve uploaded files
  app.use('/uploads', express.static(storage_dir));

  const httpServer = createServer(app);

  return httpServer;
}
