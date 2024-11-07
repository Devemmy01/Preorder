import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PaymentStatus = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    message: '',
    type: '', // 'success', 'error', or 'processing'
    isLoading: true
  });

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      setStatus({
        message: 'No payment information found.',
        type: 'error',
        isLoading: false
      });
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        
        switch (paymentIntent.status) {
          case 'succeeded':
            setStatus({
              message: 'Payment successful! Thank you for your order.',
              type: 'success',
              isLoading: false
            });
            break;

          case 'processing':
            setStatus({
              message: "Payment is processing. We'll update you when payment is received.",
              type: 'processing',
              isLoading: false
            });
            break;

          case 'requires_payment_method':
            setStatus({
              message: 'Payment failed. Please try another payment method.',
              type: 'error',
              isLoading: false
            });
            setTimeout(() => navigate('/preorder'), 3000);
            break;

          default:
            setStatus({
              message: 'Something went wrong with your payment.',
              type: 'error',
              isLoading: false
            });
            break;
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus({
          message: 'Failed to check payment status.',
          type: 'error',
          isLoading: false
        });
      }
    };

    checkPaymentStatus();
  }, [stripe, navigate]);

  const StatusIcon = () => {
    switch (status.type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'processing':
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (status.isLoading) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <StatusIcon />
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
          <p className={`text-lg ${
            status.type === 'success' ? 'text-green-600' :
            status.type === 'error' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {status.message}
          </p>
          {status.type === 'success' && (
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Return to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus; 