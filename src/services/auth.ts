/**
 * frontend/src/services/auth.ts
 * ──────────────────────────────
 * Backend auth API çağrıları.
 * Tüm istekler credentials: "include" ile gönderilir → HttpOnly cookie otomatik taşınır.
 * Frontend hiçbir zaman token'ı elle okumaz/yazmaz.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface UserInfo {
    username: string;
    full_name: string | null;
    email: string | null;
    role: "admin" | "project_manager" | "viewer" | "user";
}

interface ApiMessage {
    detail: string;
}

const defaultHeaders = { "Content-Type": "application/json" };

/** Hata mesajını backend'den çek. */
async function extractError(res: Response): Promise<string> {
    try {
        const data = await res.json();
        return data.detail ?? `HTTP ${res.status}`;
    } catch {
        return `HTTP ${res.status}`;
    }
}

// ──────────────────────────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: defaultHeaders,
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const msg = await extractError(res);
        throw new Error(msg);
    }
}

// ──────────────────────────────────────────────────────────────────
// Mevcut kullanıcı bilgisi (bootstrap için de kullanılır)
// ──────────────────────────────────────────────────────────────────

export async function getMe(): Promise<UserInfo> {
    const res = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Oturum bulunamadı");
    }

    return res.json() as Promise<UserInfo>;
}

// ──────────────────────────────────────────────────────────────────
// Token yenile
// ──────────────────────────────────────────────────────────────────

export async function refreshToken(): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Token yenilenemiyor — yeniden giriş yapın");
    }
}

// ──────────────────────────────────────────────────────────────────
// Logout
// ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    // Hata olsa bile session'ı temizle
}

export type { UserInfo };
