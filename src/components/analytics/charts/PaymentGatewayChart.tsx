
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Stripe', clicks: 245, fill: '#635bff' },
  { name: 'PayPal', clicks: 198, fill: '#0070ba' },
  { name: 'Razorpay', clicks: 132, fill: '#0266ff' },
  { name: 'Cashfree', clicks: 104, fill: '#5dd1f5' },
  { name: 'UPI', clicks: 186, fill: '#61c56a' },
];

const PaymentGatewayChart: React.FC = () => {
  // Calculate total clicks
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Total Gateway Clicks</p>
          <p className="font-medium">{totalClicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Most Used</p>
          <p className="font-medium">{data[0].name}</p>
        </div>
      </div>
      
      <ChartContainer 
        config={{
          clicks: { color: "#6366f1" }
        }} 
        className="h-[300px]"
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
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
          <Bar
            dataKey="clicks" 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
            fill="#6366f1"
          />
        </BarChart>
      </ChartContainer>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
            <span>{item.name}: {Math.round(item.clicks / totalClicks * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentGatewayChart;
