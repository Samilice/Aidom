import { Navigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="container page" style={{ textAlign: 'center', padding: '80px 0' }}>
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
