const BASE = '/api/ansible';

export async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!res.ok) {
        let errData;
        try {
            errData = await res.json();
        } catch {
            throw new Error(res.statusText);
        }
        throw errData;
    }
    return res.json();
}

// ── Templates ──────────────────────────────────────────────────────────────
export const getTemplates = (params: Record<string, any> = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/templates${q ? `?${q}` : ''}`);
};

export const getTemplate = (id: string | number) => request(`/templates/${id}`);

export const getLaunchConfig = (id: string | number) => request(`/templates/${id}/launch-config`);

export const launchTemplate = (id: string | number, body: any) =>
    request(`/templates/${id}/launch`, { method: 'POST', body: JSON.stringify(body) });

// ── Jobs ───────────────────────────────────────────────────────────────────
export const getJobs = (params: Record<string, any> = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/jobs${q ? `?${q}` : ''}`);
};

export const getJob = (jobId: string | number) => request(`/jobs/${jobId}`);

export const getJobOutput = (jobId: string | number, cursor: number = 0) =>
    request(`/jobs/${jobId}/output?cursor=${cursor}&format=json`);

// ── Approvals ──────────────────────────────────────────────────────────────
export const getApprovals = () => request('/approvals');
export const getPendingCount = () => request('/approvals/pending-count');
export const approveApproval = (id: string | number, reason: string = '') =>
    request(`/approvals/${id}/approve`, { method: 'POST', body: JSON.stringify({ reason }) });
export const denyApproval = (id: string | number, reason: string = '') =>
    request(`/approvals/${id}/deny`, { method: 'POST', body: JSON.stringify({ reason }) });

// ── Overview ───────────────────────────────────────────────────────────────
export const getOverview = () => request('/overview');

// ── Favorites ─────────────────────────────────────────────────────────────
export const getFavorites = () => request('/favorites');
export const addFavorite = (body: any) =>
    request('/favorites', { method: 'POST', body: JSON.stringify(body) });
export const removeFavorite = (templateId: string | number) =>
    request(`/favorites/${templateId}`, { method: 'DELETE' });
