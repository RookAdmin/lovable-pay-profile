
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartPie, 
  BarChart3, 
  LineChart, 
  Menu,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/login", { state: { message: "Please log in to access the dashboard." } });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 fixed left-0 top-0 h-full z-10 pt-16`}>
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start mb-6"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} />
              {sidebarOpen && <span className="ml-2">Menu</span>}
            </Button>
            
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/dashboard')}
              >
                <ChartPie size={18} />
                {sidebarOpen && <span className="ml-2">Dashboard</span>}
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-start bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
              >
                <BarChart3 size={18} />
                {sidebarOpen && <span className="ml-2">Analytics</span>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Analytics Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsDashboard />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payments" className="space-y-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Payment Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Detailed payment analytics and metrics.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="links" className="space-y-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Smart Link Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Performance metrics for your smart links.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
