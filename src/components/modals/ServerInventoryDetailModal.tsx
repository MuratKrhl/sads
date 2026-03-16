import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ServerInventory } from '@/utils/types';

interface ModalProps {
    server: ServerInventory;
    isOpen: boolean;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null; }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="col-span-2 text-sm text-gray-900 break-words">{value || '-'}</dd>
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2 border-b pb-1">{children}</h4>
);

const ServerInventoryDetailModal: React.FC<ModalProps> = ({ server, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-white px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {server.hostname}
                        </h3>
                        <p className="text-sm text-gray-500">{server.os}</p>
                    </div>
                    <button
                        type="button"
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none"
                        onClick={onClose}
                    >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
                     <div className="bg-white p-4 rounded-lg border">
                         <dl>
                            <SectionTitle>System Information</SectionTitle>
                            <DetailRow label="Hostname" value={server.hostname} />
                            <DetailRow label="Environment" value={server.environment} />
                            <DetailRow label="OS / Platform" value={server.os} />
                            <DetailRow label="CPU" value={server.cpu} />
                            <DetailRow label="Memory" value={server.memory} />
                            <DetailRow label="Disk" value={server.disk} />
                            <DetailRow label="Owner / Team" value={server.owner} />
                            <DetailRow label="Last Update" value={server.lastUpdate ? new Date(server.lastUpdate).toLocaleDateString() : '-'} />
                             
                            <SectionTitle>Middleware & Runtimes</SectionTitle>
                            <DetailRow label="Java Version" value={server.javaVersion} />
                            <DetailRow label="JBoss Version" value={server.jbossVersion} />
                            <DetailRow label="WebSphere Version" value={server.webSphereVersion} />
                            <DetailRow label="Apache / Nginx Version" value={server.apacheVersion} />
                            <DetailRow label="CTG Version" value={server.ctgVersion} />
                            <DetailRow label="Hazelcast Version" value={server.hazelcastVersion} />
                             
                            <SectionTitle>Security & Network</SectionTitle>
                            <DetailRow label="TLS Version" value={server.tlsVersion} />
                            <DetailRow label="Network / Ports" value={server.networkPorts} />
                         </dl>
                    </div>
                </div>
                
                 {/* Footer */}
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

export default ServerInventoryDetailModal;
