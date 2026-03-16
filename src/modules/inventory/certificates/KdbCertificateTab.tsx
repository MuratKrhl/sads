import React, { useState, useMemo, useContext } from 'react';
import { KDB_CERTIFICATE_DATA } from '@/utils/constants';
import { AuthContext } from '@/context/AuthContext';
import {
    Square3Stack3DIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { KdbCertificate } from '@/utils/types';
import KdbCertificateDetailModal from '@/components/modals/KdbCertificateDetailModal';

// --- Types & Constants ---

type ViewType = "all" | "valid" | "expiring" | "expired" | "prod" | "dev" | "test" | "qa" | "lab";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    counts: Record<string, number>;
}

interface CertWithStatus extends KdbCertificate {
    daysToExpiry: number;
    status: 'Expired' | 'Expiring Soon' | 'Valid';
}

const getCertStatus = (validTo: string): CertWithStatus['status'] => {
    const now = new Date();
    const expiry = new Date(validTo);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expired';
    if (diffDays <= 30) return 'Expiring Soon';
    return 'Valid';
};

const getDaysToExpiry = (validTo: string): number => {
    const now = new Date();
    const expiry = new Date(validTo);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// --- Components ---

// 1. Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, counts }) => {
    const navItems = [
        { id: "all", label: "All Certificates", icon: LockClosedIcon, color: "text-blue-500" },
        { id: "valid", label: "Valid", icon: CheckCircleIcon, color: "text-green-500" },
        { id: "expiring", label: "Expiring Soon", icon: ExclamationTriangleIcon, color: "text-amber-500" },
        { id: "expired", label: "Expired", icon: XCircleIcon, color: "text-red-500" },
        { id: "prod", label: "Production", icon: Square3Stack3DIcon, color: "text-purple-500" },
        { id: "dev", label: "Development", icon: Square3Stack3DIcon, color: "text-amber-500" },
        { id: "test", label: "Test", icon: Square3Stack3DIcon, color: "text-indigo-500" },
        { id: "qa", label: "QA", icon: Square3Stack3DIcon, color: "text-pink-500" },
        { id: "lab", label: "Lab", icon: Square3Stack3DIcon, color: "text-gray-500" },
    ];

    return (
        <aside className="w-64 border-r border-gray-100 p-4 flex flex-col gap-6 bg-white h-full shrink-0">
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-2">
                    Navigation
                </h3>
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id as ViewType)}
                            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeView === item.id
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                                <span>{item.label}</span>
                            </div>
                            {counts[item.id] > 0 && (
                                <span className="text-xs text-gray-400 font-normal bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                                    {counts[item.id]}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

// 2. Main Content Component
const KdbCertificateTab: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<ViewType>("all");
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCert, setSelectedCert] = useState<CertWithStatus | null>(null);

    const data: KdbCertificate[] = KDB_CERTIFICATE_DATA;

    const augmentedData: CertWithStatus[] = useMemo(() => {
        return data.map(cert => ({
            ...cert,
            daysToExpiry: getDaysToExpiry(cert.validTo),
            status: getCertStatus(cert.validTo),
        }));
    }, [data]);

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = augmentedData;

        // View Filter
        if (activeView === "valid") result = result.filter(r => r.status === "Valid");
        else if (activeView === "expiring") result = result.filter(r => r.status === "Expiring Soon");
        else if (activeView === "expired") result = result.filter(r => r.status === "Expired");
        else if (activeView === "prod") result = result.filter(r => r.environment === "Prod");
        else if (activeView === "dev") result = result.filter(r => r.environment === "Dev");
        else if (activeView === "test") result = result.filter(r => r.environment === "Test");
        else if (activeView === "qa") result = result.filter(r => r.environment === "QA");
        else if (activeView === "lab") result = result.filter(r => r.environment === "Lab");

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.alias.toLowerCase().includes(query) ||
                r.server.toLowerCase().includes(query) ||
                r.issuer.toLowerCase().includes(query)
            );
        }

        return result.sort((a, b) => a.daysToExpiry - b.daysToExpiry);
    }, [augmentedData, activeView, searchQuery]);

    // Counts for Sidebar
    const counts = useMemo(() => ({
        all: augmentedData.length,
        valid: augmentedData.filter(r => r.status === "Valid").length,
        expiring: augmentedData.filter(r => r.status === "Expiring Soon").length,
        expired: augmentedData.filter(r => r.status === "Expired").length,
        prod: augmentedData.filter(r => r.environment === "Prod").length,
        dev: augmentedData.filter(r => r.environment === "Dev").length,
        test: augmentedData.filter(r => r.environment === "Test").length,
        qa: augmentedData.filter(r => r.environment === "QA").length,
        lab: augmentedData.filter(r => r.environment === "Lab").length,
    }), [augmentedData]);

    const getTitle = () => {
        switch (activeView) {
            case "expiring": return "Expiring Certificates";
            case "expired": return "Expired Certificates";
            case "prod": return "Production Certificates";
            case "dev": return "Development Certificates";
            case "test": return "Test Certificates";
            case "qa": return "QA Certificates";
            case "lab": return "Lab Certificates";
            default: return "KDB Certificate Inventory";
        }
    };

    return (
        <div className="flex h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                counts={counts as any}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="border-b border-gray-100 px-6 py-5 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{getTitle()}</h1>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                    {/* Tabs & Toolbar */}
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        {/* Spacer */}
                        <div></div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search certificates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-64 bg-white transition-all shadow-sm"
                                />
                            </div>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm">
                                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content View */}
                    <div className="flex-1 overflow-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                        <CertTable data={filteredData} onSelect={setSelectedCert} />
                    </div>
                </div>
            </main>

            {selectedCert && (
                <KdbCertificateDetailModal
                    cert={selectedCert}
                    isOpen={!!selectedCert}
                    onClose={() => setSelectedCert(null)}
                />
            )}
        </div>
    );
};

const CertTable: React.FC<{ data: CertWithStatus[], onSelect: (c: CertWithStatus) => void }> = ({ data, onSelect }) => {
    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                    <Th label="Alias" />
                    <Th label="Environment" />
                    <Th label="Server" />
                    <Th label="Issuer" />
                    <Th label="Expires" />
                    <Th label="Days Left" />
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                    <tr
                        key={row.id}
                        onClick={() => onSelect(row)}
                        className="group hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                        <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                                <LockClosedIcon className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-900 text-sm">{row.alias}</span>
                            </div>
                        </td>
                        <td className="px-5 py-3">
                            <Badge value={row.environment} />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                            {row.server}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 truncate max-w-[200px]" title={row.issuer}>
                            {row.issuer}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 font-mono">
                            {new Date(row.validTo).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                            <ExpiryBadge days={row.daysToExpiry} status={row.status} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const Th = ({ label }: { label: string }) => (
    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
    </th>
);

const Badge = ({ value }: { value: string }) => {
    const colors: any = {
        Prod: "bg-purple-100 text-purple-700 border-purple-200",
        Dev: "bg-amber-100 text-amber-700 border-amber-200",
        Test: "bg-indigo-100 text-indigo-700 border-indigo-200",
        QA: "bg-blue-100 text-blue-700 border-blue-200",
        Lab: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[value] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
            {value}
        </span>
    );
};

const ExpiryBadge: React.FC<{ days: number, status: CertWithStatus['status'] }> = ({ days, status }) => {
    const colorMap: Record<CertWithStatus['status'], string> = {
        Valid: "bg-green-50 text-green-700 border-green-200",
        'Expiring Soon': "bg-amber-50 text-amber-700 border-amber-200",
        Expired: "bg-red-50 text-red-700 border-red-200",
    };
    const label = status === 'Expired' ? `Expired (${Math.abs(days)}d ago)` : `${days} days`;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[status]}`}>
            {label}
        </span>
    );
};

export default KdbCertificateTab;
