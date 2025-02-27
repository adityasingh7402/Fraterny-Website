
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-navy text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-playfair mb-6">Refund & Cancellation Policy</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Understanding our policies regarding refunds and cancellations.
          </p>
        </div>
      </section>
      
      {/* Refund Policy Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <p className="text-lg">
              Our refund and cancellation policies are outlined in our Terms and Conditions. Please refer to the Cancellation section in our <Link to="/terms-and-conditions" className="text-terracotta hover:underline">Terms and Conditions</Link> for detailed information.
            </p>
            
            <p className="text-sm text-gray-500 mt-12 italic">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default RefundPolicy;
