
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Trophy, Home, Heart, AlertTriangle, CheckCircle, ShieldCheck, Zap, Newspaper, Target, Eye, Users, User, ChevronRight, Sparkles } from 'lucide-react';
import { sounds } from '../services/audio';
import { HoaxPoolItem } from '../types';

interface TargetItem {
  id: number;
  text: string;
  type: 'HOAX' | 'FACT';
  x: number;
  y: number;
  speed: number;
  rotation: number;
  isStamped?: boolean;
  stampedBy?: number; 
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
  const [feedback, setFeedback] = useState<{msg: string, type: 'BAD' | 'GOOD'} | null>(null);

  const requestRef = useRef<number>(null);
  const itemsRef = useRef<TargetItem[]>([]);
  const stateRef = useRef({ gameState, mode, level, scoreP1, hoaxPoolItems });

  useEffect(() => {
    stateRef.current = { gameState, mode, level, scoreP1, hoaxPoolItems };
  }, [gameState, mode, level, scoreP1, hoaxPoolItems]);

  const showFeedback = useCallback((msg: string, type: 'BAD' | 'GOOD') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 800);
  }, []);

  const spawnItem = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    if (stateRef.current.hoaxPoolItems.length === 0) return;
    
    const randomSource = stateRef.current.hoaxPoolItems[Math.floor(Math.random() * stateRef.current.hoaxPoolItems.length)];
    const baseSpeed = 0.4 + (stateRef.current.level * 0.25);
    const safeX = 30 + Math.random() * 40;

    const newItem: TargetItem = {
      id: Math.random(),
      text: randomSource.text,
      type: randomSource.isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110,
      speed: baseSpeed + (Math.random() * 0.3),
      rotation: (Math.random() - 0.5) * 8,
    };
    
    itemsRef.current.push(newItem);
    setItems([...itemsRef.current]);
  }, []);

  const updateLoop = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y - item.speed }))
      .filter(item => {
        if (item.y < -20 && !item.isStamped && item.type === 'HOAX' && stateRef.current.mode === 'SINGLE') {
          setScoreP1(s => Math.max(0, s - 10));
          showFeedback("HOAKS LOLOS!", "BAD");
        }
        return item.y > -25;
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
      const spawnTimer = setInterval(spawnItem, 1800);
      
      const clockTimer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        clearInterval(spawnTimer);
        clearInterval(clockTimer);
      };
    }
  }, [gameState, updateLoop, spawnItem]);

  const handleShoot = (id: number, player: number = 1) => {
    if (gameState !== 'PLAYING') return;

    itemsRef.current = itemsRef.current.map(item => {
      if (item.id === id && !item.isStamped) {
        if (item.type === 'HOAX') {
          sounds.correct();
          if (player === 1) setScoreP1(s => s + 15);
          else setScoreP2(s => s + 15);
          showFeedback(mode === 'VERSUS' ? `P${player} +15!` : "TEPAT!", "GOOD");
          return { ...item, isStamped: true, stampedBy: player };
        } else {
          sounds.wrong();
          if (mode === 'SINGLE') {
            setLives(l => {
              if (l <= 1) setGameState('GAMEOVER');
              return l - 1;
            });
          }
          showFeedback(mode === 'VERSUS' ? `P${player} SALAH!` : "ITU FAKTA!", "BAD");
          return { ...item, isStamped: true, stampedBy: player };
        }
      }
      return item;
    });

    setItems([...itemsRef.current]);
  };

  if (gameState === 'START') {
    return (
      <div className="h-screen bg-[#00E5FF] flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 text-center rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0px_#000] max-w-xl w-full">
          <ShieldAlert className="w-16 h-16 mx-auto mb-6 text-[#FF3D00]" />
          <h1 className="text-3xl font-black uppercase italic mb-4">REDaksi STRIKE</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button onClick={() => { setMode('SINGLE'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-col items-center hover:bg-slate-50">
              <User className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-black uppercase text-xs">JURNALIS SOLO</span>
            </button>
            <button onClick={() => { setMode('VERSUS'); setGameState('PLAYING'); sounds.click(); }} className="bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-col items-center hover:bg-slate-50">
              <Users className="w-8 h-8 mb-2 text-[#FF3D00]" />
              <span className="font-black uppercase text-xs">DUEL REDAKSI</span>
            </button>
          </div>
          <button onClick={onBack} className="text-xs font-black uppercase text-slate-400">Kembali</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/80 flex items-center justify-center p-6 backdrop-blur-md z-[300]">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-10 text-center max-w-lg w-full border-4 border-black shadow-[12px_12px_0px_#FF3D00] rounded-[2.5rem]">
          <Trophy className="w-16 h-16 mx-auto text-[#FFD600] mb-6" />
          <h2 className="text-3xl font-black uppercase text-black mb-6 italic">MISI SELESAI</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
             <div className="bg-slate-50 p-6 rounded-2xl border-2 border-black">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">SKOR AKHIR</p>
                <p className="text-4xl font-black text-[#FF3D00]">{scoreP1}</p>
             </div>
          </div>
          <button onClick={onBack} className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl border-4 border-white">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 flex flex-col items-center relative overflow-hidden select-none">
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 bg-white p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] z-50">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black">
          <Home className="mr-2 w-4 h-4"/> LOBI
        </button>
        <div className="flex items-center space-x-12">
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase">WAKTU</p>
            <p className="font-black text-2xl">{timeLeft}s</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase">SKOR</p>
            <p className="font-black text-2xl text-[#FF3D00]">{scoreP1}</p>
          </div>
        </div>
        <div className="flex space-x-1">
             {[...Array(3)].map((_, i) => (
               <Heart key={i} className={`w-5 h-5 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
             ))}
        </div>
      </div>

      <div className="relative w-full max-w-4xl flex-1 bg-[#F8FAFC] rounded-[3.5rem] border-8 border-black overflow-hidden shadow-2xl">
        <AnimatePresence>
          {items.map(item => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, left: `${item.x}%`, top: `${item.y}%`, rotate: item.rotation }}
              exit={{ scale: item.isStamped ? 1.1 : 0, opacity: 0 }}
              onClick={() => handleShoot(item.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] bg-white w-[180px] transition-all hover:scale-105 active:shadow-none select-none overflow-hidden ${item.isStamped ? 'grayscale opacity-60' : ''}`}
            >
              <span className="text-[10px] font-black uppercase italic text-center block leading-tight">{item.text}</span>
              {item.isStamped && (
                <div className={`absolute inset-0 flex items-center justify-center border-4 m-1 rounded-lg font-black text-2xl z-40 bg-white/70 uppercase ${item.stampedBy === 1 ? 'border-[#FF3D00] text-[#FF3D00]' : 'border-blue-600 text-blue-600'}`}>
                  {item.type === 'HOAX' ? 'BLOK!' : 'MIS!'}
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HoaxShooter;
