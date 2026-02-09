import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Providers/AuthProvider";
import { Activity } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center text-white">
        <Activity className="text-lime-400 animate-spin mb-4" size={48} />
        <span className="text-lime-400 font-black tracking-widest uppercase text-xs">
          Verifying Identity...
        </span>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
