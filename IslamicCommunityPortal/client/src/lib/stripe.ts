import { apiRequest } from "@/lib/queryClient";

/**
 * Check if Stripe is available in the current environment
 * @returns Whether Stripe is available
 */
export function isStripeAvailable(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLIC_KEY;
}

/**
 * Create a payment intent for a donation
 * @param amount The amount to charge in cents
 * @param donorName The name of the donor
 * @param donorEmail The email of the donor
 * @param anonymous Whether the donation should be anonymous
 * @param frequency The donation frequency (one-time, monthly, etc.)
 * @returns The donation data with client secret if Stripe is available
 */
export async function createDonationPaymentIntent(
  amount: number,
  donorName: string,
  donorEmail: string,
  anonymous: boolean,
  frequency: string
): Promise<{ clientSecret?: string, donationId: number, development?: boolean, message?: string }> {
  const response = await apiRequest('POST', '/api/create-payment-intent', {
    amount,
    donorName,
    donorEmail,
    anonymous,
    frequency
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create payment intent');
  }
  
  const data = await response.json();
  
  // Handle both development mode and production mode
  return {
    clientSecret: data.clientSecret,
    donationId: data.donationId,
    development: data.development,
    message: data.message
  };
}
