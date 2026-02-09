import React, { useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthProvider";
import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Hash,
} from "lucide-react";

const OrderHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const server_url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (user?.email) {
      fetch(`${server_url}/bookings/user/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setBookings(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bookings:", err);
          setLoading(false);
        });
    }
  }, [user, server_url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center text-white">
        <Activity className="text-lime-400 animate-spin mb-4" size={48} />
        <span className="text-lime-400 font-black tracking-widest uppercase text-xs">
          Retrieving Mission Logs...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-12">
          Mission <span className="text-lime-400">Logs</span>
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-500 uppercase font-black tracking-[0.5em]">
              No Operations Found
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-lime-400/30 transition-colors"
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl ${
                    booking.status === "CONFIRMED"
                      ? "bg-lime-400 text-black"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {booking.status}
                </div>

                {/* Left: Turf Image */}
                <div className="w-full md:w-48 h-32 md:h-full rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={booking.turf.image}
                    alt={booking.turf.name}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>

                {/* Right: Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-lime-400 mb-1">
                      <Hash size={12} />
                      <span className="text-[10px] font-mono opacity-70">
                        {booking.id}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                      {booking.turf.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Date
                        </span>
                      </div>
                      <p className="font-mono text-sm">{booking.date}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Time
                        </span>
                      </div>
                      <p className="font-mono text-sm">
                        {booking.slot}:00 -{" "}
                        {parseInt(booking.slot.split("-")[1])}:00
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MapPin size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Location
                        </span>
                      </div>
                      <p className="font-mono text-sm truncate">
                        {booking.turf.city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <CreditCard size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Method
                        </span>
                      </div>
                      <p className="font-mono text-sm">
                        {booking.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {booking.transactionId && (
                    <div className="pt-4 border-t border-white/10 flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                        TRX ID:
                      </span>
                      <span className="font-mono text-xs text-lime-400/70">
                        {booking.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
