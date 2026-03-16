import React, { useState, useContext } from 'react';
import {
  LayoutDashboard, Package, User, Layers,
  Activity, MessageSquare, FileText,
  Calendar, Link, LogOut
} from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';

interface HorizontalSidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

const navItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Envanter', label: 'Envanter', icon: Package },
  { id: 'Self Service', label: 'Self Service', icon: User },
  { id: 'Ansible', label: 'Ansible', icon: Layers },
  { id: 'Performance', label: 'Performance', icon: Activity },
  { id: 'AskGT', label: 'AskGT', icon: MessageSquare },
  { id: 'Log Viewer', label: 'Log Viewer', icon: FileText },
  { id: 'Nöbet Listesi', label: 'Nöbet Listesi', icon: Calendar },
  { id: 'Önemli Linkler', label: 'Önemli Linkler', icon: Link },
];

export default function Navbar({ activeItem, onNavigate }: HorizontalSidebarProps) {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 16px;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          height: 56px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-logo {
          margin-right: 24px;
          display: flex;
          align-items: center;
          font-weight: 800;
          font-size: 1.25rem;
          color: #111827;
          letter-spacing: -0.025em;
        }

        .navbar-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 4px;
          overflow-x: auto;
          flex: 1;
        }

        .navbar-links::-webkit-scrollbar {
          display: none;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          height: 56px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.2s;
          cursor: pointer;
        }

        .nav-item:hover {
          color: #111827;
          background: #f9fafb;
        }

        .nav-item.active {
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
          background: #f0f7ff;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: 16px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 9999px;
          background: #f3f4f6;
          max-width: 150px;
        }

        .logout-btn {
          color: #ef4444;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          background: #fef2f2;
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-logo">
          BMW Portal
        </div>

        <ul className="navbar-links">
          {navItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <div
                className={`nav-item ${activeItem === id ? 'active' : ''}`}
                onClick={() => onNavigate(id)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <div className="user-profile">
            <span className="text-sm font-semibold truncate capitalize">{user?.username || 'Giriş Yapılmadı'}</span>
          </div>
          <button onClick={logout} className="logout-btn" title="Çıkış Yap">
            <LogOut size={18} />
          </button>
        </div>
      </nav>
    </>
  );
}
