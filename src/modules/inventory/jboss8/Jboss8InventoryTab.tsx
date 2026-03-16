import React, { useState, useMemo, useContext } from 'react';
import { JBOSS8_INVENTORY_DATA } from '@/utils/constants';
import { AuthContext } from '@/context/AuthContext';
import {
    Square3Stack3DIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    InboxStackIcon,
    CpuChipIcon,
    ServerIcon as ServerOutlineIcon
} from '@heroicons/react/24/outline';
import { Jboss8Inventory, Jboss8Status } from '@/utils/types';

// --- Types & Constants ---

type ViewType = "all" | "active" | "stopped" | "prod" | "dev" | "test" | "qa" | "lab";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    counts: Record<string, number>;
}

// --- Components ---

// 1. Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, counts }) => {
    const navItems = [
        { id: "all", label: "All Instances", icon: InboxStackIcon, color: "text-purple-500" },
        { id: "active", label: "Running", icon: CheckCircleIcon, color: "text-green-500" },
        { id: "stopped", label: "Stopped", icon: XCircleIcon, color: "text-gray-500" },
        { id: "prod", label: "Production", icon: Square3Stack3DIcon, color: "text-blue-500" },
        { id: "dev", label: "Development", icon: Square3Stack3DIcon, color: "text-amber-500" },
        { id: "test", label: "Test", icon: Square3Stack3DIcon, color: "text-indigo-500" },
        { id: "qa", label: "QA", icon: Square3Stack3DIcon, color: "text-pink-500" },
        { id: "lab", label: "Lab", icon: Square3Stack3DIcon, color: "text-gray-400" },
    ];

    return (
        <aside className="w-64 border-r border-gray-100 p-4 flex flex-col gap-6 bg-white h-full shrink-0">
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-2">
                    Jboss 8 Navigation
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
const Jboss8InventoryTab: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<ViewType>("all");
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInstance, setSelectedInstance] = useState<Jboss8Inventory | null>(null);

    const data: Jboss8Inventory[] = JBOSS8_INVENTORY_DATA;

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = data;

        // View Filter
        if (activeView === "active") result = result.filter(r => r.status === "Running");
        else if (activeView === "stopped") result = result.filter(r => r.status === "Stopped");
        else if (activeView === "prod") result = result.filter(r => r.environment === "Prod");
        else if (activeView === "dev") result = result.filter(r => r.environment === "Dev");
        else if (activeView === "test") result = result.filter(r => r.environment === "Test");
        else if (activeView === "qa") result = result.filter(r => r.environment === "QA");
        else if (activeView === "lab") result = result.filter(r => r.environment === "Lab");

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.instanceName.toLowerCase().includes(query) ||
                r.server.toLowerCase().includes(query)
            );
        }

        return result.sort((a, b) => a.instanceName.localeCompare(b.instanceName));
    }, [data, activeView, searchQuery]);

    // Counts for Sidebar
    const counts = useMemo(() => ({
        all: data.length,
        active: data.filter(r => r.status === "Running").length,
        stopped: data.filter(r => r.status === "Stopped").length,
        prod: data.filter(r => r.environment === "Prod").length,
        dev: data.filter(r => r.environment === "Dev").length,
        test: data.filter(r => r.environment === "Test").length,
        qa: data.filter(r => r.environment === "QA").length,
        lab: data.filter(r => r.environment === "Lab").length,
    }), [data]);

    const getTitle = () => {
        switch (activeView) {
            case "prod": return "Production Jboss 8 Instances";
            case "dev": return "Development Jboss 8 Instances";
            case "test": return "Test Jboss 8 Instances";
            case "qa": return "QA Jboss 8 Instances";
            case "lab": return "Lab Jboss 8 Instances";
            case "active": return "Running Jboss 8 Instances";
            case "stopped": return "Stopped Jboss 8 Instances";
            default: return "Jboss 8 Inventory";
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
                        {/* Summary Info */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                                <InboxStackIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-700">{counts.all} Total</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">{counts.active} Running</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search instances..."
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
                        <Jboss8Table data={filteredData} onSelect={setSelectedInstance} />
                    </div>
                </div>
            </main>
        </div>
    );
};

const Jboss8Table: React.FC<{ data: Jboss8Inventory[], onSelect: (d: Jboss8Inventory) => void }> = ({ data, onSelect }) => {
    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                    <Th label="Instance Name" />
                    <Th label="Environment" />
                    <Th label="Server" />
                    <Th label="Port" />
                    <Th label="JVM Version" />
                    <Th label="Status" />
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
                            <div className="font-medium text-gray-900 text-sm">{row.instanceName}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{row.version}</div>
                        </td>
                        <td className="px-5 py-3">
                            <EnvBadge value={row.environment} />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <ServerOutlineIcon className="w-3.5 h-3.5 text-gray-400" />
                                {row.server}
                            </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                            <div className="flex flex-col">
                                <span>{row.port}</span>
                                {row.managementPort && <span className="text-[10px] text-gray-400">Mgmt: {row.managementPort}</span>}
                            </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <CpuChipIcon className="w-3.5 h-3.5 text-gray-400" />
                                {row.jvmVersion}
                            </div>
                        </td>
                        <td className="px-5 py-3">
                            <StatusBadge value={row.status} />
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

const EnvBadge = ({ value }: { value: string }) => {
    const colors: any = {
        Prod: "bg-blue-100 text-blue-700 border-blue-200",
        Dev: "bg-amber-100 text-amber-700 border-amber-200",
        Test: "bg-indigo-100 text-indigo-700 border-indigo-200",
        QA: "bg-pink-100 text-pink-700 border-pink-200",
        Lab: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[value] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
            {value}
        </span>
    );
};

const StatusBadge = ({ value }: { value: Jboss8Status }) => {
    const colors = {
        Running: "bg-green-50 text-green-700 border-green-200",
        Stopped: "bg-gray-50 text-gray-600 border-gray-200",
        Error: "bg-red-50 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[value] || "bg-gray-50 text-gray-600"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${value === 'Running' ? "bg-green-500" : value === 'Error' ? "bg-red-500" : "bg-gray-400"}`} />
            {value}
        </span>
    );
};

export default Jboss8InventoryTab;
