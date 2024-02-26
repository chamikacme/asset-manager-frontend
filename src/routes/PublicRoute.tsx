import useAuthStore from "@/store/authStore";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }: { element: React.ReactNode }) => {
  if (!useAuthStore((state) => state.user).isLogged) {
    return <>{element}</>;
  }

  return <Navigate to="/dashboard" />;
};

export default PublicRoute;
