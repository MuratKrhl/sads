import React from 'react';
import { useAuth } from '@/context/AuthContext';

const ProjectManagePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Proje Yönetimi</h1>
            <p className="text-gray-500 mb-6">
                Giriş yapan: <span className="font-mono font-semibold">{user?.username}</span>
                {' '}| Rol: <span className="font-mono text-blue-600">{user?.role}</span>
            </p>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <p className="text-gray-600">Proje takibi ve yönetimi burada gerçekleştirilir.</p>
            </div>
        </div>
    );
};

export default ProjectManagePage;
