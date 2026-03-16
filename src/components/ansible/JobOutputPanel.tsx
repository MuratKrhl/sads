import { useEffect, useRef } from 'react';
import { useJobOutput } from '../../hooks/useAnsible';

const STATUS_STYLE = {
    successful: { color: '#22c55e', label: '✓ SUCCESSFUL' },
    failed: { color: '#ef4444', label: '✗ FAILED' },
    running: { color: '#38bdf8', label: '● RUNNING' },
    pending: { color: '#f59e0b', label: '◌ PENDING' },
    canceled: { color: '#6b7280', label: '— CANCELED' },
};

export default function JobOutputPanel({ job, onClose }: { job: any, onClose?: () => void }) {
    const { lines, status } = useJobOutput(job?.job_id, !!job);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    if (!job) return null;

    const st = STATUS_STYLE[status as keyof typeof STATUS_STYLE] ?? STATUS_STYLE.pending;

    const overlay: React.CSSProperties = {
        position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, backdropFilter: 'blur(6px)',
    };

    const panel: React.CSSProperties = {
        background: '#050d1a', border: '1px solid #1e3a5f', borderRadius: 12,
        width: 780, height: 560, display: 'flex', flexDirection: 'column',
        fontFamily: "'IBM Plex Mono', monospace",
        boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
        overflow: 'hidden',
    };

    return (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div style={panel}>
                {/* Titlebar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderBottom: '1px solid #1e3a5f',
                    background: '#0a1628',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Traffic light dots */}
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
                                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
                            ))}
                        </div>
                        <span style={{ color: '#64748b', fontSize: 11, letterSpacing: 1 }}>JOB #{job.job_id}</span>
                        <span style={{ color: '#94a3b8', fontSize: 11 }}>—</span>
                        <span style={{ color: '#94a3b8', fontSize: 11, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.template_name ?? 'Job Output'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: st.color, letterSpacing: 1 }}>
                            {status === 'running' && (
                                <span style={{ display: 'inline-block', animation: 'pulse 1s infinite', marginRight: 4 }}>●</span>
                            )}
                            {st.label}
                        </span>
                        {job.maestro_url && (
                            <a href={job.maestro_url} target="_blank" rel="noopener noreferrer"
                                style={{ color: '#38bdf8', fontSize: 11, textDecoration: 'none', letterSpacing: 1 }}>
                                MAESTRO ↗
                            </a>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', padding: 0 }}>×</button>
                    </div>
                </div>

                {/* Output */}
                <div style={{
                    flex: 1, overflowY: 'auto', padding: '12px 16px',
                    background: '#050d1a',
                }}>
                    {lines.length === 0 ? (
                        <div style={{ color: '#334155', fontSize: 12, marginTop: 20 }}>
                            {status === 'pending' ? 'Job kuyruğa alındı, başlatılıyor...' : 'Output bekleniyor...'}
                        </div>
                    ) : (
                        lines.map((l, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 1 }}>
                                <span style={{ color: '#1e3a5f', fontSize: 11, minWidth: 36, textAlign: 'right', userSelect: 'none' }}>
                                    {l.line}
                                </span>
                                <span style={{
                                    fontSize: 12, color: l.text?.startsWith('TASK') ? '#38bdf8'
                                        : l.text?.startsWith('PLAY') ? '#a78bfa'
                                            : l.text?.includes('ok=') ? '#22c55e'
                                                : l.text?.includes('failed=') && !l.text?.includes('failed=0') ? '#ef4444'
                                                    : '#94a3b8',
                                    whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                                }}>
                                    {l.text}
                                </span>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Footer */}
                <div style={{
                    padding: '8px 16px', borderTop: '1px solid #1e3a5f',
                    background: '#0a1628', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{ fontSize: 11, color: '#334155' }}>
                        {lines.length} satır
                    </span>
                    {status === 'running' && (
                        <span style={{ fontSize: 11, color: '#38bdf8', animation: 'pulse 2s infinite' }}>
                            ● polling aktif
                        </span>
                    )}
                    {(status === 'successful' || status === 'failed' || status === 'canceled') && (
                        <span style={{ fontSize: 11, color: '#334155' }}>tamamlandı</span>
                    )}
                </div>
            </div>
        </div>
    );
}
