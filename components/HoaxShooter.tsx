
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
    const baseSpeed = 0.4 + (stateRef.current.level * 0.22);
    
    // SAFE ZONE: 15% - 85% untuk kartu selebar 280px agar tidak clipping
    const safeX = 20 + Math.random() * 60;

    const newItem: TargetItem = {
      id: Math.random(),
      text: randomSource.text,
      type: randomSource.isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110,
      speed: baseSpeed + (Math.random() * 0.25),
      rotation: (Math.random() - 0.5) * 15,
      glitch: stateRef.current.level >= 2 && Math.random() > 0.65
    };
    
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const updateLoop = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y - item.speed }))
      .filter(item => {
        if (item.y < -25 && !item.isStamped && item.type === 'HOAX' && stateRef.current.mode === 'SINGLE') {
          setScoreP1(s => Math.max(0, s - 10));
          showFeedback("HOAKS LOLOS!", "BAD");
        }
        return item.y > -30;
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
      const spawnTimer = setInterval(spawnItem, level === 1 ? 2400 : level === 2 ? 1600 : 1000);
      
      const clockTimer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            return 0;
          }
          if (t === 40) setLevel(2);
          if (t === 20) setLevel(3);
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
            particleCount: 25,
            spread: 50,
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 md:p-12 text-center rounded-[3rem] md:rounded-[4.5rem] border-8 border-black shadow-[20px_20px_0px_#000] max-w-2xl w-full relative z-10">
          <div className="bg-[#FF3D00] w-24 h-24 rounded-3xl border-4 border-black mx-auto flex items-center justify-center rotate-6 mb-8 shadow-2xl">
             <ShieldAlert className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic mb-4 tracking-tighter leading-none">REDaksi <span className="text-[#FF3D00]">STRIKE</span></h1>
          <div className="bg-slate-100 p-6 rounded-3xl border-4 border-black border-dashed mb-10 text-left">
             <h3 className="font-black text-sm uppercase mb-3 flex items-center"><Target className="w-5 h-5 mr-2 text-red-600" /> Aturan Redaktur:</h3>
             <ul className="text-xs md:text-sm font-bold text-slate-700 space-y-2">
               <li>1. Baca teks berita yang meluncur ke atas.</li>
               <li>2. Tembak/Klik jika itu berita <span className="text-red-600 font-black">HOAKS</span>.</li>
               <li>3. Jangan menembak berita <span className="text-green-600 font-black">FAKTA</span>.</li>
             </ul>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <button onClick={() => { setMode('SINGLE'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_#000] flex flex-col items-center hover:bg-blue-50 transition-all group active:translate-y-2 active:shadow-none">
              <User className="w-12 h-12 mb-3 text-blue-600 group-hover:scale-125 transition-transform" />
              <span className="font-black uppercase text-xs">MODE TUNGGAL</span>
            </button>
            <button onClick={() => { setMode('VERSUS'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_#000] flex flex-col items-center hover:bg-red-50 transition-all group active:translate-y-2 active:shadow-none">
              <Users className="w-12 h-12 mb-3 text-[#FF3D00] group-hover:scale-125 transition-transform" />
              <span className="font-black uppercase text-xs">DUEL IFP / MULTI</span>
            </button>
          </div>
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-400 hover:text-black tracking-[0.3em]">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/90 flex items-center justify-center p-6 backdrop-blur-2xl z-[500] font-playful">
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-12 text-center max-w-lg w-full border-8 border-black shadow-[20px_20px_0px_#FF3D00] rounded-[4rem]">
          <div className="w-24 h-24 bg-[#FFD600] rounded-3xl border-4 border-black mx-auto flex items-center justify-center -rotate-12 mb-8 shadow-2xl">
             <Trophy className="w-14 h-14 text-black" />
          </div>
          <h2 className="text-5xl font-black uppercase text-black mb-2 italic tracking-tighter">SKOR AKHIR</h2>
          <div className="bg-slate-50 p-10 rounded-[2.5rem] border-4 border-black mb-10 shadow-[8px_8px_0px_#000]">
             {mode === 'SINGLE' ? (
               <p className="text-8xl font-black text-[#FF3D00] tracking-tighter leading-none italic">{scoreP1}</p>
             ) : (
               <div className="grid grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-red-500 mb-2">P1</p>
                    <p className="text-5xl font-black">{scoreP1}</p>
                  </div>
                  <div className="h-16 w-1 bg-black/10 mx-auto"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-500 mb-2">P2</p>
                    <p className="text-5xl font-black">{scoreP2}</p>
                  </div>
               </div>
             )}
          </div>
          <button onClick={onBack} className="w-full py-6 bg-black text-white font-black uppercase rounded-3xl border-4 border-white shadow-2xl hover:scale-105 transition-all text-xl italic tracking-widest">KEMBALI KE REDAKSI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 md:p-4 flex flex-col items-center relative overflow-hidden select-none font-playful">
      {/* HUD Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 bg-white p-4 md:p-6 rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0px_#000] z-[100]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black hover:text-[#FF3D00] transition-colors">
          <Home className="mr-2 w-5 h-5"/> LOBI
        </button>
        <div className="flex items-center space-x-6 md:space-x-16">
          {mode === 'VERSUS' && (
            <div className="text-center hidden sm:block">
              <p className="text-[9px] font-black text-red-500 uppercase">TIM MERAH</p>
              <p className="font-black text-2xl md:text-3xl italic">{scoreP1}</p>
            </div>
          )}
          <div className="text-center bg-slate-100 px-6 py-2 rounded-2xl border-2 border-black">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">DURASI SIARAN</p>
            <p className={`font-black text-3xl md:text-4xl leading-none italic ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>{timeLeft}s</p>
          </div>
          {mode === 'VERSUS' ? (
            <div className="text-center hidden sm:block">
              <p className="text-[9px] font-black text-blue-500 uppercase">TIM BIRU</p>
              <p className="font-black text-2xl md:text-3xl italic">{scoreP2}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase">SKOR REDAKSI</p>
              <p className="font-black text-2xl md:text-4xl text-[#FF3D00] leading-none italic">{scoreP1}</p>
            </div>
          )}
        </div>
        <div className="flex space-x-1.5 md:space-x-2">
             {mode === 'SINGLE' ? (
               [...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-6 h-6 md:w-8 md:h-8 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
               ))
             ) : (
               <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black italic">VS MODE</div>
             )}
        </div>
      </div>

      {/* Arena Kontainer dengan Safe Area */}
      <div className="relative w-full max-w-6xl flex-1 bg-[#F1F5F9] rounded-[4rem] border-8 border-black overflow-hidden shadow-[inset_0px_10px_40px_rgba(0,0,0,0.2)] bg-[url('https://www.transparenttextures.com/patterns/newspaper.png')]">
        <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_2px)] bg-[length:50px_50px] opacity-[0.03]"></div>
        
        {/* Versus Divider IFP */}
        {mode === 'VERSUS' && (
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-black/20 z-[30] pointer-events-none"></div>
        )}

        {/* Big Large Labels Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ scale: 0.2, opacity: 0, rotate: -15 }} 
              animate={{ scale: 1.5, opacity: 1, rotate: 0 }} 
              exit={{ scale: 3, opacity: 0 }} 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150]"
            >
               <div className={`text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-center drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] ${feedback.type === 'GOOD' ? 'text-green-600' : 'text-red-600'}`}>
                 {feedback.msg}
                 {mode === 'VERSUS' && <p className="text-2xl mt-4 text-black font-black bg-white/80 px-4 py-2 rounded-xl border-4 border-black inline-block uppercase italic">{feedback.p === 'P1' ? 'TIM MERAH' : 'TIM BIRU'}</p>}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Berita Netral Literasi */}
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
                rotate: item.rotation + (item.glitch ? Math.sin(Date.now()/40)*4 : 0)
              }}
              exit={{ scale: item.isStamped ? 1.6 : 0, opacity: 0 }}
              onClick={(e) => {
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                if (rect && mode === 'VERSUS') {
                   const clickX = e.clientX - rect.left;
                   handleShoot(item.id, clickX < rect.width / 2 ? 'P1' : 'P2');
                } else {
                   handleShoot(item.id, 'P1');
                }
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-6 md:p-8 rounded-[1.5rem] border-4 border-black shadow-[8px_8px_0px_#000] bg-white w-[260px] md:w-[320px] min-h-[140px] md:min-h-[160px] flex flex-col items-center justify-center text-center group ${item.isStamped ? 'z-[50] grayscale-0' : 'z-20'} ${item.glitch ? 'animate-pulse' : ''}`}
            >
              {/* Desain Koran Netral */}
              <div className="absolute top-0 left-0 w-full h-3 bg-slate-200/50"></div>
              <div className="flex items-center space-x-2 mb-4 opacity-30">
                 <div className="w-12 h-1.5 bg-black rounded-full"></div>
                 <div className="w-6 h-1.5 bg-black rounded-full"></div>
              </div>

              <p className="text-[14px] md:text-[18px] font-black uppercase italic leading-[1.2] tracking-tight text-black">
                {item.text}
              </p>
              
              <div className="mt-4 w-2/3 h-1 bg-black/5 rounded-full"></div>

              {/* Stamp Animasi */}
              {item.isStamped && (
                <motion.div 
                  initial={{ scale: 4, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center border-[15px] m-1 rounded-2xl font-black text-6xl z-50 bg-white/90 uppercase italic tracking-tighter pointer-events-none ${
                    item.type === 'HOAX' 
                      ? (item.stampedBy === 'P1' ? 'border-[#FF3D00] text-[#FF3D00]' : 'border-[#00E5FF] text-[#00E5FF]') 
                      : 'border-red-600 text-red-600'
                  }`}
                >
                  {item.type === 'HOAX' ? 'STOP!' : 'SALAH!'}
                  <div className="text-[10px] mt-2 bg-black text-white px-3 py-1 rounded-full uppercase tracking-[0.2em]">{item.stampedBy} VERIFIED</div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Game Control */}
      <div className="mt-4 flex space-x-4 max-w-full">
         <div className="bg-black text-white px-8 py-4 rounded-[2rem] text-[10px] md:text-sm font-black uppercase italic tracking-widest flex items-center shadow-2xl border-4 border-white/10 whitespace-nowrap overflow-hidden">
           <Zap className="w-6 h-6 mr-4 text-[#FFD600] shrink-0" />
           <span>TEMBAK/KLIK BERITA <span className="text-[#FF3D00]">HOAKS</span> — BIARKAN <span className="text-[#00E5FF]">FAKTA</span> TERBIT!</span>
         </div>
      </div>
    </div>
  );
};

export default HoaxShooter;
