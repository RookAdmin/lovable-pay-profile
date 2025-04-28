
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container max-w-4xl px-4 py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#333333]">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: April 28, 2025</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Paym.me's website and services, you agree to be bound by these Terms of Service. 
          If you do not agree to all the terms and conditions, you may not access or use our services.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">2. Description of Service</h2>
        <p>
          Paym.me provides a platform that allows users to create payment identities and receive payments 
          through various payment methods. We are not a financial institution or a payment processor, but 
          rather facilitate the sharing of payment information between users.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">3. User Accounts</h2>
        <p>
          To use certain features of our services, you must create an account. You are responsible for 
          maintaining the confidentiality of your account information and for all activities that occur under your account. 
          You agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate and complete information</li>
          <li>Update your information as needed</li>
          <li>Protect your account credentials</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">4. User Content</h2>
        <p>
          You retain ownership of content you submit to our platform. By submitting content, you grant 
          us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display the 
          content in connection with providing our services.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">5. Prohibited Activities</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use our services for illegal purposes</li>
          <li>Violate any laws or regulations</li>
          <li>Impersonate another person or entity</li>
          <li>Upload malicious code or attempt to interfere with our services</li>
          <li>Collect user information without consent</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">6. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access to our services at our 
          sole discretion, without notice, for any reason, including if we believe you have violated 
          these Terms of Service.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">7. Disclaimer of Warranties</h2>
        <p>
          Our services are provided "as is" and "as available" without warranties of any kind, either 
          express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Paym.me shall not be liable for any indirect, incidental, 
          special, consequential, or punitive damages resulting from your use of or inability to use our services.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">9. Changes to Terms</h2>
        <p>
          We may modify these Terms of Service at any time. We will notify you of any changes by posting 
          the new Terms on this page. Your continued use of our services after any such changes constitutes 
          your acceptance of the new Terms.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#333333]">10. Contact Us</h2>
        <p>
          If you have questions about these Terms of Service, please contact us at legal@paym.me.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
