import React, { useState, useMemo, useContext } from 'react';
import { OPENSHIFT_INVENTORY_DATA } from '@/utils/constants';
import { AuthContext } from '@/context/AuthContext';
import {
    Square3Stack3DIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    CloudIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { OpenshiftInventory } from '@/utils/types';
import OpenshiftInventoryDetailModal from '@/components/modals/OpenshiftInventoryDetailModal';

// --- Types & Constants ---

type ViewType = "all" | "prod" | "dev" | "test" | "qa" | "lab";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    counts: Record<string, number>;
}

// --- Components ---

// 1. Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, counts }) => {
    const navItems = [
        { id: "all", label: "All Clusters", icon: CloudIcon, color: "text-blue-500" },
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
const OpenshiftInventoryTab: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<ViewType>("all");
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCluster, setSelectedCluster] = useState<OpenshiftInventory | null>(null);

    const data: OpenshiftInventory[] = OPENSHIFT_INVENTORY_DATA;

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = data;

        // View Filter
        if (activeView === "prod") result = result.filter(r => r.environment === "Prod");
        else if (activeView === "dev") result = result.filter(r => r.environment === "Dev");
        else if (activeView === "test") result = result.filter(r => r.environment === "Test");
        else if (activeView === "qa") result = result.filter(r => r.environment === "QA");
        else if (activeView === "lab") result = result.filter(r => r.environment === "Lab");

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.clusterName.toLowerCase().includes(query) ||
                r.namespace.toLowerCase().includes(query)
            );
        }

        return result.sort((a, b) => a.clusterName.localeCompare(b.clusterName));
    }, [data, activeView, searchQuery]);

    // Counts for Sidebar
    const counts = useMemo(() => ({
        all: data.length,
        prod: data.filter(r => r.environment === "Prod").length,
        dev: data.filter(r => r.environment === "Dev").length,
        test: data.filter(r => r.environment === "Test").length,
        qa: data.filter(r => r.environment === "QA").length,
        lab: data.filter(r => r.environment === "Lab").length,
    }), [data]);

    const getTitle = () => {
        switch (activeView) {
            case "prod": return "Production Clusters";
            case "dev": return "Development Clusters";
            case "test": return "Test Clusters";
            case "qa": return "QA Clusters";
            case "lab": return "Lab Clusters";
            default: return "Openshift Inventory";
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
                                    placeholder="Search clusters..."
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
                        <ClusterTable data={filteredData} onSelect={setSelectedCluster} />
                    </div>
                </div>
            </main>

            {selectedCluster && (
                <OpenshiftInventoryDetailModal
                    cluster={selectedCluster}
                    isOpen={!!selectedCluster}
                    onClose={() => setSelectedCluster(null)}
                />
            )}
        </div>
    );
};

const ClusterTable: React.FC<{ data: OpenshiftInventory[], onSelect: (c: OpenshiftInventory) => void }> = ({ data, onSelect }) => {
    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                    <Th label="Cluster Name" />
                    <Th label="Environment" />
                    <Th label="Namespace" />
                    <Th label="Version" />
                    <Th label="Nodes" />
                    <Th label="Pods" />
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
                                <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-900 text-sm">{row.clusterName}</span>
                            </div>
                        </td>
                        <td className="px-5 py-3">
                            <Badge value={row.environment} />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                            {row.namespace}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 font-mono">
                            {row.clusterVersion}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 font-bold">
                            {row.nodes}
                        </td>
                        <td className="px-5 py-3">
                            <PodsStatus status={row.pods} />
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

const PodsStatus: React.FC<{ status?: string }> = ({ status }) => {
    if (!status) return <span>-</span>;
    const parts = status.split(' / ');
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {parts.map(part => {
                const state = part.includes('Running') ? 'Running' : part.includes('Pending') ? 'Pending' : 'Error';
                const count = part.split(' ')[0];
                let color = 'bg-gray-100 text-gray-700 border-gray-200';
                if (state === 'Running') color = 'bg-green-50 text-green-700 border-green-200';
                if (state === 'Pending') color = 'bg-amber-50 text-amber-700 border-amber-200';
                if (state === 'Error') color = 'bg-red-50 text-red-700 border-red-200';

                return (
                    <span key={part} className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${color}`}>
                        {count} {state}
                    </span>
                );
            })}
        </div>
    );
};

export default OpenshiftInventoryTab;
