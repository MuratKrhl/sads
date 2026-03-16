import React from 'react';
import PlaceholderChart from '@/components/charts/PlaceholderChart';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';

interface NginxTabContentProps {
    onWidgetClick: (widgetTitle: string) => void;
}

const NginxTabContent: React.FC<NginxTabContentProps> = ({ onWidgetClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlaceholderDonutChart 
                title="CPU / Bellek / Disk Kullanımı" 
                onClick={() => onWidgetClick('CPU / Bellek / Disk Kullanımı')} 
            />
            <PlaceholderChart 
                title="Toplam İstek & Hata Oranları" 
                onClick={() => onWidgetClick('Toplam İstek & Hata Oranları')} 
            />
            <PlaceholderChart 
                title="Ortalama Yanıt Süresi" 
                onClick={() => onWidgetClick('Ortalama Yanıt Süresi')} 
            />
        </div>
    );
};

export default NginxTabContent;
