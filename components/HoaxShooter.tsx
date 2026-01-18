
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Trophy, Home, Heart, AlertTriangle, CheckCircle, ShieldCheck, Zap, Newspaper, Target, Eye, Users, User, ChevronRight, Sparkles } from 'lucide-react';
import { sounds } from '../services/audio';

interface TargetItem {
  id: number;
  text: string;
  type: 'HOAX' | 'FACT';
  x: number;
  y: number;
  speed: number;
  rotation: number;
  isStamped?: boolean;
  stampedBy?: number; // 1 for P1, 2 for P2
}

const HOAX_POOL = [
  "Makan Mie Instan Tiap Hari Bikin Umur 100 Tahun!",
  "KLIK SEKARANG: Dapatkan HP Gratis Tanpa Syarat",
  "RAHASIA: Guru Ini Ternyata Robot Canggih!",
  "Mengejutkan! Minum Kopi Sembuhkan Patah Tulang",
  "Waspada! Chip 5G Terdeteksi di Air Keran Sekolah",
  "VIRAL! Siswa Pintar Ini Berhenti Sekolah Demi Game",
  "DIBONGKAR! Rahasia Nilai 100 Tanpa Belajar Keras",
  "Tanaman Ini Bisa Ngomong Bahasa Manusia!",
  "HEBOH! Penampakan UFO di Belakang SMPN 3 Bonang",
  "Minum Air Es Setelah Olahraga Bisa Bikin Jantung Berhenti!",
  "Gunakan Garam di Sudut Ruangan untuk Menarik Rezeki",
  "WASPADA: Radiasi HP Bisa Mematangkan Telur Rebus"
];

const FACT_POOL = [
  "BMKG: Waspada Potensi Hujan Lebat Sore Ini",
  "Kemdikbud Rilis Jadwal Libur Semester Ganjil",
  "Siswa SMPN 3 Bonang Panen Sayur Hidroponik",
  "Dinas Kesehatan: Cara Mencuci Tangan yang Benar",
  "Pemerintah Berikan Subsidi Seragam Sekolah",
  "Pengumuman: Lomba Literasi Nasional Tingkat SMP",
  "Hasil Rapat Pleno Orang Tua Siswa Kelas VII",
  "Kemenkes Imbau Siswa Konsumsi Sayur dan Buah",
  "Prestasi: Tim Robotik Sekolah Raih Medali Emas",
  "Kurikulum Merdeka Fokus pada Pengembangan Karakter",
  "Pendaftaran PPDB SMP Dimulai Bulan Depan",
  "Siswa Berprestasi Mendapatkan Beasiswa Berlanjut"
];

const HoaxShooter = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [mode, setMode] = useState<'SINGLE' | 'VERSUS'>('SINGLE');
  const [level, setLevel] = useState(1);
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [items, setItems] = useState<TargetItem[]>([]);
  const [feedback, setFeedback] = useState<{msg: string, type: 'BAD' | 'GOOD'} | null>(null);
  const [levelUpMessage, setLevelUpMessage] = useState(false);

  const requestRef = useRef<number>(null);
  const itemsRef = useRef<TargetItem[]>([]);
  const stateRef = useRef({ gameState, mode, level, scoreP1 });

  useEffect(() => {
    stateRef.current = { gameState, mode, level, scoreP1 };
  }, [gameState, mode, level, scoreP1]);

  const showFeedback = useCallback((msg: string, type: 'BAD' | 'GOOD') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 800);
  }, []);

  const spawnItem = useCallback(() => {
    if (stateRef.current.gameState !== 'PLAYING') return;
    
    const isHoax = Math.random() > 0.4;
    const baseSpeed = 0.4 + (stateRef.current.level * 0.25);
    const randomSpeed = Math.random() * 0.3;

    // PERBAIKAN FATAL: Mempersempit rentang X (30% ke 70%) agar kartu tidak pernah menyentuh pinggir layar HP.
    // Dengan lebar kartu 140px di mobile, posisi ini menjamin teks selalu terbaca di tengah.
    const safeX = 30 + Math.random() * 40;

    const newItem: TargetItem = {
      id: Math.random(),
      text: isHoax 
        ? HOAX_POOL[Math.floor(Math.random() * HOAX_POOL.length)]
        : FACT_POOL[Math.floor(Math.random() * FACT_POOL.length)],
      type: isHoax ? 'HOAX' : 'FACT',
      x: safeX,
      y: 110,
      speed: baseSpeed + randomSpeed,
      rotation: (Math.random() - 0.5) * 8, // Mengurangi rotasi agar teks lebih stabil dibaca di HP
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
    if (scoreP1 > 120 && level === 1) {
      setLevel(2);
      setLevelUpMessage(true);
      setTimeout(() => setLevelUpMessage(false), 2000);
    } else if (scoreP1 > 300 && level === 2) {
      setLevel(3);
      setLevelUpMessage(true);
      setTimeout(() => setLevelUpMessage(false), 2000);
    }
  }, [scoreP1, level]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      itemsRef.current = [];
      setScoreP1(0);
      setScoreP2(0);
      setLives(3);
      setTimeLeft(60);
      setLevel(1);

      requestRef.current = requestAnimationFrame(updateLoop);
      const spawnTimer = setInterval(spawnItem, level === 1 ? 2000 : level === 2 ? 1600 : 1200);
      
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
  }, [gameState, updateLoop, spawnItem, level]);

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
          } else {
            if (player === 1) setScoreP1(s => Math.max(0, s - 20));
            else setScoreP2(s => Math.max(0, s - 20));
          }
          showFeedback(mode === 'VERSUS' ? `P${player} SALAH!` : "ITU FAKTA!", "BAD");
          return { ...item, isStamped: true, stampedBy: player };
        }
      }
      return item;
    });

    setItems([...itemsRef.current]);
    setTimeout(() => {
      itemsRef.current = itemsRef.current.filter(i => i.id !== id);
      setItems([...itemsRef.current]);
    }, 600);
  };

  if (gameState === 'START') {
    return (
      <div className="h-screen bg-[#00E5FF] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white p-6 md:p-12 text-center rounded-[2.5rem] md:rounded-[3rem] border-4 border-black shadow-[10px_10px_0px_#000] max-w-xl w-full z-10"
        >
          <div className="bg-[#FF3D00] w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 border-4 border-black rotate-6 shadow-xl">
            <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic mb-1 md:mb-2 tracking-tighter text-black">REDaksi <span className="text-[#FF3D00]">STRIKE</span></h1>
          <p className="text-slate-400 font-bold text-[10px] md:text-xs mb-6 md:mb-8 uppercase italic tracking-widest">Ujian Kecepatan Verifikasi Berita</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <button 
              onClick={() => { sounds.click(); setMode('SINGLE'); setGameState('PLAYING'); }}
              className="bg-white hover:bg-slate-50 border-4 border-black p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-[6px_6px_0px_#000] transition-all flex flex-col items-center group"
            >
              <User className="w-8 h-8 md:w-10 md:h-10 mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase text-xs md:text-sm">JURNALIS SOLO</span>
            </button>
            <button 
              onClick={() => { sounds.click(); setMode('VERSUS'); setGameState('PLAYING'); }}
              className="bg-white hover:bg-slate-50 border-4 border-black p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-[6px_6px_0px_#000] transition-all flex flex-col items-center group"
            >
              <Users className="w-8 h-8 md:w-10 md:h-10 mb-2 text-[#FF3D00] group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase text-xs md:text-sm">DUEL REDAKSI</span>
            </button>
          </div>

          <div className="bg-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl border-2 border-black border-dashed text-left">
             <p className="text-[10px] md:text-xs font-black uppercase mb-2 flex items-center text-slate-500"><Eye className="mr-2 w-4 h-4" /> Instruksi Verifikator:</p>
             <ul className="text-[9px] md:text-xs font-bold text-slate-600 space-y-1.5 md:space-y-2">
                <li className="flex items-center"><Zap className="w-3 h-3 mr-2 text-red-600 shrink-0" /> Tembak Berita <strong>HOAKS</strong> (Sensasional).</li>
                <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-blue-600 shrink-0" /> Biarkan Berita <strong>FAKTA</strong> Lolos.</li>
                <li className="text-[#FF3D00] italic font-black">Waspada! Baca cepat & tepat di area tengah!</li>
             </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-screen bg-black/90 flex items-center justify-center p-4 md:p-6 backdrop-blur-md z-[300]">
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white p-8 md:p-12 text-center max-w-lg w-full border-4 border-black shadow-[12px_12px_0px_#FF3D00] rounded-[2.5rem] md:rounded-[3.5rem]"
        >
          <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto text-[#FFD600] mb-4 md:mb-6 animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-black uppercase text-black mb-2 italic tracking-tighter">MISI SELESAI</h2>
          
          <div className={`grid ${mode === 'VERSUS' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 md:gap-6 my-6 md:my-8`}>
             <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border-2 border-black">
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">SKOR P1</p>
                <p className="text-3xl md:text-5xl font-black text-[#FF3D00] leading-none">{scoreP1}</p>
             </div>
             {mode === 'VERSUS' && (
               <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border-2 border-black">
                  <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">SKOR P2</p>
                  <p className="text-3xl md:text-5xl font-black text-blue-600 leading-none">{scoreP2}</p>
               </div>
             )}
          </div>

          <button onClick={onBack} className="w-full py-4 md:py-5 bg-black text-white font-black uppercase rounded-xl md:rounded-2xl border-4 border-white shadow-[6px_6px_0px_#444] transition-all hover:scale-105">KEMBALI KE LOBI</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#00E5FF] p-2 md:p-4 flex flex-col items-center relative overflow-hidden select-none">
      {/* HUD Header - Dikecilkan untuk mobile */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-2 md:mb-4 bg-white p-2 md:p-4 rounded-2xl md:rounded-3xl border-4 border-black shadow-[4px_4px_0px_#000] z-50">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[8px] md:text-[10px] text-black">
          <Home className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5"/> LOBI
        </button>
        
        <div className="flex items-center space-x-3 md:space-x-12">
          <div className="text-center">
            <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase leading-none">WAKTU</p>
            <p className={`font-black text-sm md:text-2xl leading-none ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>{timeLeft}s</p>
          </div>
          
          <div className="flex items-center bg-slate-50 px-3 md:px-6 py-1 md:py-2 rounded-xl md:rounded-2xl border-2 border-black space-x-4 md:space-x-8">
            <div className="flex flex-col items-center">
              <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase leading-none">{mode === 'VERSUS' ? 'P1' : 'SKOR'}</p>
              <p className="font-black text-sm md:text-2xl text-[#FF3D00] leading-none">{scoreP1}</p>
            </div>
            {mode === 'VERSUS' && (
              <div className="flex flex-col items-center">
                <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase leading-none">P2</p>
                <p className="font-black text-sm md:text-2xl text-blue-600 leading-none">{scoreP2}</p>
              </div>
            )}
          </div>
        </div>

        {mode === 'SINGLE' ? (
          <div className="flex space-x-0.5 md:space-x-1">
             {[...Array(3)].map((_, i) => (
               <Heart key={i} className={`w-4 h-4 md:w-6 md:h-6 ${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-200'}`} />
             ))}
          </div>
        ) : (
          <Users className="w-4 h-4 md:w-6 md:h-6 text-black" />
        )}
      </div>

      {/* Arena Tembak - Responsive Container */}
      <div className="relative w-full max-w-4xl flex-1 bg-[#F8FAFC] rounded-[2rem] md:rounded-[3.5rem] border-4 md:border-8 border-black overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none"></div>
        
        {mode === 'VERSUS' && (
           <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-black/10 border-x border-dashed border-black/20"></div>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] px-6 md:px-10 py-3 md:py-6 rounded-xl md:rounded-3xl border-4 border-black font-black uppercase italic text-xl md:text-3xl shadow-2xl pointer-events-none ${feedback.type === 'GOOD' ? 'bg-green-500 text-white' : 'bg-red-600 text-white'}`}
            >
              {feedback.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Targets */}
        <div className="absolute inset-0 overflow-hidden">
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
                exit={{ scale: item.isStamped ? 1.1 : 0, opacity: 0 }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  const clickX = e.clientX;
                  const screenWidth = window.innerWidth;
                  const player = mode === 'VERSUS' ? (clickX < screenWidth / 2 ? 1 : 2) : 1;
                  handleShoot(item.id, player);
                }}
                // PERBAIKAN: Lebar kartu diperkecil (140px) dan dibatasi area spawn-nya (safeX) agar tidak terpotong.
                // Menggunakan padding yang lebih besar agar teks tidak mepet ke tepi border kartu.
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl border-2 md:border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center bg-white w-[140px] md:w-[240px] transition-all hover:scale-105 active:shadow-none select-none overflow-hidden ${
                  item.isStamped ? 'grayscale opacity-60' : ''
                }`}
                style={{ zIndex: 30 }}
              >
                <div className="w-full h-1 bg-slate-100 rounded-full mb-2 opacity-50"></div>
                <div className="px-1 md:px-2 pb-1 md:pb-2 w-full">
                  <span className="text-[10px] md:text-sm font-black uppercase italic text-center text-black leading-tight block break-words">
                    {item.text}
                  </span>
                </div>

                <AnimatePresence>
                  {item.isStamped && (
                    <motion.div 
                      initial={{ scale: 3, rotate: -40, opacity: 0 }}
                      animate={{ scale: 1, rotate: -15, opacity: 1 }}
                      className={`absolute inset-0 flex items-center justify-center border-4 md:border-[8px] m-1 rounded-lg font-black text-xl md:text-3xl z-40 bg-white/70 backdrop-blur-[1px] uppercase ${item.stampedBy === 1 ? 'border-[#FF3D00] text-[#FF3D00]' : 'border-blue-600 text-blue-600'}`}
                    >
                      {item.type === 'HOAX' ? 'BLOK!' : 'MIS!'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-10">
           <Crosshair className="w-48 h-48 md:w-96 md:h-96 text-black" />
        </div>
      </div>

      <div className="mt-2 md:mt-4 bg-white px-4 md:px-8 py-1.5 md:py-3 rounded-full border-2 md:border-4 border-black shadow-lg z-50">
        <p className="text-black font-black uppercase text-[7px] md:text-[10px] flex items-center italic">
          <Eye className="mr-1.5 md:mr-3 w-3 h-3 md:w-5 md:h-5 text-[#FF3D00]" /> 
          Tembak yang <strong>HOAKS</strong>, Biarkan yang <strong>FAKTA</strong>
        </p>
      </div>
    </div>
  );
};

export default HoaxShooter;
