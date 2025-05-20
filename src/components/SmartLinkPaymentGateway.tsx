
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SmartLinkPaymentGateway = () => {
  const navigate = useNavigate();
  
  const handleIntegrateClick = () => {
    toast.info("Redirecting to Apps and Integrations...");
    navigate("/dashboard", { state: { activeTab: "apps-integrations" } });
  };

  return (
    <Card className="border-yellow/30 shadow-sm mb-6">
      <CardHeader className="bg-yellow/10 border-b border-yellow/20">
        <div className="flex items-center gap-2 text-black">
          <AlertCircle size={18} className="text-yellow" />
          <CardTitle className="text-base font-medium">Payment Gateway Required</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          To receive payments through Smart Links, you need to integrate a payment gateway. 
          This allows your visitors to make payments directly through your link.
        </p>
        <div className="flex justify-end">
          <Button size="sm" onClick={handleIntegrateClick}>
            Integrate Payment Gateway
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartLinkPaymentGateway;
