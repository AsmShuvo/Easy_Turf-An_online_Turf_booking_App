import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Trophy,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useAuth } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";
import api from "../../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const imgTactical =
    "https://plus.unsplash.com/premium_vector-1719247619350-3c59236f723e?q=80&w=880&auto=format&fit=crop";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setIsSubmitting(true);
      await signup(formData.email, formData.password);

      // Save user info to PostgreSQL database
      try {
        await api.post("/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log("User synced to database successfully");
      } catch (dbError) {
        console.error("Database sync error:", dbError);
        const status = dbError.response?.status;
        if (status) {
          Swal.fire({
            title: "Database Out of Sync",
            text: `Local setup completed but remote sync failed: ${status}`,
            icon: "warning",
            background: "#050505",
            color: "#fff",
            confirmButtonColor: "#f59e0b",
          });
        } else {
          Swal.fire({
            title: "Connection Error",
            text: "Identity verified but database link offline",
            icon: "error",
            background: "#050505",
            color: "#fff",
            confirmButtonColor: "#ef4444",
          });
        }
      }

      await Swal.fire({
        title: "Account Created",
        text: "You have been successfully enlisted in Turf King.",
        icon: "success",
        background: "#050505",
        color: "#fff",
        confirmButtonColor: "#a3e635",
      });
      navigate("/");
    } catch (err) {
      setError("Failed to create account: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 pt-32 pb-20">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* LEFT SIDE: TACTICAL VISUAL */}
        <div className="relative hidden lg:block bg-lime-400">
          <img
            src={imgTactical}
            alt="Tactical Player"
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-black">
              Join the <br /> Elite <span className="text-white">Ranks</span>
            </h2>
            <p className="mt-4 text-black/70 font-bold uppercase tracking-widest text-xs">
              01 // Professional Deployment System
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-8 md:p-16 space-y-10">
          <header>
            <div className="flex items-center space-x-2 text-lime-400 mb-2">
              <Trophy size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                New Recruit
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Create <span className="text-lime-400">Profile</span>
            </h1>
          </header>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                  Contact No
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880..."
                    className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="commander@turfking.com"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-xl focus:border-lime-400 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="group relative w-full py-5 overflow-hidden rounded-xl transition-all duration-300 mt-4 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-lime-400 group-hover:bg-lime-300 transition-colors" />
              <div className="relative flex items-center justify-center space-x-2 text-black font-black uppercase tracking-[0.2em] text-xs">
                <span>{isSubmitting ? "Enlisting..." : "Create Account"}</span>
                {isSubmitting ? (
                  <Activity size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
              </div>
            </button>
          </form>

          <footer className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              Already enlisted?{" "}
              <Link
                to="/login"
                className="text-lime-400 hover:text-lime-300 ml-1"
              >
                Access Terminal
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;
