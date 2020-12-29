import { loadStripe } from "@stripe/stripe-js";

import config from "./config";

const stripe = loadStripe(config.stripe.publishableKey);

export async function patronCheckout(email) {
  const origin = window.location.origin;
  return (await stripe).redirectToCheckout({
    lineItems: [{ price: config.stripe.priceId, quantity: 1 }],
    mode: "subscription",
    successUrl: origin + "/donate",
    cancelUrl: origin,
    customerEmail: email,
  });
}

export default stripe;
