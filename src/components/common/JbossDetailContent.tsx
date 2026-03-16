import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';
import PlaceholderTable from '@/components/tables/PlaceholderTable';
import PlaceholderChart from '@/components/charts/PlaceholderChart';

const JbossDetailContent: React.FC = () => {
    const servletHeaders = ["Servlet Name", "Request Count", "Avg. Time (ms)"];
    const servletData = [
        ["/app/mainServlet", 8900, 150],
        ["/app/api/data", 7600, 95],
        ["/app/login", 5400, 210],
    ];
    
    const errorLogHeaders = ["Timestamp", "Level", "Logger", "Message"];
    const errorLogData = [
        ["14:30:15", "ERROR", "com.bmw.service", "NullPointerException at..."],
        ["14:28:02", "WARN", "org.hibernate", "HHH000123: Longer than..."],
    ];

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="İşlem Bazlı CPU" value="15" unit="%" />
                <DetailKpiCard title="Blocked Threads" value="3" />
                <DetailKpiCard title="Queue Uzunluğu" value="12" />
                <DetailKpiCard title="Uzun Süren İşlemler" value="5" />
            </div>
            <PlaceholderChart title="Garbage Collection İstatistikleri" />
            <PlaceholderTable title="Servlet Performansı" headers={servletHeaders} rows={servletData} />
            <PlaceholderTable title="Error Log Analizi" headers={errorLogHeaders} rows={errorLogData} />
        </div>
    );
};

export default JbossDetailContent;
