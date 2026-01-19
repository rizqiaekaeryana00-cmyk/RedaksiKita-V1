
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
    const baseSpeed = 0.35 + (stateRef.current.level * 0.2);
    
    /**
     * SAFE ZONE CALCULATION:
     * Kartu berita memiliki lebar max 280px - 320px.
     * Kita menggunakan persentase (x%) dari lebar arena.
     * Agar tidak terpotong di pinggir, x harus berada di antara:
     * (Lebar Kartu / Lebar Arena * 50)% s/d (100 - (Lebar Kartu / Lebar Arena * 50))%
     */
    const cardWidthPercent = window.innerWidth < 768 ? 35 : 25; // Estimasi lebar kartu dalam %
    const margin = cardWidthPercent / 2 + 5; // Margin aman (setengah kartu + buffer 5%)
    const safeX = margin + Math.random() * (100 - (margin * 2));

    const newItem: TargetItem = {
      id: Math.random(),
      text: randomSource.text,
      type: randomSource.isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110, // Mulai dari bawah arena
      speed: baseSpeed + (Math.random() * 0.2),
      rotation: (Math.random() - 0.5) * 12,
      glitch: stateRef.current.level >= 2 && Math.random() > 0.7
    };
    
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const updateLoop = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y - item.speed }))
      .filter(item => {
        // Penalti jika hoaks lolos di mode Single
        if (item.y < -35 && !item.isStamped && item.type === 'HOAX' && stateRef.current.mode === 'SINGLE') {
          setScoreP1(s => Math.max(0, s - 10));
          showFeedback("HOAKS LOLOS!", "BAD");
        }
        return item.y > -40; // Filter item yang sudah jauh di atas
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
      const spawnInterval = level === 1 ? 2600 : level === 2 ? 1800 : 1200;
      const spawnTimer = setInterval(spawnItem, spawnInterval);
      
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
          showFeedback("HOAKS DIBLOKIR!", "GOOD", player);
          
          confetti({
            particleCount: 20,
            spread: 45,
            origin: { x: item.x / 100, y: item.y / 100 },
            colors: player === 'P1' ? ['#FF3D00'] : ['#00E5FF']
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
          showFeedback("FAKTA TERTEMBAK!", "BAD", player);
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 md:p-12 text-center rounded-[3rem] md:rounded-[4rem] border-8 border-black shadow-[16px_16px_0px_#000] max-w-2xl w-full relative z-10 mx-auto">
          <div className="bg-[#FF3D00] w-20 h-20 md:w-24 md:h-24 rounded-3xl border-4 border-black mx-auto flex items-center justify-center rotate-6 mb-6 md:mb-8 shadow-xl">
             <ShieldAlert className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic mb-4 tracking-tighter leading-none">REDaksi <span className="text-[#FF3D00]">STRIKE</span></h1>
          <p className="text-xs md:text-sm font-bold text-slate-500 mb-8 md:mb-10 uppercase italic tracking-widest leading-relaxed">
            Misi Literasi: Tembak berita <span className="text-red-600 underline">HOAKS</span>.<br/>
            Lindungi berita <span className="text-green-600 underline">FAKTA</span>.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
            <button onClick={() => { setMode('SINGLE'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-6 md:p-8 rounded-[2rem] shadow-[6px_6px_0px_#000] flex flex-col items-center hover:bg-blue-50 transition-all group active:translate-y-1 active:shadow-none">
              <User className="w-10 h-10 md:w-12 md:h-12 mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase text-[10px] md:text-xs">MODE JURNALIS</span>
            </button>
            <button onClick={() => { setMode('VERSUS'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-6 md:p-8 rounded-[2rem] shadow-[6px_6px_0px_#000] flex flex-col items-center hover:bg-red-50 transition-all group active:translate-y-1 active:shadow-none">
              <Users className="w-10 h-10 md:w-12 md:h-12 mb-3 text-[#FF3D00] group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase text-[10px] md:text-xs">MODE DUEL (IFP)</span>
            </button>
          </div>
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-400 hover:text-black tracking-[0.2em] transition-colors">KEMBALI KE RUANG REDAKSI</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl z-[500] font-playful">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-10 md:p-12 text-center max-w-lg w-full border-8 border-black shadow-[16px_16px_0px_#FF3D00] rounded-[3.5rem] md:rounded-[4rem]">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FFD600] rounded-3xl border-4 border-black mx-auto flex items-center justify-center -rotate-12 mb-8 shadow-2xl">
             <Trophy className="w-10 h-10 md:w-14 md:h-14 text-black" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-black mb-2 italic tracking-tighter">SKOR AKHIR</h2>
          <div className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border-4 border-black mb-10 shadow-[8px_8px_0px_#000]">
             {mode === 'SINGLE' ? (
               <p className="text-6xl md:text-8xl font-black text-[#FF3D00] tracking-tighter leading-none italic">{scoreP1}</p>
             ) : (
               <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase text-red-500 mb-1">TIM MERAH</p>
                    <p className="text-4xl md:text-5xl font-black">{scoreP1}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase text-blue-500 mb-1">TIM BIRU</p>
                    <p className="text-4xl md:text-5xl font-black">{scoreP2}</p>
                  </div>
               </div>
             )}
          </div>
          <button onClick={onBack} className="w-full py-5 md:py-6 bg-black text-white font-black uppercase rounded-[1.5rem] md:rounded-3xl border-4 border-white shadow-xl hover:scale-105 transition-all text-sm md:text-xl italic tracking-widest">LANJUTKAN TUGAS</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 md:p-4 flex flex-col items-center relative overflow-hidden select-none font-playful">
      {/* Dynamic HUD - Centered & Responsive */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 bg-white p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0px_#000] z-[100] mx-auto">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[9px] md:text-[11px] text-black hover:text-[#FF3D00] transition-colors">
          <Home className="mr-1.5 w-4 h-4 md:w-5 md:h-5"/> LOBI
        </button>
        
        <div className="flex items-center space-x-4 md:space-x-12">
          {mode === 'VERSUS' && (
            <div className="text-center hidden sm:block">
              <p className="text-[8px] font-black text-red-500 uppercase tracking-tighter">MERAH</p>
              <p className="font-black text-xl md:text-3xl leading-none italic">{scoreP1}</p>
            </div>
          )}
          <div className="text-center px-4 md:px-8 bg-slate-100 rounded-xl border-2 border-black/5">
            <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">WAKTU</p>
            <p className={`font-black text-2xl md:text-4xl leading-none italic ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
              {timeLeft}s
            </p>
          </div>
          {mode === 'VERSUS' ? (
            <div className="text-center hidden sm:block">
              <p className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">BIRU</p>
              <p className="font-black text-xl md:text-3xl leading-none italic">{scoreP2}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">SKOR</p>
              <p className="font-black text-xl md:text-3xl text-[#FF3D00] leading-none italic">{scoreP1}</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
            <div className="hidden sm:block bg-black text-white px-3 py-1.5 rounded-xl text-[9px] font-black italic border-2 border-white/20">
               LVL {level}
            </div>
            {mode === 'SINGLE' && (
               <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                    <Heart key={i} className={`w-5 h-5 md:w-7 md:h-7 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
                    ))}
               </div>
            )}
        </div>
      </div>

      {/* Main Game Arena - Safe Boundary Container */}
      <div ref={arenaRef} className="relative w-full max-w-6xl flex-1 bg-[#F1F5F9] rounded-[2.5rem] md:rounded-[4rem] border-8 border-black overflow-hidden shadow-[inset_0px_10px_30px_rgba(0,0,0,0.15)] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] bg-[length:40px_40px] opacity-[0.03]"></div>
        
        {/* Versus Divider */}
        {mode === 'VERSUS' && (
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-black/10 z-[30] pointer-events-none"></div>
        )}

        {/* Feedback Labels */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ scale: 0.4, opacity: 0, y: 30 }} 
              animate={{ scale: 1.4, opacity: 1, y: 0 }} 
              exit={{ scale: 2.5, opacity: 0 }} 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150] px-6"
            >
               <div className={`text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${feedback.type === 'GOOD' ? 'text-green-600' : 'text-red-600'}`}>
                 {feedback.msg}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating News Cards */}
        <AnimatePresence>
          {items.map(item => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0, rotate: item.rotation }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                left: `${item.x}%`, 
                top: `${item.y}%`, 
                rotate: item.rotation + (item.glitch ? Math.sin(Date.now()/40)*5 : 0)
              }}
              exit={{ scale: item.isStamped ? 1.6 : 0, opacity: 0 }}
              onClick={(e) => {
                if (gameState !== 'PLAYING') return;
                const rect = arenaRef.current?.getBoundingClientRect();
                if (rect && mode === 'VERSUS') {
                   const clickX = e.clientX - rect.left;
                   handleShoot(item.id, clickX < rect.width / 2 ? 'P1' : 'P2');
                } else {
                   handleShoot(item.id, 'P1');
                }
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-5 md:p-8 rounded-[1.5rem] border-4 border-black shadow-[6px_6px_0px_#000] bg-white w-[260px] md:w-[320px] min-h-[140px] md:min-h-[170px] flex flex-col items-center justify-center text-center transition-all group overflow-hidden ${item.isStamped ? 'grayscale-0 opacity-100 z-[200]' : 'z-20'} ${item.glitch ? 'animate-pulse' : ''}`}
            >
              {/* Neutral "News Clip" Styling - Pure Literacy Mode */}
              <div className="absolute top-0 left-0 w-full h-2.5 bg-slate-100 opacity-50"></div>
              <div className="flex items-center space-x-2 mb-3 opacity-20">
                 <div className="w-10 h-1.5 bg-black rounded-full"></div>
                 <div className="w-6 h-1.5 bg-black rounded-full"></div>
              </div>

              <p className="text-[14px] md:text-[18px] font-black uppercase italic leading-[1.2] tracking-tight text-black">
                {item.text}
              </p>
              
              <div className="mt-4 w-1/2 h-1 bg-black/5 rounded-full"></div>

              {/* Stamp Effect Overlay */}
              {item.isStamped && (
                <motion.div 
                  initial={{ scale: 4, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center border-[12px] m-1 rounded-2xl font-black text-5xl md:text-6xl z-50 bg-white/90 uppercase italic tracking-tighter pointer-events-none ${
                    item.type === 'HOAX' 
                      ? (item.stampedBy === 'P1' ? 'border-[#FF3D00] text-[#FF3D00]' : 'border-[#00E5FF] text-[#00E5FF]') 
                      : 'border-red-600 text-red-600'
                  }`}
                >
                  {item.type === 'HOAX' ? 'BLOCK!' : 'ERROR!'}
                  <span className="text-[10px] mt-2 bg-black text-white px-3 py-0.5 rounded-full tracking-[0.2em]">{item.stampedBy}</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Responsive Footer Info */}
      <div className="mt-4 flex flex-col items-center space-y-2 w-full max-w-6xl">
         <div className="bg-black text-white px-6 md:px-10 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] text-[9px] md:text-xs font-black uppercase italic tracking-widest flex items-center shadow-xl border-4 border-white/10 w-full md:w-auto text-center justify-center">
            <Zap className="w-5 h-5 md:w-6 md:h-6 mr-3 text-[#FFD600] shrink-0" />
            <span className="truncate">BACA & TEMBAK <span className="text-[#FF3D00]">HOAKS</span> — BIARKAN <span className="text-[#00E5FF]">FAKTA</span> TERBIT!</span>
         </div>
      </div>
    </div>
  );
};

export default HoaxShooter;
