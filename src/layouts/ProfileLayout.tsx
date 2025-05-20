
import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '@/components/Logo';

const ProfileLayout: React.FC = () => {
  console.log("Rendering ProfileLayout - This is a public page that should work without login");
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-app">
      <header className="w-full backdrop-blur-md bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="container px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary">paym.me</span>
            <span className="opacity-70"> / privacy-first payments</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 rounded-full filter blur-3xl -z-10" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue/5 rounded-full filter blur-3xl -z-10" />
        <Outlet />
      </main>
      
      <footer className="w-full border-t border-gray-100 bg-white">
        <div className="container px-4 py-6">
          <p className="text-sm text-center text-gray-600">
            Powered by <span className="font-semibold">paym.me</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
