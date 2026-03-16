import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DatasourceInventory, DatasourceStatus } from '@/utils/types';

interface ModalProps {
    datasource: DatasourceInventory;
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

const DatasourceInventoryDetailModal: React.FC<ModalProps> = ({ datasource, isOpen, onClose }) => {
    if (!isOpen) return null;

    const StatusPill: React.FC<{ status: DatasourceStatus }> = ({ status }) => {
      const colorMap: Record<DatasourceStatus, string> = {
        Active: "bg-green-100 text-green-800",
        Inactive: "bg-gray-100 text-gray-700",
        Error: "bg-red-100 text-red-800",
      };
      return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorMap[status]}`}>{status}</span>;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-white px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {datasource.datasourceName}
                        </h3>
                        <p className="text-sm text-gray-500">{datasource.applicationName} on {datasource.server}</p>
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
                    {/* Summary Card */}
                    <div className="bg-white p-4 rounded-lg border mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Status</div>
                            <div className="mt-1"><StatusPill status={datasource.status} /></div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 uppercase">DB Type</div>
                            <div className="text-lg font-bold text-gray-800">{datasource.dbType}</div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 uppercase">Environment</div>
                            <div className="text-lg font-bold text-gray-800">{datasource.environment}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Owner</div>
                            <div className="text-lg font-bold text-gray-800 truncate">{datasource.ownerTeam}</div>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="bg-white p-4 rounded-lg border">
                         <dl>
                            <SectionTitle>Connection Details</SectionTitle>
                            <DetailRow label="Datasource Name (JNDI)" value={datasource.datasourceName} />
                            <DetailRow label="Application" value={datasource.applicationName} />
                            <DetailRow label="Server" value={datasource.server} />
                            <DetailRow label="Connection URL" value={datasource.connectionURL} />
                            <DetailRow label="Database User" value={datasource.user} />

                            <SectionTitle>Performance & Pool</SectionTitle>
                            <DetailRow label="Active Connections" value={datasource.activeConnections} />
                            <DetailRow label="Max Connections" value={datasource.maxConnections} />
                            <DetailRow label="Avg. Response Time (ms)" value={datasource.avgResponseTime} />
                            <DetailRow label="Total Requests" value={datasource.totalRequests} />
                            <DetailRow label="Last Test Result" value={datasource.lastTestResult} />
                            {datasource.connectionPoolSettings && (
                                <>
                                    <DetailRow label="Pool Min Size" value={datasource.connectionPoolSettings.min} />
                                    <DetailRow label="Pool Max Size" value={datasource.connectionPoolSettings.max} />
                                    <DetailRow label="Pool Timeout (s)" value={datasource.connectionPoolSettings.timeout} />
                                </>
                            )}
                            <DetailRow label="Last Update" value={datasource.lastUpdate} />
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

export default DatasourceInventoryDetailModal;
