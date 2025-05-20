
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  FileText, 
  Calendar, 
  ChevronDown 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Import chart components
import ViewsChart from "./charts/ViewsChart";
import ClicksChart from "./charts/ClicksChart";
import ClickRateChart from "./charts/ClickRateChart";
import PaymentGatewayChart from "./charts/PaymentGatewayChart";
import SmartLinksChart from "./charts/SmartLinksChart";
import InvoiceClicksChart from "./charts/InvoiceClicksChart";

// Demo data for lifetime metrics
const lifetimeMetrics = {
  totalRevenue: 15750.25,
  totalInvoices: 245,
  totalPayments: 198,
  totalOutstanding: 8420.75,
  totalViews: 4285,
  totalClicks: 1876,
  clickRate: 43.78
};

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);

  const handleTimeRangeChange = (value: string) => {
    setIsLoading(true);
    setTimeRange(value);
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="alltime">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lifetime analytics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${lifetimeMetrics.totalRevenue.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          description="Lifetime earnings"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Invoices"
          value={lifetimeMetrics.totalInvoices.toString()}
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          description="Invoices created"
          isLoading={isLoading}
        />
        <MetricCard
          title="Payments Received"
          value={lifetimeMetrics.totalPayments.toString()}
          icon={<CreditCard className="h-5 w-5 text-purple-500" />}
          description={`${Math.round((lifetimeMetrics.totalPayments / lifetimeMetrics.totalInvoices) * 100)}% completion rate`}
          isLoading={isLoading}
        />
        <MetricCard
          title="Outstanding Payments"
          value={`$${lifetimeMetrics.totalOutstanding.toLocaleString()}`}
          icon={<Calendar className="h-5 w-5 text-amber-500" />}
          description={`${lifetimeMetrics.totalInvoices - lifetimeMetrics.totalPayments} invoices pending`}
          isLoading={isLoading}
        />
      </div>

      {/* Engagement metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Views"
          value={lifetimeMetrics.totalViews.toLocaleString()}
          icon={<Users className="h-5 w-5 text-blue-500" />}
          description="Profile & link views"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Clicks"
          value={lifetimeMetrics.totalClicks.toLocaleString()}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          description="Across all links"
          isLoading={isLoading}
        />
        <MetricCard
          title="Click Rate"
          value={`${lifetimeMetrics.clickRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          description="Avg. click through rate"
          isLoading={isLoading}
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views over time */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Views Over Time</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ViewsChart timeRange={timeRange} />
            )}
          </CardContent>
        </Card>

        {/* Clicks over time */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Clicks Over Time</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ClicksChart timeRange={timeRange} />
            )}
          </CardContent>
        </Card>

        {/* Click rate over time */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Click Rate Over Time</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ClickRateChart timeRange={timeRange} />
            )}
          </CardContent>
        </Card>

        {/* Payment Gateway Clicks */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Payment Gateway Clicks</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <PaymentGatewayChart />
            )}
          </CardContent>
        </Card>

        {/* Smart Links Analytics */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Smart Links Analytics</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <SmartLinksChart timeRange={timeRange} />
            )}
          </CardContent>
        </Card>

        {/* Invoice Clicked Analytics */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Invoice Click Analytics</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <InvoiceClicksChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Segments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Analytics Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SegmentCard 
            title="Payment Gateway Clicks" 
            value={523} 
            change={12.4} 
            isPositive={true}
            description="Clicks across all payment gateways"
            isLoading={isLoading}
          />
          <SegmentCard 
            title="Smart Links Analytics" 
            value={847} 
            change={8.7} 
            isPositive={true}
            description="Smart link engagement metrics"
            isLoading={isLoading}
          />
          <SegmentCard 
            title="Invoice Click Analysis" 
            value={192} 
            change={-3.2} 
            isPositive={false}
            description="Invoice engagement metrics"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

// Metric card component for displaying individual metrics
const MetricCard = ({ title, value, icon, description, isLoading }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  isLoading: boolean;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            )}
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="rounded-full bg-background p-2">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Segment card component for analytics segments
const SegmentCard = ({ title, value, change, isPositive, description, isLoading }: {
  title: string;
  value: number;
  change: number;
  isPositive: boolean;
  description: string;
  isLoading: boolean;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-base font-medium">{title}</h3>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mt-2 mb-1" />
        ) : (
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
