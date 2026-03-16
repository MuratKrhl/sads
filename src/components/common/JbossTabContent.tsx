import React from 'react';
import PlaceholderChart from '@/components/charts/PlaceholderChart';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';

interface JbossTabContentProps {
    onWidgetClick: (widgetTitle: string) => void;
}

const JbossTabContent: React.FC<JbossTabContentProps> = ({ onWidgetClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlaceholderDonutChart 
                title="CPU / Heap & Non-Heap Memory" 
                onClick={() => onWidgetClick('CPU / Heap & Non-Heap Memory')} 
            />
            <PlaceholderDonutChart 
                title="Thread & JDBC Bağlantıları" 
                onClick={() => onWidgetClick('Thread & JDBC Bağlantıları')} 
            />
            <PlaceholderChart 
                title="HTTP İstek ve Hata Oranı" 
                onClick={() => onWidgetClick('HTTP İstek ve Hata Oranı')} 
            />
        </div>
    );
};

export default JbossTabContent;
