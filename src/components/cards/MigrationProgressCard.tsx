import React from 'react';

interface MigrationProgressCardProps {
    progress: number;
    migratedCount: number;
    totalCount: number;
}

const MigrationProgressCard: React.FC<MigrationProgressCardProps> = ({ progress, migratedCount, totalCount }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">JBoss Migration Progress</h3>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-gray-900">{progress}%</p>
        <div 
            className="relative group"
            title={`${migratedCount} / ${totalCount} sunucu geçiş yaptı`}
        >
            <p className="text-sm font-medium text-gray-500">{migratedCount} / {totalCount}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
        <div 
          className="bg-green-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        JBoss EAP 7'den 8'e geçiş durumu
      </p>
    </div>
  );
};

export default MigrationProgressCard;
