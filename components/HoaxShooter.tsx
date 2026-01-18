
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Trophy, Home } from 'lucide-react';
import { sounds } from '../services/audio';

const HOAX_SENTENCES = [
  "Besok sekolah libur!", "Ada hadiah gratis!", "Klik link ini sekarang!", "Viral: Guru baru!", "Hoax: Banjir besar!"
];

const HoaxShooter = ({ onBack }: { onBack: () => void }) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<{ id: number, text: string, x: number, y: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const newItem = {
        id: Date.now(),
        text: HOAX_SENTENCES[Math.floor(Math.random() * HOAX_SENTENCES.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      };
      setItems(prev => [...prev, newItem].slice(-5));
    }, 1500);
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, [timeLeft]);

  const handleShoot = (id: number) => {
    sounds.correct();
    setScore(s => s + 10);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  if (timeLeft <= 0) {
    return (
      <div className="min-h-screen bg-[#FF3D00] flex items-center justify-center p-6">
        <div className="glass-card bg-white p-12 text-center max-w-md w-full border-4 border-black shadow-[16px_16px_0px_#000] rounded-[3rem]">
          <Trophy className="w-24 h-24 mx-auto text-[#FFD600] mb-6 drop-shadow-md" />
          <h2 className="text-4xl font-black uppercase text-black mb-4 italic tracking-tighter">REDaksi SELESAI!</h2>
          <p className="text-2xl font-black mb-8 text-slate-700">Skor Akhir: <span className="text-[#FF3D00]">{score}</span></p>
          <button onClick={onBack} className="btn-primary w-full py-5 text-white font-black uppercase rounded-2xl shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none border-4 border-black transition-all">Kembali ke Lobi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00E5FF] p-6 flex flex-col items-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-white/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] relative z-10">
        <button onClick={onBack} className="flex items-center font-black uppercase text-xs text-black hover:text-[#FF3D00] transition-colors"><Home className="mr-2 w-4 h-4"/> Lobi</button>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-500">Waktu</span>
            <span className="font-black text-3xl text-black">{timeLeft}s</span>
          </div>
          <div className="w-1 h-10 bg-black/10 rounded-full"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-500">Skor</span>
            <span className="font-black text-3xl text-[#FF3D00]">{score}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-4xl h-[65vh] bg-white/30 rounded-[3rem] border-8 border-black overflow-hidden shadow-2xl backdrop-blur-sm">
        <AnimatePresence>
          {items.map(item => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
              onClick={() => handleShoot(item.id)}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute bg-[#FF3D00] text-white px-6 py-4 rounded-[2rem] border-4 border-black shadow-[4px_4px_0px_#000] flex items-center space-x-3 font-black uppercase italic text-sm active:scale-90 active:shadow-none transition-all group"
            >
              <div className="bg-white p-1 rounded-lg border-2 border-black group-hover:rotate-12 transition-transform">
                <ShieldAlert className="w-5 h-5 text-[#FF3D00]" />
              </div>
              <span className="drop-shadow-sm">{item.text}</span>
            </motion.button>
          ))}
        </AnimatePresence>
        
        {/* Aim Sight Decorative Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <Crosshair className="w-96 h-96 text-black" />
        </div>
      </div>
      
      <div className="mt-8 bg-white px-8 py-3 rounded-2xl border-4 border-black shadow-lg relative z-10">
        <p className="text-black font-black uppercase text-sm animate-pulse flex items-center">
          <Crosshair className="mr-2 w-5 h-5" /> Tembak gelembung HOAKS secepatnya!
        </p>
      </div>
    </div>
  );
};

export default HoaxShooter;
