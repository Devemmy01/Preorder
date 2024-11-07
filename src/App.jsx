import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preorder from "./Preorder";
import { SuccessPayment, CancelledPayment } from './components/PaymentResponse';
import PaymentStatus from './PaymentStatus';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/preorder" element={<Preorder />} />
        <Route path="/success" element={<SuccessPayment />} />
        <Route path="/cancel" element={<CancelledPayment />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
      </Routes>
    </Router>
  );
};

export default App;