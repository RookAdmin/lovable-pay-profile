
import React, { useEffect } from 'react';
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

  return <Home />;
};

export default Index;
