import React, { useState, useEffect } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
  count?: number;
  icon?: React.ElementType;
}

interface TabsProps {
  tabs: Tab[];
  nested?: boolean;
  variant?: 'standard' | 'pill';
}

const Tabs: React.FC<TabsProps> = ({ tabs, nested = false, variant = 'standard' }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(0);
    }
  }, [tabs]);

  if (variant === 'pill') {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none
                  ${isActive
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                `}
              >
                {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-6">
          {tabs[activeTab]?.content}
        </div>
      </div>
    );
  }

  if (nested) {
    const tabContainerStyle = 'border-b border-gray-200';
    const tabStyle = "px-4 py-2 -mb-px border-b-2 font-medium text-sm";
    const activeTabStyle = "border-blue-500 text-blue-600";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
    const contentStyle = "pt-4";

    return (
      <div>
        <div className={`flex flex-wrap ${tabContainerStyle}`}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`${tabStyle} ${activeTab === index ? activeTabStyle : inactiveTabStyle} focus:outline-none transition-colors duration-200 whitespace-nowrap`}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </div>
            </button>
          ))}
        </div>
        <div className={contentStyle}>
          {tabs[activeTab]?.content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 flex items-center gap-2
                ${activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className="ml-2 py-0.5 px-2 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
