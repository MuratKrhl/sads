import { useState } from 'react';
import { useTemplates, useFavorites } from '../../hooks/useAnsible';
import { STATUS_COLOR, TYPE_LABEL, timeAgo } from '../../utils/ansibleUtils';

export default function TemplateList({ onLaunch, onViewOutput }: { onLaunch?: (t: any) => void, onViewOutput?: (t: any) => void }) {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [favOnly, setFavOnly] = useState(false);
    const [page, setPage] = useState(1);

    const params = { page, page_size: 15, ...(search && { search }), ...(type && { type }), ...(favOnly && { favorite: true }) };
    const { data, loading } = useTemplates(params);
    const { favorites, toggle } = useFavorites();

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / 15);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                <input
                    type="text"
                    placeholder="🔍  Template ara..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    style={{
                        padding: '8px 12px', borderRadius: 8, border: '1px solid #1e3a5f',
                        background: '#0a1628', color: '#e2e8f0', fontSize: 12,
                        fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
                    }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    <select
                        value={type}
                        onChange={(e) => { setType(e.target.value); setPage(1); }}
                        style={{
                            flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #1e3a5f',
                            background: '#0a1628', color: '#94a3b8', fontSize: 11, fontFamily: 'inherit', outline: 'none',
                        }}
                    >
                        <option value="">Tüm tipler</option>
                        <option value="job_template">Job Template</option>
                        <option value="workflow_job_template">Workflow</option>
                    </select>
                    <button
                        onClick={() => { setFavOnly(!favOnly); setPage(1); }}
                        style={{
                            padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                            border: `1px solid ${favOnly ? '#f59e0b' : '#1e3a5f'}`,
                            background: favOnly ? '#1a1000' : 'transparent',
                            color: favOnly ? '#f59e0b' : '#64748b', fontFamily: 'inherit',
                        }}
                    >
                        ★ Favoriler
                    </button>
                </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {loading ? (
                    <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '32px 0' }}>Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '32px 0', border: '1px dashed #1e3a5f', borderRadius: 8 }}>
                        Template bulunamadı
                    </div>
                ) : items.map((t) => (
                    <div
                        key={t.id}
                        style={{
                            background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 10,
                            padding: '12px 14px', transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e3a5f'}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            {/* Type badge */}
                            <div style={{
                                flexShrink: 0, padding: '2px 6px', borderRadius: 4, fontSize: 9,
                                fontWeight: 700, letterSpacing: 1, marginTop: 2,
                                background: t.type === 'workflow_job_template' ? '#1a0a48' : '#0c2d48',
                                color: t.type === 'workflow_job_template' ? '#a78bfa' : '#38bdf8',
                                border: `1px solid ${t.type === 'workflow_job_template' ? '#4c1d95' : '#0369a1'}`,
                            }}>
                                {TYPE_LABEL[t.type as keyof typeof TYPE_LABEL] ?? t.type}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {t.name}
                                </div>
                                {t.description && (
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {t.description}
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {t.last_run_status ? (
                                        <>
                                            <div style={{
                                                width: 6, height: 6, borderRadius: '50%',
                                                background: STATUS_COLOR[t.last_run_status as keyof typeof STATUS_COLOR] ?? '#6b7280',
                                                flexShrink: 0,
                                            }} />
                                            <span style={{ fontSize: 10, color: '#64748b' }}>
                                                {t.last_run_status}{t.last_run_at ? ` · ${timeAgo(t.last_run_at)}` : ''}
                                            </span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: 10, color: '#334155' }}>hiç çalışmadı</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                <button
                                    title="Favoriye ekle/çıkar"
                                    onClick={() => toggle(t)}
                                    style={{
                                        background: 'none', border: 'none', padding: '4px 6px',
                                        cursor: 'pointer', fontSize: 14, lineHeight: 1,
                                        color: favorites.has(t.id) ? '#f59e0b' : '#334155',
                                        transition: 'color 0.15s',
                                    }}
                                >
                                    {favorites.has(t.id) ? '★' : '☆'}
                                </button>
                                {t.can_launch && (
                                    <button
                                        onClick={() => onLaunch?.(t)}
                                        style={{
                                            padding: '4px 10px', borderRadius: 6, border: '1px solid #0369a1',
                                            background: '#0c2d48', color: '#38bdf8', fontSize: 11,
                                            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1,
                                        }}
                                    >
                                        ▶
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12, alignItems: 'center' }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ background: 'none', border: '1px solid #1e3a5f', color: '#64748b', borderRadius: 6, padding: '4px 10px', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 11 }}
                    >
                        ‹
                    </button>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{ background: 'none', border: '1px solid #1e3a5f', color: '#64748b', borderRadius: 6, padding: '4px 10px', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 11 }}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}
