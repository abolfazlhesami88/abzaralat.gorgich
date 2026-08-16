import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/adminsite" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/adminsite" replace />;
  }

  return <>{children}</>;
}
