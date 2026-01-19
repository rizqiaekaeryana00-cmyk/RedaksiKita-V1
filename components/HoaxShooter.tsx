
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trophy, Home, Heart, Users, User, Zap, Sparkles, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
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
  glitch?: boolean;
}

interface HoaxShooterProps {
  onBack: () => void;
  hoaxPoolItems: HoaxPoolItem[];
}

const HoaxShooter: React.FC<HoaxShooterProps> = ({ onBack, hoaxPoolItems }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
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
      : [{ id: 'fallback', text: 'Tunggu data...', isHoax: false }];

    const randomSource = pool[Math.floor(Math.random() * pool.length)];
    const baseSpeed = 0.25 + (stateRef.current.level * 0.15);
    
    /**
     * ULTRA SAFE CENTER ZONE:
     * Untuk HP Portrait, lebar kartu adalah ~260px. Layar HP rata-rata 360px-400px.
     * Jika X di pinggir (misal 20%), maka 20% dari 360 = 72px. Center di 72px, lebar 260px -> kiri terpotong -58px.
     * MAKA: Kita paksa kartu muncul HANYA di area tengah (45% s/d 55% untuk HP, atau 30% s/d 70% untuk PC).
     */
    const isMobile = window.innerWidth < 768;
    const range = isMobile ? { min: 48, max: 52 } : { min: 30, max: 70 };
    const safeX = range.min + Math.random() * (range.max - range.min);

    const newItem: TargetItem = {
      id: Math.random(),
      text: randomSource.text,
      type: randomSource.isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110, 
      speed: baseSpeed + (Math.random() * 0.15),
      rotation: (Math.random() - 0.5) * 8, // Kurangi rotasi agar teks lebih mudah dibaca
      glitch: stateRef.current.level >= 2 && Math.random() > 0.8
    };
    
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const updateLoop = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y - item.speed }))
      .filter(item => {
        if (item.y < -30 && !item.isStamped && item.type === 'HOAX' && stateRef.current.mode === 'SINGLE') {
          setScoreP1(s => Math.max(0, s - 10));
          showFeedback("HOAKS LOLOS!", "BAD");
        }
        return item.y > -40;
      });

    setItems([...itemsRef.current]);
    requestRef.current = requestAnimationFrame(updateLoop);
  }, [showFeedback]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      itemsRef.current = [];
      setScoreP1(0);
      setScoreP2(0);
      setLives(3);
      setTimeLeft(60);
      setLevel(1);

      requestRef.current = requestAnimationFrame(updateLoop);
      const spawnTimer = setInterval(spawnItem, level === 1 ? 3000 : 2200);
      
      const clockTimer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            return 0;
          }
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

  const handleShoot = (id: number, player: 'P1' | 'P2') => {
    if (gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current.map(item => {
      if (item.id === id && !item.isStamped) {
        if (item.type === 'HOAX') {
          sounds.correct();
          if (player === 'P1') setScoreP1(s => s + 25);
          else setScoreP2(s => s + 25);
          showFeedback("HOAKS BLOKIR!", "GOOD", player);
          
          confetti({
            particleCount: 15,
            spread: 40,
            origin: { x: item.x / 100, y: item.y / 100 },
            colors: ['#FF3D00', '#FFD600']
          });

          return { ...item, isStamped: true, stampedBy: player };
        } else {
          sounds.wrong();
          if (mode === 'SINGLE') {
            setLives(l => {
              if (l <= 1) setGameState('GAMEOVER');
              return l - 1;
            });
          } else {
            if (player === 'P1') setScoreP1(s => Math.max(0, s - 20));
            else setScoreP2(s => Math.max(0, s - 20));
          }
          showFeedback("FAKTA SALAH!", "BAD", player);
          return { ...item, isStamped: true, stampedBy: player };
        }
      }
      return item;
    });

    setItems([...itemsRef.current]);
  };

  if (gameState === 'START') {
    return (
      <div className="h-screen bg-[#00E5FF] flex items-center justify-center p-4 relative overflow-hidden font-playful">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 md:p-10 text-center rounded-[2.5rem] md:rounded-[4rem] border-[6px] border-black shadow-[10px_10px_0px_#000] max-w-sm md:max-w-xl w-full relative z-10 mx-auto">
          <div className="bg-[#FF3D00] w-16 h-16 md:w-24 md:h-24 rounded-3xl border-4 border-black mx-auto flex items-center justify-center rotate-6 mb-6 shadow-xl">
             <ShieldAlert className="w-8 h-8 md:w-14 md:h-14 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic mb-3 tracking-tighter leading-none">REDaksi <span className="text-[#FF3D00]">STRIKE</span></h1>
          <p className="text-[10px] md:text-sm font-bold text-slate-500 mb-8 uppercase italic tracking-widest leading-tight">
            Tembak berita <span className="text-red-600 underline">HOAKS</span>.<br/>
            Lindungi berita <span className="text-green-600 underline">FAKTA</span>.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button onClick={() => { setMode('SINGLE'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col items-center hover:bg-blue-50 active:translate-y-0.5 transition-all">
              <User className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-black uppercase text-[9px]">SOLO MODE</span>
            </button>
            <button onClick={() => { setMode('VERSUS'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col items-center hover:bg-red-50 active:translate-y-0.5 transition-all">
              <Users className="w-8 h-8 mb-2 text-[#FF3D00]" />
              <span className="font-black uppercase text-[9px]">DUEL MODE</span>
            </button>
          </div>
          <button onClick={onBack} className="text-[8px] font-black uppercase text-slate-400 hover:text-black tracking-widest">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl z-[500] font-playful">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 md:p-12 text-center max-w-sm w-full border-8 border-black shadow-[12px_12px_0px_#FF3D00] rounded-[3rem]">
          <Trophy className="w-12 h-12 text-[#FFD600] mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase text-black mb-4 italic tracking-tighter">SKOR AKHIR</h2>
          <div className="bg-slate-50 p-6 rounded-[2rem] border-4 border-black mb-6">
             <p className="text-5xl font-black text-[#FF3D00] italic leading-none">{mode === 'SINGLE' ? scoreP1 : `${scoreP1} - ${scoreP2}`}</p>
          </div>
          <button onClick={onBack} className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl border-4 border-white shadow-lg text-xs italic tracking-widest">SELESAI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 md:p-4 flex flex-col items-center relative overflow-hidden select-none font-playful">
      {/* Header HUD - Tetap Terlihat & Responsif */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-3 bg-white p-2.5 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] border-black shadow-[6px_6px_0px_#000] z-[100] mx-auto">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[9px] md:text-[11px] text-black">
          <Home className="mr-1 w-4 h-4"/> <span className="hidden sm:inline">LOBI</span>
        </button>
        
        <div className="flex items-center space-x-3 md:space-x-8">
          <div className="text-center px-3 md:px-6 bg-slate-100 rounded-xl border-2 border-black/10">
            <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">WAKTU</p>
            <p className={`font-black text-xl md:text-3xl leading-none italic ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>{timeLeft}s</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">SKOR</p>
            <p className="font-black text-xl md:text-3xl text-[#FF3D00] italic leading-none">{scoreP1}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
            {mode === 'SINGLE' && (
               <div className="flex space-x-0.5">
                    {[...Array(3)].map((_, i) => (
                    <Heart key={i} className={`w-4 h-4 md:w-6 md:h-6 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
                    ))}
               </div>
            )}
        </div>
      </div>

      {/* Arena - Tempat munculnya berita (Sangat Aman) */}
      <div ref={arenaRef} className="relative w-full max-w-4xl flex-1 bg-[#F1F5F9] rounded-[2rem] md:rounded-[3rem] border-[6px] border-black overflow-hidden shadow-[inset_0px_5px_15px_rgba(0,0,0,0.1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[length:32px_32px] opacity-[0.04]"></div>
        
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150] px-4">
               <div className={`text-4xl md:text-7xl font-black uppercase italic text-center drop-shadow-md ${feedback.type === 'GOOD' ? 'text-green-600' : 'text-red-600'}`}>
                 {feedback.msg}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kartu Berita yang Dijamin Tidak Terpotong */}
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
              exit={{ scale: item.isStamped ? 1.3 : 0, opacity: 0 }}
              onClick={() => handleShoot(item.id, 'P1')}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-4 md:p-6 rounded-[1.2rem] md:rounded-[1.5rem] border-[3px] md:border-4 border-black shadow-[6px_6px_0px_#000] bg-white w-[75vw] max-w-[250px] md:max-w-[320px] min-h-[100px] md:min-h-[140px] flex flex-col items-center justify-center text-center transition-all overflow-hidden ${item.isStamped ? 'z-[100]' : 'z-20'}`}
            >
              {/* Neutral Visual Lines */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 opacity-30"></div>
              
              <p className="text-[11px] md:text-[16px] font-black uppercase italic leading-tight text-black break-words overflow-wrap-anywhere hyphens-auto">
                {item.text}
              </p>
              
              <div className="mt-3 w-1/4 h-1 bg-black/5 rounded-full"></div>

              {/* Stamp Salah/Blok - Scaled to Card */}
              {item.isStamped && (
                <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: -15 }} className={`absolute inset-0 flex flex-col items-center justify-center border-[8px] md:border-[12px] m-1 rounded-xl font-black text-3xl md:text-5xl z-50 bg-white/90 uppercase italic ${item.type === 'HOAX' ? 'border-red-600 text-red-600' : 'border-red-600 text-red-600'}`}>
                  {item.type === 'HOAX' ? 'BLOK!' : 'SALAH!'}
                  <div className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full mt-2 tracking-widest">VERIFIED</div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigasi Footer Bawah */}
      <div className="mt-3 w-full max-w-4xl px-2">
         <div className="bg-black text-white px-4 py-3 rounded-[1.5rem] text-[8px] md:text-[11px] font-black uppercase italic tracking-widest flex items-center shadow-lg border-2 border-white/10 justify-center text-center">
            <Zap className="w-4 h-4 mr-2 text-[#FFD600] shrink-0" />
            <span className="truncate">KLIK BERITA <span className="text-[#FF3D00]">HOAKS</span> — JANGAN KLIK <span className="text-[#00E5FF]">FAKTA</span>!</span>
         </div>
      </div>
      
      <style>{`
        .overflow-wrap-anywhere { overflow-wrap: anywhere; word-break: break-word; }
        .hyphens-auto { hyphens: auto; -webkit-hyphens: auto; }
      `}</style>
    </div>
  );
};

export default HoaxShooter;
