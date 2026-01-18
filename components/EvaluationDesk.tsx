
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ClipboardCheck, CheckCircle2, XCircle, Award, Trophy, Star, Lightbulb, Sparkles, Info, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../constants';
import { getEditorFeedback } from '../services/gemini';
import { sounds } from '../services/audio';
import confetti from 'canvas-confetti';

interface EvaluationDeskProps {
  onBack: () => void;
}

const EvaluationDesk: React.FC<EvaluationDeskProps> = ({ onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [editorMsg, setEditorMsg] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const current = QUIZ_QUESTIONS[currentIdx];

  useEffect(() => {
    if (finished && displayScore < score) {
      const timer = setTimeout(() => {
        setDisplayScore(prev => Math.min(prev + 2, score));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [finished, displayScore, score]);

  const handleAnswer = async (idx: number) => {
    if (showFeedback) return;
    setSelectedOpt(idx);
    setShowFeedback(true);
    setLoadingMsg(true);

    const correct = idx === current.correctAnswer;
    if (correct) {
      sounds.correct();
      setScore(s => s + 10);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FFD600', '#ffffff', '#00E5FF']
      });
    } else {
      sounds.wrong();
    }

    const msg = await getEditorFeedback(current.options[idx], correct);
    setEditorMsg(msg);
    setLoadingMsg(false);
  };

  const nextQuestion = () => {
    sounds.click();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
      setShowFeedback(false);
      setEditorMsg("");
    } else {
      setFinished(true);
    }
  };

  const getPredikat = () => {
    const total = (score / (QUIZ_QUESTIONS.length * 10)) * 100;
    if (total >= 90) return { title: 'Editor Hebat', icon: <Trophy className="w-16 h-16 text-purple-600" />, color: 'text-purple-600', bg: 'bg-purple-100', medal: '🟣' };
    if (total >= 70) return { title: 'Jurnalis Muda', icon: <Award className="w-16 h-16 text-blue-600" />, color: 'text-blue-600', bg: 'bg-blue-100', medal: '🔵' };
    if (total >= 40) return { title: 'Berkembang', icon: <Star className="w-16 h-16 text-yellow-600" />, color: 'text-yellow-600', bg: 'bg-yellow-100', medal: '🟡' };
    return { title: 'Pemula', icon: <Star className="w-16 h-16 text-slate-400" />, color: 'text-slate-600', bg: 'bg-slate-100', medal: '🔰' };
  };

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  };

  if (finished) {
    const predikat = getPredikat();
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F1F5F9] p-4 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white p-8 rounded-[3rem] border-4 border-black max-w-lg w-full text-center relative shadow-[12px_12px_0px_#000]"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full border-4 border-black shadow-lg">
            {predikat.icon}
          </div>
          <div className="mt-8 space-y-1 mb-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Laporan Evaluasi Jurnalis</h2>
            <h1 className={`text-4xl font-black ${predikat.color} italic uppercase tracking-tighter leading-none`}>
              {predikat.medal} {predikat.title}
            </h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-[10px] text-black uppercase font-black mb-1 opacity-40">Skor Akhir</p>
              <p className="text-4xl font-black text-[#FF3D00] leading-none">{displayScore}</p>
            </div>
            <div className="bg-slate-50 border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-[10px] text-black uppercase font-black mb-1 opacity-40">Akurasi</p>
              <p className="text-4xl font-black text-[#00E5FF] leading-none">{Math.round((score / (QUIZ_QUESTIONS.length * 10)) * 100)}%</p>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-500 mb-6 italic leading-relaxed px-2">
            "Berita yang baik lahir dari ketelitian dan kejujuran. Teruslah mengasah kemampuanmu, Jurnalis!"
          </p>

          <button 
            onClick={onBack}
            className="group w-full py-4 bg-[#FF3D00] text-white border-4 border-black rounded-2xl font-black uppercase tracking-widest text-lg hover:scale-102 transition-all shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none flex items-center justify-center space-x-3"
          >
            <span>Kembali Ke Redaksi</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F1F5F9] p-4 flex flex-col items-center overflow-hidden">
       {/* Custom Header - More compact */}
       <div className="w-full max-w-4xl flex justify-between items-center mb-4 bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center space-x-2 text-black hover:text-[#FF3D00] transition-all font-black uppercase text-xs group">
          <div className="bg-slate-100 p-1.5 rounded-lg border-2 border-black group-hover:bg-[#FF3D00] group-hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Keluar</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-[#4CAF50] p-2 rounded-xl border-2 border-black rotate-2">
            <ClipboardCheck className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-black italic leading-none">Meja <span className="text-[#4CAF50]">Evaluasi</span></h2>
        </div>
        <div className="bg-black text-white px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-tighter">
          {currentIdx + 1} / {QUIZ_QUESTIONS.length}
        </div>
      </div>

      <div className="w-full max-w-4xl flex-1 flex flex-col justify-between">
        {/* Progress & Question Area */}
        <div className="text-center px-4">
           <div className="h-3 w-full bg-slate-200 rounded-full border-2 border-black overflow-hidden mb-4 shadow-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                className="h-full bg-[#4CAF50]"
              ></motion.div>
           </div>
           <motion.div
             key={currentIdx}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-4"
           >
             <h3 className="text-xl md:text-2xl font-black leading-tight text-black italic tracking-tighter">
               "{current.question}"
             </h3>
           </motion.div>
        </div>

        {/* Options Area - Grid always on desktop/tablet to save space */}
        <div className={`grid grid-cols-1 ${showFeedback ? 'md:grid-cols-2 gap-3' : 'md:grid-cols-2 gap-4'} mb-4`}>
          {current.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === current.correctAnswer;
            const showCorrect = showFeedback && isCorrect;
            const showWrong = showFeedback && isSelected && !isCorrect;

            return (
              <motion.button
                key={`${currentIdx}-${idx}`}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                animate={showWrong ? shakeAnimation : {}}
                onClick={() => handleAnswer(idx)}
                disabled={showFeedback}
                className={`group relative w-full p-4 rounded-xl border-4 text-left transition-all flex items-center shadow-[4px_4px_0px_#000] outline-none ${
                  showCorrect ? 'bg-green-50 border-green-600 shadow-[4px_4px_0px_#166534]' :
                  showWrong ? 'bg-red-50 border-red-600 shadow-[4px_4px_0px_#991b1b]' :
                  isSelected ? 'bg-blue-50 border-blue-600' : 'bg-white border-black hover:bg-slate-50'
                }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl border-2 border-black mr-4 transition-transform ${
                  showCorrect ? 'bg-green-500 text-white' :
                  showWrong ? 'bg-red-500 text-white' :
                  'bg-slate-100 text-black group-hover:bg-[#FFD600]'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm md:text-base font-black text-black tracking-tight leading-snug flex-1">
                  {opt}
                </span>
                <div className="absolute top-2 right-2">
                  {showCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-5 h-5 text-green-600" /></motion.div>}
                  {showWrong && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle className="w-5 h-5 text-red-600" /></motion.div>}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback Area - Compacted to fit on one screen */}
        <div className="min-h-[140px] flex items-end">
          <AnimatePresence>
            {showFeedback && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full p-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] relative overflow-hidden ${selectedOpt === current.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <div className="flex items-start gap-4">
                   <div className={`shrink-0 w-16 h-16 rounded-xl flex items-center justify-center border-2 border-black shadow-md ${selectedOpt === current.correctAnswer ? 'bg-[#4CAF50]' : 'bg-[#FF3D00]'}`}>
                      {loadingMsg ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : (
                        selectedOpt === current.correctAnswer ? <Sparkles className="w-8 h-8 text-white" /> : <Lightbulb className="w-8 h-8 text-white" />
                      )}
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">
                        {selectedOpt === current.correctAnswer ? 'Bagus!' : 'Evaluasi Editor'}
                      </p>
                      <p className="text-lg font-black italic text-black mb-2 leading-tight tracking-tight">
                        "{loadingMsg ? 'Sedang mengetik...' : editorMsg}"
                      </p>
                      <div className="bg-white/60 p-2 rounded-lg text-xs font-bold text-slate-800 border-2 border-black border-dashed flex items-start">
                         <Info className="w-3 h-3 mr-1.5 mt-0.5 shrink-0" /> 
                         <p className="leading-tight">{current.explanation}</p>
                      </div>
                   </div>
                   <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="self-center bg-black text-white p-4 rounded-xl hover:bg-slate-900 transition-all border-2 border-white shadow-lg outline-none group"
                  >
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center bg-white px-4 py-1 rounded-full border border-black/10">
        <Sparkles className="w-3 h-3 mr-2 text-yellow-500" /> Editor Hebat selalu teliti membaca fakta!
      </div>
    </div>
  );
};

export default EvaluationDesk;
