
import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Home, Gamepad2, RotateCcw, AlertCircle, CheckCircle2, Info, ArrowRight, Play } from 'lucide-react';
import { NewsFragment, PuzzleLevel } from '../types';
import { sounds } from '../services/audio';

interface NewsArenaProps {
  onBack: () => void;
  puzzleLevels: PuzzleLevel[];
}

const NewsArena: React.FC<NewsArenaProps> = ({ onBack, puzzleLevels }) => {
  const [level, setLevel] = useState(0);
  const [fragments, setFragments] = useState<NewsFragment[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  // Daftar warna estetik untuk potongan berita
  const colors = [
    'bg-[#FFD600]', // Yellow
    'bg-[#00E5FF]', // Cyan
    'bg-[#A855F7]', // Purple (will use white text for this or light tint)
    'bg-[#FF8A65]', // Coral
    'bg-[#81C784]'  // Green
  ];

  const lightColors = [
    'bg-amber-100',
    'bg-cyan-100',
    'bg-purple-100',
    'bg-orange-100',
    'bg-green-100'
  ];

  useEffect(() => {
    if (puzzleLevels[level]) {
      const shuffled = [...puzzleLevels[level].fragments].sort(() => Math.random() - 0.5);
      setFragments(shuffled);
      setIsCorrect(null);
    }
  }, [level, puzzleLevels]);

  const checkSolution = () => {
    const correctOrder = puzzleLevels[level].fragments.map(f => f.id);
    const currentOrder = fragments.map(f => f.id);
    const success = JSON.stringify(correctOrder) === JSON.stringify(currentOrder);
    
    setIsCorrect(success);
    if (success) {
      sounds.success();
      setScore(s => s + 50);
    } else {
      sounds.wrong();
      setScore(s => Math.max(0, s - 10));
    }
  };

  const nextLevel = () => {
    sounds.click();
    if (level < puzzleLevels.length - 1) {
      setLevel(level + 1);
    } else {
      onBack();
    }
  };

  if (!puzzleLevels[level]) return <div className="p-20 text-center font-black">BELUM ADA LEVEL PUZZLE.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 flex flex-col items-center overflow-x-hidden pb-20">
      {/* Modal Instruksi yang Diperjelas */}
      {showInstructions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-white max-w-md w-full p-8 text-center rounded-[2.5rem] border-[4px] border-black shadow-[12px_12px_0px_#FF3D00]"
          >
            <div className="w-20 h-20 bg-[#FFD600] rounded-2xl border-4 border-black flex items-center justify-center mx-auto mb-6 rotate-3">
              <Gamepad2 className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-4 italic tracking-tighter">Misi Susun Berita</h2>
            <div className="space-y-4 text-left font-bold text-sm text-slate-700 mb-8 bg-slate-50 p-6 rounded-2xl border-2 border-black border-dashed">
              <p className="flex items-start">
                <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 mr-2">1</span>
                Baca setiap potongan teks dengan teliti.
              </p>
              <p className="flex items-start">
                <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 mr-2">2</span>
                Gunakan konsep <span className="text-[#FF3D00]">Piramida Terbalik</span>: Judul &rarr; Teras (Inti) &rarr; Tubuh (Penjelasan).
              </p>
              <p className="flex items-start">
                <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 mr-2">3</span>
                Tarik kotak untuk memindahkan posisinya.
              </p>
            </div>
            <button 
              onClick={() => { sounds.click(); setShowInstructions(false); }} 
              className="w-full py-5 bg-[#FF3D00] text-white font-black uppercase rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>MULAI TUGAS REDAKSI</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Header Arena */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black hover:text-[#FF3D00] transition-colors">
          <Home className="mr-1.5 w-4 h-4"/> <span className="hidden sm:inline">Lobi</span>
        </button>
        <div className="flex items-center space-x-2 text-black">
          <Gamepad2 className="text-[#FF3D00] w-5 h-5" />
          <h2 className="text-sm md:text-xl font-black uppercase tracking-tighter italic">Arena <span className="text-[#FF3D00]">Redaksi</span></h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-lg uppercase">Level {level + 1}</div>
        </div>
      </div>

      <div className="w-full max-w-3xl flex-1 flex flex-col space-y-6">
        {/* Kontainer Utama Puzzle */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] border-[4px] border-black shadow-[10px_10px_0px_#000]">
          <div className="mb-6 flex items-center justify-between border-b-2 border-slate-100 pb-4">
             <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#00E5FF]" />
                <p className="text-[10px] md:text-xs font-black uppercase text-slate-400">Susun sesuai struktur berita yang benar</p>
             </div>
             <button onClick={() => setLevel(level)} className="text-[10px] font-black uppercase text-slate-400 hover:text-black flex items-center">
                <RotateCcw className="w-3 h-3 mr-1" /> Acak Ulang
             </button>
          </div>

          <Reorder.Group axis="y" values={fragments} onReorder={setFragments} className="space-y-4">
            {fragments.map((frag, index) => (
              <Reorder.Item key={frag.id} value={frag} className="cursor-grab active:cursor-grabbing">
                <motion.div 
                  className={`${lightColors[index % lightColors.length]} p-5 md:p-6 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-none transition-all`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-white border-2 border-black w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-xs shadow-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm md:text-base font-bold text-black leading-relaxed tracking-tight">
                      {frag.text}
                    </p>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* Action Button & Feedback */}
        <div className="flex flex-col items-center">
          {isCorrect === null ? (
            <button 
              onClick={checkSolution} 
              className="w-full max-w-sm py-5 bg-[#FF3D00] text-white border-[4px] border-black rounded-2xl font-black uppercase text-lg shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
            >
              TERBITKAN BERITA! 🗞️
            </button>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className={`w-full max-w-xl p-5 rounded-2xl border-[4px] border-black flex flex-col md:flex-row items-center justify-between bg-white shadow-[8px_8px_0px_#000] gap-4`}
            >
              <div className="flex items-center space-x-4">
                {isCorrect ? (
                  <div className="bg-green-100 p-2 rounded-xl border-2 border-green-600">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-red-100 p-2 rounded-xl border-2 border-red-600">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-black text-lg uppercase leading-none italic">
                    {isCorrect ? 'Struktur Sempurna!' : 'Belum Sesuai Fakta!'}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                    {isCorrect ? 'Berita siap dikirim ke meja cetak.' : 'Coba baca alur informasinya sekali lagi.'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2 w-full md:w-auto">
                {!isCorrect && (
                  <button 
                    onClick={() => setIsCorrect(null)} 
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-black border-2 border-black rounded-xl font-black uppercase text-xs"
                  >
                    Atur Lagi
                  </button>
                )}
                <button 
                  onClick={isCorrect ? nextLevel : checkSolution} 
                  className={`flex-1 md:flex-none px-8 py-3 ${isCorrect ? 'bg-[#4CAF50]' : 'bg-[#FF3D00]'} text-white border-2 border-black rounded-xl font-black uppercase text-xs shadow-[4px_4px_0px_#000]`}
                >
                  {isCorrect ? 'Misi Berikutnya' : 'Cek Ulang'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Footer Hint */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none px-4">
        <div className="bg-black text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border-2 border-white/20 opacity-80">
          Tips: Judul &rarr; Teras Berita &rarr; Tubuh Berita
        </div>
      </div>
    </div>
  );
};

export default NewsArena;
