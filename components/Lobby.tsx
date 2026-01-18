
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Layout, Gamepad2, ClipboardCheck, ArrowRight, Newspaper, PenTool, Info, Search, ShieldAlert } from 'lucide-react';
import { AppView, Student } from '../types';
import { sounds } from '../services/audio';

interface LobbyProps {
  student: Student;
  onNavigate: (view: AppView) => void;
}

const Lobby: React.FC<LobbyProps> = ({ student, onNavigate }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full bg-white text-black p-4 md:p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-10 right-10 text-7xl animate-bounce pointer-events-none opacity-10">👨‍💼</div>
      
      {/* Header Lobi - More Compact */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 glass-card p-4 rounded-3xl bg-white shadow-[6px_6px_0px_#000]">
        <div className="flex items-center space-x-3 mb-2 md:mb-0">
          <div className="bg-[#FF3D00] p-2 rounded-xl border-2 border-black rotate-3">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-black-bold tracking-tighter italic leading-none">REDaksi <span className="text-[#FF3D00]">KITA</span></h1>
            <div className="flex items-center text-[10px] font-black bg-[#FFD600] px-2 py-0.5 rounded-lg border-2 border-black mt-1">
              <span className="mr-1 text-black">JURNALIS:</span> {student.name.toUpperCase()} 🎙️
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={() => { sounds.click(); onNavigate('INFO'); }} className="flex flex-col items-center hover:text-[#FF3D00] transition-colors text-black group">
            <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase">Info</span>
          </button>
          <div className="h-8 w-0.5 bg-black/10 rounded-full"></div>
          <div className="flex items-center space-x-2 bg-black text-white px-4 py-1.5 rounded-xl border-b-2 border-slate-700 shadow-md">
            <Clock className="w-4 h-4 text-[#FFD600]" />
            <span className="font-black text-lg mono leading-none">{time}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Grid - Responsive and Compact */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 mb-16 min-h-0 overflow-hidden">
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 custom-scrollbar">
          <MenuCard 
            title="Investigasi" 
            desc="Cari Fakta Kasus" 
            icon={<Search className="w-8 h-8 text-black" />}
            color="bg-[#00E5FF]"
            badge="PBL 1"
            onClick={() => onNavigate('INVESTIGATION')}
          />
          <MenuCard 
            title="Briefing" 
            desc="Materi Video" 
            icon={<Layout className="w-8 h-8 text-black" />}
            color="bg-[#FFD600]"
            badge="MATERI"
            onClick={() => onNavigate('BRIEFING')}
          />
          <MenuCard 
            title="Puzzle" 
            desc="Arena Redaksi" 
            icon={<Gamepad2 className="w-8 h-8 text-black" />}
            color="bg-[#FF3D00]"
            badge="LEVEL"
            onClick={() => onNavigate('ARENA')}
          />
          <MenuCard 
            title="Evaluasi" 
            desc="Uji Kemampuan" 
            icon={<ClipboardCheck className="w-8 h-8 text-black" />}
            color="bg-[#4CAF50]"
            badge="KUIS"
            onClick={() => onNavigate('EVALUATION')}
          />
          <MenuCard 
            title="Hoax" 
            desc="Tembak Hoaks" 
            icon={<ShieldAlert className="w-8 h-8 text-black" />}
            color="bg-[#A855F7]"
            badge="GAME"
            onClick={() => onNavigate('HOAX_SHOOTER')}
          />
        </div>

        {/* Writing Desk Button - Adjusted Size */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { sounds.click(); onNavigate('WRITING_DESK'); }}
          onMouseEnter={sounds.hover}
          className="bg-black text-white p-6 rounded-[2.5rem] border-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group h-full"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-black opacity-50"></div>
          <div className="relative z-10 w-16 h-16 bg-[#FF3D00] rounded-2xl flex items-center justify-center border-2 border-white group-hover:rotate-12 transition-transform shadow-lg">
             <PenTool className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase mb-1 leading-tight tracking-tighter italic">Meja Tulis</h2>
            <p className="text-slate-400 font-black text-[10px] mb-4 uppercase tracking-widest">Ayo Berkarya!</p>
            <div className="inline-flex items-center px-4 py-2 bg-white text-black rounded-xl font-black uppercase text-[10px] hover:bg-[#FFD600] transition-colors">
              Mulai <ArrowRight className="w-3 h-3 ml-1.5" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer Ticker - Slimmer */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white py-3 border-t-2 border-[#FF3D00] z-50">
         <div className="news-ticker inline-block">
            <span className="mx-8 font-black text-sm uppercase italic tracking-tight">📢 SELAMAT DATANG JURNALIS MUDA {student.name.toUpperCase()}! • WASPADA HOAKS DI MEDIA SOSIAL • SUSUN 5W+1H DENGAN TELITI • REDAKSI MENUNGGU KARYA TERBAIKMU!</span>
         </div>
      </div>

      <div className="fixed bottom-12 right-6 text-[8px] font-black text-black opacity-30">
        © 2026 REDaksi KITA - Rizqia Eka Eryana
      </div>
    </div>
  );
};

const MenuCard = ({ title, desc, icon, color, onClick, badge }: any) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    onMouseEnter={sounds.hover}
    onClick={() => { sounds.click(); onClick(); }}
    className={`relative group ${color} p-5 rounded-[2rem] border-4 border-black text-left shadow-[6px_6px_0px_#000] overflow-hidden active:shadow-none active:translate-y-1 h-full min-h-[140px]`}
  >
    <div className="absolute top-3 right-3 bg-black text-white px-2 py-0.5 rounded-lg text-[8px] font-black">{badge}</div>
    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border-2 border-black shadow-md group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-0.5 uppercase tracking-tighter text-black leading-none">{title}</h3>
    <p className="font-bold text-black/60 mb-3 text-[10px] leading-tight">{desc}</p>
    <div className="bg-black text-white p-1.5 rounded-lg inline-flex items-center justify-center group-hover:bg-slate-800 transition-colors">
       <ArrowRight className="w-4 h-4" />
    </div>
  </motion.button>
);

export default Lobby;
