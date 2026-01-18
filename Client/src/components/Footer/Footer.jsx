import React from 'react';

function Footer() {
  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* LARGE BACKGROUND TEXT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[15vw] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter italic leading-none">
        CHAMPIONS
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND COLUMN */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase mb-6">
              TURF <span className="text-lime-400">KING</span>
            </h2>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed uppercase tracking-wider">
              The ultimate deployment platform for street footballers and professional athletes. High-spec turfs, zero friction booking.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-lime-400 uppercase tracking-[0.3em]">Navigation</h4>
            <ul className="space-y-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <li className="hover:text-white cursor-pointer transition-colors">Tactical Home</li>
              <li className="hover:text-white cursor-pointer transition-colors">About Ops</li>
              <li className="hover:text-white cursor-pointer transition-colors">Booking History</li>
            </ul>
          </div>

          {/* SYSTEM STATUS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-lime-400 uppercase tracking-[0.3em]">System Status</h4>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase">All Systems Nominal</span>
                </div>
                <p className="text-[9px] text-gray-500 leading-tight font-mono uppercase tracking-tighter">
                    V4.0.2 // Latency: 12ms <br/>
                    Servers: Dhaka Central / Sylhet / Rajshahi
                </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:row justify-between items-center border-t border-white/5 pt-8 space-y-4 md:space-y-0 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-600">
          <p>© 2026 Turf King Deployment Corp</p>
          <div className="flex space-x-8">
            <span className="hover:text-white cursor-pointer">Security Protocol</span>
            <span className="hover:text-white cursor-pointer">Privacy Encrypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;