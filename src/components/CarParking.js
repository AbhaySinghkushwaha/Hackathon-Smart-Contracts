import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './App.css';

function CarParking() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message);
        setPaymentSuccess(null);
      } else {
        setPaymentError(null);
        setPaymentSuccess(paymentMethod.id);
        // Here you would typically send paymentMethod.id to your server for further processing.
        alert('Payment successful!'); // Replace this with your own success handling
      }
    } catch (error) {
      console.error('Error:', error);
      setPaymentError('An error occurred while processing your payment.');
      setPaymentSuccess(null);
    }
  };

  return (
    <div className="container">
      <h1>Car Parking Payment</h1>
      <form id="payment-form" onSubmit={handleSubmit}>
        <label htmlFor="card-element">
          Credit or debit card
        </label>
        <div id="card-element">
          <CardElement />
        </div>

        {/* Used to display form errors. */}
        <div id="card-errors" role="alert">
          {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
          {paymentSuccess && <div style={{ color: 'green' }}>Payment successful!</div>}
        </div>

        <button id="submit" type="submit" disabled={!stripe}>
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default CarParking;
