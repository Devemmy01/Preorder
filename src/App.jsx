import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Preorder from "./Preorder";
import { SuccessPayment, CancelledPayment } from './components/PaymentResponse';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Preorder />} />
        <Route path="/success" element={<SuccessPayment />} />
        <Route path="/cancel" element={<CancelledPayment />} />
      </Routes>
    </Router>
  );
};

export default App;