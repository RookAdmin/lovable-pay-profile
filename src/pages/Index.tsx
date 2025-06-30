
import React from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Rook Payment Platform - Professional Payment Links</title>
        <meta name="description" content="Create professional payment links, manage invoices, and accept payments easily with Rook Payment Platform. Start your payment journey today." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
            Rook Payment Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Create professional payment links, manage invoices, and accept payments with ease
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            
            <Button variant="outline" asChild size="lg" className="px-8 py-3 text-lg">
              <Link to="/login">Login</Link>
            </Button>
          </div>
          
          <div className="pt-8">
            <p className="text-sm text-gray-500">
              Join thousands of professionals using Rook for payments
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
