import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PlaceholderDonutChartProps {
    title: string;
    onClick?: () => void;
}

const data = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#ef4444'];

const PlaceholderDonutChart: React.FC<PlaceholderDonutChartProps> = ({ title, onClick }) => {
  return (
    <div 
        className="bg-white p-4 rounded-xl shadow-sm h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={onClick}
    >
      <h4 className="text-sm text-gray-500 font-medium mb-4">{title}</h4>
      <div className="flex-grow w-full h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlaceholderDonutChart;
