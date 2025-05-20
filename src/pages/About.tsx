
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Globe, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="container max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#333333] mb-4">About Paym.me</h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto">
          Privacy-first payment identities for creators, built with security and ease of use in mind.
        </p>
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center bg-[#f5f5f7] px-5 py-2 rounded-full">
            <span className="text-sm font-medium text-[#1A1F2C] mr-2">A product of</span>
            <span className="font-semibold text-[#9b87f5] text-lg">ROOK</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold text-[#333333] mb-4">Our Mission</h2>
              <p className="text-[#555555] mb-4">
                At Paym.me, we believe that creators should have complete control over their digital financial identity. We're building the tools that help creators establish a direct, secure connection with their audience without sacrificing privacy.
              </p>
              <p className="text-[#555555]">
                We're dedicated to creating a platform that puts you in control of your payment information, making it easier than ever to receive support from your community.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
            alt="Digital payments" 
            className="rounded-lg shadow-md w-full h-full object-cover" 
          />
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-[#333333] mb-8">Why Choose Paym.me?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-[#9b87f5]/10 p-3 rounded-full mb-4">
                <Info className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Privacy First</h3>
              <p className="text-[#555555]">
                Your data belongs to you. We employ end-to-end encryption and minimal data collection practices.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-[#9b87f5]/10 p-3 rounded-full mb-4">
                <Globe className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Global Reach</h3>
              <p className="text-[#555555]">
                Connect with your audience worldwide with multiple payment options and currency support.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-[#9b87f5]/10 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Creator Community</h3>
              <p className="text-[#555555]">
                Join thousands of creators who trust Paym.me for secure, private payment links.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-[#9b87f5]/5 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#9b87f5]/10 rounded-full flex items-center justify-center">
            <span className="font-bold text-[#7E69AB] text-2xl">R</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#333333] mb-4">Powered by Rook</h2>
        <p className="text-lg text-[#555555] max-w-3xl mx-auto">
          Paym.me is proudly developed by Rook, a leader in innovative fintech solutions. We leverage Rook's expertise in secure payment processing and data privacy to deliver a world-class experience.
        </p>
      </div>
    </div>
  );
};

export default About;
