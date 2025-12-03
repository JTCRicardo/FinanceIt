import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RevenueVisualization = ({ inventoryLogs }) => {
  // Prepare data: Group items by title and calculate potential revenue vs cost
  const data = inventoryLogs.map(item => ({
    name: item.title,
    Cost: parseFloat(item.cost),
    // Calculating total value of stock for this item
    'Total Value': parseFloat(item.cost) * parseInt(item.amount),
    amount: item.amount
  })).slice(0, 10); // Limit to top 10 items to prevent overcrowding

  if (inventoryLogs.length === 0) {
    return (
      <div className="chart-container empty">
        <p>Add inventory items to see value visualization</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="revenue-chart-wrapper">
      <h3 className="chart-title">Inventory Value Overview</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {/* Dark Mode Grid Lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            
            {/* Light Text for Axes */}
            <XAxis 
              dataKey="name" 
              stroke="#8b949e" 
              tick={{ fill: '#8b949e' }}
            />
            <YAxis 
              stroke="#8b949e" 
              tick={{ fill: '#8b949e' }}
              tickFormatter={(value) => `$${value}`}
            />
            
            {/* Dark Mode Tooltip */}
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ 
                backgroundColor: '#161b22', 
                borderColor: '#30363d', 
                color: '#c9d1d9',
                borderRadius: '8px'
              }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Legend />
            
            {/* Bars with your theme colors */}
            <Bar dataKey="Total Value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Stock Value" />
            <Bar dataKey="Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Unit Cost" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueVisualization;