
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Info, BookOpen, PlayCircle, Youtube } from 'lucide-react';
import { Lesson, VideoItem } from '../types';
import { sounds } from '../services/audio';

interface BriefingRoomProps {
  onBack: () => void;
  lessons: Lesson[];
}

const BriefingRoom: React.FC<BriefingRoomProps> = ({ onBack, lessons }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const next = () => { 
    sounds.click(); 
    setActiveIdx((prev) => Math.min(prev + 1, lessons.length - 1)); 
    setActiveVideoIdx(0);
  };
  const prev = () => { 
    sounds.click(); 
    setActiveIdx((prev) => Math.max(prev - 1, 0)); 
    setActiveVideoIdx(0);
  };

  const current = lessons[activeIdx];
  const activeVideo = current?.videos?.[activeVideoIdx];

  // Helper untuk mengubah URL YouTube biasa menjadi Embed
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!current) return <div className="p-20 text-center font-black">BELUM ADA MATERI.</div>;

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F1F5F9] p-4 flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center space-x-2 text-black hover:text-[#FF3D00] transition-colors font-black uppercase text-xs group">
          <div className="bg-slate-100 p-1.5 rounded-lg border-2 border-black group-hover:bg-[#FF3D00] group-hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Lobi Redaksi</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-[#00E5FF] p-2 rounded-xl border-2 border-black rotate-2 shadow-sm">
            <BookOpen className="text-black w-6 h-6" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-black italic leading-none">Ruang <span className="text-[#00E5FF]">Briefing</span></h2>
        </div>
        <div className="bg-black text-white px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-tighter">
          Modul {activeIdx + 1} / {lessons.length}
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[2rem] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_#000] flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex items-center space-x-2 mb-4 shrink-0">
                <div className="w-12 h-2 bg-[#FFD600] rounded-full border-2 border-black"></div>
                <span className="text-black font-black uppercase tracking-widest text-[10px] italic">Editor's Note</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-black uppercase italic tracking-tighter border-b-4 border-slate-100 pb-2 shrink-0">{current.title}</h1>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                {activeVideo ? (
                  <div className="space-y-3">
                    <div className="aspect-video w-full bg-black rounded-3xl border-4 border-black overflow-hidden shadow-xl relative">
                      <iframe 
                        className="w-full h-full"
                        src={getEmbedUrl(activeVideo.url)} 
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase italic flex items-center justify-between">
                       <span>Now Playing: {activeVideo.title}</span>
                       <Youtube className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-slate-100 rounded-3xl border-4 border-black border-dashed flex items-center justify-center">
                    <p className="font-black text-slate-400 italic">TIDAK ADA VIDEO DI MODUL INI</p>
                  </div>
                )}

                <div className="bg-[#F8FAFC] p-6 rounded-3xl border-2 border-black border-dashed">
                  <p className="text-base md:text-lg text-black font-bold leading-relaxed whitespace-pre-line">
                    {current.content}
                  </p>
                </div>

                <div className="flex items-start space-x-4 bg-[#FFD600] p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000]">
                  <div className="bg-white p-2 rounded-xl border-2 border-black">
                    <Info className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1 opacity-60">Tips Khusus</p>
                    <p className="text-base font-black italic leading-tight">"{current.meta}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Playlist Sidebar */}
        <div className="w-full md:w-72 flex flex-col space-y-4 shrink-0 overflow-hidden">
          <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col h-full">
            <h3 className="font-black uppercase text-xs mb-4 flex items-center italic">
              <PlayCircle className="w-4 h-4 mr-2 text-red-500" /> Playlist Modul
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {current.videos.length > 0 ? (
                current.videos.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => { sounds.click(); setActiveVideoIdx(idx); }}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center space-x-3 group ${activeVideoIdx === idx ? 'bg-red-50 border-red-600' : 'bg-slate-50 border-black hover:border-red-500'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black ${activeVideoIdx === idx ? 'bg-red-500 text-white' : 'bg-white text-black'}`}>
                      {activeVideoIdx === idx ? <PlayCircle className="w-4 h-4" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                    </div>
                    <span className={`text-[10px] font-black uppercase leading-tight line-clamp-2 ${activeVideoIdx === idx ? 'text-red-700' : 'text-black'}`}>
                      {vid.title}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-400 text-center py-10 italic">Belum ada playlist</p>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t-2 border-black/10 flex flex-col space-y-3">
              <button 
                onClick={activeIdx === lessons.length - 1 ? onBack : next}
                className="w-full py-3 bg-[#FF3D00] text-white border-4 border-black rounded-xl hover:scale-105 shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all font-black uppercase text-xs flex items-center justify-center"
              >
                <span>{activeIdx === lessons.length - 1 ? "SELESAI" : "MODUL LANJUT"}</span> <ChevronRight className="ml-2 w-4 h-4" />
              </button>
              {activeIdx > 0 && (
                <button onClick={prev} className="w-full py-2 bg-white text-black border-2 border-black rounded-xl font-black uppercase text-[10px] hover:bg-slate-50">
                  Kembali
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingRoom;
