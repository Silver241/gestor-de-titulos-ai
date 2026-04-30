import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/localStorage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  console.log('🔐 ProtectedRoute - montado');
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  console.log('🔐 ProtectedRoute - user:', user);

  useEffect(() => {
    console.log('🔐 ProtectedRoute - useEffect executado, user:', user);
    if (!user) {
      console.log('🔐 ProtectedRoute - sem user, redirecionando para /login');
      navigate("/login");
    } else {
      console.log('🔐 ProtectedRoute - user válido, continuando');
    }
  }, [user, navigate]);

  if (!user) {
    console.log('🔐 ProtectedRoute - retornando null (sem user)');
    return null;
  }

  console.log('🔐 ProtectedRoute - renderizando children');
  return <>{children}</>;
};
