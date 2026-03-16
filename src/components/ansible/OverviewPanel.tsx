import { useOverview } from '../../hooks/useAnsible';
import { timeAgo } from '../../utils/ansibleUtils';

const STATUS_COLOR = {
    successful: '#22c55e', running: '#38bdf8', failed: '#ef4444',
    pending: '#f59e0b', canceled: '#6b7280',
};

export default function OverviewPanel({ onTabChange }: { onTabChange?: (t: string) => void }) {
    const { data, loading } = useOverview();

    if (loading) return (
        <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '40px 0' }}>Yükleniyor...</div>
    );

    const stats = [
        { label: 'TEMPLATES', value: data?.template_count ?? 0, color: '#38bdf8', tab: 'templates' },
        { label: 'RUNNING', value: data?.running_jobs ?? 0, color: '#22c55e', tab: 'jobs' },
        { label: 'FAILED TODAY', value: data?.failed_today ?? 0, color: '#ef4444', tab: 'jobs' },
        { label: 'APPROVALS', value: data?.pending_approvals ?? 0, color: '#f59e0b', tab: 'approvals' },
    ];

    return (
        <div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {stats.map((s) => (
                    <div
                        key={s.label}
                        onClick={() => onTabChange?.(s.tab)}
                        style={{
                            background: '#0a1628', border: `1px solid #1e3a5f`, borderRadius: 10,
                            padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = s.color}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e3a5f'}
                    >
                        <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent runs */}
            <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 2, marginBottom: 10 }}>SON ÇALIŞMALAR</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(data?.recent_runs ?? []).map((r: any) => (
                    <div key={r.job_id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 8, background: '#0a1628',
                        border: '1px solid #1e3a5f',
                    }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            background: STATUS_COLOR[r.status as keyof typeof STATUS_COLOR] ?? '#6b7280',
                            boxShadow: r.status === 'running' ? `0 0 6px ${STATUS_COLOR.running}` : 'none',
                        }} />
                        <div style={{ flex: 1, fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.template_name}
                        </div>
                        <div style={{ fontSize: 11, color: '#334155', flexShrink: 0 }}>
                            {timeAgo(r.started_at)}
                        </div>
                    </div>
                ))}
                {(!data?.recent_runs || data.recent_runs.length === 0) && (
                    <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>
                        Henüz çalışma yok
                    </div>
                )}
            </div>
        </div>
    );
}
