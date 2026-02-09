import React from "react";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  User,
  Hash,
  MessageSquare,
  Send,
} from "lucide-react";

const BookingModal = ({
  isOpen,
  onClose,
  onSubmit,
  turf,
  slot,
  selectedDate,
}) => {
  if (!isOpen || !turf) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Pass data to parent handler
    onSubmit({
      ...data,
      turfId: turf.id,
      slot,
      selectedDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Turf Details */}
        <div className="md:w-1/2 relative overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative h-64 md:h-80">
            <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-full object-cover grayscale-[0.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute top-6 left-6 bg-lime-400 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase italic shadow-[0_0_20px_rgba(163,230,53,0.4)]">
              ৳{turf.rent} /hr
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-lime-400 mb-2">
                <Hash size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {turf.id}
                </span>
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                {turf.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin size={20} className="text-lime-400 shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {turf.city}
                  </p>
                  <p className="text-sm font-medium">{turf.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-400">
                <User size={20} className="text-lime-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Owner
                  </p>
                  <p className="text-sm font-medium">{turf.ownerName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-400">
                <Clock size={20} className="text-lime-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Target Slot
                  </p>
                  <p className="text-sm font-black text-lime-400 uppercase tracking-tighter italic">
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString()
                      : "Any Date"}{" "}
                    // {slot || "Any Slot"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase tracking-widest text-white italic">
              Booking <span className="text-lime-400">Request</span>
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Full Name *
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder="Commander Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime-400/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                  Phone *
                </label>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="+880"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime-400/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@nexus.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime-400/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="Sector / Area"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime-400/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center">
                <MessageSquare size={10} className="mr-1" /> Tactical Note
              </label>
              <textarea
                name="note"
                rows="3"
                placeholder="Any special requirements..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="group relative w-full py-4 mt-4 overflow-hidden rounded-xl border border-lime-400/30 bg-lime-400 text-black font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] transition-all"
            >
              <div className="relative flex items-center justify-center space-x-2">
                <span>Continue to Payment</span>
                <Send size={16} />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
