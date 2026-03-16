export const STATUS_COLOR = {
    successful: '#22c55e', running: '#38bdf8', failed: '#ef4444',
    pending: '#f59e0b', canceled: '#6b7280', never: '#334155',
};

export const TYPE_LABEL = {
    job_template: 'JT',
    workflow_job_template: 'WF',
};

export function timeAgo(dateStr: string | number | Date | null | undefined): string | null {
    if (!dateStr) return null;
    const pastDate = new Date(dateStr);
    const diff = (Date.now() - pastDate.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s önce`;
    if (diff < 3600) return `${Math.floor(diff / 60)}d önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
    return `${Math.floor(diff / 86400)}g önce`;
}

export function duration(seconds: number | null | undefined): string {
    if (!seconds) return '—';
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
}
