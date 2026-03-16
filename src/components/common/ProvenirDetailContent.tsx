import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';

const ProvenirDetailContent: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="Peak İşlem Süresi" value="980" unit="ms" />
                <DetailKpiCard title="Min İşlem Süresi" value="5" unit="ms" />
                <DetailKpiCard title="API Gecikmeleri" value="45" unit="ms" />
                <DetailKpiCard title="Queue Doluluk" value="85" unit="%" />
                <DetailKpiCard title="SLA Violation" value="0.05" unit="%" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlaceholderDonutChart title="Veritabanı Bağlantı Durumu" />
                <PlaceholderDonutChart title="Önbellek Hit/Miss Oranları" />
            </div>
        </div>
    );
};

export default ProvenirDetailContent;
