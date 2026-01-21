import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Trophy,
  Activity,
  UserPlus,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../Providers/AuthProvider";

const Navbar = () => {
  const { user, signout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "History", path: "/history" },
  ];

  console.log(user);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto max-w-[1440px] px-6 transition-all duration-500 ${
          scrolled ? "scale-95" : "scale-100"
        }`}
      >
        <div className="relative group">
          {/* Animated Border Glow behind the bar */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-lime-400/10 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center justify-between bg-black/60 backdrop-blur-2xl border border-white/10 px-6 md:px-10 py-4 rounded-2xl shadow-2xl">
            {/* LEFT: LOGO */}
            <Link to="/" className="flex items-center space-x-2 group/logo">
              <div className="p-2 bg-lime-400 rounded-lg transform group-hover/logo:rotate-[360deg] transition-transform duration-700">
                <Trophy size={18} className="text-black" />
              </div>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">
                Turf <span className="text-lime-400">King</span>
              </span>
            </Link>

            {/* CENTER: NAV LINKS */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-lime-400 transition-all relative group/link"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-lime-400 transition-all group-hover/link:w-full" />
                </Link>
              ))}
            </div>

            {/* RIGHT: AUTH & STATUS */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  {/* User Profile Info */}
                  <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <div className="w-6 h-6 bg-lime-400 rounded-md flex items-center justify-center">
                      <User size={14} className="text-black" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest leading-none">
                        Status: Ready
                      </span>
                      <span className="text-[10px] font-bold text-lime-400 truncate max-w-[120px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => signout()}
                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Exit</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Login Link */}
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-white transition-colors"
                  >
                    <LogIn size={14} className="text-lime-400" />
                    <span>Login</span>
                  </Link>

                  {/* Register Button */}
                  <Link
                    to="/register"
                    className="relative group/btn overflow-hidden rounded-lg"
                  >
                    <div className="absolute inset-0 bg-lime-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <div className="relative flex items-center space-x-2 px-5 py-2.5 border border-lime-400/50 text-lime-400 group-hover/btn:text-black transition-colors font-black text-[10px] uppercase tracking-[0.2em]">
                      <UserPlus size={14} />
                      <span>Register</span>
                    </div>
                  </Link>
                </>
              )}

              {/* System pulse */}
              <div className="flex items-center pl-4 border-l border-white/10">
                <Activity size={16} className="text-lime-500 animate-pulse" />
              </div>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white hover:text-lime-400 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full mt-4 transition-all duration-300 origin-top ${
            isOpen
              ? "scale-y-100 opacity-100"
              : "scale-y-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="mx-6 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-3xl text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-black uppercase tracking-widest text-gray-400 hover:text-lime-400"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-4 border-t border-white/10">
              {user ? (
                <>
                  <div className="text-[10px] font-bold text-lime-400 uppercase tracking-widest pb-2">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      signout();
                      setIsOpen(false);
                    }}
                    className="bg-red-500/10 text-red-500 py-3 rounded-xl font-black uppercase tracking-widest text-xs border border-red-500/20"
                  >
                    Logout Terminal
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-black uppercase tracking-widest text-lime-400"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="bg-lime-400 text-black py-3 rounded-xl font-black uppercase tracking-widest text-xs"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
