import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowLeft, Copy } from 'lucide-react';

const SuccessPayment = () => {
  const [status, setStatus] = useState('loading');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');
    const transactionId = queryParams.get('transaction_id');

    if (sessionId) {
      // Handle Stripe success
      fetch(`https://lovepassionsandwholeness.com/api/verify-payment?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setStatus('success');
          setOrderData(data);
        })
        .catch(() => setStatus('error'));
    } else if (transactionId) {
      // Handle Flutterwave success (existing logic)
      setStatus('success');
      setOrderData({ transaction_id: transactionId });
    }
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Successful!</h1>
          <div className="bg-green-50 w-full mt-2 py-1 px-3 rounded-full">
            <p className="text-green-600 text-sm text-center">Your order has been confirmed</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {orderData && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">{orderData.transaction_id}</span>
                  <button 
                    onClick={() => handleCopy(orderData.transaction_id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {orderData && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Reference</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">{orderData.reference}</span>
                  <button 
                    onClick={() => handleCopy(orderData.reference)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-gray-600 text-center mb-8">
          <p>Thank you for pre-ordering "Embrace"!</p>
          <p className="mt-2">We've sent a confirmation email with your order details.</p>
          <p className="mt-2 text-sm">Please save your transaction details for future reference.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center w-full px-4 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

const CancelledPayment = ({ reference }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Cancelled</h1>
          <div className="bg-red-50 w-full mt-2 py-1 px-3 rounded-full">
            <p className="text-red-600 text-sm text-center">Transaction was not completed</p>
          </div>
        </div>

        {reference && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Reference</span>
              <span className="text-gray-900 font-medium">{reference}</span>
            </div>
          </div>
        )}

        <div className="text-gray-600 text-center mb-8">
          <p>Your order has been cancelled. Don't worry, no charges were made.</p>
          <p className="mt-2">If you'd like to try again or have any questions, please feel free to place a new order.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center w-full px-4 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Order Form
          </button>
        </div>
      </div>
    </div>
  );
};

export { SuccessPayment, CancelledPayment };