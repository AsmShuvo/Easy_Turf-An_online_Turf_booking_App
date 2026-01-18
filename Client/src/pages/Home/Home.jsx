import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [city, setCity] = useState("");
  const [slot, setSlot] = useState("");

  const cities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"];
  const slots = [
    "10-11",
    "11-12",
    "12-13",
    "13-14",
    "14-15",
    "15-16",
    "16-17",
    "17-18",
    "18-19",
    "20-21",
    "21-22",
    "22-23",
  ];

  // Your provided Unsplash links
  const imgHero =
    "https://media.istockphoto.com/id/469031426/photo/soccer-player-kicking-ball-in-stadium.jpg?s=1024x1024&w=is&k=20&c=rU7w5tg32I6znbeSdVPaSTKaZXA2JKc_Dilj60GVHXM=";
  const imgLeft =
    "https://plus.unsplash.com/premium_photo-1661820628813-48f19dfad8dc?q=80&w=687&auto=format&fit=crop";
  const imgRight =
    "https://plus.unsplash.com/premium_photo-1664297521832-0ea5ea948a67?q=80&w=687&auto=format&fit=crop";

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-lime-400 selection:text-black">
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={imgHero}
          className="w-full h-full object-cover opacity-60 scale-105"
          alt="Stadium"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Turf <span className="text-lime-400">King</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg md:text-xl font-medium tracking-widest uppercase">
            Book your prime time. Anytime.
          </p>
        </div>
      </section>

      {/* 2. BENTO GRID CONTENT */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Action Image */}
          <div className="lg:col-span-3 group relative hidden lg:block overflow-hidden rounded-3xl border border-white/10">
            <img
              src={imgLeft}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Action"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <p className="absolute bottom-6 left-6 font-bold text-lime-400 uppercase tracking-widest">
              Premium Grass
            </p>
          </div>

          {/* CENTRAL BOOKING CARD (Glassmorphism) */}
          <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="h-2 w-12 bg-lime-400 rounded-full" />
                <h2 className="text-2xl font-bold uppercase tracking-wider">
                  Reservation
                </h2>
              </div>

              {/* Input Fields */}
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-lime-400 outline-none transition-all text-white"
                    placeholderText="Select Match Date"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                      City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-lime-400 outline-none transition-all text-white appearance-none"
                    >
                      <option value="" className="bg-black">
                        Choose City
                      </option>
                      {cities.map((c) => (
                        <option key={c} value={c} className="bg-black">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                      Slot
                    </label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-lime-400 outline-none transition-all text-white appearance-none"
                    >
                      <option value="" className="bg-black">
                        Time Slot
                      </option>
                      {slots.map((s) => (
                        <option key={s} value={s} className="bg-black">
                          {s}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-lime-400 hover:bg-lime-300 text-black font-black uppercase tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_-5px_rgba(163,230,53,0.5)]">
                Search
              </button>
            </div>
          </div>

          {/* Right Action Image */}
          <div className="lg:col-span-3 group relative hidden lg:block overflow-hidden rounded-3xl border border-white/10">
            <img
              src={imgRight}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Action"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <p className="absolute bottom-6 left-6 font-bold text-lime-400 uppercase tracking-widest">
              FIFA Quality
            </p>
          </div>
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="flex justify-center pb-10 opacity-20">
        <p className="text-xs tracking-[0.5em] uppercase">
          Professional Sports Booking Engine
        </p>
      </div>
    </div>
  );
};

export default Home;
