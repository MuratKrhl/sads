import React, { useMemo } from 'react';
import { KDB_CERTIFICATE_DATA } from '@/utils/constants';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const CertificateStatusCard: React.FC = () => {
  const certificateStatus = useMemo(() => {
    const now = new Date();
    let expiringIn30Days = 0;
    let expiringIn60Days = 0;
    let expiringIn90Days = 0;
    let healthy = 0;

    KDB_CERTIFICATE_DATA.forEach(cert => {
      // FIX: The property for expiry date on KdbCertificate is `validTo`, not `expireDate`.
      const expireDate = new Date(cert.validTo);
      const diffTime = expireDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        // Already expired, count in the most critical category
        expiringIn30Days++;
      } else if (diffDays <= 30) {
        expiringIn30Days++;
      } else if (diffDays <= 60) {
        expiringIn60Days++;
      } else if (diffDays <= 90) {
        expiringIn90Days++;
      } else {
        healthy++;
      }
    });

    return {
      expiringIn30Days,
      expiringIn60Days,
      expiringIn90Days,
      healthy,
    };
  }, []);

  const StatusItem: React.FC<{ count: number; label: string; colorClass: string; icon: React.ReactNode }> = ({ count, label, colorClass, icon }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${colorClass}`}>
        <div className="flex items-center">
            {icon}
            <span className="font-semibold ml-2">{label}</span>
        </div>
        <span className="font-bold text-lg">{count}</span>
    </div>
  );


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Status</h3>
      <div className="space-y-3">
        <StatusItem
            count={certificateStatus.expiringIn30Days}
            label="Expiring in < 30 days"
            colorClass="bg-red-100 text-red-800"
            icon={<ShieldExclamationIcon className="h-6 w-6 text-red-500" />}
        />
        <StatusItem
            count={certificateStatus.expiringIn60Days}
            label="Expiring in 30-60 days"
            colorClass="bg-yellow-100 text-yellow-800"
            icon={<ShieldExclamationIcon className="h-6 w-6 text-yellow-500" />}
        />
        <StatusItem
            count={certificateStatus.expiringIn90Days}
            label="Expiring in 60-90 days"
            colorClass="bg-blue-100 text-blue-800"
            icon={<ShieldCheckIcon className="h-6 w-6 text-blue-500" />}
        />
         <StatusItem
            count={certificateStatus.healthy}
            label="Healthy (> 90 days)"
            colorClass="bg-green-100 text-green-800"
            icon={<ShieldCheckIcon className="h-6 w-6 text-green-500" />}
        />
      </div>
    </div>
  );
};

export default CertificateStatusCard;
