import { useState, useMemo } from "react";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ENVIRONMENTS = [
    { key: "PROD", label: "Production" },
    { key: "TEST", label: "Test" },
    { key: "DEV", label: "Development" },
];

const SERVERS = {
    PROD: [
        { hostname: "app-srv-001", os: "linux" },
        { hostname: "app-srv-002", os: "linux" },
        { hostname: "aix-srv-001", os: "aix" },
        { hostname: "web-srv-001", os: "linux" },
    ],
    TEST: [
        { hostname: "test-srv-001", os: "linux" },
        { hostname: "test-srv-002", os: "linux" },
    ],
    DEV: [{ hostname: "dev-srv-001", os: "linux" }],
};

const LOG_TYPES = ["APP", "IBMIHS", "Redhat Apache", "Web"];

const EAR_APPS: Record<string, string[]> = {
    "app-srv-001": ["myapp.ear", "billing.ear", "payment.ear", "reporting.ear"],
    "app-srv-002": ["myapp.ear", "portal.ear"],
    "aix-srv-001": ["erp.ear", "finance.ear", "hr.ear"],
    "test-srv-001": ["myapp.ear"],
    "test-srv-002": ["myapp.ear"],
    "dev-srv-001": ["myapp.ear"],
};

// ── File Generators ───────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const daysAgoStr = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0]; };

const generateAppFiles = (ear: string) => {
    if (!ear) return [];
    return [
        { name: `${ear}.log`, size_label: "45.2 MB", date: todayStr(), rotated: false },
        { name: `${ear}-${daysAgoStr(1)}.log`, size_label: "120.8 MB", date: daysAgoStr(1), rotated: true },
        { name: `${ear}-${daysAgoStr(2)}.log`, size_label: "98.3 MB", date: daysAgoStr(2), rotated: true },
        { name: `${ear}-${daysAgoStr(4)}.log`, size_label: "90.1 MB", date: daysAgoStr(4), rotated: true }, // older than 3 days
    ];
};

const IHS_FILES = [
    { name: "mod_jk.log", size_label: "15.4 MB", date: todayStr(), rotated: false },
    { name: `mod_jk.log.${daysAgoStr(1).replace(/-/g, "")}`, size_label: "14.2 MB", date: daysAgoStr(1), rotated: true },
    { name: `mod_jk.log.${daysAgoStr(4).replace(/-/g, "")}`, size_label: "12.0 MB", date: daysAgoStr(4), rotated: true },
    { name: "error_log", size_label: "12.1 MB", date: todayStr(), rotated: false },
    { name: `error_log.${daysAgoStr(1).replace(/-/g, "")}`, size_label: "9.8 MB", date: daysAgoStr(1), rotated: true },
    { name: "access_log", size_label: "210.4 MB", date: todayStr(), rotated: false },
    { name: `access_log.${daysAgoStr(1).replace(/-/g, "")}`, size_label: "198.7 MB", date: daysAgoStr(1), rotated: true },
];

const RHA_FILES = [
    { name: "rha_access_log", size_label: "180.2 MB", date: todayStr(), rotated: false },
    { name: `rha_access_log.${daysAgoStr(1).replace(/-/g, "")}`, size_label: "170.5 MB", date: daysAgoStr(1), rotated: true },
    { name: "rha_error_log", size_label: "8.4 MB", date: todayStr(), rotated: false },
    { name: `rha_error_log.${daysAgoStr(1).replace(/-/g, "")}`, size_label: "7.1 MB", date: daysAgoStr(1), rotated: true },
    { name: "rha_httpd.log", size_label: "45.6 MB", date: todayStr(), rotated: false },
];

const WEB_APPS = ["gbstppensionoperation", "gtbe-t", "gbs-t", "portal-web"];

const generateWebFiles = (app: string) => {
    if (!app) return [];
    const dateStr1 = daysAgoStr(1).replace(/-/g, "");
    const dateStr5 = daysAgoStr(5).replace(/-/g, "");
    return [
        { name: `${app}_ssl.access_log.${todayStr().replace(/-/g, "")}`, size_label: "88.3 MB", date: todayStr(), rotated: false },
        { name: `${app}_ssl.access_log.${dateStr1}`, size_label: "76.5 MB", date: daysAgoStr(1), rotated: true },
        { name: `${app}_ssl_error_log`, size_label: "12.4 MB", date: todayStr(), rotated: false },
        { name: `${app}_error_log.${todayStr().replace(/-/g, "")}`, size_label: "34.1 MB", date: todayStr(), rotated: false },
        { name: `${app}_error_log.${dateStr5}`, size_label: "30.1 MB", date: daysAgoStr(5), rotated: true }, // older than 3 days
    ];
};

const LOG_TYPE_META: Record<string, any> = {
    APP: { label: "APP", path: "/vhosting/*.ear/logs & /vhosting8/*.ear/logs", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    IBMIHS: { label: "IBMIHS", path: "/usr/IBMIHS/logs", color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
    "Redhat Apache": { label: "Redhat Apache", path: "/usr/IBMIHS/logs", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
    Web: { label: "Web", path: "/usr/IBMIHS/logs & /web_log/", color: "#047857", bg: "#f0fdf4", border: "#bbf7d0" },
};

const QUICK_RANGES = [
    { key: "today", label: "Bugün", days: 0 },
    { key: "yesterday", label: "Dün", days: 1 },
    { key: "3days", label: "Son 3 gün", days: 3 },
    { key: "7days", label: "Son 7 gün", days: 7 },
];

const LEVEL_CFG: Record<string, any> = {
    ERROR: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#dc2626" },
    WARNING: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", dot: "#d97706" },
    INFO: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", dot: "#2563eb" },
    DEBUG: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#6b7280" },
    UNKNOWN: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#6b7280" },
};

const ALL_LEVELS = ["ERROR", "WARNING", "INFO", "DEBUG"];

// ── Mock log üretici ──────────────────────────────────────────────────────────
const MOCK_LOGS: Record<string, any[]> = {
    APP: [
        { level: "ERROR", msg: "NullPointerException at com.example.service.UserService.getUser(UserService.java:142)", stack: "java.lang.NullPointerException\n  at com.example.service.UserService.getUser(UserService.java:142)\n  at com.example.web.UserController.show(UserController.java:88)" },
        { level: "ERROR", msg: "Connection timeout to database after 30000ms", stack: null },
        { level: "WARNING", msg: "Slow query detected: 4523ms for SELECT * FROM transactions", stack: null },
        { level: "INFO", msg: "Application started successfully on port 9080", stack: null },
        { level: "DEBUG", msg: "Session created for user: john.doe@example.com", stack: null },
    ],
    IBMIHS: [
        { level: "INFO", msg: 'GET /app/index.jsp HTTP/1.1 200 4523 - 192.168.1.100', stack: null },
        { level: "WARNING", msg: 'POST /api/login HTTP/1.1 401 213 - 10.0.0.5', stack: null },
        { level: "ERROR", msg: 'GET /api/data HTTP/1.1 500 89 - 10.0.0.12', stack: null },
    ],
    "Redhat Apache": [
        { level: "INFO", msg: 'GET /rha/app HTTP/1.1 200 1024 - 10.1.2.3', stack: null },
        { level: "ERROR", msg: '[core:error] [pid 12345] [client 10.1.2.3] AH00124: Request exceeded the limit', stack: null },
        { level: "WARNING", msg: '[ssl:warn] [pid 12345] AH01906: www.example.com:443:0 server certificate is a CA certificate', stack: null },
    ],
    Web: [
        { level: "INFO", msg: '10.0.0.1 - - [09/Mar/2026:08:01:12 +0300] "GET / HTTP/1.1" 200 5120', stack: null },
        { level: "WARNING", msg: '10.0.0.5 - - [09/Mar/2026:08:02:44 +0300] "GET /private HTTP/1.1" 404 213', stack: null },
        { level: "ERROR", msg: '10.0.0.9 - - [09/Mar/2026:08:04:01 +0300] "POST /api HTTP/1.1" 500 89', stack: null },
    ],
};

const generateLogs = (logType: string, keyword: string, selectedLevels: string[]) => {
    const base = MOCK_LOGS[logType] || MOCK_LOGS.APP;
    const hours = ["08", "09", "10", "11", "12", "13", "14", "15"];
    const entries = [];

    for (let i = 0; i < 60; i++) {
        const b = base[i % base.length];

        // Level filter
        if (!selectedLevels.includes(b.level)) continue;

        // Keyword filter
        if (keyword && !b.msg.toLowerCase().includes(keyword.toLowerCase())) continue;

        const h = hours[i % hours.length];
        const m = String((i * 7) % 60).padStart(2, "0");
        const s = String((i * 13) % 60).padStart(2, "0");

        entries.push({
            id: i + 1,
            timestamp: `2026-03-09 ${h}:${m}:${s}`,
            level: b.level, thread: String(i + 1).padStart(8, "0"),
            message: b.msg, stack_trace: b.stack,
            is_multiline: !!b.stack,
            raw: `[09/03/26 ${h}:${m}:${s}:000 TRT] ${String(i + 1).padStart(8, "0")} ${b.level[0]}  ${b.msg}`,
        });
    }
    return entries.slice(0, 40);
};

const levelCounts = (entries: any[]) => {
    const c: Record<string, number> = { ERROR: 0, WARNING: 0, INFO: 0, DEBUG: 0 };
    entries.forEach(e => { if (c[e.level] !== undefined) c[e.level]++; });
    return c;
};

// ── Sub-components ────────────────────────────────────────────────────────────
const SLabel = ({ children }: any) => (
    <div style={{
        fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: 7
    }}>{children}</div>
);

const Sel = ({ value, onChange, options, placeholder, disabled }: any) => (
    <div style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
            style={{
                width: "100%", padding: "7px 28px 7px 10px",
                background: disabled ? "#f9fafb" : "#fff",
                border: `1px solid ${disabled ? "#e5e7eb" : "#d1d5db"}`,
                borderRadius: 6, color: disabled ? "#9ca3af" : "#374151",
                fontSize: 12.5, appearance: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                outline: "none", fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
            onFocus={(e: any) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
            onBlur={(e: any) => { e.target.style.borderColor = disabled ? "#e5e7eb" : "#d1d5db"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o: any) => <option key={o.key || o} value={o.key || o}>{o.label || o}</option>)}
        </select>
        <span style={{
            position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
            pointerEvents: "none", color: "#9ca3af", fontSize: 9
        }}>▼</span>
    </div>
);

const LvlBadge = ({ level }: any) => {
    const c = LEVEL_CFG[level] || LEVEL_CFG.UNKNOWN;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 7px", borderRadius: 4, background: c.bg, color: c.color,
            border: `1px solid ${c.border}`, fontSize: 10.5, fontWeight: 700,
            letterSpacing: "0.05em", fontFamily: "'JetBrains Mono',monospace", whiteSpace: "nowrap"
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
            {level}
        </span>
    );
};

const LogRow = ({ entry, isRaw, isExpanded, onToggle }: any) => {
    const [hov, setHov] = useState(false);
    const c = LEVEL_CFG[entry.level] || LEVEL_CFG.UNKNOWN;
    return (
        <div style={{ borderBottom: "1px solid #f3f4f6" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            <div onClick={() => entry.is_multiline && onToggle(entry.id)}
                style={{
                    display: "grid",
                    gridTemplateColumns: isRaw ? "1fr" : "108px 148px 96px 1fr",
                    padding: "8px 16px", alignItems: "start",
                    background: hov ? "#f8faff" : isExpanded ? "#fafbff" : "transparent",
                    cursor: entry.is_multiline ? "pointer" : "default",
                    borderLeft: `3px solid ${isExpanded ? c.color : "transparent"}`,
                    transition: "background 0.1s",
                }}>
                {isRaw ? (
                    <span style={{
                        fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5,
                        color: "#6b7280", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all"
                    }}>
                        {entry.raw}
                    </span>
                ) : (
                    <>
                        <div style={{ paddingTop: 1 }}><LvlBadge level={entry.level} /></div>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#9ca3af", paddingTop: 2 }}>
                            {entry.timestamp?.split(" ")[1]}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d1d5db", paddingTop: 2 }}>
                            {entry.thread}
                        </span>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <span style={{
                                fontSize: 12.5, lineHeight: 1.5,
                                color: entry.level === "ERROR" ? "#dc2626" : entry.level === "WARNING" ? "#92400e" : "#374151",
                                wordBreak: "break-all"
                            }}>
                                {entry.message}
                            </span>
                            {entry.is_multiline && (
                                <span style={{
                                    fontSize: 10.5, color: "#3b82f6", flexShrink: 0, marginTop: 2,
                                    fontFamily: "'JetBrains Mono',monospace"
                                }}>
                                    {isExpanded ? "▲ gizle" : "▼ trace"}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
            {!isRaw && isExpanded && entry.stack_trace && (
                <div style={{
                    margin: "0 16px 10px 375px", padding: "10px 14px",
                    background: "#fef2f2", borderRadius: 6, borderLeft: `3px solid ${c.color}`
                }}>
                    <pre style={{
                        margin: 0, fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 11, color: "#b91c1c", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all"
                    }}>{entry.stack_trace}</pre>
                </div>
            )}
        </div>
    );
};

// Checkbox'lı dosya listesi
const FileListCheckbox = ({ files, selectedFiles, onToggle }: any) => {

    if (files.length === 0) {
        return <div style={{ padding: "14px 16px", textAlign: "center", color: "#9ca3af", fontSize: 12 }}>
            Bu aralıkta uygun dosya bulunamadı
        </div>;
    }

    return files.map((f: any) => {
        const checked = selectedFiles.includes(f.name);
        return (
            <div key={f.name}
                onClick={() => onToggle(f.name)}
                style={{
                    padding: "9px 14px", cursor: "pointer",
                    borderLeft: `3px solid ${checked ? "#3b82f6" : "transparent"}`,
                    background: checked ? "#eff6ff" : "transparent",
                    transition: "all 0.1s", display: "flex", alignItems: "flex-start", gap: 10,
                }}
                onMouseEnter={(e: any) => { if (!checked) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={(e: any) => { if (!checked) e.currentTarget.style.background = "transparent"; }}>

                {/* Checkbox */}
                <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${checked ? "#3b82f6" : "#d1d5db"}`,
                    background: checked ? "#3b82f6" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                }}>
                    {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{
                            fontSize: 12, color: checked ? "#1d4ed8" : "#374151",
                            fontWeight: checked ? 600 : 400, wordBreak: "break-all"
                        }}>
                            {f.name}
                        </span>
                        {f.rotated && (
                            <span style={{
                                fontSize: 9.5, padding: "1px 5px", borderRadius: 3, flexShrink: 0, marginLeft: 4,
                                background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb"
                            }}>
                                ARŞİV
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 10.5, color: "#9ca3af", fontFamily: "'JetBrains Mono',monospace" }}>
                            {f.size_label}
                        </span>
                        <span style={{ fontSize: 10.5, color: "#c4c9d4" }}>{f.date}</span>
                    </div>
                </div>
            </div>
        );
    });
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LogViewerPage() {
    const [env, setEnv] = useState("");
    const [server, setServer] = useState("");
    const [logType, setLogType] = useState("");
    const [earApp, setEarApp] = useState("");   // APP için .ear
    const [webApp, setWebApp] = useState("");   // WEB için uygulama adı
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const [quickRange, setQuickRange] = useState("today");
    const [dateFrom, setDateFrom] = useState(todayStr());
    const [dateTo, setDateTo] = useState(todayStr());
    const [showRotated, setShowRotated] = useState(false);

    const [levels, setLevels] = useState<string[]>(ALL_LEVELS);

    const [kwInput, setKwInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [isRaw, setIsRaw] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [page, setPage] = useState(1);

    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [queryMs, setQueryMs] = useState<number | null>(null);

    const PAGE_SIZE = 20;

    // ELK vs Shell source detection (3 days rule)
    const source = useMemo(() => {
        if (!dateFrom) return "ELK"; // default

        // Check if the date selected is older than 3 days from today
        const selectedDate = new Date(dateFrom);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        // If selected filter goes further back than 3 days, we rely on Shell/Ansible jobs
        if (selectedDate < threeDaysAgo) {
            return "Shell/Ansible";
        }
        return "ELK";
    }, [dateFrom]);

    // Cascade reset
    const handleEnvChange = (v: string) => { setEnv(v); setServer(""); setLogType(""); setEarApp(""); setWebApp(""); setSelectedFiles([]); setEntries([]); };
    const handleServerChange = (v: string) => { setServer(v); setLogType(""); setEarApp(""); setWebApp(""); setSelectedFiles([]); setEntries([]); };
    const handleLogTypeChange = (v: string) => { setLogType(v); setEarApp(""); setWebApp(""); setSelectedFiles([]); setEntries([]); };
    const handleEarChange = (v: string) => { setEarApp(v); setSelectedFiles([]); setEntries([]); };
    const handleWebAppChange = (v: string) => { setWebApp(v); setSelectedFiles([]); setEntries([]); };

    const handleQuickRange = (r: any) => {
        setQuickRange(r.key);
        setDateFrom(r.days === 0 ? todayStr() : daysAgoStr(r.days));
        setDateTo(todayStr());
        setSelectedFiles([]); setEntries([]);
    };

    const toggleLevel = (lvl: string) => {
        setLevels(prev => {
            const isSelected = prev.includes(lvl);
            if (isSelected && prev.length === 1) return prev; // Don't uncheck the last one
            return isSelected ? prev.filter(l => l !== lvl) : [...prev, lvl];
        });
    };

    // Dosya toggle (checkbox)
    const toggleFile = (fname: string) => {
        setSelectedFiles(prev =>
            prev.includes(fname) ? prev.filter(f => f !== fname) : [...prev, fname]
        );
    };

    // Compute available files based on selection and filters
    const availableFiles = useMemo(() => {
        let files: any[] = [];
        if (logType === "APP") files = generateAppFiles(earApp);
        if (logType === "IBMIHS") files = IHS_FILES;
        if (logType === "Redhat Apache") files = RHA_FILES;
        if (logType === "Web") files = generateWebFiles(webApp);

        return files.filter(f => {
            if (!showRotated && f.rotated) return false;
            if (f.date < dateFrom || f.date > dateTo) return false;
            return true;
        });
    }, [logType, earApp, webApp, showRotated, dateFrom, dateTo]);

    const showBackupWarning = useMemo(() => {
        // If rotated logs are turned on, but no files match the Date Range (especially in the past)
        if (!showRotated) return false;

        // Must have the pre-requisite selected
        if ((logType === "APP" && earApp) || logType === "IBMIHS" || logType === "Redhat Apache" || (logType === "Web" && webApp)) {
            if (availableFiles.length === 0) return true;
        }
        return false;
    }, [showRotated, logType, earApp, webApp, availableFiles.length]);

    // Dosya listesi görünür mü?
    const showFileList =
        (logType === "APP" && earApp) ||
        (logType === "IBMIHS") ||
        (logType === "Redhat Apache") ||
        (logType === "Web" && webApp);

    // Yükleme
    const doLoad = (kw: string) => {
        if (selectedFiles.length === 0) return;
        setLoading(true); setExpanded({}); setPage(1);
        const t0 = Date.now();
        setTimeout(() => {
            setEntries(generateLogs(logType, kw, levels));
            setQueryMs(Date.now() - t0);
            setLoading(false);
        }, 450);
    };

    // Dosya toggle → seçili dosya varsa otomatik yükle
    const handleFileToggle = (fname: string) => {
        const newFiles = selectedFiles.includes(fname)
            ? selectedFiles.filter(f => f !== fname)
            : [...selectedFiles, fname];
        setSelectedFiles(newFiles);
        if (newFiles.length > 0) {
            setLoading(true); setExpanded({}); setPage(1);
            const t0 = Date.now();
            setTimeout(() => {
                setEntries(generateLogs(logType, keyword, levels));
                setQueryMs(Date.now() - t0);
                setLoading(false);
            }, 350);
        } else {
            setEntries([]);
        }
    };

    const handleSearch = () => {
        if (selectedFiles.length === 0) return;
        setKeyword(kwInput);
        doLoad(kwInput);
    };

    // Fetch when levels change
    // We use useMemo to avoid loop, but let's just trigger load on level change if files are selected
    const handleApplyFilters = () => {
        if (selectedFiles.length > 0) {
            doLoad(keyword);
        }
    };

    const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

    const counts = levelCounts(entries);
    const paged = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPgs = Math.ceil(entries.length / PAGE_SIZE);
    const srvInfo = ((SERVERS as Record<string, any[]>)[env] || []).find((s: any) => s.hostname === server);

    const breadcrumb = [env, server, logType,
        logType === "APP" ? earApp : logType === "Web" ? webApp : null,
        selectedFiles.length === 1 ? selectedFiles[0] : selectedFiles.length > 1 ? `${selectedFiles.length} dosya` : null
    ].filter(Boolean);

    return (
        <div style={{
            minHeight: "100vh", background: "#f3f4f6",
            fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex", flexDirection: "column"
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#f3f4f6; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#9ca3af; }
        input[type=date] { color-scheme:light; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:none;} }
      `}</style>

            {/* ── Top Bar ────────────────────────────────────────────── */}
            <div style={{
                height: 54, background: "#fff", borderBottom: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}>

                <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 8 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(59,130,246,0.4)", fontSize: 16
                    }}>⚡</div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>
                        Log Viewer
                    </span>
                </div>

                <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />

                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
                    {breadcrumb.length === 0
                        ? <span style={{ color: "#9ca3af" }}>Ortam seçerek başlayın</span>
                        : breadcrumb.map((item, i) => (
                            <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{
                                    color: i === breadcrumb.length - 1 ? "#111827" : "#6b7280",
                                    fontWeight: i === breadcrumb.length - 1 ? 600 : 400
                                }}>{item}</span>
                                {i < breadcrumb.length - 1 && <span style={{ color: "#d1d5db" }}>/</span>}
                            </span>
                        ))
                    }
                </div>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    {source && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "4px 12px", borderRadius: 20,
                            background: source === "ELK" ? "#eff6ff" : "#fdf2f8",
                            border: `1px solid ${source === "ELK" ? "#bfdbfe" : "#fbcfe8"}`,
                            fontSize: 12, fontWeight: 600,
                            color: source === "ELK" ? "#1d4ed8" : "#be185d"
                        }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: source === "ELK" ? "#3b82f6" : "#db2777"
                            }} />
                            Kaynak: {source}
                            {queryMs && <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>{queryMs}ms</span>}
                        </div>
                    )}
                    {selectedFiles.length > 0 && (
                        <button style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "6px 14px", borderRadius: 7, background: "#fff",
                            border: "1px solid #d1d5db", color: "#374151", fontSize: 12.5,
                            cursor: "pointer", fontWeight: 500, fontFamily: "inherit",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                            ↓ TXT İndir {selectedFiles.length > 1 && `(${selectedFiles.length})`}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* ── Sidebar ────────────────────────────────────────────── */}
                <div style={{
                    width: 272, flexShrink: 0, background: "#fff",
                    borderRight: "1px solid #e5e7eb", display: "flex",
                    flexDirection: "column", overflow: "hidden",
                    boxShadow: "1px 0 4px rgba(0,0,0,0.03)"
                }}>

                    <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px" }}>

                        {/* Kaynak */}
                        <div style={{ marginBottom: 18 }}>
                            <SLabel>Kaynak Seçimi</SLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                <Sel value={env} onChange={handleEnvChange}
                                    options={ENVIRONMENTS} placeholder="Ortam seçin..." />
                                <Sel value={server} onChange={handleServerChange}
                                    options={((SERVERS as Record<string, any[]>)[env] || []).map(s => ({
                                        key: s.hostname,
                                        label: `${s.hostname}${s.os === "aix" ? "  ·  AIX" : ""}`
                                    }))}
                                    placeholder="Sunucu seçin..." disabled={!env} />
                            </div>
                        </div>

                        {/* Log Tipi */}
                        <div style={{ marginBottom: 18 }}>
                            <SLabel>Log Tipi</SLabel>
                            {!server ? (
                                <div style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic" }}>Önce sunucu seçin</div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                    {LOG_TYPES.map(t => {
                                        const meta = LOG_TYPE_META[t];
                                        const sel = logType === t;
                                        return (
                                            <div key={t} style={{ flex: 1, gridColumn: t === "APP" || t === "IBMIHS" ? "span 1" : "span 2" }}>
                                                <button onClick={() => handleLogTypeChange(t)}
                                                    style={{
                                                        width: "100%", padding: "8px 4px", borderRadius: 7, border: "1px solid",
                                                        fontSize: 12, fontFamily: "inherit", fontWeight: 700,
                                                        cursor: "pointer", transition: "all 0.15s",
                                                        borderColor: sel ? meta.border : "#e5e7eb",
                                                        background: sel ? meta.bg : "#f9fafb",
                                                        color: sel ? meta.color : "#6b7280",
                                                        boxShadow: sel ? `0 0 0 2px ${meta.border}` : "none",
                                                    }}>
                                                    {t}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {logType && (
                                <div style={{
                                    marginTop: 8, fontSize: 10, color: LOG_TYPE_META[logType].color,
                                    background: LOG_TYPE_META[logType].bg, border: `1px solid ${LOG_TYPE_META[logType].border}`,
                                    borderRadius: 5, padding: "5px 7px",
                                    fontFamily: "'JetBrains Mono',monospace",
                                    wordBreak: "break-all", lineHeight: 1.4,
                                    animation: "fadeIn 0.2s ease",
                                }}>
                                    {LOG_TYPE_META[logType].path}
                                </div>
                            )}
                        </div>

                        {/* APP → .ear seçimi */}
                        {logType === "APP" && (
                            <div style={{
                                marginBottom: 18, padding: "12px", background: "#f8faff",
                                borderRadius: 8, border: "1px solid #e0eaff"
                            }}>
                                <SLabel>Uygulama (.ear)</SLabel>
                                <Sel value={earApp} onChange={handleEarChange}
                                    options={(EAR_APPS[server] || []).map(e => ({ key: e, label: e }))}
                                    placeholder={EAR_APPS[server]?.length ? "Uygulama seçin..." : "Bu sunucuda APP yok"}
                                    disabled={!EAR_APPS[server]?.length} />
                            </div>
                        )}

                        {/* WEB → uygulama adı seçimi */}
                        {logType === "Web" && (
                            <div style={{
                                marginBottom: 18, padding: "12px", background: "#f0fdf4",
                                borderRadius: 8, border: "1px solid #bbf7d0"
                            }}>
                                <SLabel>Web Uygulaması</SLabel>
                                <Sel value={webApp} onChange={handleWebAppChange}
                                    options={WEB_APPS.map(a => ({ key: a, label: a }))}
                                    placeholder="Uygulama seçin..." />
                                {webApp && (
                                    <div style={{
                                        marginTop: 6, fontSize: 10, color: "#047857",
                                        fontFamily: "'JetBrains Mono',monospace"
                                    }}>
                                        Örn: {webApp}_ssl.access_log.*
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Zaman Aralığı */}
                        <div style={{ marginBottom: 18 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                                <SLabel>Zaman Aralığı</SLabel>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                                {QUICK_RANGES.map((r: any) => (
                                    <button key={r.key} onClick={() => handleQuickRange(r)}
                                        style={{
                                            flex: "1 0 45%", padding: "6px 4px", borderRadius: 6, border: "1px solid",
                                            fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                                            fontWeight: quickRange === r.key ? 600 : 400,
                                            borderColor: quickRange === r.key ? "#3b82f6" : "#e5e7eb",
                                            background: quickRange === r.key ? "#eff6ff" : "#f9fafb",
                                            color: quickRange === r.key ? "#1d4ed8" : "#6b7280",
                                            transition: "all 0.12s",
                                        }}>{r.label}</button>
                                ))}
                            </div>

                            {showRotated && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, animation: "fadeIn 0.2s ease" }}>
                                    {[["Başlangıç", dateFrom, (v: string) => { setDateFrom(v); setQuickRange(""); }],
                                    ["Bitiş", dateTo, (v: string) => { setDateTo(v); setQuickRange(""); }]
                                    ].map(([lbl, val, setter]) => (
                                        <div key={lbl as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 11, color: "#9ca3af", width: 58, flexShrink: 0 }}>{lbl as string}</span>
                                            <input type="date" value={val as string} onChange={e => (setter as any)(e.target.value)}
                                                style={{
                                                    flex: 1, padding: "6px 8px", background: "#fff",
                                                    border: "1px solid #d1d5db", borderRadius: 6,
                                                    color: "#374151", fontSize: 12, outline: "none", fontFamily: "inherit",
                                                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                                                }}
                                                onFocus={(e: any) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                                                onBlur={(e: any) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Arşiv Toggle */}
                        <div style={{
                            marginBottom: 16, padding: "11px 12px", background: "#f9fafb",
                            borderRadius: 8, border: "1px solid #e5e7eb"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12.5, fontWeight: 500, color: "#374151", marginBottom: 2 }}>
                                        Arşiv Dosyaları
                                    </div>
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Rotated logları / Tarih Aralığını dahil et</div>
                                </div>
                                <div onClick={() => setShowRotated(p => !p)}
                                    style={{
                                        width: 38, height: 21, borderRadius: 11, cursor: "pointer",
                                        background: showRotated ? "#3b82f6" : "#d1d5db",
                                        position: "relative", transition: "background 0.2s", flexShrink: 0
                                    }}>
                                    <div style={{
                                        width: 17, height: 17, borderRadius: "50%", background: "#fff",
                                        position: "absolute", top: 2, left: showRotated ? 19 : 2,
                                        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Dosya listesi label */}
                        {showFileList && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                                <SLabel>Log Dosyaları</SLabel>
                                {selectedFiles.length > 0 && (
                                    <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, marginTop: -7 }}>
                                        {selectedFiles.length} seçili
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dosya listesi */}
                    {showFileList && (
                        <div style={{ maxHeight: 240, overflowY: "auto", borderTop: "1px solid #f3f4f6" }}>
                            {showBackupWarning ? (
                                <div style={{ padding: "14px", background: "#fef2f2", borderBottom: "1px solid #fecaca", margin: "10px", borderRadius: "8px" }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#991b1b", marginBottom: 4 }}>Arşiv Bulunamadı!</div>
                                    <div style={{ fontSize: 11, color: "#b91c1c", lineHeight: 1.4 }}>
                                        Belirttiğiniz tarih aralığında log dosyası mevcut değil.<br /><br />Eğer log burada çıkmıyorsa; <strong>backup kontrolü için Backup ekibi ile görüşülmeli.</strong>
                                    </div>
                                </div>
                            ) : (
                                <FileListCheckbox
                                    files={availableFiles}
                                    selectedFiles={selectedFiles}
                                    onToggle={handleFileToggle}
                                />
                            )}
                        </div>
                    )}

                    {/* Sunucu bilgisi */}
                    {srvInfo && (
                        <div style={{
                            padding: "10px 14px", borderTop: "1px solid #e5e7eb",
                            background: "#f9fafb", flexShrink: 0
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 11, color: "#9ca3af" }}>İşletim Sistemi</span>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, color: "#374151",
                                    fontFamily: "'JetBrains Mono',monospace"
                                }}>{srvInfo.os.toUpperCase()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Main Content ───────────────────────────────────────── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    {/* Filter Bar */}
                    <div style={{
                        padding: "10px 16px", background: "#fff",
                        borderBottom: "1px solid #e5e7eb", display: "flex",
                        alignItems: "center", gap: 8, flexShrink: 0,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        flexWrap: "wrap",
                    }}>

                        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 400 }}>
                            <span style={{
                                position: "absolute", left: 10, top: "50%",
                                transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14
                            }}>🔍</span>
                            <input value={kwInput} onChange={e => setKwInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                                disabled={selectedFiles.length === 0}
                                placeholder={
                                    selectedFiles.length === 0 ? "Önce dosya seçin" :
                                        selectedFiles.length === 1 ? `"${selectedFiles[0]}" içinde ara...` :
                                            `${selectedFiles.length} dosyada ara...`
                                }
                                style={{
                                    width: "100%", padding: "7px 10px 7px 34px",
                                    background: selectedFiles.length === 0 ? "#f9fafb" : "#fff",
                                    border: "1px solid #d1d5db", borderRadius: 7,
                                    color: "#374151", fontSize: 13, outline: "none", fontFamily: "inherit",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                    cursor: selectedFiles.length === 0 ? "not-allowed" : "text",
                                }}
                                onFocus={(e: any) => { if (selectedFiles.length > 0) { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; } }}
                                onBlur={(e: any) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                            />
                        </div>

                        <button onClick={handleSearch} disabled={selectedFiles.length === 0}
                            style={{
                                padding: "7px 20px", borderRadius: 7,
                                background: selectedFiles.length > 0 ? "#2563eb" : "#e5e7eb",
                                border: "none", color: selectedFiles.length > 0 ? "#fff" : "#9ca3af",
                                fontSize: 13, cursor: selectedFiles.length > 0 ? "pointer" : "not-allowed",
                                fontWeight: 600, fontFamily: "inherit", transition: "background 0.15s",
                                boxShadow: selectedFiles.length > 0 ? "0 1px 3px rgba(37,99,235,0.4)" : "none"
                            }}>
                            Ara
                        </button>

                        <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 4px" }} />

                        {/* Level Checkboxes */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Level:</span>
                            {ALL_LEVELS.map(lvl => {
                                const c = LEVEL_CFG[lvl];
                                const active = levels.includes(lvl);
                                return (
                                    <div key={lvl} onClick={() => { toggleLevel(lvl); handleApplyFilters(); }}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 4, padding: "4px 8px",
                                            borderRadius: 12, cursor: "pointer", transition: "all 0.15s",
                                            border: `1px solid ${active ? c.color : '#e5e7eb'}`,
                                            background: active ? c.bg : '#f9fafb',
                                            opacity: active ? 1 : 0.6,
                                        }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? c.color : '#d1d5db' }} />
                                        <span style={{ fontSize: 11, fontWeight: 600, color: active ? c.color : '#9ca3af' }}>{lvl}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{
                            marginLeft: "auto", display: "flex", gap: 1,
                            background: "#f3f4f6", padding: 2, borderRadius: 8, border: "1px solid #e5e7eb"
                        }}>
                            {["Parsed", "Raw"].map(v => (
                                <button key={v} onClick={() => setIsRaw(v === "Raw")}
                                    style={{
                                        padding: "5px 16px", borderRadius: 7, border: "none",
                                        background: (v === "Raw") === isRaw ? "#fff" : "transparent",
                                        color: (v === "Raw") === isRaw ? "#111827" : "#9ca3af",
                                        fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                                        fontWeight: (v === "Raw") === isRaw ? 600 : 400,
                                        boxShadow: (v === "Raw") === isRaw ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                                        transition: "all 0.15s",
                                    }}>{v}</button>
                            ))}
                        </div>
                    </div>

                    {/* Seçili dosyalar chips */}
                    {selectedFiles.length > 0 && (
                        <div style={{
                            padding: "6px 16px", background: "#f8faff",
                            borderBottom: "1px solid #e5e7eb", display: "flex",
                            alignItems: "center", gap: 6, flexWrap: "wrap", flexShrink: 0
                        }}>
                            <span style={{ fontSize: 11, color: "#9ca3af", marginRight: 2 }}>Seçili:</span>
                            {selectedFiles.map(f => (
                                <span key={f} style={{
                                    display: "inline-flex", alignItems: "center", gap: 4,
                                    padding: "2px 8px", background: "#eff6ff", border: "1px solid #bfdbfe",
                                    borderRadius: 20, fontSize: 11.5, color: "#1d4ed8"
                                }}>
                                    📄 {f}
                                    <span onClick={() => handleFileToggle(f)}
                                        style={{ color: "#93c5fd", cursor: "pointer", fontWeight: 700, fontSize: 13, lineHeight: 1 }}>×</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Level Summary */}
                    {entries.length > 0 && (
                        <div style={{
                            padding: "7px 16px", background: "#f9fafb",
                            borderBottom: "1px solid #e5e7eb",
                            display: "flex", alignItems: "center", gap: 20, flexShrink: 0
                        }}>
                            {Object.entries(counts).map(([level, count]) => {
                                const c = LEVEL_CFG[level];
                                return (count as number) > 0 ? (
                                    <div key={level} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot }} />
                                        <span style={{ fontSize: 12, color: "#6b7280" }}>{level}</span>
                                        <span style={{
                                            fontSize: 12, fontWeight: 700, color: c.color,
                                            fontFamily: "'JetBrains Mono',monospace"
                                        }}>{count as number}</span>
                                    </div>
                                ) : null;
                            })}
                            {keyword && (
                                <span style={{ fontSize: 11.5, color: "#6b7280" }}>
                                    · <span style={{ color: "#2563eb", fontWeight: 500 }}>"{keyword}"</span> filtresi
                                </span>
                            )}
                            <span style={{
                                marginLeft: "auto", fontSize: 11.5, color: "#9ca3af",
                                fontFamily: "'JetBrains Mono',monospace"
                            }}>
                                {entries.length} satır · {page}/{totalPgs} sayfa
                            </span>
                        </div>
                    )}

                    {/* Table Header */}
                    {!isRaw && entries.length > 0 && (
                        <div style={{
                            display: "grid", gridTemplateColumns: "108px 148px 96px 1fr",
                            padding: "6px 16px", borderBottom: "1px solid #e5e7eb",
                            background: "#f9fafb", flexShrink: 0
                        }}>
                            {["Level", "Zaman", "Thread", "Mesaj"].map(h => (
                                <span key={h} style={{
                                    fontSize: 10, fontWeight: 700, color: "#9ca3af",
                                    letterSpacing: "0.1em", textTransform: "uppercase"
                                }}>{h}</span>
                            ))}
                        </div>
                    )}

                    {/* Log Rows */}
                    <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
                        {loading ? (
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                height: 220, gap: 10, color: "#6b7280"
                            }}>
                                <div style={{
                                    width: 20, height: 20, border: "2px solid #e5e7eb",
                                    borderTopColor: "#3b82f6", borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite"
                                }} />
                                <span style={{ fontSize: 13 }}>Loglar yükleniyor...</span>
                            </div>
                        ) : entries.length === 0 ? (
                            <div style={{
                                display: "flex", flexDirection: "column", alignItems: "center",
                                justifyContent: "center", height: 300, gap: 12, animation: "fadeIn 0.3s ease"
                            }}>
                                <div style={{ fontSize: 48 }}>📋</div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", textAlign: "center" }}>
                                    {!env && "Ortam seçerek başlayın"}
                                    {env && !server && "Sunucu seçin"}
                                    {server && !logType && "Log tipi seçin"}
                                    {logType === "APP" && !earApp && "Uygulama (.ear) seçin"}
                                    {logType === "Web" && !webApp && "Web uygulaması seçin"}
                                    {showFileList && selectedFiles.length === 0 && "Dosya seçin"}
                                    {selectedFiles.length > 0 && <>
                                        Sonuç bulunamadı<br />
                                        <span style={{ fontSize: 12, fontWeight: 400, color: "#6b7280" }}>Aktif level filtrelerinizi (ERROR, WARNING vb.) veya arama kelimenizi kontrol edin.</span>
                                    </>}
                                </div>
                                {!env && (
                                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                        Ortam → Sunucu → Log Tipi → Uygulama → Dosya
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ animation: "fadeIn 0.2s ease" }}>
                                {paged.map((entry: any) => (
                                    <LogRow key={entry.id} entry={entry} isRaw={isRaw}
                                        isExpanded={!!expanded[entry.id]} onToggle={toggleExpand} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPgs > 1 && (
                        <div style={{
                            padding: "10px 16px", borderTop: "1px solid #e5e7eb",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            background: "#f9fafb", flexShrink: 0
                        }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                style={{
                                    padding: "5px 12px", background: "#fff", border: "1px solid #d1d5db",
                                    borderRadius: 6, color: page === 1 ? "#d1d5db" : "#374151",
                                    cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 12,
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                                }}>←</button>
                            {Array.from({ length: Math.min(totalPgs, 7) }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    style={{
                                        padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                                        border: `1px solid ${page === p ? "#2563eb" : "#d1d5db"}`,
                                        background: page === p ? "#2563eb" : "#fff",
                                        color: page === p ? "#fff" : "#6b7280",
                                        fontFamily: "'JetBrains Mono',monospace", fontWeight: page === p ? 700 : 400,
                                        boxShadow: page === p ? "0 1px 3px rgba(37,99,235,0.3)" : "0 1px 2px rgba(0,0,0,0.04)",
                                    }}>{p}</button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPgs, p + 1))} disabled={page === totalPgs}
                                style={{
                                    padding: "5px 12px", background: "#fff", border: "1px solid #d1d5db",
                                    borderRadius: 6, color: page === totalPgs ? "#d1d5db" : "#374151",
                                    cursor: page === totalPgs ? "not-allowed" : "pointer", fontSize: 12,
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                                }}>→</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
