import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';
import CheckoutForm from '../components/checkout/CheckoutForm';
const Checkout = () => {
  return <div className="min-h-screen bg-gray-900">
      <AnnouncementBanner />
      <Header />

      <div className="container mx-auto px-4 py-16 bg-zinc-950">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>
        <CheckoutForm />
      </div>

      <Footer />
    </div>;
};
export default Checkout;