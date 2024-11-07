import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ orderId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
    setIsReady(true);
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe not initialized');
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-status?order_id=${orderId}`,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setMessage(error.message || 'An error occurred while processing your payment.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      {message && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">{message}</div>}
      <button
        disabled={isProcessing || !stripe || !elements}
        className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium ${
          isProcessing || !stripe || !elements ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Pay now'}
      </button>
      <p className="text-center text-sm text-gray-500 mt-4">Kindly fill the payment form before clicking the button.</p>
    </form>
  );
};

export default CheckoutForm;