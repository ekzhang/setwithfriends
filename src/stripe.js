import { loadStripe } from "@stripe/stripe-js";

import config, { isDev } from "./config";

const stripe = isDev ? null : loadStripe(config.stripe.publishableKey);

export async function patronCheckout(email) {
  if (isDev) {
    return {
      error: {
        message: "Stripe not supported in development mode. Sorry!",
      },
    };
  }
  const origin = window.location.origin;
  return (await stripe).redirectToCheckout({
    lineItems: [{ price: config.stripe.priceId, quantity: 1 }],
    mode: "subscription",
    successUrl: origin + "/donate",
    cancelUrl: origin + "/donate",
    customerEmail: email,
  });
}

export default stripe;
