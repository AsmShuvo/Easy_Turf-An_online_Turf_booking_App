import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Activity,
  ChevronRight,
  Search,
} from "lucide-react";
import BookingModal from "../../components/BookingModal";
import PaymentModal from "../../components/PaymentModal";
import { useAuth } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Turfs = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTurf, setSelectedTurf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const { city, selectedDate, slot } = location.state || {};

  const { data: allTurfs = [], isLoading: isTurfsLoading } = useQuery({
    queryKey: ["turfs"],
    queryFn: async () => {
      const res = await api.get("/turfs");
      return res.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/bookings", payload);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Booking Secure",
        text: "Mission objective achieved. Your arena is reserved.",
        icon: "success",
        background: "#050505",
        color: "#fff",
        confirmButtonColor: "#a3e635",
      });
      navigate("/");
    },
    onError: (error) => {
      console.error("Booking Error:", error);
      Swal.fire({
        title: "Booking Failed",
        text: error.response?.data?.error || "Could not finalize the operation",
        icon: "error",
        background: "#050505",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  // Client-side filtering
  const turfs = React.useMemo(() => {
    let filteredData = allTurfs;

    // 1. Filter by City
    if (city && city !== "All") {
      filteredData = filteredData.filter(
        (turf) => turf.city.toLowerCase() === city.toLowerCase(),
      );
    }

    // 2. Filter by Availability
    if (selectedDate && slot) {
      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toLocaleDateString("en-GB");
      const [slotStart, slotEnd] = slot.split("-").map(Number);

      filteredData = filteredData.filter((turf) => {
        const bookedSlotsForDate = turf.slots[formattedDate] || [];
        const isBooked = bookedSlotsForDate.some(
          (s) => s.start === slotStart && s.end === slotEnd,
        );
        return !isBooked;
      });
    }

    return filteredData;
  }, [allTurfs, city, selectedDate, slot]);

  if (isTurfsLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center">
        <Activity className="text-lime-400 animate-spin mb-4" size={48} />
        <span className="text-lime-400 font-black tracking-widest uppercase text-xs">
          Scanning Arenas...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-32 pb-20 px-6 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center space-x-2 text-lime-400 mb-2">
              <Activity size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Live Feed // Deployment
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
              {city && city !== "All" ? (
                <>
                  Sector <span className="text-lime-400">{city}</span>
                </>
              ) : (
                <>
                  Global <span className="text-lime-400">Arenas</span>
                </>
              )}
            </h1>
            {selectedDate && (
              <p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">
                Target Date: {new Date(selectedDate).toLocaleDateString()} //
                Slot: {slot || "Any"}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-lime-400 transition-colors"
          >
            <Search size={16} />
            <span>Modify Search</span>
          </button>

          <button
            onClick={() => navigate("/create-turf")}
            className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-lime-400 hover:text-white transition-colors border border-lime-400/30 px-4 py-2 rounded-lg"
          >
            <span>Register New Arena</span>
          </button>
        </div>
      </div>

      {/* TURF GRID */}
      <div className="max-w-7xl mx-auto">
        {turfs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-500 uppercase font-black tracking-[0.5em]">
              No Vacant Arenas Found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {turfs.map((turf) => (
              <div key={turf.id} className="group relative">
                {/* Neon Glow Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-lime-400/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-md" />

                <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-lime-400/50 transition-colors duration-500">
                  {/* Image with Price Overlay */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={turf.image}
                      alt={turf.name}
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-6 right-6 bg-lime-400 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter italic shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                      ৳{turf.rent}{" "}
                      <span className="text-[9px] opacity-70">/hr</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-lime-400 transition-colors">
                      {turf.name}
                    </h2>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start space-x-3">
                        <MapPin size={18} className="text-lime-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {turf.city}
                          </p>
                          <p className="text-sm text-gray-300 font-medium">
                            {turf.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock size={18} className="text-lime-400" />
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          Operational: 10:00 - 00:00
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      disabled={!user}
                      onClick={() => {
                        if (!user) return;
                        setSelectedTurf(turf);
                        setIsModalOpen(true);
                      }}
                      className={`mt-auto group/btn relative w-full py-4 overflow-hidden rounded-xl border border-lime-400/30 transition-colors ${
                        !user
                          ? "opacity-50 cursor-not-allowed hover:border-red-500/30"
                          : "hover:border-lime-400"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 ${
                          !user ? "bg-red-500/10" : "bg-lime-400"
                        } translate-y-full ${
                          user ? "group-hover/btn:translate-y-0" : ""
                        } transition-transform duration-300`}
                      />
                      <div
                        className={`relative flex items-center justify-center space-x-2 ${
                          !user ? "text-gray-500" : "text-lime-400"
                        } ${
                          user ? "group-hover/btn:text-black" : ""
                        } font-black uppercase tracking-[0.2em] text-xs`}
                      >
                        <span>{user ? "Book Now" : "Login Required"}</span>
                        {user && <ChevronRight size={16} />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          setBookingData(data);
          setIsModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
        turf={selectedTurf}
        slot={slot}
        selectedDate={selectedDate}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={selectedTurf?.rent}
        onSubmit={async (paymentInfo) => {
          setIsPaymentModalOpen(false);

          // Format date to DD/MM/YYYY
          const dateObj = new Date(bookingData.selectedDate);
          const formattedDate = dateObj.toLocaleDateString("en-GB");

          const payload = {
            ...bookingData,
            date: formattedDate,
            paymentMethod: paymentInfo.method,
            transactionId: paymentInfo.transactionId,
            userEmail: user.email,
          };

          bookingMutation.mutate(payload);
        }}
      />
    </div>
  );
};

export default Turfs;
