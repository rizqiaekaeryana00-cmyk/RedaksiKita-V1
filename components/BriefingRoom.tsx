
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Info, BookOpen, PlayCircle } from 'lucide-react';
import { LESSONS } from '../constants';
import { sounds } from '../services/audio';

interface BriefingRoomProps {
  onBack: () => void;
}

const BriefingRoom: React.FC<BriefingRoomProps> = ({ onBack }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = () => { sounds.click(); setActiveIdx((prev) => Math.min(prev + 1, LESSONS.length - 1)); };
  const prev = () => { sounds.click(); setActiveIdx((prev) => Math.max(prev - 1, 0)); };

  const current = LESSONS[activeIdx];

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F1F5F9] p-4 flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center space-x-2 text-black hover:text-[#FF3D00] transition-colors font-black uppercase text-xs group">
          <div className="bg-slate-100 p-1.5 rounded-lg border-2 border-black group-hover:bg-[#FF3D00] group-hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Lobi</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-[#00E5FF] p-2 rounded-xl border-2 border-black rotate-2">
            <BookOpen className="text-black w-6 h-6" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-black italic leading-none">Ruang <span className="text-[#00E5FF]">Briefing</span></h2>
        </div>
        <div className="bg-black text-white px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-tighter">
          {activeIdx + 1} / {LESSONS.length}
        </div>
      </div>

      {/* Card Content - Optimized for "One Screen" */}
      <div className="w-full max-w-4xl flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-[2.5rem] border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_#000] flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex items-center space-x-2 mb-4 shrink-0">
              <div className="w-12 h-2 bg-[#FFD600] rounded-full border-2 border-black"></div>
              <span className="text-black font-black uppercase tracking-widest text-[10px] italic">Informasi Materi</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-black uppercase italic tracking-tighter border-b-4 border-slate-100 pb-2 shrink-0">{current.title}</h1>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-6 space-y-6">
              {current.videoUrl && (
                <div className="aspect-video w-full bg-black rounded-2xl border-4 border-black overflow-hidden shadow-lg shrink-0">
                  <iframe 
                    className="w-full h-full"
                    src={current.videoUrl} 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="bg-[#F8FAFC] p-6 md:p-8 rounded-3xl border-2 border-black border-dashed">
                <p className="text-lg md:text-xl text-black font-bold leading-relaxed whitespace-pre-line">
                  {current.content}
                </p>
              </div>

              {/* Step-by-step indicator for Steps lesson */}
              {current.id === 'langkah' && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="bg-white border-2 border-black p-2 rounded-xl text-center">
                      <div className="w-6 h-6 bg-black text-white rounded-full mx-auto mb-1 text-[10px] flex items-center justify-center font-black">{i}</div>
                      <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF3D00] w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Tip Section - Fixed at bottom of card */}
            <div className="flex items-start space-x-4 bg-[#FFD600] p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] shrink-0">
              <div className="bg-white p-2 rounded-xl border-2 border-black shadow-sm">
                <Info className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1 opacity-60">Pesan Penting Redaktur</p>
                <p className="text-base md:text-lg text-black font-black italic leading-tight">"{current.meta}"</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - Compact & Consistent */}
      <div className="w-full max-w-4xl flex justify-between mt-6 px-2">
        <button 
          onClick={prev}
          disabled={activeIdx === 0}
          className="flex items-center space-x-2 px-8 py-4 bg-white border-4 border-black rounded-2xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black uppercase text-sm text-black shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none"
        >
          <ChevronLeft className="w-5 h-5" /> <span>Sebelumnya</span>
        </button>
        
        <div className="hidden sm:flex items-center space-x-1">
          {LESSONS.map((_, i) => (
            <div key={i} className={`h-2 rounded-full border border-black transition-all ${i === activeIdx ? 'w-8 bg-[#FF3D00]' : 'w-2 bg-slate-300'}`}></div>
          ))}
        </div>

        <button 
          onClick={activeIdx === LESSONS.length - 1 ? onBack : next}
          className="flex items-center space-x-2 px-10 py-4 bg-[#FF3D00] text-white border-4 border-black rounded-2xl hover:scale-105 shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all font-black uppercase text-sm"
        >
          <span>{activeIdx === LESSONS.length - 1 ? "Saya Paham!" : "Lanjut"}</span> <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BriefingRoom;
