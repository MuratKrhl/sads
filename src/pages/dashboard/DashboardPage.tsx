import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import * as d3 from "d3";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  Sector, AreaChart, Area, XAxis, YAxis,
} from "recharts";
import DutyOfTodayCard from '../../components/cards/DutyOfTodayCard';
import GlobalPlatformHealth from '../../components/dashboard/GlobalPlatformHealth';
import LogoMarquee from '../../components/common/LogoMarquee';

/* ══════════════════════════════════════════════════════════════
   SHARED STYLES / TOKENS
══════════════════════════════════════════════════════════════ */
const C = {
  healthy: "#10b981",
  warning: "#f59e0b",
  critical: "#ef4444",
  info: "#0ea5e9",
  purple: "#7c3aed",
  orange: "#f97316",
  bg: "#f1f5f9",
  card: "#ffffff",
  border: "#e2e8f0",
  muted: "#94a3b8",
  text: "#1e293b",
  sub: "#64748b",
};

const statusColor = (v: number, warn: number, crit: number) =>
  v >= crit ? C.critical : v >= warn ? C.warning : C.healthy;

/* ══════════════════════════════════════════════════════════════
   ENVANTER DATA
══════════════════════════════════════════════════════════════ */
const serverInventory = { total: 148, linux: 97, aix: 51 };
const serverDonutData = [
  { name: "Linux", value: serverInventory.linux, color: C.info },
  { name: "AIX", value: serverInventory.aix, color: C.orange },
];


const appInventory = [
  { name: "JBoss", value: 24, color: C.info },
  { name: "WebSphere", value: 18, color: C.purple },
  { name: "Nginx", value: 31, color: C.orange },
  { name: "OpenShift", value: 15, color: C.healthy },
  { name: "EVAM", value: 9, color: C.warning },
  { name: "PowerCurve", value: 12, color: C.critical },
  { name: "Provenir", value: 8, color: "#8b5cf6" },
  { name: "Wyden", value: 6, color: "#06b6d4" },
  { name: "LinuxOne", value: 14, color: "#84cc16" },
];
const kdbNames = ["KDB+/q", "Analytics", "Developer", "Associate", "Expert"];
const kdbColors = [C.info, C.purple, C.orange, C.healthy, C.warning];
const kdbMatrix = [
  [0, 12, 8, 5, 3], [12, 0, 15, 7, 4], [8, 15, 0, 10, 6], [5, 7, 10, 0, 9], [3, 4, 6, 9, 0],
];
const javaInventory = {
  name: "Java Sertifikaları",
  children: [
    {
      name: "Oracle", color: C.orange, children: [
        { name: "OCA", value: 18 }, { name: "OCP", value: 25 }, { name: "OCE", value: 9 },
      ]
    },
    {
      name: "Spring", color: C.info, children: [
        { name: "Spring Pro", value: 21 }, { name: "Spring Boot", value: 28 },
      ]
    },
    {
      name: "Cloud", color: C.purple, children: [
        { name: "AWS Java", value: 14 }, { name: "Azure Java", value: 11 }, { name: "GCP Java", value: 8 },
      ]
    },
  ],
};
const totalApps = appInventory.reduce((s, a) => s + a.value, 0);
const totalJava = javaInventory.children.flatMap((c: any) => c.children).reduce((s: number, c: any) => s + c.value, 0);
const totalKDB = Math.round(kdbMatrix.flat().reduce((s, v) => s + v, 0) / 2);

/* ══════════════════════════════════════════════════════════════
   NOC DATA
══════════════════════════════════════════════════════════════ */
const genSeries = (base: number, spread: number, len = 20) =>
  Array.from({ length: len }, (_, i) => ({ t: `${i}s`, v: Math.max(0, base + (Math.random() - .5) * spread) }));

const initNOC = {
  tps: genSeries(0, 0),
  errorRate: genSeries(0, 0),
  jvmHeap: genSeries(0, 0),
  dbPool: genSeries(0, 0),
  activeCon: genSeries(0, 0),
  nginxTps: genSeries(0, 0),
  nginx5xx: genSeries(0, 0),
};
const topIssues: any[] = [];

/* ══════════════════════════════════════════════════════════════
   SHARED TINY COMPONENTS
══════════════════════════════════════════════════════════════ */
const Pulse = ({ color }: any) => (
  <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
    <span style={{
      position: "absolute", inset: 0, borderRadius: "50%", background: color,
      opacity: .4, animation: "nocPulse 1.8s ease-in-out infinite"
    }} />
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, position: "relative" }} />
  </span>
);

const Badge = ({ label, color }: any) => (
  <span style={{
    fontSize: 9, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase",
    background: `${color}15`, color, border: `1px solid ${color}40`, padding: "2px 8px", borderRadius: 99
  }}>
    {label}
  </span>
);

const Card = ({ children, style = {} }: any) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", ...style
  }}>
    {children}
  </div>
);

const CardTitle = ({ accent, title, badge, right, subtitle }: any) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 3, height: 20, background: accent, borderRadius: 2 }} />
        <span style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 15, letterSpacing: 2, color: C.text }}>{title}</span>
        {badge}
      </div>
      {right}
    </div>
    {subtitle && <p style={{ color: C.muted, fontSize: 11, marginTop: 3, marginLeft: 12 }}>{subtitle}</p>}
  </div>
);

const MiniMetric = ({ label, value, unit, color }: any) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "6px 0", borderBottom: `1px solid ${C.border}`
  }}>
    <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "Bebas Neue,sans-serif", letterSpacing: 1 }}>
      {value}<span style={{ fontSize: 10, letterSpacing: 0 }}>{unit}</span>
    </span>
  </div>
);

const StatusRow = ({ label, count, color }: any) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "7px 12px", borderRadius: 8, background: `${color}0d`,
    border: `1px solid ${color}22`, marginBottom: 6
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Pulse color={color} /><span style={{ fontSize: 11, color: C.sub }}>{label}</span>
    </div>
    <span style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 22, color }}>{count}</span>
  </div>
);

const ArcGauge = ({ value, max = 100, color, size = 88, label }: any) => {
  const r = (size - 14) / 2, circ = Math.PI * r, dash = Math.min(value / max, 1) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <path d={`M 7,${size / 2} A ${r},${r} 0 0 1 ${size - 7},${size / 2}`}
          fill="none" stroke="#e2e8f0" strokeWidth={10} strokeLinecap="round" />
        <path d={`M 7,${size / 2} A ${r},${r} 0 0 1 ${size - 7},${size / 2}`}
          fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />
        <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fill={color}
          fontSize="15" fontWeight="700" fontFamily="Bebas Neue,sans-serif">
          {Math.round(value)}%
        </text>
      </svg>
      {label && <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>}
    </div>
  );
};

const Spark = ({ data, color, height = 50 }: any) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
      <defs>
        <linearGradient id={`sg${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
        fill={`url(#sg${color.replace("#", "")})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

/* ══════════════════════════════════════════════════════════════
   D3 CHARTS
══════════════════════════════════════════════════════════════ */
function ChordChart({ matrix, names, colors }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const render = () => {
      el.innerHTML = "";
      const W = el.clientWidth || 300, H = el.clientHeight || 300;
      const outerR = Math.min(W, H) * .41, innerR = outerR - 24;
      const chord = d3.chord().padAngle(0.06)(matrix);
      const arcGen = d3.arc().innerRadius(innerR).outerRadius(outerR);
      const arcHov = d3.arc().innerRadius(innerR - 4).outerRadius(outerR + 12);
      const ribbonG = d3.ribbon().radius(innerR - 4);
      const svg = d3.select(el).append("svg").attr("width", W).attr("height", H)
        .append("g").attr("transform", `translate(${W / 2},${H / 2})`);
      svg.append("g").selectAll("path").data(chord).join("path")
        .attr("d", ribbonG as any).attr("fill", d => colors[(d.source as any).index])
        .attr("opacity", .3).attr("stroke", "#fff").attr("stroke-width", .5)
        .on("mouseover", function () { d3.select(this).transition().duration(150).attr("opacity", .72); })
        .on("mouseout", function () { d3.select(this).transition().duration(150).attr("opacity", .3); });
      const grp = svg.append("g").selectAll("g").data(chord.groups).join("g");
      grp.append("path").attr("d", arcGen as any)
        .attr("fill", d => colors[d.index]).attr("stroke", "#fff").attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("mouseover", function (e, d) {
          d3.select(this).transition().duration(160).attr("d", arcHov(d as any) as any)
            .style("filter", `drop-shadow(0 3px 10px ${colors[(d as any).index]}99)`);
        })
        .on("mouseout", function (e, d) {
          d3.select(this).transition().duration(160).attr("d", arcGen(d as any) as any).style("filter", "none");
        });
      grp.append("text").each((d: any) => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", "0.35em")
        .attr("transform", (d: any) => `rotate(${(d.angle * 180 / Math.PI - 90)}) translate(${outerR + 14}) ${d.angle > Math.PI ? "rotate(180)" : ""}`)
        .attr("text-anchor", (d: any) => d.angle > Math.PI ? "end" : "start")
        .attr("fill", C.sub).attr("font-size", "10px").attr("font-family", "'Fira Code',monospace")
        .text((d: any) => names[d.index]);
    };
    render();
    const ro = new ResizeObserver(render); ro.observe(el);
    return () => ro.disconnect();
  }, [matrix, names, colors]);
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

function SunburstChart({ data }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const render = () => {
      el.innerHTML = "";
      const W = el.clientWidth || 300, H = el.clientHeight || 300;
      const radius = Math.min(W, H) / 2 - 6;
      const root = d3.hierarchy(data).sum((d: any) => d.value || 0).sort((a: any, b: any) => b.value - a.value);
      d3.partition().size([2 * Math.PI, radius])(root as any);
      const arc = d3.arc<any>().startAngle(d => d.x0).endAngle(d => d.x1).innerRadius(d => d.y0).outerRadius(d => d.y1 - 3);
      const arcHov = d3.arc<any>().startAngle(d => d.x0).endAngle(d => d.x1).innerRadius(d => d.y0 - 3).outerRadius(d => d.y1 + 12);
      const getColor = (d: any) => { let n = d; while (n.depth > 1) n = n.parent; return n.data.color || C.info; };
      const svg = d3.select(el).append("svg").attr("width", W).attr("height", H)
        .append("g").attr("transform", `translate(${W / 2},${H / 2})`);
      const nodes = root.descendants().filter(d => d.depth > 0);
      svg.selectAll("path").data(nodes).join("path")
        .attr("d", arc as any).attr("fill", d => getColor(d))
        .attr("opacity", d => d.depth === 1 ? .88 : .62)
        .attr("stroke", "#fff").attr("stroke-width", 1.5).style("cursor", "pointer")
        .on("mouseover", function (e, d) {
          d3.select(this).transition().duration(160).attr("d", arcHov(d as any) as any).attr("opacity", 1)
            .style("filter", `drop-shadow(0 3px 12px ${getColor(d)}99)`);
        })
        .on("mouseout", function (e, d) {
          d3.select(this).transition().duration(160).attr("d", arc(d as any) as any)
            .attr("opacity", (d as any).depth === 1 ? .88 : .62).style("filter", "none");
        });
      svg.selectAll("text").data(nodes.filter(d => ((d as any).x1 - (d as any).x0) * (((d as any).y0 + (d as any).y1) / 2) > 20))
        .join("text")
        .attr("transform", d => { const [x, y] = arc.centroid(d as any); return `translate(${x},${y})`; })
        .attr("text-anchor", "middle").attr("dy", "0.35em").attr("fill", "#fff")
        .attr("font-size", d => (d as any).depth === 1 ? "11px" : "9px")
        .attr("font-weight", d => (d as any).depth === 1 ? "600" : "400")
        .attr("font-family", "'Fira Code',monospace")
        .style("pointer-events", "none").text((d: any) => d.data.name);
    };
    render();
    const ro = new ResizeObserver(render); ro.observe(el);
    return () => ro.disconnect();
  }, [data]);
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

/* ══════════════════════════════════════════════════════════════
   RECHARTS ACTIVE SHAPES
══════════════════════════════════════════════════════════════ */
const renderActiveDonut = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }: any) => (
  <g>
    <Sector cx={cx} cy={cy} innerRadius={innerRadius - 6} outerRadius={outerRadius + 14}
      startAngle={startAngle} endAngle={endAngle} fill={fill}
      style={{ filter: `drop-shadow(0 4px 14px ${fill}77)` }} />
    <Sector cx={cx} cy={cy} innerRadius={innerRadius - 10} outerRadius={innerRadius - 6}
      startAngle={startAngle} endAngle={endAngle} fill={fill} />
  </g>
);
const renderActivePie = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }: any) => (
  <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 14}
    startAngle={startAngle} endAngle={endAngle} fill={fill}
    style={{ filter: `drop-shadow(0 4px 16px ${fill}88)` }} />
);

/* ══════════════════════════════════════════════════════════════
   NOTION-STYLE SERVER INVENTORY
══════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════
   ENVANTER SECTION
══════════════════════════════════════════════════════════════ */
function EnvanterSection() {
  const [activeDonut, setActiveDonut] = useState<number | null>(null);
  const [activePie, setActivePie] = useState<number | null>(null);

  const bannerStats = [
    { label: "TOPLAM SUNUCU", value: serverInventory.total, color: C.info, sub: `${serverInventory.linux} Linux · ${serverInventory.aix} AIX` },
    { label: "TOPLAM UYGULAMA", value: totalApps, color: C.purple, sub: `${appInventory.length} farklı platform` },
    { label: "KDB SERTİFİKA", value: totalKDB, color: C.orange, sub: `${kdbNames.length} sertifika türü` },
    { label: "JAVA SERTİFİKA", value: totalJava, color: C.healthy, sub: `${javaInventory.children.length} kategori` },
  ];

  return (
    <div>
      {/* Thin stat banner */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {bannerStats.map((s, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderLeft: `4px solid ${s.color}`, borderRadius: 12,
            padding: "14px 20px", display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 44, color: s.color, lineHeight: 1, flexShrink: 0 }}>{s.value}</div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C.sub }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

        {/* Sunucu Donut */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "22px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)"
        }}>
          <CardTitle accent={C.info} title="SUNUCU ENVANTERİ" subtitle="Donut Chart · İşletim Sistemi Dağılımı" />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, height: 300, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serverDonutData} cx="50%" cy="50%"
                    innerRadius={90} outerRadius={138} dataKey="value" labelLine={false}
                    activeIndex={activeDonut as any} activeShape={renderActiveDonut}
                    onMouseEnter={(_, i) => setActiveDonut(i)}
                    onMouseLeave={() => setActiveDonut(null)}>
                    {serverDonutData.map((e, i) => (
                      <Cell key={i} fill={e.color} stroke="#f1f5f9" strokeWidth={4} style={{ cursor: "pointer" }} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
                    fontFamily: "Fira Code", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                  }}
                    formatter={(v: any, n: any) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                textAlign: "center", pointerEvents: "none"
              }}>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 46, color: C.info, lineHeight: 1 }}>{serverInventory.total}</div>
                <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>TOPLAM</div>
              </div>
            </div>
            <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 14 }}>
              {serverDonutData.map((d, i) => (
                <div key={i} style={{ background: `${d.color}10`, border: `1px solid ${d.color}30`, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 36, color: d.color, lineHeight: 1 }}>{d.value}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{((d.value / serverInventory.total) * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Uygulama Pie */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "22px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)"
        }}>
          <CardTitle accent={C.purple} title="UYGULAMA ENVANTERİ" subtitle="Pie Chart · Platform Dağılımı" />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: "0 0 230px", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appInventory} cx="50%" cy="50%"
                    outerRadius={108} dataKey="value" labelLine={false}
                    activeIndex={activePie as any} activeShape={renderActivePie}
                    onMouseEnter={(_, i) => setActivePie(i)}
                    onMouseLeave={() => setActivePie(null)}>
                    {appInventory.map((e, i) => (
                      <Cell key={i} fill={e.color} stroke="#f1f5f9" strokeWidth={2} style={{ cursor: "pointer" }} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
                    fontFamily: "Fira Code", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                  }}
                    formatter={(v: any, n: any) => [`${v} (${((v / totalApps) * 100).toFixed(1)}%)`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {appInventory.map((d, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 10px", borderRadius: 8,
                  background: activePie === i ? `${d.color}12` : "transparent",
                  border: activePie === i ? `1px solid ${d.color}30` : "1px solid transparent",
                  transition: "all .18s"
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: C.sub, flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.value}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{((d.value / totalApps) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* KDB Chord */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "22px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)"
        }}>
          <CardTitle accent={C.orange} title="KDB SERTİFİKA ENVANTERİ" subtitle="Chord Chart · Sertifika İlişkileri" />
          <div style={{ height: 320 }}><ChordChart matrix={kdbMatrix} names={kdbNames} colors={kdbColors} /></div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginTop: 12,
            padding: "10px 12px", background: "#f8fafc", borderRadius: 10
          }}>
            {kdbNames.map((n, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: kdbColors[i], flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: C.sub }}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Java Sunburst */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "22px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)"
        }}>
          <CardTitle accent={C.healthy} title="JAVA SERTİFİKA ENVANTERİ" subtitle="Sunburst Chart · Sertifika Hiyerarşisi" />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: "0 0 300px", height: 320 }}><SunburstChart data={javaInventory} /></div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {javaInventory.children.map((cat, i) => (
                <div key={i} style={{
                  background: `${cat.color}08`, border: `1px solid ${cat.color}25`,
                  borderRadius: 10, padding: "10px 12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: cat.color }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: cat.color }}>{cat.name}</span>
                  </div>
                  {cat.children.map((c, j) => (
                    <div key={j} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: 11, color: C.sub, padding: "2px 0"
                    }}>
                      <span>{c.name}</span>
                      <span style={{ fontWeight: 600, color: C.text }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PLATFORM HEALTH SECTION (NOC)
══════════════════════════════════════════════════════════════ */
function PlatformSection() {
  const [data, setData] = useState(initNOC);
  const [tick, setTick] = useState(0);

  // New states for WebSocket data
  const [liveMetrics, setLiveMetrics] = useState<any>({
    tps: 0,
    errorRate: 0,
    jvmHeap: 0,
    dbPool: { poolUsage: 0, activeConnections: 0 },
    pods: { running: 0, pending: 0, crashLoop: 0, total: 0 },
    criticalCount: 0,
    warningCount: 0,
    problems: [],
    trafficSeries: []
  });

  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: any;
    let mockTimer: any;

    const generateMockSnapshot = () => {
      setData(prev => {
        const shift = (arr: any[], base: number, spread: number) => [...arr.slice(1),
        { t: `${arr.length}s`, v: Math.max(0, base + (Math.random() - .5) * spread) }];
        return {
          tps: shift(prev.tps, 4200, 900),
          errorRate: shift(prev.errorRate, .8, .7),
          jvmHeap: shift(prev.jvmHeap, 72, 12),
          dbPool: shift(prev.dbPool, 68, 15),
          activeCon: shift(prev.activeCon, 340, 90),
          nginxTps: shift(prev.nginxTps, 2100, 450),
          nginx5xx: shift(prev.nginx5xx, .4, .5),
        };
      });
      setTick(t => t + 1);
    };

    const connect = () => {
      ws = new WebSocket("ws://localhost:8000/ws/noc/");

      ws.onopen = () => {
        setWsConnected(true);
        if (mockTimer) {
          clearInterval(mockTimer);
          mockTimer = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const snapshot = JSON.parse(event.data);

          if (snapshot.type === "noc_snapshot") {
            setLiveMetrics({
              tps: snapshot.tps || 0,
              errorRate: snapshot.errorRate || 0,
              jvmHeap: snapshot.jvmHeap || 0,
              dbPool: snapshot.dbPool || { poolUsage: 0, activeConnections: 0 },
              pods: snapshot.pods || { running: 0, pending: 0, crashLoop: 0, total: 0 },
              problems: snapshot.problems || [],
              criticalCount: snapshot.criticalCount || 0,
              warningCount: snapshot.warningCount || 0,
              trafficSeries: snapshot.trafficSeries || []
            });

            // Update sparkline series
            setData(prev => {
              const shift = (arr: any[], nextVal: number) => {
                const newArr = [...arr.slice(1), { t: `${tick}s`, v: nextVal }];
                return newArr;
              };

              // Approximate Nginx metrics from total TPS/Error rate for visualization as they aren't directly in this snapshot
              const nginxTpsVal = Math.floor((snapshot.tps || 0) * 0.5);
              const nginx5xxVal = Math.floor((snapshot.errorRate || 0) * 0.5);

              return {
                tps: prev.tps, // Traffic series is now handled by backend
                errorRate: shift(prev.errorRate, snapshot.errorRate || 0),
                jvmHeap: shift(prev.jvmHeap, snapshot.jvmHeap || 0),
                dbPool: shift(prev.dbPool, snapshot.dbPool?.poolUsage || 0),
                activeCon: shift(prev.activeCon, snapshot.dbPool?.activeConnections || 0),
                nginxTps: shift(prev.nginxTps, nginxTpsVal),
                nginx5xx: shift(prev.nginx5xx, nginx5xxVal),
              };
            });
            setTick(t => t + 1);
          }
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (!mockTimer) {
          mockTimer = setInterval(generateMockSnapshot, 1500);
        }
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };

    mockTimer = setInterval(generateMockSnapshot, 1500);
    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (mockTimer) clearInterval(mockTimer);
      if (ws) ws.close();
    };
  }, [tick]);

  const tps = wsConnected ? liveMetrics.tps : Math.round(data.tps.at(-1)?.v || 0);
  const errRate = wsConnected ? +(liveMetrics.errorRate).toFixed(2) : +(data.errorRate.at(-1)?.v || 0).toFixed(2);
  const jvmHeap = wsConnected ? liveMetrics.jvmHeap : Math.round(data.jvmHeap.at(-1)?.v || 0);
  const dbPool = wsConnected ? liveMetrics.dbPool.poolUsage : Math.round(data.dbPool.at(-1)?.v || 0);
  const activeCon = wsConnected ? liveMetrics.dbPool.activeConnections : Math.round(data.activeCon.at(-1)?.v || 0);

  // Nginx derived mocks
  const nginxTps = Math.round(data.nginxTps.at(-1)?.v || 0);
  const n5xx = +(data.nginx5xx.at(-1)?.v || 0).toFixed(2);

  const jvmColor = statusColor(jvmHeap, 75, 85);
  const poolColor = statusColor(dbPool, 70, 85);
  const errColor = statusColor(errRate, 1, 2);
  const critCount = wsConnected ? liveMetrics.criticalCount : (topIssues.length > 0 ? topIssues.filter((i: any) => i.level === "critical").length : 0);
  const warnCount = wsConnected ? liveMetrics.warningCount : (topIssues.length > 0 ? topIssues.filter((i: any) => i.level === "warning").length : 0);
  const issues = wsConnected ? liveMetrics.problems : topIssues;

  return (
    <div>
      {/* Alert banner */}
      {critCount > 0 && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          borderLeft: "4px solid #ef4444", borderRadius: 12,
          padding: "12px 20px", marginBottom: 18,
          display: "flex", alignItems: "center", gap: 14
        }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <span style={{ fontSize: 12, color: "#991b1b", fontWeight: 600 }}>
            {critCount} KRİTİK ALARM AKTİF — JBoss-3 High Heap · DS-App1 Pool Exhaustion · Pod-OCP7 CrashLoop
          </span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#b91c1c", animation: "blink 1.4s infinite" }}>● LIVE</span>
        </div>
      )}

      {/* Tier 2 — Global Health + 5 Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <CardTitle accent={C.healthy} title="GLOBAL HEALTH" badge={<Badge label="LIVE" color={C.healthy} />} />
          <StatusRow label="Healthy Services" count={41} color={C.healthy} />
          <StatusRow label="Warning Services" count={warnCount} color={C.warning} />
          <StatusRow label="Critical Services" count={critCount} color={C.critical} />
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, paddingTop: 10 }}>
            <MiniMetric label="Total Applications" value={137} unit="" color={C.info} />
            <MiniMetric label="Total Nodes" value={148} unit="" color={C.info} />
            <MiniMetric label="Total Clusters" value={12} unit="" color={C.info} />
          </div>
        </Card>

        <Card>
          <CardTitle accent={C.info} title="PLATFORM KRİTİK METRİKLER"
            right={<span style={{ fontSize: 10, color: C.muted }}>↻ {tick}s</span>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {/* TPS */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>TOTAL TPS</div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 36, color: C.info, lineHeight: 1 }}>{tps.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>req/sec</div>
              <Spark data={liveMetrics.trafficSeries.length > 0 ? liveMetrics.trafficSeries : data.tps} color={C.info} height={44} />
            </div>
            {/* Error Rate */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>ERROR RATE</div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 36, color: errColor, lineHeight: 1 }}>{errRate}%</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>platform avg</div>
              <Spark data={data.errorRate} color={errColor} height={44} />
            </div>
            {/* JVM Heap */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>JVM HEAP</div>
              <ArcGauge value={jvmHeap} color={jvmColor} size={90} />
              <div style={{ fontSize: 10, color: jvmHeap >= 85 ? C.critical : C.muted, marginTop: 2 }}>
                {jvmHeap >= 85 ? "⚠ CRITICAL" : jvmHeap >= 75 ? "⚠ WARNING" : "NORMAL"}
              </div>
            </div>
            {/* DB Pool */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>DB CONN POOL</div>
              <ArcGauge value={dbPool} color={poolColor} size={90} />
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{activeCon} active</div>
            </div>
            {/* Pod Health */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>POD HEALTH</div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 36, color: C.healthy, lineHeight: 1 }}>{liveMetrics.pods.running || 247}</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>running</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                <span style={{ fontSize: 10, background: "#fef9c3", color: "#a16207", padding: "2px 7px", borderRadius: 6 }}>{liveMetrics.pods.pending || 0} pending</span>
                <span style={{ fontSize: 10, background: "#fef2f2", color: "#991b1b", padding: "2px 7px", borderRadius: 6 }}>{liveMetrics.pods.crashLoop || 0} crash</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tier 3 — Platform details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* NGINX */}
        <Card>
          <CardTitle accent={C.orange} title="NGINX" badge={<Badge label="EDGE" color={C.orange} />} />
          <MiniMetric label="Requests/sec" value={nginxTps.toLocaleString()} unit="" color={C.info} />
          <MiniMetric label="Active Connections" value={activeCon} unit="" color={C.info} />
          <MiniMetric label="5xx Rate" value={n5xx} unit="%" color={n5xx > 1 ? C.critical : C.healthy} />
          <MiniMetric label="Upstream Failures" value={3} unit="" color={C.warning} />
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 4 }}>TPS TREND</div>
            <Spark data={data.nginxTps} color={C.orange} height={46} />
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 4 }}>5XX TREND</div>
            <Spark data={data.nginx5xx} color={C.critical} height={36} />
          </div>
        </Card>

        {/* JBOSS */}
        <Card>
          <CardTitle accent={C.purple} title="JBOSS" badge={<Badge label="MIDDLEWARE" color={C.purple} />} />
          <MiniMetric label="JVM Heap Usage" value={jvmHeap} unit="%" color={jvmColor} />
          <MiniMetric label="Thread Count" value={312} unit="" color={C.info} />
          <MiniMetric label="Busy Threads" value={178} unit="" color={C.warning} />
          <MiniMetric label="Request TPS" value={1840} unit="" color={C.info} />
          <MiniMetric label="Error Rate" value={errRate} unit="%" color={errColor} />
          <MiniMetric label="Deployments" value={24} unit="" color={C.info} />
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 4 }}>JVM HEAP TREND</div>
            <Spark data={data.jvmHeap} color={jvmColor} height={46} />
          </div>
        </Card>

        {/* DATASOURCE */}
        <Card>
          <CardTitle accent={C.info} title="DATASOURCE" badge={<Badge label="DB POOL" color={C.info} />} />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <ArcGauge value={dbPool} color={poolColor} size={100} label="Pool Usage" />
          </div>
          <MiniMetric label="Active Connections" value={activeCon} unit="" color={poolColor} />
          <MiniMetric label="Idle Connections" value={120} unit="" color={C.healthy} />
          <MiniMetric label="Max Pool Size" value={512} unit="" color={C.muted} />
          <MiniMetric label="Failed Connections" value={7} unit="" color={C.critical} />
          <MiniMetric label="Slow Queries" value={14} unit="" color={C.warning} />
        </Card>

        {/* OPENSHIFT */}
        <Card>
          <CardTitle accent={C.healthy} title="OPENSHIFT" badge={<Badge label="CLUSTER" color={C.healthy} />} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { label: "Running Pods", value: liveMetrics.pods.running || 247, color: C.healthy },
              { label: "Pending Pods", value: liveMetrics.pods.pending || 3, color: C.warning },
              { label: "CrashLoop", value: liveMetrics.pods.crashLoop || 2, color: C.critical },
              { label: "Total Nodes", value: 12, color: C.info },
            ].map((m, i) => (
              <div key={i} style={{
                background: `${m.color}0d`, border: `1px solid ${m.color}25`,
                borderRadius: 9, padding: "9px 10px", textAlign: "center"
              }}>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 28, color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 3, letterSpacing: 1 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <MiniMetric label="Node CPU Avg" value={61} unit="%" color={C.warning} />
          <MiniMetric label="Node Memory" value={74} unit="%" color={C.warning} />
          <MiniMetric label="Pod Restarts" value={18} unit="" color={C.critical} />
          <MiniMetric label="Network In" value="1.2" unit=" GB/s" color={C.info} />
        </Card>
      </div>

      {/* Tier 4 — Traffic + Alerts + Top Issues + Duty of the Day */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px 320px 280px", gap: 16 }}>

        {/* Traffic */}
        <Card>
          <CardTitle accent={C.info} title="TRAFFIC OVERVIEW" right={<Badge label="REALTIME" color={C.info} />} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Total TPS", value: tps.toLocaleString(), color: C.info },
              { label: "Avg Response", value: "142 ms", color: C.healthy },
              { label: "Error Rate", value: `${errRate}%`, color: errColor },
              { label: "Peak TPS", value: "5,847", color: C.purple },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 30, color: m.color, lineHeight: 1 }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveMetrics.trafficSeries.length > 0 ? liveMetrics.trafficSeries : data.tps} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.info} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={C.info} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: C.muted }} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: C.muted }} />
                <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => [Math.round(v), "TPS"]} />
                <Area type="monotone" dataKey="v" stroke={C.info} strokeWidth={2}
                  fill="url(#tpsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alert Summary */}
        <Card>
          <CardTitle accent={C.critical} title="ALERT SUMMARY" />
          {[
            { label: "Active Alerts", value: critCount + warnCount, color: C.text },
            { label: "Critical", value: critCount, color: C.critical },
            { label: "Warning", value: warnCount, color: C.warning },
            { label: "Auto-healed", value: 8, color: C.healthy },
          ].map((a, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 12px", borderRadius: 9, marginBottom: 6,
              background: `${a.color}0d`, border: `1px solid ${a.color}22`
            }}>
              <span style={{ fontSize: 11, color: C.sub }}>{a.label}</span>
              <span style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 24, color: a.color }}>{a.value}</span>
            </div>
          ))}
        </Card>

        {/* Top Issues */}
        <Card>
          <CardTitle accent={C.warning} title="TOP ISSUES" />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                {["Servis", "Problem", "Seviye"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "4px 8px", color: C.muted,
                    fontWeight: 400, borderBottom: `1px solid ${C.border}`, letterSpacing: 1, fontSize: 9
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((iss: any, i: number) => {
                const col = iss.level === "critical" ? C.critical : C.warning;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "9px 8px", color: C.text, fontWeight: 600 }}>{iss.service}</td>
                    <td style={{ padding: "9px 8px", color: C.sub }}>{iss.problem}</td>
                    <td style={{ padding: "9px 8px" }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                        background: `${col}15`, color: col, border: `1px solid ${col}40`,
                        padding: "2px 8px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: col, display: "inline-block" }} />
                        {iss.level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Duty of the Day Card */}
        <DutyOfTodayCard />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT DASHBOARD — Header + Tab Navigation
══════════════════════════════════════════════════════════════ */
export default function DashboardPage({ onNavigate }: any) {


  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Fira Code',monospace", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Code:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:#f1f5f9;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}
        @keyframes nocPulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(2.2);opacity:0}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
      `}</style>

      {/* ── HEADER REMOVED ── */}

      {/* ── CONTENT ── */}
      <main style={{ padding: "28px 32px" }}>
        {/* Page title removed */}

        <div style={{ marginBottom: 32 }}>
          <LogoMarquee />
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, letterSpacing: 4, color: "#0f172a", lineHeight: 1, marginBottom: 5 }}>
            GLOBAL PLATFORM HEALTH
          </div>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 24, letterSpacing: .5 }}>
            Üst Düzey Gözlemlenebilirlik — Altyapı ve Uygulama Durumu
          </p>
          <GlobalPlatformHealth />
        </div>

        <div style={{ marginTop: 20, marginBottom: 24, borderTop: "1px solid #e2e8f0", paddingTop: 32 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, letterSpacing: 4, color: "#0f172a", lineHeight: 1 }}>
            ENVANTER ÖZETİ
          </div>
        </div>

        <EnvanterSection />

        <div style={{ marginTop: 40, marginBottom: 24, borderTop: "1px solid #e2e8f0", paddingTop: 32 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 32, letterSpacing: 4, color: "#0f172a", lineHeight: 1 }}>
            PLATFORM HEALTH METRICS
          </div>
          <p style={{ color: C.muted, fontSize: 12, marginTop: 5, letterSpacing: .5 }}>
            NOC Operatör Görünümü — Canlı Sistem Durumu
          </p>
        </div>

        <PlatformSection />
      </main>
    </div>
  );
}
