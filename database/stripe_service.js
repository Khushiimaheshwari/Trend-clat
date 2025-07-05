import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class Stripe_Service {

  async verifyWebhook(rawBody, signature) {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

  async createCheckoutSession(orderDetails) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
        line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Order Total', 
            },
            unit_amount: Math.round(orderDetails.Total_Amount * 100),
          },
          quantity: 1,
        }
      ],
      success_url: `http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/checkout/cancel',
      metadata: {
        orderId: orderDetails.Order_ID,
        customerId: orderDetails.Customer_ID.toString(),
        totalAmount: orderDetails.Total_Amount.toString(),
      },
    });

    return session;
  }
}

export const stripeService = new Stripe_Service();
