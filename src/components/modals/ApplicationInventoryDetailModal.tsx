import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ApplicationInventory, ApplicationStatus, ServerInventory } from '@/utils/types';

interface AugmentedApp extends ApplicationInventory {
    environment: ServerInventory['environment'] | 'Unknown';
}

interface ModalProps {
    app: AugmentedApp;
    isOpen: boolean;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="col-span-2 text-sm text-gray-900">
            {children || value || '-'}
        </dd>
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2 border-b pb-1">{children}</h4>
);


const ApplicationInventoryDetailModal: React.FC<ModalProps> = ({ app, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const StatusPill: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
      const colorMap: Record<ApplicationStatus, string> = {
        Running: "bg-green-500 text-white",
        Stopped: "bg-gray-500 text-white",
        Starting: "bg-amber-500 text-white",
        Error: "bg-red-500 text-white",
      };
      return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}>{status}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                            {app.applicationName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{app.hostname}</p>
                    </div>
                    <button
                        type="button"
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-colors"
                        onClick={onClose}
                    >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-xs text-gray-500 uppercase font-medium mb-2">Status</div>
                            <div><StatusPill status={app.status} /></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-xs text-gray-500 uppercase font-medium mb-2">Version</div>
                            <div className="text-xl font-bold text-gray-900">{app.version}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-xs text-gray-500 uppercase font-medium mb-2">Environment</div>
                            <div className="text-xl font-bold text-gray-900">{app.environment}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-xs text-gray-500 uppercase font-medium mb-2">Owner</div>
                            <div className="text-xl font-bold text-gray-900 truncate">{app.ownerTeam}</div>
                        </div>
                    </div>

                    {/* Details Sections */}
                    <div className="space-y-6">
                        {/* Deployment Info */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Deployment Info</h4>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500">Application Name</dt>
                                    <dd className="text-sm text-gray-900 font-medium">{app.applicationName}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500">Server</dt>
                                    <dd className="text-sm text-gray-900 font-medium">{app.hostname}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500">Deployment Date</dt>
                                    <dd className="text-sm text-gray-900 font-medium">{new Date(app.deploymentDate).toLocaleString()}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Middleware & JVM */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Middleware & JVM</h4>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500">JBoss Version</dt>
                                    <dd className="text-sm text-gray-900 font-medium">{app.jbossVersion || '-'}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500">WebSphere Version</dt>
                                    <dd className="text-sm text-gray-900 font-medium">{app.websphereVersion || '-'}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500">Java Version</dt>
                                    <dd className="text-sm text-gray-900 font-medium">{app.javaVersion || '-'}</dd>
                                </div>
                                {app.jvmDetails && (
                                    <>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <dt className="text-sm font-medium text-gray-500">JVM Path</dt>
                                            <dd className="text-sm text-gray-900 font-medium">{app.jvmDetails.path}</dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <dt className="text-sm font-medium text-gray-500">JVM Memory</dt>
                                            <dd className="text-sm text-gray-900 font-medium">{app.jvmDetails.memory}</dd>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <dt className="text-sm font-medium text-gray-500">Heap Size</dt>
                                            <dd className="text-sm text-gray-900 font-medium">{app.jvmDetails.heapSize}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </div>

                        {/* Datasource Info */}
                        {app.datasourceInfo && (
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Datasource</h4>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <dt className="text-sm font-medium text-gray-500">JNDI Name</dt>
                                        <dd className="text-sm text-gray-900 font-medium">{app.datasourceInfo.jndi}</dd>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <dt className="text-sm font-medium text-gray-500">DB URL</dt>
                                        <dd className="text-sm text-gray-900 font-medium break-all">{app.datasourceInfo.url}</dd>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <dt className="text-sm font-medium text-gray-500">DB User</dt>
                                        <dd className="text-sm text-gray-900 font-medium">{app.datasourceInfo.user}</dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        type="button"
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 focus:outline-none transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationInventoryDetailModal;
