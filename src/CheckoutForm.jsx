import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    // Check for initial payment status
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-status?order_id=${orderId}`,
        },
      });

      // This point will only be reached if there is an immediate error
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
        } else {
          setMessage("An unexpected error occurred.");
        }
        console.error('Payment error:', error);
      }
    } catch (e) {
      console.error('Payment confirmation error:', e);
      setMessage("Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
      <PaymentElement 
        id="payment-element" 
        options={{
          layout: "tabs",
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          }
        }}
      />
      
      {/* Show error messages */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes("succeeded") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <button 
        disabled={isLoading || !stripe || !elements} 
        className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center
          ${isLoading || !stripe || !elements ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} 
          transition-colors duration-200`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Pay now'
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;