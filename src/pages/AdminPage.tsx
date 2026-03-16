import React from 'react';
import { useAuth } from '@/context/AuthContext';

const AdminPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Paneli</h1>
            <p className="text-gray-500 mb-6">Giriş yapan: <span className="font-mono font-semibold">{user?.username}</span></p>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <p className="text-gray-600">Sistem yönetimi burada gerçekleştirilir.</p>
            </div>
        </div>
    );
};

export default AdminPage;
