import React from 'react';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';
import KpiCard from '@/components/cards/KpiCard';

interface HazelcastTabContentProps {
    onWidgetClick: (widgetTitle: string) => void;
}

const HazelcastTabContent: React.FC<HazelcastTabContentProps> = ({ onWidgetClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlaceholderDonutChart 
                title="Heap & Non-Heap Memory" 
                onClick={() => onWidgetClick('Heap & Non-Heap Memory')} 
            />
            <PlaceholderDonutChart 
                title="Cluster Üyeleri Durumu" 
                onClick={() => onWidgetClick('Cluster Üyeleri Durumu')} 
            />
            <KpiCard 
                title="Thread Sayısı" 
                value="64"
                unit="Active"
                onClick={() => onWidgetClick('Thread Sayısı')} 
            />
        </div>
    );
};

export default HazelcastTabContent;
