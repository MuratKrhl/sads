import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';
import PlaceholderTable from '@/components/tables/PlaceholderTable';
import PlaceholderDonutChart from '@/components/charts/PlaceholderDonutChart';

const HttpdDetailContent: React.FC = () => {
    const errorLogHeaders = ["Timestamp", "Severity", "Message"];
    const errorLogData = [
        ["2024-08-15 10:30:00", "Error", "Client denied by server configuration"],
        ["2024-08-15 10:28:15", "Warn", "File does not exist: /var/www/favicon.ico"],
        ["2024-08-15 10:25:05", "Error", "Connection reset by peer"],
        ["2024-08-15 10:22:40", "Error", "Script timeout"],
    ];

    const endpointHeaders = ["Endpoint", "Requests", "Avg. Time (ms)"];
    const endpointData = [
        ["/api/v1/users", 15200, 55],
        ["/api/v1/orders", 9800, 120],
        ["/health", 5100, 5],
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="Aktif Bağlantılar" value="1,204" />
                <DetailKpiCard title="Bekleyen Bağlantılar" value="15" />
                <DetailKpiCard title="Keepalive" value="289" />
                <DetailKpiCard title="CLOSE_WAIT" value="2" />
                <DetailKpiCard title="Bant Genişliği" value="5.2" unit="Gbps" />
                <DetailKpiCard title="Queue Uzunluğu" value="8" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlaceholderDonutChart title="Worker Kullanımı" />
                <PlaceholderDonutChart title="HTTP Durum Kodları" />
            </div>
            <PlaceholderTable title="En Çok Kullanılan Endpoint’ler" headers={endpointHeaders} rows={endpointData} />
            <PlaceholderTable title="Error Log Analizi" headers={errorLogHeaders} rows={errorLogData} />
        </div>
    );
};

export default HttpdDetailContent;
