import React from 'react';

interface DetailKpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
}

const DetailKpiCard: React.FC<DetailKpiCardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <h4 className="text-xs text-gray-500 font-medium truncate">{title}</h4>
      <p className="text-xl font-bold text-gray-800 mt-1">
        {value}
        {unit && <span className="text-sm font-medium ml-1 text-gray-500">{unit}</span>}
      </p>
    </div>
  );
};

export default DetailKpiCard;
