
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Layout, Gamepad2, ClipboardCheck, ArrowRight, Newspaper, PenTool, Info, Search, ShieldAlert, User } from 'lucide-react';
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
    <div className="min-h-screen bg-white text-black p-4 md:p-8 flex flex-col relative overflow-x-hidden pb-32">
      {/* Dekorasi Latar Belakang */}
      <div className="absolute top-20 right-10 text-6xl md:text-9xl animate-bounce pointer-events-none opacity-5">🎙️</div>
      <div className="absolute bottom-40 left-10 text-6xl md:text-9xl animate-pulse pointer-events-none opacity-5">🗞️</div>
      
      {/* Header Lobi Utama */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border-[3px] md:border-4 border-black shadow-[6px_6px_0px_#000] w-full max-w-7xl mx-auto z-10">
        <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
          <div className="bg-[#FF3D00] p-2 md:p-3 rounded-xl md:rounded-2xl border-2 md:border-4 border-black rotate-3 shadow-md">
            <Newspaper className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-black tracking-tighter uppercase italic leading-none">REDaksi <span className="text-[#FF3D00]">KITA</span></h1>
            <div className="flex items-center text-[10px] md:text-xs font-black bg-[#FFD600] px-3 py-1 rounded-lg border-2 border-black mt-1.5 shadow-sm">
              {/* Fix: Imported missing User icon from lucide-react */}
              <User className="w-3 h-3 mr-1.5" /> JURNALIS: {student.name.toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-3 md:space-x-6">
          <button onClick={() => { sounds.click(); onNavigate('INFO'); }} className="bg-slate-50 p-3 rounded-xl md:rounded-2xl border-2 border-black hover:bg-white transition-colors shadow-[2px_2px_0px_#000] active:translate-y-0.5">
            <Info className="w-5 h-5 md:w-7 md:h-7 text-black" />
          </button>
          <div className="flex items-center space-x-3 bg-black text-white px-5 md:px-7 py-2 md:py-3 rounded-xl md:rounded-2xl border-b-4 border-slate-700 shadow-lg">
            <Clock className="w-4 h-4 md:w-6 md:h-6 text-[#FFD600]" />
            <span className="font-black text-lg md:text-2xl tracking-tighter leading-none">{time}</span>
          </div>
        </div>
      </div>

      {/* Grid Menu Utama - Sangat Adaptif */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <MenuCard 
            title="Investigasi" 
            desc="Cari Fakta & Barang Bukti" 
            icon={<Search className="w-7 h-7 md:w-10 md:h-10" />}
            color="bg-[#00E5FF]"
            badge="MISI 1"
            onClick={() => onNavigate('INVESTIGATION')}
          />
          <MenuCard 
            title="Briefing" 
            desc="Materi Video & Jurnalistik" 
            icon={<Layout className="w-7 h-7 md:w-10 md:h-10" />}
            color="bg-[#FFD600]"
            badge="BELAJAR"
            onClick={() => onNavigate('BRIEFING')}
          />
          <MenuCard 
            title="Puzzle" 
            desc="Arena Susun Redaksi" 
            icon={<Gamepad2 className="w-7 h-7 md:w-10 md:h-10" />}
            color="bg-[#FF3D00]"
            badge="MINIGAME"
            onClick={() => onNavigate('ARENA')}
          />
          <MenuCard 
            title="Evaluasi" 
            desc="Uji Kompetensi Jurnalis" 
            icon={<ClipboardCheck className="w-7 h-7 md:w-10 md:h-10" />}
            color="bg-[#4CAF50]"
            badge="KUIS"
            onClick={() => onNavigate('EVALUATION')}
          />
          <MenuCard 
            title="Hoax Shot" 
            desc="Tembak Berita Palsu" 
            icon={<ShieldAlert className="w-7 h-7 md:w-10 md:h-10" />}
            color="bg-[#A855F7]"
            badge="ARKADE"
            onClick={() => onNavigate('HOAX_SHOOTER')}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { sounds.click(); onNavigate('WRITING_DESK'); }}
          className="bg-black text-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-[4px] border-white flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 relative overflow-hidden group min-h-[250px] lg:min-h-full shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-90"></div>
          <div className="relative z-10 w-16 h-16 md:w-24 md:h-24 bg-[#FF3D00] rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center border-4 border-white group-hover:rotate-12 transition-transform shadow-xl">
             <PenTool className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 leading-none italic tracking-tighter">Meja Tulis</h2>
            <p className="text-slate-400 font-black text-[10px] md:text-xs mb-6 uppercase tracking-[0.2em]">TERBITKAN KARYAMU</p>
            <div className="inline-flex items-center px-6 md:px-10 py-3 md:py-4 bg-white text-black rounded-2xl font-black uppercase text-xs md:text-sm group-hover:bg-[#FFD600] transition-colors">
              MULAI MENULIS <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer Ticker Fixed di Bawah */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white py-3 md:py-4 border-t-[4px] border-[#FF3D00] z-[100] shadow-2xl">
         <div className="news-ticker">
            <span className="mx-8 font-black text-xs md:text-base uppercase italic tracking-tight">
              🗞️ SELAMAT BEKERJA, {student.name.toUpperCase()}! • PASTIKAN BERITA 5W+1H AKURAT • HINDARI HOAKS DI LINGKUNGAN SEKOLAH • SALAM JURNALIS MUDA SMP NEGERI 3 BONANG! 📢
            </span>
         </div>
      </div>
    </div>
  );
};

const MenuCard = ({ title, desc, icon, color, onClick, badge }: any) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -5 }}
    onClick={() => { sounds.click(); onClick(); }}
    className={`relative group ${color} p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-[3px] md:border-4 border-black text-left shadow-[6px_6px_0px_#000] overflow-hidden active:shadow-none active:translate-y-1 h-full min-h-[160px] flex flex-col justify-end`}
  >
    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-xl text-[8px] md:text-[10px] font-black uppercase border border-white/20 shadow-md">{badge}</div>
    <div className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 border-2 md:border-4 border-black shadow-md group-hover:rotate-6 transition-transform">
      {icon}
    </div>
    <div>
      <h3 className="text-xl md:text-2xl font-black mb-1 uppercase tracking-tighter text-black leading-none">{title}</h3>
      <p className="font-bold text-black/70 text-[10px] md:text-sm leading-tight mb-4">{desc}</p>
      <div className="bg-black text-white p-1.5 md:p-2 rounded-xl inline-flex items-center shadow-md">
         <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
  </motion.button>
);

export default Lobby;
