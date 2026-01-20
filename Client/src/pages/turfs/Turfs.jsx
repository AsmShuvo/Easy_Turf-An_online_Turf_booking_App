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

const Turfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state passed from Home search
  const { city, selectedDate, slot } = location.state || {};

  useEffect(() => {
    // Note: Ensure your data is in public/data/turfs.json
    fetch("/data/turfs.json")
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data;

        // 1. Filter by City
        if (city && city !== "All") {
          filteredData = filteredData.filter(
            (turf) => turf.city.toLowerCase() === city.toLowerCase(),
          );
        }

        // 2. Filter by Availability
        // Logic: A turf is available if the searched slot is NOT in the booked 'slots' object
        if (selectedDate && slot) {
          const dateObj = new Date(selectedDate);
          const formattedDate = dateObj.toLocaleDateString("en-GB"); // "DD/MM/YYYY" matching your JSON keys

          console.log("🔍 RAW selectedDate:", selectedDate);
          console.log("🔍 Formatted Date:", formattedDate, "| Slot:", slot);

          filteredData = filteredData.filter((turf) => {
            const bookedSlotsForDate = turf.slots[formattedDate] || [];

            // Parse the selected slot (e.g., "12-13" -> start: 12, end: 13)
            const [slotStart, slotEnd] = slot.split("-").map(Number);

            // Check if this exact slot is booked
            const isBooked = bookedSlotsForDate.some(
              (s) => s.start === slotStart && s.end === slotEnd,
            );

            console.log(
              `📍 ${turf.name} (${turf.city}):`,
              `\n  - Slot dates in data: [${Object.keys(turf.slots).join(", ")}]`,
              `\n  - Booked for ${formattedDate}:`,
              bookedSlotsForDate,
              `\n  - Searching: ${slotStart}-${slotEnd}`,
              `\n  - IsBooked: ${isBooked}`,
              `\n  - WillShow: ${!isBooked}`,
            );

            return !isBooked; // Only show if NOT booked
          });
        }

        setTurfs(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [city, selectedDate, slot]);

  if (loading) {
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
                    <button className="mt-auto group/btn relative w-full py-4 overflow-hidden rounded-xl border border-lime-400/30 hover:border-lime-400 transition-colors">
                      <div className="absolute inset-0 bg-lime-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                      <div className="relative flex items-center justify-center space-x-2 text-lime-400 group-hover/btn:text-black font-black uppercase tracking-[0.2em] text-xs">
                        <span>Book Now</span>
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Turfs;
