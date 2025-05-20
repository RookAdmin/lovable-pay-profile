
import React from "react";
import { useSearchParams } from "react-router-dom";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPie, BarChart3, LineChart } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/layout/DashboardSidebar";

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('view') || 'overview';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="w-full flex">
        <DashboardSidebar />
        <SidebarInset className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
            <SidebarTrigger />
          </div>
          
          <Tabs defaultValue={activeTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <ChartPie size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <LineChart size={16} />
                <span>Smart Links</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Payment Analytics</CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
            
            <TabsContent value="links" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Smart Link Analytics</CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
