import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login/patient" replace />;
  }

  if (!allowedRoles.includes(user.role.toLowerCase())) {
    // Redirect based on role
    if (user.role.toLowerCase() === 'medecin') {
      return <Navigate to="/doctor" replace />;
    } else if (user.role.toLowerCase() === 'patient') {
      return <Navigate to="/patient" replace />;
    }
    return <Navigate to="/login/patient" replace />;
  }

  return <>{children}</>;
} 