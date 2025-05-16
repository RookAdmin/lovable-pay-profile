
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
    <Card className="border-amber-200 dark:border-amber-800/30 shadow-md mb-6">
      <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/30">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertCircle size={18} />
          <CardTitle className="text-base font-medium">Payment Gateway Required</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
