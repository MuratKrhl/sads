/**
 * frontend/src/context/AuthContext.tsx
 * ──────────────────────────────────────
 * Cookie tabanlı auth state yönetimi.
 *
 * • Uygulama açılışında /auth/me ile bootstrap
 * • Token localStorage'da tutulmaz
 * • SessionTimeoutModal entegrasyonu korundu
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { getMe, login as apiLogin, logout as apiLogout, refreshToken, UserInfo } from "@/services/auth";

// ──────────────────────────────────────────────────────────────────
// Tipler
// ──────────────────────────────────────────────────────────────────

interface AuthContextType {
    user: UserInfo | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    showTimeoutModal: boolean;
    countdown: number;
    extendSession: () => void;
}

// ──────────────────────────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
    showTimeoutModal: false,
    countdown: 60,
    extendSession: () => { },
});

// ──────────────────────────────────────────────────────────────────
// Sabitler
// ──────────────────────────────────────────────────────────────────

const SESSION_TIMEOUT_MS = 25 * 60 * 1000;   // 25 dakika hareketsizlik uyarısı
const COUNTDOWN_SECONDS = 60;                 // Modal countdown

// ──────────────────────────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Bootstrap: sayfa yüklenince cookie ile oturumu kontrol et ──
    useEffect(() => {
        getMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    // ── Hareketsizlik sayacı ────────────────────────────────────────
    const clearTimers = useCallback(() => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (countdownTimer.current) clearInterval(countdownTimer.current);
        setShowTimeoutModal(false);
        setCountdown(COUNTDOWN_SECONDS);
    }, []);

    const startInactivityTimer = useCallback(() => {
        clearTimers();
        inactivityTimer.current = setTimeout(() => {
            setShowTimeoutModal(true);
            let remaining = COUNTDOWN_SECONDS;
            countdownTimer.current = setInterval(() => {
                remaining -= 1;
                setCountdown(remaining);
                if (remaining <= 0) {
                    clearTimers();
                    apiLogout().then(() => setUser(null));
                }
            }, 1000);
        }, SESSION_TIMEOUT_MS);
    }, [clearTimers]);

    // Kullanıcı hareket edince sayacı sıfırla
    useEffect(() => {
        if (!user) return;
        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        const reset = () => startInactivityTimer();
        events.forEach((e) => window.addEventListener(e, reset));
        startInactivityTimer();
        return () => {
            events.forEach((e) => window.removeEventListener(e, reset));
            clearTimers();
        };
    }, [user, startInactivityTimer, clearTimers]);

    // ── Auth işlemleri ──────────────────────────────────────────────
    const login = useCallback(async (username: string, password: string) => {
        await apiLogin(username, password);
        const userInfo = await getMe();
        setUser(userInfo);
    }, []);

    const logout = useCallback(async () => {
        clearTimers();
        await apiLogout();
        setUser(null);
    }, [clearTimers]);

    const extendSession = useCallback(async () => {
        clearTimers();
        try {
            await refreshToken();
        } catch {
            await logout();
        }
        startInactivityTimer();
    }, [clearTimers, logout, startInactivityTimer]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                showTimeoutModal,
                countdown,
                extendSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ──────────────────────────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────────────────────────

export const useAuth = () => useContext(AuthContext);
