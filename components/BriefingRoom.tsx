
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, BookOpen, PlayCircle, Youtube, MonitorPlay, ListVideo } from 'lucide-react';
import { Lesson } from '../types';
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

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
  };

  if (!current) return <div className="p-10 text-center font-black uppercase text-slate-400">Belum ada materi.</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-3 md:p-4 flex flex-col items-center overflow-y-auto">
      {/* Header Utama */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_#000]">
        <button onClick={onBack} className="flex items-center space-x-1.5 text-black hover:text-[#FF3D00] transition-all font-black uppercase text-[9px] md:text-[10px] group">
          <div className="bg-slate-100 p-1.5 rounded-lg border-2 border-black group-hover:bg-[#FF3D00] group-hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Lobi</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="bg-[#00E5FF] p-1.5 md:p-2.5 rounded-xl md:rounded-2xl border-[3px] border-black -rotate-2">
            <BookOpen className="text-black w-4 h-4 md:w-6 md:h-6" />
          </div>
          <h2 className="text-base md:text-2xl font-black uppercase tracking-tighter text-black italic leading-none">Briefing</h2>
        </div>

        <div className="bg-black text-white px-3 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-tighter border-b-2 border-slate-700">
          Modul {activeIdx + 1} / {lessons.length}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 md:gap-6 mb-8">
        {/* Area Konten Utama */}
        <div className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl md:rounded-[2.5rem] border-[3px] md:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col overflow-hidden"
            >
              <div className="p-5 md:p-8 border-b-2 border-slate-100 bg-white">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-1 bg-[#FFD600] rounded-full border border-black"></div>
                  <span className="text-black font-black uppercase text-[8px] italic opacity-60">EDITOR'S NOTE</span>
                </div>
                <h1 className="text-xl md:text-3xl font-black text-black uppercase italic tracking-tighter leading-tight">{current.title}</h1>
              </div>
              
              <div className="p-5 md:p-8 space-y-6 md:space-y-8 bg-slate-50/50">
                {activeVideo ? (
                  <div className="space-y-3">
                    <div className="aspect-video w-full bg-black rounded-2xl md:rounded-[2rem] border-[3px] border-black overflow-hidden relative shadow-lg">
                      <iframe 
                        className="absolute inset-0 w-full h-full"
                        src={getEmbedUrl(activeVideo.url)} 
                        title={activeVideo.title}
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="bg-black text-white px-4 py-2 rounded-xl text-[9px] md:text-[11px] font-black uppercase italic flex items-center justify-between">
                       <span className="truncate mr-2">● {activeVideo.title}</span>
                       <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-white rounded-2xl md:rounded-[2rem] border-2 border-black border-dashed flex flex-col items-center justify-center opacity-40">
                    <MonitorPlay className="w-12 h-12 mb-2" />
                    <p className="font-black text-[10px] italic">TIDAK ADA VIDEO</p>
                  </div>
                )}

                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 border-black shadow-sm">
                  <p className="text-sm md:text-lg text-black font-bold leading-relaxed whitespace-pre-line">
                    {current.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Playlist */}
        <div className="w-full lg:w-80 flex flex-col space-y-4 shrink-0 pb-8 lg:pb-0">
          <div className="bg-white p-5 rounded-3xl md:rounded-[2rem] border-[3px] md:border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col h-full">
            <h3 className="font-black uppercase text-[10px] md:text-xs mb-4 flex items-center italic">
              <ListVideo className="w-4 h-4 mr-2 text-[#FF3D00]" /> Playlist Video
            </h3>
            
            <div className="flex flex-col gap-2 max-h-[40vh] lg:max-h-none overflow-y-auto no-scrollbar">
              {current.videos.length > 0 ? (
                current.videos.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => { sounds.click(); setActiveVideoIdx(idx); }}
                    className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 text-left transition-all flex items-center space-x-3 ${activeVideoIdx === idx ? 'bg-[#FF3D00]/5 border-[#FF3D00]' : 'bg-slate-50 border-transparent'}`}
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 border-2 border-black ${activeVideoIdx === idx ? 'bg-[#FF3D00] text-white' : 'bg-white text-black'}`}>
                      {activeVideoIdx === idx ? <PlayCircle className="w-4 h-4" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                    </div>
                    <span className={`text-[10px] md:text-[11px] font-black uppercase leading-tight line-clamp-2 italic ${activeVideoIdx === idx ? 'text-[#FF3D00]' : 'text-black'}`}>
                      {vid.title}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-center text-[10px] font-bold opacity-30 py-4">Belum ada video</p>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t-2 border-slate-100 flex flex-col space-y-3">
              <button 
                onClick={activeIdx === lessons.length - 1 ? onBack : next}
                className="w-full py-4 bg-[#FF3D00] text-white border-[3px] border-black rounded-xl hover:scale-102 transition-all font-black uppercase text-[10px] md:text-xs shadow-[4px_4px_0px_#000]"
              >
                {activeIdx === lessons.length - 1 ? "SELESAI" : "LANJUT MODUL"}
              </button>
              
              {activeIdx > 0 && (
                <button onClick={prev} className="w-full py-2 bg-white text-black border-2 border-black rounded-xl font-black uppercase text-[9px] hover:bg-slate-50">
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
