import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Trophy, Activity, UserPlus, LogIn } from "lucide-react";

const Navbar = () => {
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

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className={`mx-auto max-w-[1440px] px-6 transition-all duration-500 ${
        scrolled ? "scale-95" : "scale-100"
      }`}>
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
              {/* Login Link */}
              <Link 
                to="/login" 
                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-white transition-colors"
              >
                <LogIn size={14} className="text-lime-400" />
                <span>Login</span>
              </Link>

              {/* Register Button with "Scan" Glow */}
              <Link to="/register" className="relative group/btn overflow-hidden rounded-lg">
                {/* Button Glow Layer */}
                <div className="absolute inset-0 bg-lime-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center space-x-2 px-5 py-2.5 border border-lime-400/50 text-lime-400 group-hover/btn:text-black transition-colors font-black text-[10px] uppercase tracking-[0.2em]">
                  <UserPlus size={14} />
                  <span>Register</span>
                </div>
              </Link>

              {/* System pulse moved to extreme right */}
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
        <div className={`lg:hidden absolute top-full left-0 w-full mt-4 transition-all duration-300 origin-top ${
          isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}>
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
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-lime-400">Login</Link>
              <Link to="/register" className="bg-lime-400 text-black py-3 rounded-xl font-black uppercase tracking-widest text-xs">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;