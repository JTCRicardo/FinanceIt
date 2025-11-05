import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './RevenueVisualization.css';

export default function RevenueVisualization({ inventoryLogs }) {
  const chartData = inventoryLogs.map(item => ({
    name: item.title,
    expectedRevenue: parseFloat(item.cost) * parseInt(item.amount),
    cost: parseFloat(item.cost),
    quantity: parseInt(item.amount)
  }));

  const totalRevenue = chartData.reduce((sum, item) => sum + item.expectedRevenue, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{payload[0].payload.name}</p>
          <p className="tooltip-detail">Cost: ${payload[0].payload.cost.toFixed(2)}</p>
          <p className="tooltip-detail">Quantity: {payload[0].payload.quantity}</p>
          <p className="tooltip-revenue">Expected Revenue: ${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (!inventoryLogs || inventoryLogs.length === 0) {
    return null;
  }

  return (
    <div className="revenue-visualization-container">
      <div className="revenue-visualization-header">
        <h2>📊 Expected Revenue Visualization</h2>
        <p className="total-revenue">
          Total Expected Revenue: <span className="revenue-amount">${totalRevenue.toFixed(2)}</span>
        </p>
        <p className="subtitle">Revenue if all inventory is sold at listed prices</p>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="expectedRevenue" 
              fill="#0969da" 
              name="Expected Revenue"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
