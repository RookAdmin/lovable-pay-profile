
import React from "react";
import { Helmet } from 'react-helmet-async';
import PaymsSection from "@/components/home/PaymsSection";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - Rook Payment Platform</title>
        <meta name="description" content="Manage your payment links, invoices, and transactions with Rook Payment Platform" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>
        <PaymsSection />
      </div>
    </>
  );
};

export default Dashboard;
