import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ROLE_REDIRECTS = {
  superadmin: '/admin/dashboard',
  admin: '/admin/dashboard',
  user: '/dashboard',
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="font-mono text-[11px] tracking-[0.3em] text-cream/40 uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const redirect = ROLE_REDIRECTS[user.role] || '/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default PublicRoute;