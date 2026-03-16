import React, { useState, useMemo, useContext } from "react";
import { APPLICATION_INVENTORY_DATA, SERVER_INVENTORY_DATA } from "@/utils/constants";
import { ApplicationInventory, ApplicationStatus, ServerInventory } from "@/utils/types";
import { AuthContext } from "@/context/AuthContext";
import {
  Square3Stack3DIcon,
  PlayCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CommandLineIcon
} from "@heroicons/react/24/outline";
import ApplicationInventoryDetailModal from '@/components/modals/ApplicationInventoryDetailModal';

// --- Types & Constants ---

type ViewType = "all" | "running" | "stopped" | "prod" | "dev" | "test" | "qa" | "lab";

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  counts: Record<string, number>;
}

// --- Components ---

// 1. Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, counts }) => {
  const navItems = [
    { id: "all", label: "All Applications", icon: CommandLineIcon, color: "text-blue-500" },
    { id: "running", label: "Running", icon: PlayCircleIcon, color: "text-green-500" },
    { id: "stopped", label: "Stopped", icon: XCircleIcon, color: "text-gray-500" },
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
interface AugmentedApp extends ApplicationInventory {
  environment: ServerInventory['environment'] | 'Unknown';
  javaVersion?: string;
  jbossVersion?: string;
  websphereVersion?: string;
}

const ApplicationInventoryTab = () => {
  const { user } = useContext(AuthContext);
  const [activeView, setActiveView] = useState<ViewType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<AugmentedApp | null>(null);

  const data: ApplicationInventory[] = APPLICATION_INVENTORY_DATA;

  // Augment data with Server info
  const serverMap = useMemo(() => {
    return new Map<string, ServerInventory>(
      SERVER_INVENTORY_DATA.map(server => [server.hostname, server])
    );
  }, []);

  const augmentedData: AugmentedApp[] = useMemo(() => {
    return data.map(app => {
      const server = serverMap.get(app.hostname);
      return {
        ...app,
        environment: server?.environment || 'Unknown',
        javaVersion: server?.javaVersion,
        jbossVersion: server?.jbossVersion,
        websphereVersion: server?.webSphereVersion,
      };
    });
  }, [data, serverMap]);

  // Filter Logic
  const filteredData = useMemo(() => {
    let result = augmentedData;

    // View Filter
    if (activeView === "running") result = result.filter(r => r.status === "Running");
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
        r.applicationName.toLowerCase().includes(query) ||
        r.hostname.toLowerCase().includes(query)
      );
    }

    return result;
  }, [augmentedData, activeView, searchQuery]);

  // Counts for Sidebar
  const counts = useMemo(() => ({
    all: augmentedData.length,
    running: augmentedData.filter(r => r.status === "Running").length,
    stopped: augmentedData.filter(r => r.status === "Stopped").length,
    prod: augmentedData.filter(r => r.environment === "Prod").length,
    dev: augmentedData.filter(r => r.environment === "Dev").length,
    test: augmentedData.filter(r => r.environment === "Test").length,
    qa: augmentedData.filter(r => r.environment === "QA").length,
    lab: augmentedData.filter(r => r.environment === "Lab").length,
  }), [augmentedData]);

  const getTitle = () => {
    switch (activeView) {
      case "prod": return "Production Applications";
      case "dev": return "Development Applications";
      case "test": return "Test Applications";
      case "qa": return "QA Applications";
      case "lab": return "Lab Applications";
      case "running": return "Running Applications";
      case "stopped": return "Stopped Applications";
      default: return "Application Inventory";
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
            {/* Empty space for alignment since tab switcher is gone */}
            <div></div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
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
            <AppTable data={filteredData} onSelect={setSelectedApp} />
          </div>
        </div>
      </main>

      {selectedApp && (
        <ApplicationInventoryDetailModal
          app={selectedApp}
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

const AppTable: React.FC<{ data: AugmentedApp[], onSelect: (a: AugmentedApp) => void }> = ({ data, onSelect }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
        <tr>
          <Th label="Application Name" />
          <Th label="Environment" />
          <Th label="Server" />
          <Th label="Version" />
          <Th label="Status" />
          <Th label="Platform" />
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
              <div className="font-medium text-gray-900 text-sm">{row.applicationName}</div>
            </td>
            <td className="px-5 py-3">
              <Badge value={row.environment} />
            </td>
            <td className="px-5 py-3 text-sm text-gray-600">
              {row.hostname}
            </td>
            <td className="px-5 py-3 text-sm text-gray-600 font-mono">
              {row.version}
            </td>
            <td className="px-5 py-3">
              <StatusBadge value={row.status} />
            </td>
            <td className="px-5 py-3 text-sm text-gray-500">
              {row.jbossVersion ? 'JBoss' : row.websphereVersion ? 'WebSphere' : 'Java'}
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

const StatusBadge = ({ value }: { value: ApplicationStatus }) => {
  const colors = {
    Running: "bg-green-50 text-green-700 border-green-200",
    Stopped: "bg-gray-50 text-gray-600 border-gray-200",
    Starting: "bg-amber-50 text-amber-700 border-amber-200",
    Error: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[value] || "bg-gray-50 text-gray-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${value === 'Running' ? "bg-green-500" : value === 'Error' ? "bg-red-500" : "bg-gray-400"}`} />
      {value}
    </span>
  );
};

export default ApplicationInventoryTab;
