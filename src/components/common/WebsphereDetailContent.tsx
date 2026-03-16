import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';
import PlaceholderTable from '@/components/tables/PlaceholderTable';
import PlaceholderChart from '@/components/charts/PlaceholderChart';

const WebsphereDetailContent: React.FC = () => {
    const errorLogHeaders = ["Timestamp", "Level", "Logger", "Message"];
    const errorLogData = [
        ["15:10:20", "SEVERE", "com.ibm.ws.webcontainer", "SRVE0260E: The server..."],
        ["15:09:45", "WARNING", "com.ibm.ws.db2", "DSRA8200W: DataSource..."],
    ];

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="Heap Bellek" value="8.2" unit="GB" />
                <DetailKpiCard title="EJB İşlemleri" value="1.5k" unit="/s" />
                <DetailKpiCard title="JMS Mesajları" value="500" />
                <DetailKpiCard title="JVM Metaspace" value="256" unit="MB" />
            </div>
            <PlaceholderChart title="Thread Pool Detayları" />
            <PlaceholderTable title="Error Log Analizi" headers={errorLogHeaders} rows={errorLogData} />
        </div>
    );
};

export default WebsphereDetailContent;
