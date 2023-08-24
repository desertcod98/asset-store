import { Stripe, loadStripe } from '@stripe/stripe-js';

const PUBLIC_STRIPE_KEY = "pk_test_51NijwAJ1iOBK5q05rQDaeK9v5HoAFMZiJlnR6iPOwBQm7auQCaX8kbAf9jHDYAjCFNCyTwYroUe2TiCW67MVsLmx00CkcZe455";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLIC_STRIPE_KEY);
  }
  return stripePromise;
};

export default getStripe;