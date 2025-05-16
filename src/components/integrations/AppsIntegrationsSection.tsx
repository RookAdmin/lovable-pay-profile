
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, Lock, Award, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  status: "not_configured" | "connected" | "enterprise_only";
  description: string;
}

interface InvoiceTool {
  id: string;
  name: string;
  logo: string;
  status: "not_configured" | "connected" | "enterprise_only";
  description: string;
}

const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: "stripe",
    name: "Stripe",
    logo: "https://stripe.com/favicon.ico",
    status: "not_configured",
    description: "Accept international payments with Stripe's powerful payment gateway."
  },
  {
    id: "razorpay",
    name: "Razorpay",
    logo: "https://razorpay.com/favicon.png",
    status: "not_configured",
    description: "India's leading payment gateway for businesses of all sizes."
  },
  {
    id: "cashfree",
    name: "Cashfree",
    logo: "https://cashfree.com/favicon.ico",
    status: "not_configured",
    description: "Comprehensive payment solutions for Indian businesses."
  },
  {
    id: "payu",
    name: "PayU",
    logo: "https://payu.in/favicon.ico",
    status: "enterprise_only",
    description: "Enterprise-grade payment processing with advanced security features."
  }
];

const INVOICE_TOOLS: InvoiceTool[] = [
  {
    id: "zoho",
    name: "Zoho Invoice",
    logo: "https://www.zoho.com/favicon.ico",
    status: "not_configured",
    description: "Professional invoicing software for small businesses and freelancers."
  },
  {
    id: "freshbooks",
    name: "FreshBooks",
    logo: "https://www.freshbooks.com/favicon.ico",
    status: "enterprise_only",
    description: "Cloud-based accounting software designed for small business owners."
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    logo: "https://quickbooks.intuit.com/favicon.ico",
    status: "enterprise_only",
    description: "Complete financial management solution for businesses of all sizes."
  },
  {
    id: "xero",
    name: "Xero",
    logo: "https://www.xero.com/favicon.ico",
    status: "enterprise_only",
    description: "Online accounting software designed for small businesses and accountants."
  }
];

const SSO_PROVIDERS = [
  {
    id: "google",
    name: "Google SSO",
    logo: "https://www.google.com/favicon.ico",
    status: "enterprise_only",
    description: "Enable Google Single Sign-On for enterprise users."
  },
  {
    id: "microsoft",
    name: "Microsoft Azure AD",
    logo: "https://www.microsoft.com/favicon.ico",
    status: "enterprise_only",
    description: "Connect with Azure Active Directory for enterprise authentication."
  },
  {
    id: "okta",
    name: "Okta",
    logo: "https://www.okta.com/favicon.ico",
    status: "enterprise_only",
    description: "Secure identity management and single sign-on solution."
  }
];

const AppsIntegrationsSection = () => {
  const [activeTab, setActiveTab] = useState("payment-gateways");

  const handleIntegration = (appId: string, appType: string) => {
    toast.info(`${appType} integration coming soon for ${appId}!`);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>;
      case "enterprise_only":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Enterprise Only</Badge>;
      default:
        return <Badge variant="outline">Not Configured</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Apps and Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payment-gateways" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="payment-gateways" className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>Payment Gateways</span>
              </TabsTrigger>
              <TabsTrigger value="invoice-tools" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Invoice Tools</span>
              </TabsTrigger>
              <TabsTrigger value="sso" className="flex items-center gap-2">
                <Lock size={16} />
                <span>SSO Login</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="payment-gateways">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PAYMENT_GATEWAYS.map(gateway => (
                  <Card key={gateway.id} className={`overflow-hidden transition-all duration-300 border ${gateway.status === 'enterprise_only' ? 'border-amber-200 dark:border-amber-800/30' : 'border-gray-200 dark:border-gray-800'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-3">
                            <img src={gateway.logo} alt={gateway.name} className="w-6 h-6" />
                          </div>
                          <h4 className="text-gray-800 dark:text-white font-medium">{gateway.name}</h4>
                        </div>
                        <div>
                          {renderStatusBadge(gateway.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {gateway.description}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant={gateway.status === "enterprise_only" ? "outline" : "default"}
                          size="sm"
                          disabled={gateway.status === "enterprise_only"}
                          onClick={() => handleIntegration(gateway.id, "Payment gateway")}
                          className={gateway.status === "enterprise_only" ? "border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400" : ""}
                        >
                          {gateway.status === "connected" ? "Manage" : 
                           gateway.status === "enterprise_only" ? "Enterprise Plan Required" : "Connect"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 dark:text-blue-400 mt-1">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-blue-700 dark:text-blue-300 text-sm font-medium mb-1">Why integrate a payment gateway?</h4>
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                      Payment gateways allow you to receive payments directly through your smart links. 
                      Without an integration, your visitors will need to manually send payments to your displayed payment details.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="invoice-tools">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {INVOICE_TOOLS.map(tool => (
                  <Card key={tool.id} className={`overflow-hidden transition-all duration-300 border ${tool.status === 'enterprise_only' ? 'border-amber-200 dark:border-amber-800/30' : 'border-gray-200 dark:border-gray-800'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-3">
                            <img src={tool.logo} alt={tool.name} className="w-6 h-6" />
                          </div>
                          <h4 className="text-gray-800 dark:text-white font-medium">{tool.name}</h4>
                        </div>
                        <div>
                          {renderStatusBadge(tool.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {tool.description}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant={tool.status === "enterprise_only" ? "outline" : "default"}
                          size="sm"
                          disabled={tool.status === "enterprise_only"}
                          onClick={() => handleIntegration(tool.id, "Invoice tool")}
                          className={tool.status === "enterprise_only" ? "border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400" : ""}
                        >
                          {tool.status === "connected" ? "Manage" : 
                           tool.status === "enterprise_only" ? "Enterprise Plan Required" : "Connect"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 dark:text-blue-400 mt-1">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-blue-700 dark:text-blue-300 text-sm font-medium mb-1">Streamline your billing</h4>
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                      Invoice tools integration allows you to automatically generate professional invoices when payments are received through your smart links.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sso">
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="text-amber-500" size={24} />
                  <div>
                    <h4 className="text-lg font-medium">Enterprise Feature</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Single Sign-On (SSO) integration is available exclusively for enterprise users.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SSO_PROVIDERS.map(provider => (
                  <Card key={provider.id} className="overflow-hidden border border-amber-200 dark:border-amber-800/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-3">
                            <img src={provider.logo} alt={provider.name} className="w-6 h-6" />
                          </div>
                          <h4 className="text-gray-800 dark:text-white font-medium">{provider.name}</h4>
                        </div>
                        <div>
                          {renderStatusBadge(provider.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {provider.description}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline"
                          size="sm"
                          disabled
                          className="border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400"
                        >
                          Enterprise Plan Required
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-4 border border-amber-200 dark:border-amber-800/30 rounded-lg bg-amber-50/50 dark:bg-amber-900/10">
                <div className="flex items-start gap-3">
                  <div className="text-amber-500 mt-1">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-amber-700 dark:text-amber-400 text-sm font-medium mb-1">Upgrade to Enterprise</h4>
                    <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mb-4">
                      SSO integration allows your team members to log in using your company's identity provider, ensuring secure and streamlined access management.
                    </p>
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-600 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                      Contact Sales for Enterprise Pricing
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppsIntegrationsSection;
