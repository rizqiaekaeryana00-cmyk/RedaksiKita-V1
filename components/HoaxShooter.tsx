
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trophy, Home, Heart, Users, User, Zap, Sparkles, Target, AlertCircle, CheckCircle2, Info, BookOpen, ShieldCheck, XCircle, MousePointer2, Swords } from 'lucide-react';
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
  const [scoreP2, setScoreP2] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [items, setItems] = useState<TargetItem[]>([]);
  const [feedback, setFeedback] = useState<{msg: string, type: 'BAD' | 'GOOD', p?: 'P1' | 'P2'} | null>(null);

  const requestRef = useRef<number>(null);
  const itemsRef = useRef<TargetItem[]>([]);
  const arenaRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ gameState, mode, level, scoreP1, scoreP2, hoaxPoolItems });

  useEffect(() => {
    stateRef.current = { gameState, mode, level, scoreP1, scoreP2, hoaxPoolItems };
  }, [gameState, mode, level, scoreP1, scoreP2, hoaxPoolItems]);

  const showFeedback = useCallback((msg: string, type: 'BAD' | 'GOOD', p?: 'P1' | 'P2') => {
    setFeedback({ msg, type, p });
    setTimeout(() => setFeedback(null), 1200);
  }, []);

  const spawnItem = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    
    const pool = stateRef.current.hoaxPoolItems.length > 0 
      ? stateRef.current.hoaxPoolItems 
      : [{ id: 'f', text: 'Berita Fakta Default', isHoax: false }];
    
    const randomSource = pool[Math.floor(Math.random() * pool.length)];
    const isMobile = window.innerWidth < 768;
    const baseSpeed = 0.2 + (stateRef.current.level * 0.12);

    // --- LOGIKA ANTI-TERPOTONG (SAFE SPAWNING) ---
    // Di HP, lebar kartu sekitar 70% layar. Jadi Center (X) harus di kisaran 35% - 65%.
    // Jika Versus, lebar kartu lebih kecil (setengah area), X dibatasi per zona.
    let safeX: number;
    if (stateRef.current.mode === 'SINGLE') {
      // Pusatkan kartu di tengah layar (Laptop/HP)
      const margin = isMobile ? 15 : 25; 
      safeX = (50 - (margin/2)) + Math.random() * margin; 
    } else {
      // Versus: Split Kiri (P1) dan Kanan (P2)
      const isLeft = Math.random() > 0.5;
      const zoneMargin = isMobile ? 10 : 15;
      if (isLeft) {
        safeX = 25 - (zoneMargin/2) + Math.random() * zoneMargin;
      } else {
        safeX = 75 - (zoneMargin/2) + Math.random() * zoneMargin;
      }
    }

    const newItem: TargetItem = {
      id: Math.random(),
      text: randomSource.text,
      type: randomSource.isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110, 
      speed: baseSpeed + (Math.random() * 0.1),
      rotation: (Math.random() - 0.5) * 4, // Kurangi rotasi agar teks tetap tegak
    };
    
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const updateLoop = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y - item.speed }))
      .filter(item => {
        if (item.y < -35 && !item.isStamped && item.type === 'HOAX' && stateRef.current.mode === 'SINGLE') {
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
      setScoreP1(0); setScoreP2(0); setLives(3); setTimeLeft(60); setLevel(1);
      requestRef.current = requestAnimationFrame(updateLoop);
      const spawnTimer = setInterval(spawnItem, level === 1 ? 2500 : 1800);
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

  const handleShoot = (id: number, clickX: number) => {
    if (gameState !== 'PLAYING') return;
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;

    let player: 'P1' | 'P2' = 'P1';
    if (mode === 'VERSUS') {
      player = (clickX - rect.left) < rect.width / 2 ? 'P1' : 'P2';
    }

    itemsRef.current = itemsRef.current.map(item => {
      if (item.id === id && !item.isStamped) {
        if (item.type === 'HOAX') {
          sounds.correct();
          if (player === 'P1') setScoreP1(s => s + 25); else setScoreP2(s => s + 25);
          showFeedback("HOAKS BLOKIR!", "GOOD", player);
          confetti({ particleCount: 20, spread: 40, origin: { x: item.x / 100, y: item.y / 100 }, colors: player === 'P1' ? ['#FF3D00'] : ['#00E5FF'] });
          return { ...item, isStamped: true, stampedBy: player };
        } else {
          sounds.wrong();
          if (mode === 'SINGLE') {
            setLives(l => { if (l <= 1) setGameState('GAMEOVER'); return l - 1; });
          } else {
            if (player === 'P1') setScoreP1(s => Math.max(0, s - 20)); else setScoreP2(s => Math.max(0, s - 20));
          }
          showFeedback("ITU FAKTA!", "BAD", player);
          return { ...item, isStamped: true, stampedBy: player };
        }
      }
      return item;
    });
    setItems([...itemsRef.current]);
  };

  // --- VIEWS ---

  if (gameState === 'START') {
    return (
      <div className="h-screen bg-[#00E5FF] flex items-center justify-center p-4 font-playful relative">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] bg-[length:24px_24px] opacity-10"></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 md:p-12 text-center rounded-[3rem] border-[6px] border-black shadow-[12px_12px_0px_#000] max-w-lg w-full z-10">
          <ShieldAlert className="w-16 h-16 md:w-20 md:h-20 text-[#FF3D00] mx-auto mb-6 rotate-6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-2 tracking-tighter leading-none">REDaksi <span className="text-[#FF3D00]">STRIKE</span></h1>
          <p className="text-xs font-bold text-slate-500 mb-8 uppercase italic tracking-widest leading-relaxed">Pilih mode tugasmu hari ini!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button onClick={() => { sounds.click(); setMode('SINGLE'); setGameState('TUTORIAL'); }} className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-col items-center hover:bg-slate-50 active:translate-y-1 active:shadow-none transition-all">
               <User className="w-10 h-10 mb-2 text-blue-600" />
               <span className="font-black text-xs uppercase">SOLO JURNALIS</span>
            </button>
            <button onClick={() => { sounds.click(); setMode('VERSUS'); setGameState('TUTORIAL'); }} className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-col items-center hover:bg-slate-50 active:translate-y-1 active:shadow-none transition-all">
               <Swords className="w-10 h-10 mb-2 text-[#FF3D00]" />
               <span className="font-black text-xs uppercase">DUEL REDAKSI</span>
            </button>
          </div>
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] hover:text-black">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'TUTORIAL') {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center p-4 font-playful">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 md:p-12 rounded-[3rem] border-[6px] border-black shadow-[12px_12px_0px_#000] max-w-2xl w-full">
          <div className="flex items-center space-x-4 mb-8 border-b-4 border-black pb-4">
             <BookOpen className="w-10 h-10 text-blue-600" />
             <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Panduan Misi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-2xl border-4 border-red-600 space-y-2">
               <Target className="w-8 h-8 text-red-600 mb-2" />
               <h3 className="font-black text-xs uppercase text-red-600">TARGET: HOAKS</h3>
               <p className="text-[11px] font-bold text-slate-700">Tembak/Klik kalimat yang tidak masuk akal atau bohong. <span className="text-red-600 font-black">+25 Poin!</span></p>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl border-4 border-green-600 space-y-2">
               <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
               <h3 className="font-black text-xs uppercase text-green-600">LINDUNGI: FAKTA</h3>
               <p className="text-[11px] font-bold text-slate-700">Biarkan kalimat nyata terbit ke atas. Jika diklik, <span className="text-red-600 font-black">Nyawa/Skor berkurang!</span></p>
            </div>
          </div>
          <button onClick={() => { sounds.success(); setGameState('PLAYING'); }} className="w-full py-5 bg-[#FF3D00] text-white border-4 border-black rounded-2xl font-black uppercase text-xl shadow-[8px_8px_0px_#000] hover:scale-102 transition-all">SAYA SIAP BERTUGAS!</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/90 flex items-center justify-center p-6 backdrop-blur-md z-[500] font-playful">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 text-center max-w-sm w-full border-8 border-black shadow-[16px_16px_0px_#FF3D00] rounded-[3.5rem]">
          <Trophy className="w-16 h-16 text-[#FFD600] mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase mb-8 italic tracking-tighter">HASIL REDAKSI</h2>
          <div className="space-y-4 mb-10">
             <div className="bg-slate-50 p-6 rounded-2xl border-4 border-black">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">SKOR AKHIR</p>
                <p className="text-5xl font-black text-[#FF3D00] italic leading-none">{mode === 'VERSUS' ? `${scoreP1} - ${scoreP2}` : scoreP1}</p>
             </div>
          </div>
          <button onClick={onBack} className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl border-4 border-white shadow-lg text-xs italic tracking-widest">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 md:p-4 flex flex-col items-center relative overflow-hidden select-none font-playful">
      {/* Header HUD - Tetap Terlihat & Responsif */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-3 bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] border-black shadow-[6px_6px_0px_#000] z-[100] mx-auto">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black">
          <Home className="mr-1 w-4 h-4"/> <span className="hidden sm:inline">LOBI</span>
        </button>
        
        <div className="flex items-center space-x-3 md:space-x-12">
          {mode === 'VERSUS' && (
            <div className="text-center">
               <p className="text-[7px] font-black text-red-500 uppercase italic">MERAH</p>
               <p className="text-xl md:text-2xl font-black italic leading-none">{scoreP1}</p>
            </div>
          )}
          <div className="text-center px-4 md:px-8 bg-slate-50 rounded-xl border-2 border-black/10 shadow-inner">
            <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">WAKTU</p>
            <p className={`font-black text-xl md:text-3xl leading-none italic ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>{timeLeft}s</p>
          </div>
          {mode === 'VERSUS' ? (
            <div className="text-center">
               <p className="text-[7px] font-black text-blue-500 uppercase italic">BIRU</p>
               <p className="text-xl md:text-2xl font-black italic leading-none">{scoreP2}</p>
            </div>
          ) : (
            <div className="text-center">
               <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">SKOR</p>
               <p className="font-black text-xl md:text-3xl text-[#FF3D00] italic leading-none">{scoreP1}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-1">
          {mode === 'SINGLE' && [...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-4 h-4 md:w-6 md:h-6 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
          ))}
          {mode === 'VERSUS' && <div className="text-[9px] font-black italic bg-black text-white px-3 py-1 rounded-full uppercase">DUEL</div>}
        </div>
      </div>

      {/* Arena - Dengan Sistem Safe Spawning yang Ditingkatkan */}
      <div ref={arenaRef} className="relative w-full max-w-5xl flex-1 bg-[#F1F5F9] rounded-[2rem] md:rounded-[3.5rem] border-[6px] border-black overflow-hidden shadow-[inset_0px_10px_30px_rgba(0,0,0,0.1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[length:32px_32px] opacity-[0.05]"></div>
        
        {/* Divider Versus */}
        {mode === 'VERSUS' && <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-black/20 border-x border-black/5 z-0"></div>}

        {/* Feedback Notif */}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ scale: 0.5, opacity: 0, y: 10 }} animate={{ scale: 1.2, opacity: 1, y: 0 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-[200] px-6">
               <div className={`text-4xl md:text-7xl font-black uppercase italic text-center drop-shadow-xl ${feedback.type === 'GOOD' ? 'text-green-600' : 'text-red-600'}`}>
                 {feedback.msg}
                 {feedback.p && <span className="block text-xs md:text-xl bg-black text-white px-4 py-1.5 rounded-full mt-3 mx-auto w-max italic border-2 border-white/20">{feedback.p === 'P1' ? 'TIM MERAH' : 'TIM BIRU'}</span>}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kartu Berita yang Dijamin Tidak Terpotong & Rapi */}
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
              onClick={(e) => handleShoot(item.id, e.clientX)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-[4px] md:border-[6px] border-black shadow-[8px_8px_0px_#000] bg-white w-[85%] max-w-[280px] md:max-w-[340px] min-h-[130px] md:min-h-[180px] flex flex-col items-center justify-center text-center transition-all overflow-hidden ${item.isStamped ? 'z-[100]' : 'z-20 hover:scale-[1.03] active:scale-95'}`}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-50 opacity-40"></div>
              
              {/* Kalimat Berita - Wrapping Otomatis & Terpusat */}
              <p className="text-[12px] md:text-[18px] font-black uppercase italic leading-tight text-black break-words whitespace-normal px-1">
                {item.text}
              </p>
              
              <div className="mt-5 w-1/4 h-1 bg-black/10 rounded-full"></div>

              {/* Stamp Visual Effect - Scaled to Card Size */}
              {item.isStamped && (
                <motion.div initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: -15 }} className={`absolute inset-0 flex flex-col items-center justify-center border-[12px] md:border-[16px] m-1.5 rounded-2xl font-black text-4xl md:text-6xl z-50 bg-white/95 uppercase italic tracking-tighter ${item.type === 'HOAX' ? (item.stampedBy === 'P1' ? 'border-red-600 text-red-600' : 'border-blue-600 text-blue-600') : 'border-red-600 text-red-600'}`}>
                  {item.type === 'HOAX' ? 'BLOKIR!' : 'SALAH!'}
                  <div className="text-[10px] bg-black text-white px-4 py-1 rounded-full mt-4 tracking-widest border-2 border-white/20 uppercase shadow-md">{item.stampedBy === 'P1' ? 'MERAH' : 'BIRU'}</div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Navigasi Bawah */}
      <div className="mt-3 w-full max-w-5xl px-2">
         <div className="bg-black text-white px-6 py-4 rounded-[2rem] text-[9px] md:text-xs font-black uppercase italic tracking-widest flex items-center shadow-xl border-4 border-white/10 justify-center text-center">
            <Zap className="w-4 h-4 mr-3 text-[#FFD600] shrink-0" />
            <span className="truncate">Klik Berita <span className="text-[#FF3D00]">HOAKS</span> — Lindungi Berita <span className="text-[#00E5FF]">FAKTA</span>!</span>
         </div>
      </div>
    </div>
  );
};

export default HoaxShooter;
