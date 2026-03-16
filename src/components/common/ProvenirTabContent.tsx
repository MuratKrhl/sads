import React from 'react';
import PlaceholderChart from '@/components/charts/PlaceholderChart';
import KpiCard from '@/components/cards/KpiCard';

interface ProvenirTabContentProps {
    onWidgetClick: (widgetTitle: string) => void;
}

const ProvenirTabContent: React.FC<ProvenirTabContentProps> = ({ onWidgetClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlaceholderChart 
                title="Transaction Volume" 
                onClick={() => onWidgetClick('Transaction Volume')} 
            />
            <KpiCard 
                title="Ortalama İşlem Süresi" 
                value="35"
                unit="ms"
                onClick={() => onWidgetClick('Ortalama İşlem Süresi')} 
            />
             <KpiCard 
                title="Başarılı / Başarısız İşlemler" 
                value="99.8%"
                unit="Success"
                onClick={() => onWidgetClick('Başarılı / Başarısız İşlemler')} 
            />
        </div>
    );
};

export default ProvenirTabContent;
