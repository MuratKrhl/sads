import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface InventoryStatusProps {
  totalJboss: number;
  migratedJboss: number;
  totalWebsphere: number;
}

const InventoryStatus: React.FC<InventoryStatusProps> = ({ totalJboss, migratedJboss, totalWebsphere }) => {
  const nonMigratedJboss = totalJboss - migratedJboss;
  
  const migrationData = [
    { name: 'Migrated to EAP 8+', value: migratedJboss },
    { name: 'On EAP 7', value: nonMigratedJboss },
  ];
  
  const CHART_COLORS = ['#22C55E', '#EF4444', '#F59E0B']; // Green, Red, Amber

  const renderLegend = (props: any) => {
      const { payload } = props;
      return (
          <ul className="flex flex-col space-y-2">
              {payload.map((entry: any, index: number) => (
                  <li key={`item-${index}`} className="flex items-center">
                      <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-gray-600">{entry.value}:</span>
                      <span className="text-sm font-medium text-gray-800 ml-1">{entry.payload.value}</span>
                  </li>
              ))}
          </ul>
      );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
      <div className="flex flex-col md:flex-row items-center justify-between h-full gap-6">
          {/* Left side: Stats */}
          <div className="w-full md:w-1/2 space-y-6">
              <div>
                  <h4 className="text-sm font-medium text-gray-500 border-b pb-2 mb-4">JBoss Instances</h4>
                  <div className="flex items-baseline space-x-4">
                      <div className="text-left">
                          <p className="text-xs text-gray-500 flex items-center"><span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>Total</p>
                          <p className="text-2xl font-bold text-gray-800">{totalJboss}</p>
                      </div>
                      <div className="text-left">
                          <p className="text-xs text-gray-500 flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Migrated (EAP 8+)</p>
                          <p className="text-2xl font-bold text-green-600">{migratedJboss}</p>
                      </div>
                       <div className="text-left">
                          <p className="text-xs text-gray-500 flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>On EAP 7</p>
                          <p className="text-2xl font-bold text-red-600">{nonMigratedJboss}</p>
                      </div>
                  </div>
              </div>
               <div>
                  <h4 className="text-sm font-medium text-gray-500 border-b pb-2 mb-4">WebSphere Instances</h4>
                  <div className="flex items-baseline space-x-4">
                     <div className="text-left">
                          <p className="text-xs text-gray-500 flex items-center"><span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>Total Running</p>
                          <p className="text-2xl font-bold text-gray-800">{totalWebsphere}</p>
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Right side: Donut Chart */}
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
              <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer>
                      <PieChart>
                          <Pie
                              data={migrationData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {migrationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} Servers`} />
                          <Legend content={renderLegend} verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ right: -10 }} />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
