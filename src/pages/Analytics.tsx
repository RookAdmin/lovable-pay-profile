
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartPie, 
  BarChart3, 
  LineChart,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no user is authenticated, redirect to login
    if (!user) {
      toast.error("Please log in to access analytics");
      navigate("/login");
    }
  }, [user, navigate]);

  // If no user, show nothing while redirecting
  if (!user) return null;
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ChartPie size={16} />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="payms" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Payms</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="mt-0">
        <AnalyticsDashboard />
      </TabsContent>
      
      <TabsContent value="payms" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Payms Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View analytics for your payment links, including views, clicks, and conversion rates.</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payments" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Payment Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track your revenue, payment methods, and transaction history.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default Analytics;
