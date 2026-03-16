import { useState } from 'react';
import { useJobs } from '../../hooks/useAnsible';
import { timeAgo, duration } from '../../utils/ansibleUtils';

const STATUS_COLOR = {
    successful: '#22c55e', running: '#38bdf8', failed: '#ef4444',
    pending: '#f59e0b', canceled: '#6b7280',
};
const STATUS_BG = {
    successful: '#052010', running: '#031020', failed: '#1a0505',
    pending: '#1a1000', canceled: '#111',
};

export default function JobsPanel({ onViewOutput }: { onViewOutput?: (j: any) => void }) {
    const [status, setStatus] = useState('');
    const { data, loading, reload } = useJobs({ page_size: 20, ...(status && { status }) });
    const items = data?.items ?? [];

    const statusFilters = [
        { label: 'Tümü', value: '' },
        { label: 'Running', value: 'running' },
        { label: 'Successful', value: 'successful' },
        { label: 'Failed', value: 'failed' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {statusFilters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setStatus(f.value)}
                        style={{
                            padding: '5px 12px', borderRadius: 20, fontSize: 10, cursor: 'pointer',
                            border: `1px solid ${status === f.value ? (STATUS_COLOR[f.value as keyof typeof STATUS_COLOR] || '#38bdf8') : '#1e3a5f'}`,
                            background: status === f.value ? (STATUS_BG[f.value as keyof typeof STATUS_BG] || '#031020') : 'transparent',
                            color: status === f.value ? (STATUS_COLOR[f.value as keyof typeof STATUS_COLOR] || '#38bdf8') : '#64748b',
                            fontFamily: 'inherit', letterSpacing: 1,
                        }}
                    >
                        {f.label.toUpperCase()}
                    </button>
                ))}
                <div style={{ flex: 1 }} />
                <button onClick={reload} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>↻</button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {loading ? (
                    <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '32px 0' }}>Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '32px 0', border: '1px dashed #1e3a5f', borderRadius: 8 }}>
                        Job bulunamadı
                    </div>
                ) : items.map((job) => (
                    <div
                        key={job.job_id}
                        style={{
                            background: '#0a1628', border: `1px solid ${job.status === 'running' ? '#0369a1' : '#1e3a5f'}`,
                            borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.15s',
                        }}
                        onClick={() => onViewOutput?.(job)}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = STATUS_COLOR[job.status as keyof typeof STATUS_COLOR] ?? '#38bdf8'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = job.status === 'running' ? '#0369a1' : '#1e3a5f'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                background: STATUS_COLOR[job.status as keyof typeof STATUS_COLOR] ?? '#6b7280',
                                boxShadow: job.status === 'running' ? `0 0 8px ${STATUS_COLOR.running}` : 'none',
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {job.template_name}
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                                    <span style={{ fontSize: 10, color: '#64748b' }}>#{job.job_id}</span>
                                    <span style={{ fontSize: 10, color: '#64748b' }}>👤 {job.started_by}</span>
                                    <span style={{ fontSize: 10, color: '#64748b' }}>⏱ {duration(job.duration_seconds)}</span>
                                    <span style={{ fontSize: 10, color: '#334155' }}>{timeAgo(job.started_at)}</span>
                                </div>
                            </div>
                            <div style={{
                                padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                letterSpacing: 1, background: STATUS_BG[job.status as keyof typeof STATUS_BG] ?? '#111',
                                color: STATUS_COLOR[job.status as keyof typeof STATUS_COLOR] ?? '#6b7280',
                                border: `1px solid ${STATUS_COLOR[job.status as keyof typeof STATUS_COLOR] ?? '#6b7280'}`,
                                flexShrink: 0,
                            }}>
                                {job.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
