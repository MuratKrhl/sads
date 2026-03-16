import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit, onClick }) => {
  return (
    <div 
        className="bg-white p-4 rounded-xl shadow-sm h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={onClick}
    >
      <h4 className="text-sm text-gray-500 font-medium truncate">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 mt-1">
        {value}
        {unit && <span className="text-base font-medium ml-1 text-gray-600">{unit}</span>}
      </p>
    </div>
  );
};

export default KpiCard;
