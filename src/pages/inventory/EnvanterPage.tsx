import React from 'react';
import Tabs from '@/components/common/Tabs';
import ServerInventoryTab from '@/modules/inventory/servers/ServerInventoryTab';
import ApplicationInventoryTab from '@/modules/inventory/applications/ApplicationInventoryTab';
import KdbCertificateTab from '@/modules/inventory/certificates/KdbCertificateTab';
import JavaCertificateTab from '@/modules/inventory/certificates/JavaCertificateTab';
import OpenshiftInventoryTab from '@/modules/inventory/servers/OpenshiftInventoryTab';
import DatasourceInventoryTab from '@/modules/inventory/datasources/DatasourceInventoryTab';
import Jboss8InventoryTab from '@/modules/inventory/jboss8/Jboss8InventoryTab';
import {
    ServerIcon,
    Square3Stack3DIcon,
    ShieldCheckIcon,
    CommandLineIcon,
    CloudIcon,
    CircleStackIcon,
    InboxStackIcon
} from "@heroicons/react/24/outline";

const EnvanterPage: React.FC = () => {
    const tabs = [
        { label: 'Sunucu Envanter', icon: ServerIcon, content: <ServerInventoryTab /> },
        { label: 'Uygulama Envanter', icon: Square3Stack3DIcon, content: <ApplicationInventoryTab /> },
        { label: 'KDB Sertifika', icon: ShieldCheckIcon, content: <KdbCertificateTab /> },
        { label: 'Java Sertifika', icon: CommandLineIcon, content: <JavaCertificateTab /> },
        { label: 'Openshift Envanter', icon: CloudIcon, content: <OpenshiftInventoryTab /> },
        { label: 'Datasource Envanter', icon: CircleStackIcon, content: <DatasourceInventoryTab /> },
        { label: 'Jboss 8 Envanter', icon: InboxStackIcon, content: <Jboss8InventoryTab /> },
    ];

    return <Tabs tabs={tabs} variant="pill" />;
};

export default EnvanterPage;
