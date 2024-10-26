import React from "react";
import { useLocation } from "react-router-dom";
import ban from "./assets/emb.png";
import banm from "./assets/banm.jpeg";

const PaymentPage = () => {
    const location = useLocation();
    const paymentLink = location.state?.paymentLink;

    return (
        <div className="relative flex flex-col items-center justify-center h-screen">
            <img src={banm} alt="" className="absolute h-screen w-full object-cover"/>
            <div className="absolute h-screen w-full bg-black opacity-50"></div>
            <div className="absolute flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4 text-white">Proceed to Payment</h1>
                <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black font-semibold px-10 p-4 rounded-md hover:bg-black hover:text-white transition"
                >
                    Proceed
                </a>
            </div>
        </div>
    );
};

export default PaymentPage;