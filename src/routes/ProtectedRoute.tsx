/**
 * frontend/src/routes/ProtectedRoute.tsx
 * ────────────────────────────────────────
 * Login kontrolü yapar. Giriş yapılmamışsa LoginPage gösterir.
 */

import React from "react";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/LoginPage";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-lg">Yükleniyor...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
