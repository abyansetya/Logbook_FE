import { Navigate } from "react-router";
import { useAuth } from "../provider/auth-context";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Navigate to={isAuthenticated ? "/dashboard" : "/sign-in"} replace />;
}
