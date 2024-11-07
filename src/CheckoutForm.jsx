import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ orderId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!stripe) {
      console.log('Stripe not yet loaded');
      return;
    }

    if (!elements) {
      console.log('Elements not yet loaded');
      return;
    }

    console.log('Stripe and Elements loaded successfully');
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
          payment_method_data: {
            billing_details: {
              // Add any billing details if needed
            },
          },
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
      <div className="text-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading payment form...</p>
      </div>
    );
  }

  if (!stripe || !elements) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
        <p className="text-yellow-700">
          Payment system is initializing. Please wait...
        </p>
      </div>
    );
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement 
        id="payment-element"
        options={{
          layout: 'tabs',
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          }
        }}
      />

      {message && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          {message}
        </div>
      )}

      <button
        disabled={isProcessing || !stripe || !elements}
        className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium
          ${isProcessing || !stripe || !elements ? 
            'bg-gray-400 cursor-not-allowed' : 
            'bg-black hover:bg-gray-800'}`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </div>
        ) : (
          'Pay now'
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;