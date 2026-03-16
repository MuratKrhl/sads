import React, { useState } from 'react';
import Tabs from '@/components/common/Tabs';
import HttpdTabContent from '@/components/common/HttpdTabContent';
import NginxTabContent from '@/components/common/NginxTabContent';
import JbossTabContent from '@/components/common/JbossTabContent';
import WebsphereTabContent from '@/components/common/WebsphereTabContent';
import CtgTabContent from '@/components/common/CtgTabContent';
import HazelcastTabContent from '@/components/common/HazelcastTabContent';
import ProvenirTabContent from '@/components/common/ProvenirTabContent';
import PerformanceDetailModal from '@/components/modals/PerformanceDetailModal';

const PerformancePage: React.FC = () => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        tab: string | null;
        widgetTitle: string | null;
    }>({
        isOpen: false,
        tab: null,
        widgetTitle: null,
    });

    const handleWidgetClick = (tab: string, widgetTitle: string) => {
        setModalState({ isOpen: true, tab, widgetTitle });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, tab: null, widgetTitle: null });
    };

    const tabs = [
        { label: 'HTTPD', content: <HttpdTabContent onWidgetClick={(title) => handleWidgetClick('HTTPD', title)} /> },
        { label: 'NGINX', content: <NginxTabContent onWidgetClick={(title) => handleWidgetClick('NGINX', title)} /> },
        { label: 'JBoss', content: <JbossTabContent onWidgetClick={(title) => handleWidgetClick('JBoss', title)} /> },
        { label: 'WebSphere', content: <WebsphereTabContent onWidgetClick={(title) => handleWidgetClick('WebSphere', title)} /> },
        { label: 'CTG', content: <CtgTabContent onWidgetClick={(title) => handleWidgetClick('CTG', title)} /> },
        { label: 'Hazelcast', content: <HazelcastTabContent onWidgetClick={(title) => handleWidgetClick('Hazelcast', title)} /> },
        { label: 'Provenir', content: <ProvenirTabContent onWidgetClick={(title) => handleWidgetClick('Provenir', title)} /> },
    ];

    return (
        <>
            <Tabs tabs={tabs} />
            <PerformanceDetailModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                tab={modalState.tab}
                widgetTitle={modalState.widgetTitle}
            />
        </>
    );
};

export default PerformancePage;
