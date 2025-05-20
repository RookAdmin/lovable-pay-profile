
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

// Demo data for invoice clicks
const data = [
  { name: 'Web Design', clicks: 87, fill: '#6366f1' },
  { name: 'Development', clicks: 63, fill: '#8b5cf6' },
  { name: 'Consultation', clicks: 42, fill: '#ec4899' },
  { name: 'Marketing', clicks: 28, fill: '#f43f5e' },
  { name: 'Hosting', clicks: 14, fill: '#14b8a6' },
];

const InvoiceClicksChart: React.FC = () => {
  // Calculate total clicks
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
  const maxClicked = data.reduce((prev, current) => (prev.clicks > current.clicks) ? prev : current);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Total Invoice Clicks</p>
          <p className="font-medium">{totalClicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Most Clicked</p>
          <p className="font-medium">{maxClicked.name}</p>
        </div>
      </div>
      
      <ChartContainer 
        config={{
          clicks: { color: "#8b5cf6" }
        }} 
        className="h-[300px]"
      >
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            type="category"
            dataKey="name"
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            width={100}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="clicks" 
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
            fill="#8b5cf6"
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

export default InvoiceClicksChart;
