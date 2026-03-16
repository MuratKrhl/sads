import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlaceholderChartProps {
    title: string;
    onClick?: () => void;
}

const data = Array.from({ length: 12 }, (_, i) => ({
  name: `Point ${i + 1}`,
  value: Math.floor(Math.random() * 500) + 50,
}));

const PlaceholderChart: React.FC<PlaceholderChartProps> = ({ title, onClick }) => {
  return (
    <div 
        className="bg-white p-4 rounded-xl shadow-sm h-72 flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={onClick}
    >
      <h4 className="text-sm text-gray-500 font-medium mb-4">{title}</h4>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlaceholderChart;
