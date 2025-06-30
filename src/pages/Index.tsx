
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Home from './Home';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Welcome to Paym.me",
      description: "Privacy-first payment profiles for creators",
      duration: 5000,
    });
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Paym.me - Privacy-First Payment Profiles for Creators</title>
        <meta name="description" content="Create professional payment profiles with smart links, UPI integration, and advanced analytics. Perfect for creators, freelancers, and businesses." />
      </Helmet>
      <Home />
    </>
  );
};

export default Index;
