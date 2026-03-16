import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';
import PlaceholderTable from '@/components/tables/PlaceholderTable';

const HazelcastDetailContent: React.FC = () => {
    const mapHeaders = ["Map Name", "Size", "Cache Hits", "Cache Misses"];
    const mapData = [
        ["userSessions", 125430, "1.2M", 5400],
        ["productCache", 50210, "8.5M", 12000],
        ["configCache", 150, "500K", 120],
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="Partition Migration" value="0" />
                <DetailKpiCard title="Split-Brain" value="No" />
                <DetailKpiCard title="Backup Count" value="1" />
                <DetailKpiCard title="Swap Kullanımı" value="256" unit="MB" />
            </div>
            <PlaceholderTable title="Map Boyutları ve Cache Kullanımı" headers={mapHeaders} rows={mapData} />
        </div>
    );
};

export default HazelcastDetailContent;
