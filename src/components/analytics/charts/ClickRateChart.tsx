
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
  
  // Generate random click rate data
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Click rate between 20-60%
    const clickRate = Math.floor(Math.random() * 40) + 20;
    
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
    
    data.push({
      name: dateStr,
      rate: clickRate
    });
  }
  
  return data;
};

interface ClickRateChartProps {
  timeRange: string;
}

const ClickRateChart: React.FC<ClickRateChartProps> = ({ timeRange }) => {
  const data = generateDemoData(timeRange);
  
  // Calculate summary statistics
  const totalRates = data.reduce((sum, item) => sum + item.rate, 0);
  const avgRate = Math.round(totalRates / data.length);
  const maxRate = Math.max(...data.map(item => item.rate));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Avg Click Rate</p>
          <p className="font-medium">{avgRate}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Peak Rate</p>
          <p className="font-medium">{maxRate}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Last Rate</p>
          <p className="font-medium">{data[data.length - 1].rate}%</p>
        </div>
      </div>
      
      <ChartContainer 
        config={{ rate: { color: "#8b5cf6" } }} 
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
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            width={40}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: any) => [`${value}%`, 'Click Rate']}
          />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#8b5cf6" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ClickRateChart;
