/**
 * frontend/src/routes/RoleBasedRoute.tsx
 * ────────────────────────────────────────
 * Rol kontrolü yapar. İzin yoksa Unauthorized sayfası gösterir.
 */

import React from "react";
import { useAuth } from "@/context/AuthContext";

type Role = "admin" | "project_manager" | "viewer" | "user";

interface RoleBasedRouteProps {
    allowedRoles: Role[];
    children: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role as Role)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-4xl font-bold mb-4">403</h1>
                <p className="text-lg text-gray-400">Bu sayfaya erişim yetkiniz yok.</p>
                <p className="text-sm text-gray-500 mt-2">
                    Gerekli rol: <span className="font-mono text-yellow-400">{allowedRoles.join(" | ")}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Mevcut rol: <span className="font-mono text-red-400">{user?.role ?? "yok"}</span>
                </p>
            </div>
        );
    }

    return <>{children}</>;
};

export default RoleBasedRoute;
