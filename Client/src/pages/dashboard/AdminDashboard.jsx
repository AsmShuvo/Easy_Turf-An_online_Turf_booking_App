import React, { useEffect, useState } from "react";
import {
  Activity,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  Clock3,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../Providers/AuthProvider";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, PENDING, CONFIRMED
  const server_url = import.meta.env.VITE_SERVER_URL;

  const { user } = useAuth(); // Get user to access (db) id

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        const [bookingsRes, turfsRes] = await Promise.all([
          fetch(`${server_url}/bookings?ownerId=${user.id}`),
          fetch(`${server_url}/turfs?ownerId=${user.id}`),
        ]);

        const bookingsData = await bookingsRes.json();
        const turfsData = await turfsRes.json();

        setBookings(bookingsData);
        setTurfs(turfsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [server_url, user]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${server_url}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b,
          ),
        );
      } else {
        const errorData = await res.json();
        alert("Failed to update status: " + errorData.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const handleDelete = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this booking and free the slot?",
      )
    )
      return;

    try {
      const res = await fetch(`${server_url}/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      } else {
        const errorData = await res.json();
        alert("Failed to delete: " + errorData.error);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting booking");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    totalTurfs: turfs.length,
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-white">
        <Activity className="text-lime-400 animate-spin mb-4" size={48} />
        <span className="text-lime-400 font-black tracking-widest uppercase text-xs">
          Syncing Command Center...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ... header and other parts remain same ... */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Command <span className="text-lime-400">Center</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Overview of all field operations
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
              My Arenas
            </p>
            <p className="text-2xl font-black text-white">{stats.totalTurfs}</p>
          </div>
          <div className="bg-lime-400/10 border border-lime-400/20 px-6 py-4 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-lime-400 tracking-widest">
              Active Ops
            </p>
            <p className="text-2xl font-black text-lime-400">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-4 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">
              Pending
            </p>
            <p className="text-2xl font-black text-yellow-500">
              {stats.pending}
            </p>
          </div>
        </div>
      </header>

      {/* MY TURFS QUICK VIEW */}
      {turfs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {turfs.map((turf) => (
            <div
              key={turf.id}
              className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-white uppercase">
                  {turf.name}
                </p>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin size={10} />
                  <span className="text-[10px] uppercase">{turf.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/10 mt-8">
        <div className="flex space-x-2">
          {["ALL", "PENDING", "CONFIRMED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-lime-400 text-black"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative group mx-4 flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400"
            size={14}
          />
          <input
            type="text"
            placeholder="SEARCH OPERATIONS..."
            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 text-xs font-bold text-white focus:border-lime-400 outline-none uppercase placeholder:text-gray-700"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 border-b border-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Operation ID
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Turf / Location
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  User / Contact
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Schedule
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-lime-400 opacity-70">
                        #{booking.id.split("-")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div>
                      <p className="font-bold text-sm text-white uppercase">
                        {booking.turf.name}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-500 mt-1">
                        <MapPin size={10} />
                        <span className="text-[10px] uppercase">
                          {booking.turf.city}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div>
                      <p className="font-bold text-sm text-white">
                        {booking.user.name || booking.user.email.split("@")[0]}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-500 mt-1">
                        <User size={10} />
                        <span className="text-[10px]">
                          {booking.user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar size={12} />
                        <span className="font-mono text-xs">
                          {booking.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock size={12} />
                        <span className="font-mono text-xs">
                          {booking.slot}:00
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${
                        booking.status === "CONFIRMED"
                          ? "bg-lime-400/10 border-lime-400/20 text-lime-400"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {booking.status === "CONFIRMED" ? (
                        <CheckCircle size={10} />
                      ) : (
                        <Clock3 size={10} />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {booking.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "CONFIRMED")
                        }
                        disabled={booking.status === "CONFIRMED"}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                          booking.status === "CONFIRMED"
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                            : "bg-lime-400 text-black hover:bg-lime-300"
                        }`}
                      >
                        Confirm
                      </button>

                      {booking.status === "CONFIRMED" ? (
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
