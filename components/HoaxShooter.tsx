
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trophy, Home, Heart, Users, User, Zap, Sparkles, Target, AlertCircle, CheckCircle2, Info, BookOpen, ShieldCheck, XCircle, MousePointer2 } from 'lucide-react';
import { sounds } from '../services/audio';
import { HoaxPoolItem } from '../types';
import confetti from 'canvas-confetti';

interface TargetItem {
  id: number;
  text: string;
  type: 'HOAX' | 'FACT';
  x: number;
  y: number;
  speed: number;
  rotation: number;
  isStamped?: boolean;
  stampedBy?: 'P1' | 'P2';
}

interface HoaxShooterProps {
  onBack: () => void;
  hoaxPoolItems: HoaxPoolItem[];
}

const HoaxShooter: React.FC<HoaxShooterProps> = ({ onBack, hoaxPoolItems }) => {
  const [gameState, setGameState] = useState<'START' | 'TUTORIAL' | 'PLAYING' | 'GAMEOVER'>('START');
  const [mode, setMode] = useState<'SINGLE' | 'VERSUS'>('SINGLE');
  const [level, setLevel] = useState(1);
  const [scoreP1, setScoreP1] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [items, setItems] = useState<TargetItem[]>([]);
  const [feedback, setFeedback] = useState<{msg: string, type: 'BAD' | 'GOOD'} | null>(null);

  const requestRef = useRef<number>(null);
  const itemsRef = useRef<TargetItem[]>([]);
  const arenaRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ gameState, level, scoreP1, hoaxPoolItems });

  useEffect(() => {
    stateRef.current = { gameState, level, scoreP1, hoaxPoolItems };
  }, [gameState, level, scoreP1, hoaxPoolItems]);

  const showFeedback = useCallback((msg: string, type: 'BAD' | 'GOOD') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 1000);
  }, []);

  const spawnItem = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    
    const pool = stateRef.current.hoaxPoolItems.length > 0 ? stateRef.current.hoaxPoolItems : [{ id: 'f', text: 'Berita Fakta Default', isHoax: false }];
    const randomSource = pool[Math.floor(Math.random() * pool.length)];
    
    // Perhitungan Area Aman (Safe Zone)
    const isMobile = window.innerWidth < 768;
    // Di HP, paksa sangat ke tengah (45-55%), di PC lebih luas (25-75%)
    const minX = isMobile ? 42 : 25;
    const maxX = isMobile ? 58 : 75;
    const safeX = minX + Math.random() * (maxX - minX);

    const newItem: TargetItem = {
      id: Math.random(),
      text: randomSource.text,
      type: randomSource.isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110, 
      speed: 0.25 + (stateRef.current.level * 0.15) + (Math.random() * 0.1),
      rotation: (Math.random() - 0.5) * 6,
    };
    
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const updateLoop = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y - item.speed }))
      .filter(item => {
        // Penalti jika Hoax Lolos
        if (item.y < -35 && !item.isStamped && item.type === 'HOAX') {
          setScoreP1(s => Math.max(0, s - 10));
          showFeedback("HOAKS LOLOS!", "BAD");
        }
        return item.y > -45;
      });

    setItems([...itemsRef.current]);
    requestRef.current = requestAnimationFrame(updateLoop);
  }, [showFeedback]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      itemsRef.current = [];
      setScoreP1(0);
      setLives(3);
      setTimeLeft(60);
      setLevel(1);
      requestRef.current = requestAnimationFrame(updateLoop);
      const spawnTimer = setInterval(spawnItem, level === 1 ? 2800 : 2000);
      const clockTimer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { setGameState('GAMEOVER'); return 0; }
          if (t === 41) setLevel(2);
          if (t === 21) setLevel(3);
          return t - 1;
        });
      }, 1000);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        clearInterval(spawnTimer);
        clearInterval(clockTimer);
      };
    }
  }, [gameState, updateLoop, spawnItem, level]);

  const handleShoot = (id: number) => {
    if (gameState !== 'PLAYING') return;
    itemsRef.current = itemsRef.current.map(item => {
      if (item.id === id && !item.isStamped) {
        if (item.type === 'HOAX') {
          sounds.correct();
          setScoreP1(s => s + 25);
          showFeedback("HOAKS DIBLOKIR!", "GOOD");
          confetti({ particleCount: 15, spread: 40, origin: { x: item.x / 100, y: item.y / 100 } });
          return { ...item, isStamped: true };
        } else {
          sounds.wrong();
          setLives(l => { if (l <= 1) setGameState('GAMEOVER'); return l - 1; });
          showFeedback("ITU FAKTA!", "BAD");
          return { ...item, isStamped: true };
        }
      }
      return item;
    });
    setItems([...itemsRef.current]);
  };

  // --- RENDERING VIEWS ---

  if (gameState === 'START') {
    return (
      <div className="h-screen bg-[#00E5FF] flex items-center justify-center p-4 font-playful relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] bg-[length:24px_24px] opacity-10"></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 md:p-12 text-center rounded-[3rem] border-[6px] border-black shadow-[12px_12px_0px_#000] max-w-sm md:max-w-lg w-full z-10">
          <div className="bg-[#FF3D00] w-20 h-20 rounded-3xl border-4 border-black mx-auto flex items-center justify-center rotate-6 mb-8 shadow-xl">
             <ShieldAlert className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-4 tracking-tighter leading-none">REDaksi <span className="text-[#FF3D00]">STRIKE</span></h1>
          <p className="text-xs font-bold text-slate-500 mb-10 uppercase italic tracking-widest leading-relaxed">Uji ketajaman matamu membedakan fakta dan hoaks dalam waktu terbatas!</p>
          <button onClick={() => { sounds.click(); setGameState('TUTORIAL'); }} className="w-full py-5 bg-[#FFD600] text-black border-4 border-black rounded-2xl font-black uppercase text-lg shadow-[6px_6px_0px_#000] hover:scale-105 transition-all">PERSIAPAN MISI</button>
          <button onClick={onBack} className="mt-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'TUTORIAL') {
    return (
      <div className="h-screen bg-slate-100 flex items-center justify-center p-4 font-playful overflow-y-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 md:p-10 rounded-[2.5rem] border-[6px] border-black shadow-[12px_12px_0px_#000] max-w-2xl w-full">
          <div className="flex items-center space-x-4 mb-8 border-b-4 border-black pb-4">
             <BookOpen className="w-8 h-8 text-blue-600" />
             <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Panduan Jurnalis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-600 space-y-3">
               <div className="flex items-center space-x-2 text-red-600">
                  <Target className="w-6 h-6" />
                  <span className="font-black uppercase text-xs">Target Utama</span>
               </div>
               <p className="text-[11px] font-bold text-red-900 leading-relaxed">Tembak/Klik setiap kalimat <span className="underline">HOAKS</span> yang muncul. Ciri-cirinya: provokatif, tidak masuk akal, dan tanpa sumber data.</p>
            </div>
            <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-600 space-y-3">
               <div className="flex items-center space-x-2 text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="font-black uppercase text-xs">Wajib Dilindungi</span>
               </div>
               <p className="text-[11px] font-bold text-green-900 leading-relaxed">Biarkan kalimat <span className="underline">FAKTA</span> terbit ke atas. Jangan diklik! Jika diklik, Nyawa (Hati) kamu akan berkurang.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-black border-dashed mb-10 flex items-center space-x-4">
             <div className="bg-black p-3 rounded-full text-white">
                <MousePointer2 className="w-6 h-6 animate-bounce" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-black">Cara Bermain:</p>
                <p className="text-[11px] font-bold text-slate-600">Klik pada kartu berita untuk "Menembak". Gunakan mouse (PC) atau sentuhan jari (HP). Pastikan akurasi kamu tinggi!</p>
             </div>
          </div>

          <button onClick={() => { sounds.success(); setGameState('PLAYING'); }} className="w-full py-5 bg-[#FF3D00] text-white border-4 border-black rounded-2xl font-black uppercase text-xl shadow-[8px_8px_0px_#000] hover:scale-102 active:translate-y-1 transition-all">MULAI BERTUGAS!</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/90 flex items-center justify-center p-6 backdrop-blur-md z-[500] font-playful">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 text-center max-w-sm w-full border-8 border-black shadow-[16px_16px_0px_#FF3D00] rounded-[3.5rem]">
          <Trophy className="w-16 h-16 text-[#FFD600] mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4 italic">MISI SELESAI</h2>
          <div className="bg-slate-100 p-6 rounded-2xl border-4 border-black mb-8">
             <p className="text-5xl font-black text-[#FF3D00] italic">{scoreP1}</p>
             <p className="text-[10px] font-black text-slate-400 mt-2">SKOR REDAKSI</p>
          </div>
          <button onClick={onBack} className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl border-4 border-white shadow-lg text-sm tracking-widest italic">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 md:p-4 flex flex-col items-center relative overflow-hidden select-none font-playful">
      {/* Dynamic Header HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] border-black shadow-[6px_6px_0px_#000] z-[100] mx-auto">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black">
          <Home className="mr-1 w-4 h-4"/> <span className="hidden sm:inline">LOBI</span>
        </button>
        
        <div className="flex items-center space-x-4 md:space-x-10">
          <div className="text-center px-4 bg-slate-50 rounded-xl border-2 border-black/5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">WAKTU</p>
            <p className={`font-black text-xl md:text-3xl leading-none italic ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>{timeLeft}s</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SKOR</p>
            <p className="font-black text-xl md:text-3xl text-[#FF3D00] italic leading-none">{scoreP1}</p>
          </div>
        </div>

        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-4 h-4 md:w-6 md:h-6 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Main Game Arena - Safe Spawning Zone */}
      <div ref={arenaRef} className="relative w-full max-w-4xl flex-1 bg-[#F1F5F9] rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] border-black overflow-hidden shadow-[inset_0px_10px_30px_rgba(0,0,0,0.1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[length:32px_32px] opacity-[0.05]"></div>
        
        {/* Feedback Messages */}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ scale: 0.5, opacity: 0, y: 20 }} animate={{ scale: 1.2, opacity: 1, y: 0 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-[200] px-6">
               <div className={`text-4xl md:text-7xl font-black uppercase italic text-center drop-shadow-xl ${feedback.type === 'GOOD' ? 'text-green-600' : 'text-red-600'}`}>
                 {feedback.msg}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guaranteed Centered News Cards */}
        <AnimatePresence>
          {items.map(item => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                left: `${item.x}%`, 
                top: `${item.y}%`, 
                rotate: item.rotation
              }}
              exit={{ scale: item.isStamped ? 1.4 : 0, opacity: 0 }}
              onClick={() => handleShoot(item.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-5 md:p-8 rounded-[1.5rem] border-[4px] border-black shadow-[8px_8px_0px_#000] bg-white w-[clamp(240px,70vw,320px)] min-h-[120px] md:min-h-[160px] flex flex-col items-center justify-center text-center transition-all overflow-hidden ${item.isStamped ? 'z-[100]' : 'z-20 hover:scale-105 active:scale-95'}`}
            >
              {/* Card Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-50 opacity-40"></div>
              <div className="flex space-x-1 mb-4 opacity-10">
                 <div className="w-10 h-1 bg-black rounded-full"></div>
                 <div className="w-4 h-1 bg-black rounded-full"></div>
              </div>

              <p className="text-[12px] md:text-[17px] font-black uppercase italic leading-tight text-black break-words hyphens-auto text-center px-1">
                {item.text}
              </p>
              
              <div className="mt-4 w-1/4 h-1 bg-black/10 rounded-full"></div>

              {/* Stamp Visual Effect */}
              {item.isStamped && (
                <motion.div initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} className={`absolute inset-0 flex flex-col items-center justify-center border-[12px] m-1 rounded-2xl font-black text-4xl md:text-6xl z-50 bg-white/95 uppercase italic tracking-tighter ${item.type === 'HOAX' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'}`}>
                  {item.type === 'HOAX' ? 'BLOKIR!' : 'SALAH!'}
                  <div className="text-[10px] bg-black text-white px-3 py-1 rounded-full mt-3 tracking-widest border-2 border-white/20">VERIFIED</div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Responsive Footer Nav */}
      <div className="mt-4 w-full max-w-4xl px-2">
         <div className="bg-black text-white px-6 py-4 rounded-[2rem] text-[9px] md:text-xs font-black uppercase italic tracking-widest flex items-center shadow-xl border-4 border-white/10 justify-center text-center">
            <Zap className="w-4 h-4 mr-3 text-[#FFD600] shrink-0" />
            <span>Klik Berita <span className="text-[#FF3D00]">HOAKS</span> — Lindungi Berita <span className="text-[#00E5FF]">FAKTA</span>!</span>
         </div>
      </div>
      
      <style>{`
        .hyphens-auto { hyphens: auto; -webkit-hyphens: auto; }
      `}</style>
    </div>
  );
};

export default HoaxShooter;
