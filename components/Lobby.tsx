
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Layout, Gamepad2, ClipboardCheck, ArrowRight, Newspaper, PenTool, Info, Search, ShieldAlert, User, Tv, Radio, Mic2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FAFC] text-black p-4 md:p-8 flex flex-col relative overflow-hidden pb-32">
      {/* Dynamic Studio Particles - Subtle floating 3D elements */}
      <div className="absolute top-20 right-[15%] text-6xl animate-pulse pointer-events-none opacity-[0.05] rotate-12">🎙️</div>
      <div className="absolute top-40 left-[10%] text-7xl animate-bounce pointer-events-none opacity-[0.05] -rotate-12">📺</div>
      <div className="absolute bottom-60 right-[5%] text-8xl animate-pulse pointer-events-none opacity-[0.05]">📰</div>
      
      {/* Professional Studio Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3.5rem] border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-7xl mx-auto z-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-full bg-slate-50 border-l-2 border-black/5 flex items-center justify-center opacity-40">
           <Mic2 className="w-12 h-12 text-black/10 rotate-12" />
        </div>

        <div className="flex items-center space-x-6 mb-6 md:mb-0 w-full md:w-auto relative z-10">
          <div className="bg-[#FF3D00] p-3 md:p-5 rounded-2xl md:rounded-[2rem] border-4 border-black rotate-3 shadow-[4px_4px_0px_#000]">
            <Newspaper className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-5xl font-black text-black tracking-tighter uppercase italic leading-none">
              REDaksi <span className="text-[#FF3D00]">KITA</span>
            </h1>
            <div className="flex items-center text-[10px] md:text-xs font-black bg-[#FFD600] px-4 py-1.5 rounded-full border-2 border-black mt-2 shadow-sm italic">
              <Radio className="w-3 h-3 mr-2 blinking-dot text-red-600" /> ON-AIR STUDIO: {student.name.toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-4 md:space-x-8">
          <button 
            onClick={() => { sounds.click(); onNavigate('INFO'); }} 
            className="bg-slate-50 p-4 rounded-2xl border-4 border-black hover:bg-white transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
          >
            <Info className="w-6 h-6 md:w-8 md:h-8 text-black" />
          </button>
          <div className="flex flex-col items-center bg-slate-900 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl md:rounded-[2.5rem] border-4 border-black shadow-[6px_6px_0px_#FF3D00]">
            <span className="text-[8px] md:text-[10px] font-black text-[#FFD600] uppercase mb-1 tracking-widest">BROADCAST TIME</span>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 md:w-8 md:h-8 text-[#FFD600]" />
              <span className="font-black text-xl md:text-4xl tracking-tighter leading-none">{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid with Layered 3D Cards - BRIGHT COLORS RESTORED */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <MenuCard 
            title="Investigasi" 
            desc="Kumpulkan Bukti Valid" 
            icon={<Search className="w-8 h-8 md:w-12 md:h-12" />}
            color="bg-[#00E5FF]"
            accent="bg-[#00B8D4]"
            badge="PRIORITAS"
            onClick={() => onNavigate('INVESTIGATION')}
          />
          <MenuCard 
            title="Briefing" 
            desc="Materi Redaktur Senior" 
            icon={<Tv className="w-8 h-8 md:w-12 md:h-12" />}
            color="bg-[#FFD600]"
            accent="bg-[#FFAB00]"
            badge="EDUKASI"
            onClick={() => onNavigate('BRIEFING')}
          />
          <MenuCard 
            title="Arena" 
            desc="Susun Struktur Berita" 
            icon={<Gamepad2 className="w-8 h-8 md:w-12 md:h-12" />}
            color="bg-[#FF3D00]"
            accent="bg-[#D50000]"
            badge="MINIGAME"
            onClick={() => onNavigate('ARENA')}
          />
          <MenuCard 
            title="Evaluasi" 
            desc="Uji Kompetensi Pers" 
            icon={<ClipboardCheck className="w-8 h-8 md:w-12 md:h-12" />}
            color="bg-[#4CAF50]"
            accent="bg-[#2E7D32]"
            badge="UJI NYALI"
            onClick={() => onNavigate('EVALUATION')}
          />
          <MenuCard 
            title="Hoax Shot" 
            desc="Basmi Berita Palsu" 
            icon={<ShieldAlert className="w-8 h-8 md:w-12 md:h-12" />}
            color="bg-[#A855F7]"
            accent="bg-[#7E22CE]"
            badge="ARKADE"
            onClick={() => onNavigate('HOAX_SHOOTER')}
          />
        </div>

        {/* Writing Desk - High Priority CTA with 3D Pop Effect */}
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { sounds.click(); onNavigate('WRITING_DESK'); }}
          className="bg-black p-1 md:p-2 rounded-[3rem] md:rounded-[4.5rem] border-4 border-black shadow-[12px_12px_0px_#FF3D00] flex flex-col group min-h-[300px] lg:min-h-full transition-all"
        >
          <div className="bg-[#1a1a1a] flex-1 rounded-[2.5rem] md:rounded-[4rem] border-2 border-white/10 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#333_1px,transparent_1px)] bg-[length:20px_20px] opacity-10"></div>
            
            <div className="relative z-10 w-20 h-20 md:w-32 md:h-32 bg-[#FF3D00] rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center border-4 border-white group-hover:rotate-12 transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.2)]">
               <PenTool className="w-10 h-10 md:w-16 md:h-16 text-white" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-2 leading-none italic tracking-tighter">Meja Tulis</h2>
              <p className="text-[#FFD600] font-black text-[10px] md:text-xs mb-8 uppercase tracking-[0.3em]">PUBLIKASI KARYA PERS</p>
              
              <div className="inline-flex items-center px-8 md:px-12 py-4 md:py-6 bg-white text-black rounded-[1.5rem] md:rounded-3xl font-black uppercase text-xs md:text-base border-4 border-black shadow-[4px_4px_0px_#FFD600] group-hover:bg-[#FFD600] group-hover:shadow-[4px_4px_0px_#FFF] transition-all">
                MULAI MENULIS <ArrowRight className="w-5 h-5 md:w-7 md:h-7 ml-3" />
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Broadcast News Ticker */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1E293B] text-white py-4 md:py-6 border-t-[6px] border-[#FF3D00] z-[100] shadow-[0px_-10px_30px_rgba(0,0,0,0.3)]">
         <div className="news-ticker">
            <span className="mx-12 font-black text-xs md:text-xl uppercase italic tracking-tighter flex items-center">
              <span className="bg-[#FF3D00] px-3 py-1 rounded mr-4 text-white">BREAKING NEWS</span>
              SELAMAT BEKERJA, {student.name.toUpperCase()}! • SMP NEGERI 3 BONANG: STUDI BANDING JURNALISTIK TERPADU • PASTIKAN SETIAP KATA MENGANDUNG FAKTA • JANGAN PERNAH MENYERAH PADA HOAKS • SALAM LITERASI!
            </span>
         </div>
      </div>
    </div>
  );
};

const MenuCard = ({ title, desc, icon, color, accent, onClick, badge }: any) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -8 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => { sounds.click(); onClick(); }}
    className={`relative group ${color} p-1 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-black text-left shadow-[8px_8px_0px_#000] overflow-hidden active:shadow-none active:translate-y-2 h-full min-h-[180px] md:min-h-[220px] transition-all`}
  >
    {/* High-visibility contrast layer */}
    <div className={`absolute inset-0 ${accent} opacity-30 transform -skew-x-12 translate-x-1/2`}></div>
    
    <div className="bg-white/95 rounded-[2.2rem] md:rounded-[3.2rem] p-6 md:p-8 h-full flex flex-col justify-between relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-4 border-black shadow-[4px_4px_0px_#000] group-hover:rotate-12 transition-transform bg-white`}>
          {icon}
        </div>
        <div className="bg-black text-white px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-md">
          {badge}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl md:text-3xl font-black mb-1 uppercase tracking-tighter text-black leading-none italic">{title}</h3>
        <p className="font-bold text-slate-600 text-[10px] md:text-sm leading-tight mb-4">{desc}</p>
        <div className="bg-black text-white p-2 md:p-3 rounded-xl inline-flex items-center shadow-[3px_3px_0px_#FF3D00] group-hover:shadow-none transition-all">
           <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
        </div>
      </div>
    </div>
  </motion.button>
);

export default Lobby;
