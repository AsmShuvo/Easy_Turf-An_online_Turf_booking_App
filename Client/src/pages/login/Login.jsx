import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Activity, ShieldCheck } from "lucide-react";
import { useAuth } from "../../Providers/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const imgTactical =
    "https://plus.unsplash.com/premium_vector-1719504653273-8174c5d508cc?q=80&w=880&auto=format&fit=crop";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setIsSubmitting(true);
      await login(email, password);

      // Fetch role to decide redirect
      // Note: login() updates auth state, but we might need to fetch role manually here
      // or rely on a slight delay/check.
      // Better: fetch role directly here for immediate decision.
      const response = await fetch(`http://localhost:3000/users/${email}`);
      if (response.ok) {
        const dbUser = await response.json();
        console.log("User: ", dbUser);
        if (dbUser.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Fallback if fetch fails
        navigate("/");
      }
    } catch (err) {
      setError("Failed to log in: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* LEFT SIDE: FORM */}
        <div className="p-8 md:p-16 space-y-10 order-2 lg:order-1">
          <header>
            <div className="flex items-center space-x-2 text-lime-400 mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Identity Verification
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Command <span className="text-lime-400">Login</span>
            </h1>
          </header>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                Email Cipher
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commander@nexus.com"
                  className="w-full bg-white/[0.03] border border-white/10 p-5 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                  Password Key
                </label>
                <Link
                  to="#"
                  className="text-[9px] font-black text-lime-400/50 uppercase hover:text-lime-400 transition-colors"
                >
                  Forgot Key?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 p-5 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="group relative w-full py-5 overflow-hidden rounded-xl transition-all duration-300 mt-4 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-lime-400 group-hover:bg-lime-300 transition-colors" />
              <div className="relative flex items-center justify-center space-x-2 text-black font-black uppercase tracking-[0.2em] text-xs">
                <span>
                  {isSubmitting ? "Authenticating..." : "Establish Connection"}
                </span>
                <Activity
                  size={16}
                  className={isSubmitting ? "animate-spin" : "animate-pulse"}
                />
              </div>
            </button>
          </form>

          <footer className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              New to the system?{" "}
              <Link
                to="/register"
                className="text-lime-400 hover:text-lime-300 ml-1"
              >
                Enlist Now
              </Link>
            </p>
          </footer>
        </div>

        {/* RIGHT SIDE: TACTICAL VISUAL */}
        <div className="relative hidden lg:block bg-lime-400 order-1 lg:order-2">
          <img
            src={imgTactical}
            alt="Tactical Arena"
            className="w-full h-full object-cover mix-blend-multiply opacity-90 scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-40" />
          <div className="absolute top-12 right-12 text-right">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-black">
              Return to <br /> the <span className="text-white">Arena</span>
            </h2>
            <p className="mt-4 text-black/70 font-bold uppercase tracking-widest text-[10px]">
              Secure Hub Login Required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
