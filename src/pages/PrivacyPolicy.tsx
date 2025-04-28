
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl px-4 py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#333333]">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: April 28, 2025</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">1. Introduction</h2>
        <p>
          Welcome to Paym.me ("we," "our," or "us"). We are committed to protecting your privacy and personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website 
          and services.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">2. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (name, email address, username)</li>
          <li>Profile information (display name, bio, social media links)</li>
          <li>Payment method information (UPI IDs, bank account details)</li>
          <li>Transaction data (payment amounts, dates, recipient information)</li>
          <li>Communications with us</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">4. Information Sharing and Disclosure</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Service providers who perform services on our behalf</li>
          <li>Payment processors to facilitate transactions</li>
          <li>Other users when you create a public profile</li>
          <li>In response to legal requests or to protect our rights</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, 
          no security system is impenetrable, and we cannot guarantee the security of your information.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">6. Your Rights and Choices</h2>
        <p>You can:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access, update, and correct your account information</li>
          <li>Opt out of marketing communications</li>
          <li>Request deletion of your account and data</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">8. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at privacy@paym.me.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
