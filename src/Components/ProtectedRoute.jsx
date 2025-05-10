// Components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "./useUserContext";

const ProtectedRoute = ({ allowedRole }) => {
    const { userRole, loading } = useUserContext();

    // Wait until loading finishes
    if (loading) {
      return <div>Loading...</div>; 
    }
  if (!userRole) {
    return <Navigate to="/kwinjira" />;
  }

  return userRole === allowedRole ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
