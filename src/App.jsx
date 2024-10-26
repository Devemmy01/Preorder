import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Preorder from "./Preorder";
import PaymentPage from "./PaymentPage";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path="/" element={<Preorder />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;