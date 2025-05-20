
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
} from 'recharts';

// Demo data for different time ranges
const generateDemoData = (timeRange: string) => {
  const today = new Date();
  const data = [];
  let days = 30;
  let format = 'MMM DD';
  
  switch (timeRange) {
    case '7days':
      days = 7;
      format = 'ddd';
      break;
    case '30days':
      days = 30;
      format = 'MMM DD';
      break;
    case '3months':
      days = 90;
      format = 'MMM';
      break;
    case '6months':
      days = 180;
      format = 'MMM';
      break;
    case '12months':
      days = 365;
      format = 'MMM';
      break;
    default:
      days = 30;
  }
  
  // Generate random click data
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    let clicks = 0;
    
    // Create a pattern with weekday variations and randomness
    if (timeRange === '7days' || timeRange === '30days') {
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const baseClicks = isWeekend ? 
        Math.floor(Math.random() * 15) + 5 : // 5-20 for weekends
        Math.floor(Math.random() * 30) + 15;  // 15-45 for weekdays
      
      clicks = baseClicks;
    } else {
      // For longer periods, create a gradual upward trend with some fluctuation
      const baseValue = Math.floor(20 + (i / days) * 40);
      const fluctuation = Math.floor(Math.random() * 15) - 7; // -7 to +7
      clicks = Math.max(3, baseValue + fluctuation);
    }
    
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    data.push({
      name: dateStr,
      clicks: clicks
    });
  }
  
  return data;
};

interface ClicksChartProps {
  timeRange: string;
}

const ClicksChart: React.FC<ClicksChartProps> = ({ timeRange }) => {
  const data = generateDemoData(timeRange);
  
  // Calculate summary statistics
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
  const avgClicks = Math.round(totalClicks / data.length);
  const maxClicks = Math.max(...data.map(item => item.clicks));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Total Clicks</p>
          <p className="font-medium">{totalClicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Average</p>
          <p className="font-medium">{avgClicks.toLocaleString()} / day</p>
        </div>
        <div>
          <p className="text-muted-foreground">Peak</p>
          <p className="font-medium">{maxClicks.toLocaleString()}</p>
        </div>
      </div>
      
      <ChartContainer 
        config={{ clicks: { color: "#10b981" } }} 
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
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ClicksChart;
