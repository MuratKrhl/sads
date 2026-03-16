import React from 'react';
import { PageTab } from '@/utils/types';
import Tabs from '@/components/common/Tabs';
import EvamListenerTab from '@/components/common/EvamListenerTab';
import DatasourceTanımlamaTab from '@/modules/inventory/datasources/DatasourceTanımlamaTab';

interface PageComponentProps {
    title: string;
    tabsConfig: PageTab[];
}

const PageComponent: React.FC<PageComponentProps> = ({ title, tabsConfig }) => {
    if (!tabsConfig || tabsConfig.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="mt-2 text-gray-600">Content for this page will be available soon.</p>
            </div>
        );
    }

    const tabs = tabsConfig.map(tabConfig => {
        let content: React.ReactNode;

        if (title === 'Self Service' && tabConfig.label === 'Evam Listener Tanımlama') {
            content = <EvamListenerTab />;
        } else if (tabConfig.nestedTabs) {
            const nested = tabConfig.nestedTabs.map(nestedTab => {
                let nestedContent: React.ReactNode;
                
                if (title === 'Self Service' && tabConfig.label === 'Datasource' && nestedTab.label === 'Datasource Tanımlama') {
                    nestedContent = <DatasourceTanımlamaTab />;
                } else {
                     nestedContent = <p className="text-gray-600">Content for {nestedTab.label}</p>;
                }

                return {
                    label: nestedTab.label,
                    content: nestedContent
                };
            });
            content = <Tabs tabs={nested} nested={true} />;
        } else {
            content = <p className="text-gray-600">Content for {tabConfig.label}</p>;
        }

        return {
            label: tabConfig.label,
            count: tabConfig.count,
            content: content
        };
    });

    return <Tabs tabs={tabs} />;
};

export default PageComponent;
