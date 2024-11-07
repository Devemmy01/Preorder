import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    const orderId = new URLSearchParams(window.location.search).get('order_id');

    if (!clientSecret) {
      setMessage('No payment information found.');
      setIsLoading(false);
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          // Redirect to success page with order ID
          window.location.href = `https://lovepassionsandwholeness.com/api/preorder-stripe/${orderId}?paymentintent=${paymentIntent.id}`;
          break;

        case 'processing':
          setMessage("Payment is processing. We'll update you when payment is received.");
          break;

        case 'requires_payment_method':
          setMessage('Payment failed. Please try another payment method.');
          // Optionally redirect back to checkout page
          setTimeout(() => {
            navigate('/preorder');
          }, 3000);
          break;

        default:
          setMessage('Something went wrong with your payment.');
          break;
      }
      setIsLoading(false);
    });
  }, [stripe, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus; 