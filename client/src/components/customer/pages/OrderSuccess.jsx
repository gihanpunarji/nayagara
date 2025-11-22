import React from 'react';
import { Link } from 'react-router-dom';

function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. You will receive an email confirmation shortly.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h2>
          <p className="text-gray-600">This is a placeholder for order details. You can fetch and display order information here.</p>
        </div>
        <Link
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;