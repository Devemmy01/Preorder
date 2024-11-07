import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preorder from "./Preorder";
import { SuccessPayment, CancelledPayment } from './components/PaymentResponse';
import PaymentStatus from './PaymentStatus';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route index element={<Preorder />} />
          <Route path="/success" element={<SuccessPayment />} />
          <Route path="/cancel" element={<CancelledPayment />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
        </Routes>
      </Elements>
    </Router>
  );
};

export default App;