import React from 'react';
import KpiCard from '@/components/cards/KpiCard';

interface CtgTabContentProps {
    onWidgetClick: (widgetTitle: string) => void;
}

const CtgTabContent: React.FC<CtgTabContentProps> = ({ onWidgetClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard 
                title="Toplam / Başarılı / Hatalı İşlemler" 
                value="1.2M" 
                unit="Total"
                onClick={() => onWidgetClick('Toplam / Başarılı / Hatalı İşlemler')} 
            />
            <KpiCard 
                title="CPU ve Bellek Kullanımı" 
                value="45%" 
                unit="CPU"
                onClick={() => onWidgetClick('CPU ve Bellek Kullanımı')} 
            />
        </div>
    );
};

export default CtgTabContent;
