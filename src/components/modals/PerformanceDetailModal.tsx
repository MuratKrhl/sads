import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import HttpdDetailContent from '@/components/common/HttpdDetailContent';
import NginxDetailContent from '@/components/common/NginxDetailContent';
import JbossDetailContent from '@/components/common/JbossDetailContent';
import WebsphereDetailContent from '@/components/common/WebsphereDetailContent';
import CtgDetailContent from '@/components/common/CtgDetailContent';
import HazelcastDetailContent from '@/components/common/HazelcastDetailContent';
import ProvenirDetailContent from '@/components/common/ProvenirDetailContent';


interface PerformanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: string | null;
  widgetTitle: string | null;
}

const PerformanceDetailModal: React.FC<PerformanceDetailModalProps> = ({ isOpen, onClose, tab, widgetTitle }) => {
    if (!isOpen) return null;

    const renderContent = () => {
        switch(tab) {
            case 'HTTPD': return <HttpdDetailContent />;
            case 'NGINX': return <NginxDetailContent />;
            case 'JBoss': return <JbossDetailContent />;
            case 'WebSphere': return <WebsphereDetailContent />;
            case 'CTG': return <CtgDetailContent />;
            case 'Hazelcast': return <HazelcastDetailContent />;
            case 'Provenir': return <ProvenirDetailContent />;
            default: return <p>No detail available for this section.</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full max-h-[90vh] flex flex-col">
                <div className="bg-white px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {widgetTitle} - {tab} Details
                    </h3>
                    <button
                        type="button"
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onClose}
                    >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
                    {renderContent()}
                </div>
                 <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerformanceDetailModal;
