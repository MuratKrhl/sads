import React from 'react';
import PlaceholderChart from '@/components/charts/PlaceholderChart';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';

interface WebsphereTabContentProps {
    onWidgetClick: (widgetTitle: string) => void;
}

const WebsphereTabContent: React.FC<WebsphereTabContentProps> = ({ onWidgetClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlaceholderDonutChart 
                title="CPU & Bellek" 
                onClick={() => onWidgetClick('CPU & Bellek')} 
            />
            <PlaceholderDonutChart 
                title="Thread & JDBC Bağlantıları" 
                onClick={() => onWidgetClick('Thread & JDBC Bağlantıları')} 
            />
            <PlaceholderChart 
                title="HTTP İstekleri ve Hata Oranları" 
                onClick={() => onWidgetClick('HTTP İstekleri ve Hata Oranları')} 
            />
        </div>
    );
};

export default WebsphereTabContent;
