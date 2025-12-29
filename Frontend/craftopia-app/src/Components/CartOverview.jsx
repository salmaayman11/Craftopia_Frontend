import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api/api';
import {toast} from 'react-hot-toast';
const ESCROW_FEE = 0;


const CartOverview = ({ cartItems }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);
  const total = subtotal + ESCROW_FEE;

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleCheckout = async () => {
  setLoading(true);
  try {
    const productIds = cartItems.map(item => item.id);
    const quantity = cartItems.map(item => item.cartQuantity);

    const response = await apiPost('/order/placeOrder', {
      productIds,
      quantity
    });

    console.log('✅ Order placed successfully:', response);
    navigate('/orders');
  } catch (error) {
    console.error('❌ Error placing order:', error.message);
    toast.error('Failed to place order. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200 sticky top-4">
      <h2 className="text-base sm:text-lg font-semibold mb-4">Order Summary</h2>

      <div className="flex justify-between mb-2 text-sm sm:text-base text-gray-600">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mb-2 text-sm sm:text-base text-gray-600">
        <span>Shipping</span>
        <span className="text-black">Free</span>
      </div>

      <div className="flex justify-between mb-4 text-sm sm:text-base text-gray-600">
        <span>Escrow Service</span>
        <span>${ESCROW_FEE.toFixed(2)}</span>
      </div>

      <hr className="mb-4" />

      <div className="flex justify-between mb-4 text-base sm:text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 sm:py-2 rounded-md hover:bg-gray-800 transition mb-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base font-medium"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Processing...
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </button>

      <button
        onClick={handleContinueShopping}
        className="w-full border border-gray-300 py-3 sm:py-2 rounded-md hover:bg-gray-100 transition touch-manipulation text-sm sm:text-base font-medium"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CartOverview;
