import useAuthStore from "@/store/authStore";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ element }: { element: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (user.role === "admin" || user.role === "manager") {
    return <>{element}</>;
  }

  return <Navigate to="/organization" />;
};

export default AdminRoute;
