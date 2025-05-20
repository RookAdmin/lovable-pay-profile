
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// Demo data for different time ranges
const generateDemoData = (timeRange: string) => {
  const today = new Date();
  const data = [];
  let days = 30;
  
  switch (timeRange) {
    case '7days':
      days = 7;
      break;
    case '30days':
      days = 30;
      break;
    case '3months':
      days = 90;
      break;
    case '6months':
      days = 180;
      break;
    case '12months':
      days = 365;
      break;
    default:
      days = 30;
  }
  
  // Generate data with clicks and conversions
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Create more realistic patterns
    const baseClicks = Math.floor(Math.random() * 30) + 15;  // 15-45 clicks
    const clicks = baseClicks;
    
    // Conversions are a portion of clicks (20-40%)
    const conversionRate = Math.random() * 0.2 + 0.2;  // 20-40%
    const conversions = Math.floor(clicks * conversionRate);
    
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    data.push({
      name: dateStr,
      clicks: clicks,
      conversions: conversions
    });
  }
  
  return data;
};

interface SmartLinksChartProps {
  timeRange: string;
}

const SmartLinksChart: React.FC<SmartLinksChartProps> = ({ timeRange }) => {
  const data = generateDemoData(timeRange);
  
  // Calculate summary statistics
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
  const conversionRate = Math.round((totalConversions / totalClicks) * 100);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Total Clicks</p>
          <p className="font-medium">{totalClicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Conversions</p>
          <p className="font-medium">{totalConversions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Conv. Rate</p>
          <p className="font-medium">{conversionRate}%</p>
        </div>
      </div>
      
      <ChartContainer 
        config={{
          clicks: { color: "#6366f1" },
          conversions: { color: "#10b981" }
        }} 
        className="h-[300px]"
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            minTickGap={5}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            width={40}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
          />
          <Line 
            type="monotone" 
            dataKey="clicks" 
            name="Clicks"
            stroke="#6366f1" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="conversions" 
            name="Conversions"
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
      
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span>Clicks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Conversions</span>
        </div>
      </div>
    </div>
  );
};

export default SmartLinksChart;
