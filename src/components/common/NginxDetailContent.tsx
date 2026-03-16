import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';
import PlaceholderTable from '@/components/tables/PlaceholderTable';
import PlaceholderChart from '@/components/charts/PlaceholderChart';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';

const NginxDetailContent: React.FC = () => {
    const errorLogHeaders = ["Timestamp", "Severity", "Message"];
    const errorLogData = [
        ["2024-08-15 11:30:00", "Error", "upstream prematurely closed connection"],
        ["2024-08-15 11:28:15", "Crit", "connect() failed (111: Connection refused)"],
    ];

    const endpointHeaders = ["Endpoint", "Requests", "Avg. Time (ms)"];
    const endpointData = [
        ["/api/v1/users", 15200, 55],
        ["/api/v1/orders", 9800, 120],
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="Aktif Bağlantılar" value="2,310" />
                <DetailKpiCard title="Waiting Requests" value="8" />
                <DetailKpiCard title="Backend Yanıt Süresi" value="120" unit="ms" />
                <DetailKpiCard title="Bant Genişliği" value="8.1" unit="Gbps" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlaceholderDonutChart title="Cache Usage" />
                <PlaceholderDonutChart title="HTTP Durum Kodları" />
            </div>
            <PlaceholderTable title="En Çok Kullanılan Endpoint’ler" headers={endpointHeaders} rows={endpointData} />
            <PlaceholderTable title="Error Log Analizi" headers={errorLogHeaders} rows={errorLogData} />
        </div>
    );
};

export default NginxDetailContent;
