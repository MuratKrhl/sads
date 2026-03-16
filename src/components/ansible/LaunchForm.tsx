import { useState } from 'react';
import { useLaunchConfig } from '../../hooks/useAnsible';
import * as api from '../../services/ansible';

function Field({ field, value, onChange }: { field: any, value: any, onChange: (n: string, v: any) => void }) {
    const base = {
        width: '100%', padding: '8px 12px', borderRadius: 6,
        border: '1px solid #2a3a4a', background: '#0d1b2a',
        color: '#e2e8f0', fontSize: 13, fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box' as const,
    };

    if (field.type === 'textarea') {
        return (
            <textarea
                rows={3}
                style={{ ...base, resize: 'vertical' }}
                value={value ?? ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.label}
            />
        );
    }

    if (field.type === 'multiplechoice') {
        return (
            <select style={base} value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)}>
                <option value="">— Seç —</option>
                {field.choices?.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
        );
    }

    if (field.type === 'multiselect') {
        const selected = value ?? [];
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {field.choices?.map((c: string) => {
                    const active = selected.includes(c);
                    return (
                        <button
                            key={c}
                            type="button"
                            onClick={() => {
                                const next = active ? selected.filter((x: string) => x !== c) : [...selected, c];
                                onChange(field.name, next);
                            }}
                            style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                                border: `1px solid ${active ? '#38bdf8' : '#2a3a4a'}`,
                                background: active ? '#0c2d48' : '#0d1b2a',
                                color: active ? '#38bdf8' : '#94a3b8',
                            }}
                        >
                            {c}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <input
            type={field.type === 'password' ? 'password' : field.type === 'integer' || field.type === 'float' ? 'number' : field.type === 'email' ? 'email' : 'text'}
            style={base}
            value={value ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.label}
        />
    );
}

export default function LaunchForm({ template, onLaunched, onClose }: { template: any, onLaunched?: (r: any) => void, onClose?: () => void }) {
    const { data: config, loading } = useLaunchConfig(template.id);
    const [values, setValues] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setValue = (name: string, val: any) => setValues((v) => ({ ...v, [name]: val }));

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        const extra_vars: Record<string, any> = {};
        const body: Record<string, any> = { extra_vars };

        config?.fields?.forEach((f: any) => {
            if (f.name === 'limit') body.limit = values[f.name];
            else extra_vars[f.name] = values[f.name];
        });

        try {
            const res = await api.launchTemplate(template.id, body);
            onLaunched?.(res);
        } catch (e: any) {
            setError(e?.message || 'Launch başarısız');
        } finally {
            setSubmitting(false);
        }
    };

    const overlay: React.CSSProperties = {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)',
    };

    const modal: React.CSSProperties = {
        background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12,
        width: 520, maxHeight: '85vh', overflowY: 'auto',
        padding: 28, fontFamily: "'IBM Plex Mono', monospace",
        boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
    };

    return (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div style={modal}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <div style={{ fontSize: 11, color: '#38bdf8', letterSpacing: 2, marginBottom: 4 }}>
                            LAUNCH TEMPLATE
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{template.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{template.type}</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer', padding: 0 }}>×</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
                        <div style={{ fontSize: 12 }}>Konfigürasyon yükleniyor...</div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {config?.fields?.map((field: any) => (
                                <div key={field.name}>
                                    <label style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, fontSize: 11, color: '#94a3b8', letterSpacing: 1 }}>
                                        {field.label.toUpperCase()}
                                        {field.required && <span style={{ color: '#ef4444', fontSize: 10 }}>*</span>}
                                    </label>
                                    <Field field={field} value={values[field.name]} onChange={setValue} />
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 6, background: '#1a0a0a', border: '1px solid #ef4444', color: '#ef4444', fontSize: 12 }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                style={{
                                    flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                                    background: submitting ? '#0c2d48' : 'linear-gradient(135deg, #0369a1, #0284c7)',
                                    color: '#fff', fontSize: 13, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontFamily: 'inherit', letterSpacing: 1,
                                }}
                            >
                                {submitting ? 'LAUNCHING...' : '▶  LAUNCH'}
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '10px 20px', borderRadius: 8,
                                    border: '1px solid #2a3a4a', background: 'transparent',
                                    color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                İptal
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
