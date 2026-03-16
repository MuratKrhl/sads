import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/ansible';

export function useTemplates(params: Record<string, any> = {}) {
    const [data, setData] = useState<{ items: any[]; total: number } | null>(null);
    const [loading, setLoading] = useState(true);

    // Serialize params to string to deeply compare dependencies
    const paramsStr = JSON.stringify(params);

    useEffect(() => {
        let active = true;
        setLoading(true);
        api.getTemplates(params)
            .then(res => {
                if (active) {
                    setData(res);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (active) setLoading(false);
                console.error(err);
            });
        return () => { active = false; };
    }, [paramsStr]);

    return { data, loading };
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Set<string | number>>(new Set());

    useEffect(() => {
        api.getFavorites()
            .then(res => {
                const ids = (res?.items || []).map((f: any) => f.template_id || f.id);
                setFavorites(new Set(ids));
            })
            .catch(console.error);
    }, []);

    const toggle = useCallback(async (template: any) => {
        const id = template.id;
        try {
            if (favorites.has(id)) {
                await api.removeFavorite(id);
                setFavorites(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            } else {
                await api.addFavorite({ template_id: id, type: template.type });
                setFavorites(prev => new Set(prev).add(id));
            }
        } catch (e) {
            console.error(e);
        }
    }, [favorites]);

    return { favorites, toggle };
}

export function useOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        api.getOverview().then(res => {
            if (active) {
                setData(res);
                setLoading(false);
            }
        }).catch((e) => {
            console.error(e);
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, []);

    return { data, loading };
}

export function useApprovals() {
    const [data, setData] = useState<{ items: any[]; total: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0);

    const reload = useCallback(() => setTick(t => t + 1), []);

    useEffect(() => {
        let active = true;
        setLoading(true);
        api.getApprovals().then(res => {
            if (active) {
                setData(res);
                setLoading(false);
            }
        }).catch((e) => {
            console.error(e);
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [tick]);

    return { data, loading, reload };
}

export function useJobs(params: Record<string, any> = {}) {
    const [data, setData] = useState<{ items: any[]; total: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0);

    const paramsStr = JSON.stringify(params);
    const reload = useCallback(() => setTick(t => t + 1), []);

    useEffect(() => {
        let active = true;
        setLoading(true);
        api.getJobs(params).then(res => {
            if (active) {
                setData(res);
                setLoading(false);
            }
        }).catch((e) => {
            console.error(e);
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [paramsStr, tick]);

    return { data, loading, reload };
}

export function useJobOutput(jobId: string | number | undefined, doPoll: boolean) {
    const [lines, setLines] = useState<any[]>([]);
    const [status, setStatus] = useState<string>('pending');

    useEffect(() => {
        if (!jobId || !doPoll) return;

        let active = true;
        let cursor = 0;
        let timer: any = null;

        const poll = async () => {
            try {
                const res = await api.getJobOutput(jobId, cursor);
                if (!active) return;

                if (res.lines && res.lines.length > 0) {
                    setLines(prev => [...prev, ...res.lines]);
                    cursor = res.next_cursor || (cursor + res.lines.length);
                }

                if (res.status) {
                    setStatus(res.status);
                }

                if (res.status === 'running' || res.status === 'pending') {
                    timer = setTimeout(poll, 2000); // 2s polling
                }
            } catch (e) {
                console.error(e);
                if (active && (status === 'running' || status === 'pending')) {
                    timer = setTimeout(poll, 5000); // Backoff on error
                }
            }
        };

        poll();
        return () => {
            active = false;
            if (timer) clearTimeout(timer);
        };
    }, [jobId, doPoll]);

    return { lines, status };
}

export function useLaunchConfig(templateId: string | number) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        if (!templateId) return;

        setLoading(true);
        api.getLaunchConfig(templateId).then(res => {
            if (active) {
                setData(res);
                setLoading(false);
            }
        }).catch((e) => {
            console.error(e);
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [templateId]);

    return { data, loading };
}
