
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
  
  // Generate random view data
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    let views = 0;
    
    // Create a more realistic pattern with weekday variations and some randomness
    if (timeRange === '7days' || timeRange === '30days') {
      // More views on weekdays, fewer on weekends
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const baseViews = isWeekend ? 
        Math.floor(Math.random() * 20) + 10 : // 10-30 for weekends
        Math.floor(Math.random() * 50) + 30;  // 30-80 for weekdays
      
      views = baseViews;
    } else {
      // For longer periods, create a gradual upward trend with some fluctuation
      const baseValue = Math.floor(40 + (i / days) * 60);
      const fluctuation = Math.floor(Math.random() * 20) - 10; // -10 to +10
      views = Math.max(5, baseValue + fluctuation);
    }
    
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    data.push({
      name: dateStr,
      views: views
    });
  }
  
  return data;
};

interface ViewsChartProps {
  timeRange: string;
}

const ViewsChart: React.FC<ViewsChartProps> = ({ timeRange }) => {
  const data = generateDemoData(timeRange);
  
  // Calculate summary statistics
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const avgViews = Math.round(totalViews / data.length);
  const maxViews = Math.max(...data.map(item => item.views));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Total Views</p>
          <p className="font-medium">{totalViews.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Average</p>
          <p className="font-medium">{avgViews.toLocaleString()} / day</p>
        </div>
        <div>
          <p className="text-muted-foreground">Peak</p>
          <p className="font-medium">{maxViews.toLocaleString()}</p>
        </div>
      </div>
      
      <ChartContainer 
        config={{ views: { color: "#2563eb" } }} 
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
            dataKey="views" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ViewsChart;
