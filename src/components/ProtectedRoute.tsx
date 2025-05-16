import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = useStore((state) => state.user);
  const hasAccess = useStore((state) => state.hasAccess);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}