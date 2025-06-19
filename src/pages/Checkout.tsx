
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/checkout/CheckoutForm';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
        <CheckoutForm />
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
