import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  LogOut,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import { useAuth } from "../Providers/AuthProvider";

const DashboardLayout = () => {
  const { user, loading, signout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("DashboardLayout - User:", user, "Loading:", loading);
    if (!loading) {
      if (!user) {
        console.log("No user, redirecting to login");
        navigate("/login");
      } else if (user.role !== "admin") {
        console.log("User is not admin, redirecting to home. Role:", user.role);
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  const handleSignout = () => {
    signout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black/50 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-2 group/logo">
            <div className="p-2 bg-lime-400 rounded-lg">
              <Trophy size={18} className="text-black" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">
              Turf <span className="text-lime-400">Admin</span>
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 bg-lime-400/10 text-lime-400 rounded-xl border border-lime-400/20"
          >
            <LayoutDashboard size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Overview
            </span>
          </Link>
          {/* Placeholder links for future */}
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
            <Calendar size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Bookings
            </span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
            <Users size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Users
            </span>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
                {user?.email}
              </p>
              <p className="text-[8px] text-lime-400 uppercase font-black tracking-widest">
                Administrator
              </p>
            </div>
          </div>
          <button
            onClick={handleSignout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl check-hover:bg-red-500/20 transition-colors uppercase font-black text-[10px] tracking-widest"
          >
            <LogOut size={14} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Grid */}
        <div
          className="fixed inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #333 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="p-10 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
