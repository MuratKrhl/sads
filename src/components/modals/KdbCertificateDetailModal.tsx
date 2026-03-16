import React, { useState } from 'react';
import { XMarkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { KdbCertificate } from '@/utils/types';

interface CertWithStatus extends KdbCertificate {
    daysToExpiry: number;
    status: 'Expired' | 'Expiring Soon' | 'Valid';
}

interface ModalProps {
    cert: CertWithStatus;
    isOpen: boolean;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null; copyable?: boolean }> = ({ label, value, copyable = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(String(value));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="col-span-2 text-sm text-gray-900 flex items-center justify-between">
                <span className="break-all">{value || '-'}</span>
                {copyable && value && (
                    <button onClick={handleCopy} className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {copied ? (
                           <span className="text-xs text-green-600">Copied!</span>
                        ) : (
                           <ClipboardDocumentIcon className="h-4 w-4" />
                        )}
                    </button>
                )}
            </dd>
        </div>
    );
};

const KdbCertificateDetailModal: React.FC<ModalProps> = ({ cert, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const StatusPill: React.FC<{ status: CertWithStatus['status'] }> = ({ status }) => {
      const colorMap: Record<CertWithStatus['status'], string> = {
        Valid: "bg-green-100 text-green-800",
        'Expiring Soon': "bg-yellow-100 text-yellow-800",
        Expired: "bg-red-100 text-red-800",
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
                            {cert.alias}
                        </h3>
                         <p className="text-sm text-gray-500">{cert.subject}</p>
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
                            <div className="mt-1"><StatusPill status={cert.status} /></div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 uppercase">Days Left</div>
                            <div className="text-lg font-bold text-gray-800">{cert.daysToExpiry > 0 ? cert.daysToExpiry : 0}</div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 uppercase">Environment</div>
                            <div className="text-lg font-bold text-gray-800">{cert.environment}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Server</div>
                            <div className="text-lg font-bold text-gray-800 truncate">{cert.server}</div>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="bg-white p-4 rounded-lg border">
                         <dl>
                             <DetailRow label="Alias Name" value={cert.alias} />
                             <DetailRow label="KDB Path" value={cert.kdbPath} />
                             <DetailRow label="Subject (CN)" value={cert.subject} />
                             <DetailRow label="Issuer (CA)" value={cert.issuer} />
                             <DetailRow label="Valid From" value={cert.validFrom} />
                             <DetailRow label="Valid To (Expiry)" value={cert.validTo} />
                             <DetailRow label="Trust Status" value={cert.trustStatus} />
                             <DetailRow label="Key Algorithm" value={cert.keyAlgorithm} />
                             <DetailRow label="Key Size" value={cert.keySize} />
                             <DetailRow label="Signature Algorithm" value={cert.signatureAlgorithm} />
                             <DetailRow label="Import Date" value={cert.importDate} />
                             <DetailRow label="CMS / Stash Info" value={cert.cmsStashInfo} />
                             <DetailRow label="Serial Number" value={cert.serialNumber} copyable />
                             <DetailRow label="SHA-1 Fingerprint" value={cert.sha1} copyable />
                             <DetailRow label="SHA-256 Fingerprint" value={cert.sha256} copyable />
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

export default KdbCertificateDetailModal;
