
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import PaymsSection from '@/components/home/PaymsSection';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl">
                  Your Payment Receivables Identity
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create smart payment links and customize your payment profile. Get paid faster with a professional and personalized payment identity.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/signup">
                  <Button className="bg-dc2e3e hover:bg-dc2e3e/90">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">
                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-green-500" />
                  <span>Free plan available</span>
                </div>
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border bg-gradient-to-r from-gray-50 to-gray-100 p-2 shadow-xl dark:from-gray-900 dark:to-gray-800">
                  <img
                    alt="Dashboard Preview"
                    className="rounded-lg"
                    src="/placeholder.svg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mx-auto grid items-center gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 border-b pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="h-5 w-5 text-dc2e3e"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Personalized Links</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create custom payment links with your own branding and share them anywhere.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 border-b pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="h-5 w-5 text-dc2e3e"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M7 15h0"></path>
                  <path d="M2 9.5h20"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Multiple Payment Methods</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Accept payments via UPI, bank transfer, cards, and more all in one place.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="h-5 w-5 text-dc2e3e"
                >
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Analytics & Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track payments, views, and engagement with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Payms Section */}
      <PaymsSection />
      
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Everything you need to create a professional payment identity
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Smart Links</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create multiple payment links for different purposes</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Custom Profile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Personalize your profile with your brand identity</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Payment Verification</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get verified to build trust with your customers</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">QR Codes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generate QR codes for easy payment collection</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Analytics Dashboard</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track performance and payments with detailed reports</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">API Integration</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect with your favorite tools and services</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to get started?</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join thousands of professionals and creators using Paym.me today
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link to="/signup">
                  <Button className="bg-dc2e3e hover:bg-dc2e3e/90">Create Your Profile</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
