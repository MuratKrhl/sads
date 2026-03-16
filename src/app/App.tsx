import React, { useContext } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PageComponent from '@/pages/PageComponent';
import ImportantLinksPage from '@/pages/ImportantLinksPage';
import DutyRosterPage from '@/pages/DutyRosterPage';
import EnvanterPage from '@/pages/inventory/EnvanterPage';
import SessionTimeoutModal from '@/components/modals/SessionTimeoutModal';
import AskGTPage from '@/pages/AskGTPage';
import PerformancePage from '@/pages/performance/PerformancePage';
import LogViewerPage from '@/pages/logs/LogViewerPage';
import AdminPage from '@/pages/AdminPage';
import ProjectManagePage from '@/pages/ProjectManagePage';
import { AuthContext, AuthProvider } from '@/context/AuthContext';
import { PAGE_CONFIG } from '@/utils/constants';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RoleBasedRoute from '@/routes/RoleBasedRoute';
import LoginPage from '@/pages/LoginPage';

// ──────────────────────────────────────────────────────────────────
// Ana içerik — AuthProvider altında render edilir
// ──────────────────────────────────────────────────────────────────

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = React.useState('Dashboard');
  const { showTimeoutModal, countdown, extendSession, logout } = useContext(AuthContext);

  const renderContent = () => {
    if (activePage === 'Dashboard') return <DashboardPage onNavigate={setActivePage} />;
    if (activePage === 'Envanter') return <EnvanterPage />;
    if (activePage === 'Önemli Linkler') return <ImportantLinksPage />;
    if (activePage === 'Nöbet Listesi') return <DutyRosterPage />;
    if (activePage === 'Performance') return <PerformancePage />;
    if (activePage === 'AskGT') return <AskGTPage />;
    if (activePage === 'Log Viewer') return <LogViewerPage />;

    // Rol bazlı sayfalar
    if (activePage === 'Admin') {
      return (
        <RoleBasedRoute allowedRoles={['admin']}>
          <AdminPage />
        </RoleBasedRoute>
      );
    }
    if (activePage === 'Proje Yönetimi') {
      return (
        <RoleBasedRoute allowedRoles={['admin', 'project_manager']}>
          <ProjectManagePage />
        </RoleBasedRoute>
      );
    }

    const config = PAGE_CONFIG[activePage];
    if (config) return <PageComponent title={activePage} tabsConfig={config.tabs} />;
    return <PageComponent title={activePage} tabsConfig={[]} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Sidebar activeItem={activePage} onNavigate={setActivePage} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {renderContent()}
      </main>
      <SessionTimeoutModal
        isOpen={showTimeoutModal}
        countdown={countdown}
        onExtend={extendSession}
        onLogout={logout}
      />
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// Root App
// ──────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default App;
