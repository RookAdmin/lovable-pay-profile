import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <img
        src="/single-logo.png"
        alt="PayM Logo"
        className="w-32 h-32 mb-6 animate-spin-slow"
        style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.10))" }}
      />
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 tracking-tight animate-fade-in">
        PayM
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-300 mb-8 animate-fade-in">
        Your Payment Receivables Identity
      </p>
      <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-[#0094d4] animate-progress-fill"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
