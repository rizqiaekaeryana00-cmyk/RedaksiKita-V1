
import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Home, Gamepad2, RotateCcw, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { NewsFragment } from '../types';
import { sounds } from '../services/audio';

interface NewsArenaProps {
  onBack: () => void;
  puzzleLevels: NewsFragment[][];
}

const NewsArena: React.FC<NewsArenaProps> = ({ onBack, puzzleLevels }) => {
  const [level, setLevel] = useState(0);
  const [fragments, setFragments] = useState<NewsFragment[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (puzzleLevels[level]) {
      const shuffled = [...puzzleLevels[level]].sort(() => Math.random() - 0.5);
      setFragments(shuffled);
      setIsCorrect(null);
    }
  }, [level, puzzleLevels]);

  const checkSolution = () => {
    const correctOrder = puzzleLevels[level].map(f => f.id);
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
    <div className="h-full bg-[#F8FAFC] p-4 flex flex-col items-center overflow-hidden">
      {showInstructions && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="glass-card max-w-sm p-6 text-center bg-white rounded-3xl">
            <Gamepad2 className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h2 className="text-xl font-black uppercase mb-2">Cara Bermain</h2>
            <p className="font-bold mb-6 text-sm text-slate-700">Tarik dan pindahkan kotak teks. Susun sesuai Struktur: Judul &rarr; Teras (Lead) &rarr; Tubuh Berita.</p>
            <button onClick={() => { sounds.click(); setShowInstructions(false); }} className="btn-primary w-full py-3 text-white font-black uppercase rounded-xl">Siap, Mulai!</button>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-4xl flex justify-between items-center mb-4 bg-white p-3 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black"><Home className="mr-1.5 w-4 h-4"/> Lobi</button>
        <div className="flex items-center space-x-2 text-black">
          <Gamepad2 className="text-red-500 w-5 h-5" />
          <h2 className="text-lg font-black uppercase tracking-tighter italic">Arena <span className="text-red-500">Redaksi</span></h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-[10px] font-black text-black uppercase">Lv. {level + 1}</div>
          <div className="text-xs font-black bg-black text-white px-3 py-1 rounded-full">Score: {score}</div>
        </div>
      </div>

      <div className="w-full max-w-3xl flex-1 flex flex-col overflow-hidden">
        <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] flex-1 overflow-y-auto custom-scrollbar mb-4">
          <Reorder.Group axis="y" values={fragments} onReorder={setFragments} className="space-y-3">
            {fragments.map((frag) => (
              <Reorder.Item key={frag.id} value={frag} className="cursor-grab active:cursor-grabbing">
                <motion.div className="bg-slate-50 p-4 rounded-xl border-2 border-black hover:bg-slate-100 transition-colors shadow-sm">
                  <div className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block mb-1.5 uppercase border border-black ${frag.type === 'TITLE' ? 'bg-red-400' : 'bg-blue-400 text-white'}`}>{frag.type}</div>
                  <p className="text-sm font-bold text-black">{frag.text}</p>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <div className="shrink-0 flex flex-col items-center pb-2">
          {isCorrect === null ? (
            <button onClick={checkSolution} className="btn-primary w-full max-w-sm py-4 text-white font-black uppercase text-lg">Terbitkan Berita!</button>
          ) : (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`w-full max-w-2xl p-4 rounded-xl border-4 border-black flex items-center justify-between bg-white shadow-[6px_6px_0px_#000]`}>
              <div className="flex items-center space-x-3">
                {isCorrect ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <AlertCircle className="w-8 h-8 text-red-500" />}
                <div className="text-black">
                  <h4 className="font-black text-base uppercase leading-none">{isCorrect ? 'Sempurna!' : 'Coba Lagi!'}</h4>
                </div>
              </div>
              <button onClick={isCorrect ? nextLevel : () => setIsCorrect(null)} className="btn-primary px-5 py-2 text-white font-black uppercase text-xs rounded-lg">{isCorrect ? 'Level Berikutnya' : 'Ulangi'}</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsArena;
