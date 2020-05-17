import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_cqgKJ5Af87bM2oDM3qn6q5Yc00aQ2uGg1D');

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    //2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
