import { useState } from 'react';
import { useApprovals } from '../../hooks/useAnsible';
import * as api from '../../services/ansible';
import { timeAgo } from '../../utils/ansibleUtils';

function ApprovalCard({ item, onAction, key }: { item: any, onAction?: () => void, key?: any }) {
    const [loading, setLoading] = useState<string | null>(null); // 'approve' | 'deny'
    const [reason, setReason] = useState('');
    const [showReason, setShowReason] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const act = async (action: string | null) => {
        if (!action) return;
        setLoading(action);
        try {
            if (action === 'approve') await api.approveApproval(item.approval_id, reason);
            else await api.denyApproval(item.approval_id, reason);
            onAction?.();
        } catch (_) {
        } finally {
            setLoading(null);
            setShowReason(false);
        }
    };

    const confirmAction = (action: string) => {
        setPendingAction(action);
        setShowReason(true);
    };

    return (
        <div style={{
            background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 10,
            padding: '14px 16px', marginBottom: 10,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                        {item.workflow_name}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b' }}>
                        <span>👤 {item.requested_by}</span>
                        <span>🕐 {timeAgo(item.created_at)}</span>
                    </div>
                </div>
                {!showReason && (
                    <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                        <button
                            onClick={() => confirmAction('approve')}
                            disabled={!!loading}
                            style={{
                                padding: '6px 14px', borderRadius: 6, border: '1px solid #16a34a',
                                background: 'transparent', color: '#22c55e', fontSize: 11,
                                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: 1,
                            }}
                        >
                            {loading === 'approve' ? '...' : 'ONAYLA'}
                        </button>
                        <button
                            onClick={() => confirmAction('deny')}
                            disabled={!!loading}
                            style={{
                                padding: '6px 14px', borderRadius: 6, border: '1px solid #991b1b',
                                background: 'transparent', color: '#ef4444', fontSize: 11,
                                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: 1,
                            }}
                        >
                            {loading === 'deny' ? '...' : 'REDDET'}
                        </button>
                    </div>
                )}
            </div>

            {showReason && (
                <div style={{ marginTop: 12, borderTop: '1px solid #1e3a5f', paddingTop: 12 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, letterSpacing: 1 }}>
                        {pendingAction === 'approve' ? 'ONAY' : 'RED'} GEREKÇESİ (opsiyonel)
                    </div>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Gerekçe giriniz..."
                        style={{
                            width: '100%', padding: '7px 10px', borderRadius: 6,
                            border: '1px solid #2a3a4a', background: '#050d1a',
                            color: '#e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none',
                            boxSizing: 'border-box', marginBottom: 10,
                        }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => act(pendingAction)}
                            disabled={!!loading}
                            style={{
                                padding: '6px 16px', borderRadius: 6, border: 'none',
                                background: pendingAction === 'approve' ? '#16a34a' : '#dc2626',
                                color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            {loading ? '...' : 'Onayla'}
                        </button>
                        <button
                            onClick={() => { setShowReason(false); setReason(''); }}
                            style={{
                                padding: '6px 16px', borderRadius: 6, border: '1px solid #2a3a4a',
                                background: 'transparent', color: '#64748b', fontSize: 11,
                                cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            İptal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ApprovalsPanel() {
    const { data, loading, reload } = useApprovals();
    const items = data?.items ?? [];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 2 }}>PENDING APPROVALS</div>
                <button onClick={reload} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                    YENİLE
                </button>
            </div>

            {loading ? (
                <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>Yükleniyor...</div>
            ) : items.length === 0 ? (
                <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: '24px 0', border: '1px dashed #1e3a5f', borderRadius: 8 }}>
                    Bekleyen approval yok
                </div>
            ) : (
                items.map((item: any) => (
                    <ApprovalCard key={item.approval_id} item={item} onAction={reload} />
                ))
            )}
        </div>
    );
}
