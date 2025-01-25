import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};
