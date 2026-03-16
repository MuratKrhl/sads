import React from 'react';
import DetailKpiCard from '@/components/cards/DetailKpiCard';

const CtgDetailContent: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailKpiCard title="Ortalama İşlem Süresi" value="120" unit="ms" />
                <DetailKpiCard title="Maksimum İşlem Süresi" value="850" unit="ms" />
                <DetailKpiCard title="Aktif Bağlantılar" value="150" />
                <DetailKpiCard title="Maks Eşzamanlı Bağlantı" value="200" />
                <DetailKpiCard title="Disk I/O" value="15" unit="MB/s" />
                <DetailKpiCard title="OS Yükü" value="0.8" />
                <DetailKpiCard title="Backlog Queue" value="5" />
                <DetailKpiCard title="Timeout Oranı" value="0.1" unit="%" />
            </div>
        </div>
    );
};

export default CtgDetailContent;
