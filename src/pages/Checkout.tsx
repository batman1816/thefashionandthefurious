import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';

const Checkout = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some amazing F1 apparel to get started!</p>
          <Link 
            to="/" 
            className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CheckoutForm />
      <Footer />
    </div>
  );
};

export default Checkout;