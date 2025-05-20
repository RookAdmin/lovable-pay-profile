
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/layout/DashboardSidebar";

const Dashboard = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="w-full flex">
        <DashboardSidebar />
        <SidebarInset className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your dashboard, manage your business here.
              </p>
            </div>
            <SidebarTrigger />
          </div>
          <Separator className="my-6" />
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">$12,345</p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium">Invoices Sent</h3>
              <p className="text-3xl font-bold mt-2">48</p>
            </div>
            
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium">Outstanding Payments</h3>
              <p className="text-3xl font-bold mt-2">$2,430</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <p className="text-muted-foreground">Your recent activity will appear here.</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
