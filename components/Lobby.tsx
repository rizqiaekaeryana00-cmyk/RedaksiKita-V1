
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
    <div className="min-h-screen bg-white text-black p-3 md:p-6 flex flex-col relative overflow-x-hidden pb-16">
      <div className="absolute top-20 right-10 text-6xl md:text-8xl animate-bounce pointer-events-none opacity-5">🎙️</div>
      
      {/* Header Lobi */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_#000] w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-3 md:mb-0 w-full md:w-auto">
          <div className="bg-[#FF3D00] p-1.5 md:p-2 rounded-xl border-2 border-black rotate-3">
            <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black text-black tracking-tighter uppercase italic leading-none">REDaksi <span className="text-[#FF3D00]">KITA</span></h1>
            <div className="flex items-center text-[8px] md:text-[10px] font-black bg-[#FFD600] px-2 py-0.5 rounded-lg border-2 border-black mt-1">
              JURNALIS: {student.name.toUpperCase()} 🖋️
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-3 md:space-x-4">
          <button onClick={() => { sounds.click(); onNavigate('INFO'); }} className="bg-slate-50 p-2 rounded-xl border-2 border-black hover:bg-white transition-colors">
            <Info className="w-4 h-4 md:w-5 md:h-5 text-black" />
          </button>
          <div className="flex items-center space-x-2 bg-black text-white px-3 md:px-4 py-1.5 rounded-xl border-b-2 border-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#FFD600]" />
            <span className="font-black text-sm md:text-lg mono leading-none">{time}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 h-fit">
          <MenuCard 
            title="Investigasi" 
            desc="Cari Fakta Kasus" 
            icon={<Search className="w-6 h-6 md:w-8 md:h-8" />}
            color="bg-[#00E5FF]"
            badge="MISI 1"
            onClick={() => onNavigate('INVESTIGATION')}
          />
          <MenuCard 
            title="Briefing" 
            desc="Materi Video" 
            icon={<Layout className="w-6 h-6 md:w-8 md:h-8" />}
            color="bg-[#FFD600]"
            badge="BELAJAR"
            onClick={() => onNavigate('BRIEFING')}
          />
          <MenuCard 
            title="Puzzle" 
            desc="Arena Redaksi" 
            icon={<Gamepad2 className="w-6 h-6 md:w-8 md:h-8" />}
            color="bg-[#FF3D00]"
            badge="MINIGAME"
            onClick={() => onNavigate('ARENA')}
          />
          <MenuCard 
            title="Evaluasi" 
            desc="Uji Jurnalis" 
            icon={<ClipboardCheck className="w-6 h-6 md:w-8 md:h-8" />}
            color="bg-[#4CAF50]"
            badge="KUIS"
            onClick={() => onNavigate('EVALUATION')}
          />
          <MenuCard 
            title="Hoax" 
            desc="Tembak Hoaks" 
            icon={<ShieldAlert className="w-6 h-6 md:w-8 md:h-8" />}
            color="bg-[#A855F7]"
            badge="ARKADE"
            onClick={() => onNavigate('HOAX_SHOOTER')}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { sounds.click(); onNavigate('WRITING_DESK'); }}
          className="bg-black text-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-[3px] border-white flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group min-h-[200px] lg:h-full shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 to-black opacity-90"></div>
          <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-[#FF3D00] rounded-2xl flex items-center justify-center border-2 border-white group-hover:rotate-6 transition-transform">
             <PenTool className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-black uppercase mb-1 leading-none italic">Meja Tulis</h2>
            <p className="text-slate-400 font-black text-[9px] md:text-[10px] mb-4 uppercase tracking-widest">KARYA JURNALIS</p>
            <div className="inline-flex items-center px-4 py-2 bg-white text-black rounded-xl font-black uppercase text-[10px]">
              MULAI MENULIS <ArrowRight className="w-3 h-3 ml-1.5" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer Ticker */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white py-2.5 border-t-[3px] border-[#FF3D00] z-50">
         <div className="news-ticker">
            <span className="mx-6 font-black text-[10px] md:text-xs uppercase italic tracking-tight">
              📢 SELAMAT DATANG {student.name.toUpperCase()}! • WASPADA BERITA HOAKS • SUSUN 5W+1H DENGAN BENAR • TETAP FAKTUAL DAN OBJEKTIF!
            </span>
         </div>
      </div>
    </div>
  );
};

const MenuCard = ({ title, desc, icon, color, onClick, badge }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    onClick={() => { sounds.click(); onClick(); }}
    className={`relative group ${color} p-4 md:p-5 rounded-2xl md:rounded-[2rem] border-[3px] border-black text-left shadow-[4px_4px_0px_#000] overflow-hidden active:shadow-none active:translate-y-1 h-fit min-h-[140px]`}
  >
    <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 rounded-md text-[7px] md:text-[8px] font-black uppercase">{badge}</div>
    <div className="bg-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 border-2 border-black shadow-sm group-hover:scale-105 transition-transform">
      {icon}
    </div>
    <h3 className="text-base md:text-lg font-black mb-0.5 uppercase tracking-tighter text-black leading-none">{title}</h3>
    <p className="font-bold text-black/60 mb-3 text-[9px] md:text-[10px] leading-tight">{desc}</p>
    <div className="bg-black text-white p-1 rounded-md inline-flex items-center">
       <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
    </div>
  </motion.button>
);

export default Lobby;
