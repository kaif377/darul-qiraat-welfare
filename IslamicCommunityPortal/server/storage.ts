import { 
  users, type User, type InsertUser,
  requestSubmissions, type RequestSubmission, type InsertRequest,
  donations, type Donation, type InsertDonation,
  contactMessages, type ContactMessage, type InsertContact
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Request submission methods
  createRequest(request: InsertRequest): Promise<RequestSubmission>;
  getRequests(): Promise<RequestSubmission[]>;
  getRequestById(id: number): Promise<RequestSubmission | undefined>;
  
  // Donation methods
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStripeId(id: number, stripePaymentId: string): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  
  // Contact message methods
  createContactMessage(message: InsertContact): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Request submission methods
  async createRequest(insertRequest: InsertRequest): Promise<RequestSubmission> {
    const request = {
      ...insertRequest,
      address: insertRequest.address || null,
      fileUrls: insertRequest.fileUrls || [],
      createdAt: new Date(),
      status: 'pending'
    };
    const result = await db.insert(requestSubmissions).values(request).returning();
    return result[0];
  }
  
  async getRequests(): Promise<RequestSubmission[]> {
    return await db.select().from(requestSubmissions).orderBy(desc(requestSubmissions.createdAt));
  }
  
  async getRequestById(id: number): Promise<RequestSubmission | undefined> {
    const result = await db.select().from(requestSubmissions).where(eq(requestSubmissions.id, id));
    return result[0];
  }
  
  // Donation methods
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const donation = {
      ...insertDonation,
      anonymous: insertDonation.anonymous || false,
      createdAt: new Date(),
      stripePaymentId: null
    };
    const result = await db.insert(donations).values(donation).returning();
    return result[0];
  }
  
  async updateDonationStripeId(id: number, stripePaymentId: string): Promise<Donation> {
    const result = await db.update(donations)
      .set({ stripePaymentId })
      .where(eq(donations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error(`Donation with id ${id} not found`);
    }
    
    return result[0];
  }
  
  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }
  
  // Contact message methods
  async createContactMessage(insertMessage: InsertContact): Promise<ContactMessage> {
    const message = {
      ...insertMessage,
      createdAt: new Date()
    };
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

export const storage = new DatabaseStorage();
