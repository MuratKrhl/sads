import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import { Server, Activity, AlertTriangle } from "lucide-react";

const hostData = [
    { name: "Healthy", value: 128 },
    { name: "Warning", value: 14 },
    { name: "Critical", value: 6 }
];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const responseData = [
    { time: "10:00", value: 210 },
    { time: "10:05", value: 230 },
    { time: "10:10", value: 240 },
    { time: "10:15", value: 220 },
    { time: "10:20", value: 250 }
];

export default function GlobalPlatformHealth() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Infrastructure Health */}
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                    <Server className="text-blue-400" size={20} />
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        Infrastructure Health
                    </h2>
                </div>

                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={hostData}
                                dataKey="value"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={5}
                                stroke="none"
                            >
                                {hostData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 text-sm text-zinc-300 space-y-1">
                    <div className="flex justify-between items-center">
                        <span>Total Hosts</span>
                        <span className="font-mono text-white">148</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>CPU Usage</span>
                        <span className="font-mono text-white">38%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Memory Usage</span>
                        <span className="font-mono text-white">54%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Disk Usage</span>
                        <span className="font-mono text-white">62%</span>
                    </div>
                </div>
            </div>


            {/* Application Health */}
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-green-400" size={20} />
                    <h2 className="text-white font-semibold">
                        Application Health
                    </h2>
                </div>

                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={responseData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ fill: '#22c55e', r: 3 }}
                                activeDot={{ r: 5, stroke: '#18181b', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 text-sm text-zinc-300 space-y-1">
                    <div className="flex justify-between items-center">
                        <span>Availability</span>
                        <span className="font-mono text-green-400">99.97%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Failure Rate</span>
                        <span className="font-mono text-red-400">0.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Response p95</span>
                        <span className="font-mono text-white">247ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Apdex</span>
                        <span className="font-mono text-blue-400">0.97</span>
                    </div>
                </div>
            </div>


            {/* Alert Summary */}
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-red-400" size={20} />
                    <h2 className="text-white font-semibold">
                        Alert Summary
                    </h2>
                </div>

                <div className="space-y-3 text-sm">

                    <div className="flex justify-between bg-red-500/10 p-2 rounded border border-red-500/20">
                        <span className="text-red-400 font-medium">Critical</span>
                        <span className="text-white font-bold">1</span>
                    </div>

                    <div className="flex justify-between bg-orange-500/10 p-2 rounded border border-orange-500/20">
                        <span className="text-orange-400 font-medium">Major</span>
                        <span className="text-white font-bold">3</span>
                    </div>

                    <div className="flex justify-between bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                        <span className="text-yellow-400 font-medium">Warning</span>
                        <span className="text-white font-bold">4</span>
                    </div>

                    <div className="flex justify-between bg-green-500/10 p-2 rounded border border-green-500/20">
                        <span className="text-green-400 font-medium">Auto-healed</span>
                        <span className="text-white font-bold">8</span>
                    </div>

                </div>
            </div>

        </div>
    );
}
