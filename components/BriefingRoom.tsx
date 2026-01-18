
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Info, BookOpen, PlayCircle, Youtube, MonitorPlay, ListVideo } from 'lucide-react';
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

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
  };

  if (!current) return <div className="p-20 text-center font-black uppercase italic tracking-tighter text-slate-400">Belum ada materi jurnalis tersedia.</div>;

  return (
    <div className="h-full bg-[#F1F5F9] p-4 flex flex-col items-center overflow-hidden">
      {/* Header Utama */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 bg-white p-4 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center space-x-2 text-black hover:text-[#FF3D00] transition-all font-black uppercase text-[10px] group">
          <div className="bg-slate-100 p-2 rounded-xl border-2 border-black group-hover:bg-[#FF3D00] group-hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <span className="hidden md:inline">Lobi Redaksi</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="bg-[#00E5FF] p-2.5 rounded-2xl border-4 border-black -rotate-2 shadow-sm">
            <BookOpen className="text-black w-6 h-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black italic leading-none">Ruang <span className="text-[#00E5FF]">Briefing</span></h2>
        </div>

        <div className="bg-black text-white px-5 py-2 rounded-2xl font-black uppercase text-[11px] tracking-tighter border-b-4 border-slate-700">
          Modul {activeIdx + 1} / {lessons.length}
        </div>
      </div>

      <div className="w-full max-w-6xl flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Area Konten Utama & Video */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0px_#000] flex-1 flex flex-col overflow-hidden relative"
            >
              {/* Judul & Badge */}
              <div className="p-6 md:p-8 border-b-4 border-slate-100 shrink-0 bg-white">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-1.5 bg-[#FFD600] rounded-full border-2 border-black"></div>
                  <span className="text-black font-black uppercase tracking-widest text-[9px] italic opacity-60">EDITOR'S NOTE</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-black uppercase italic tracking-tighter leading-none">{current.title}</h1>
              </div>
              
              {/* Scrollable Area for Video & Description */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8 bg-slate-50/50">
                {activeVideo ? (
                  <div className="space-y-4">
                    {/* Cinema Viewport */}
                    <div className="aspect-video w-full bg-black rounded-[2rem] border-4 border-black overflow-hidden shadow-2xl relative group">
                      <iframe 
                        className="absolute inset-0 w-full h-full"
                        src={getEmbedUrl(activeVideo.url)} 
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                      <div className="absolute top-4 left-4 pointer-events-none">
                         <div className="bg-[#FF3D00] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase border-2 border-black shadow-md flex items-center">
                            <MonitorPlay className="w-3 h-3 mr-1.5" /> Playing
                         </div>
                      </div>
                    </div>
                    
                    {/* Status Bar */}
                    <div className="bg-black text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase italic flex items-center justify-between shadow-lg">
                       <div className="flex items-center">
                          <span className="text-red-500 mr-2">●</span> {activeVideo.title}
                       </div>
                       <Youtube className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-white rounded-[2rem] border-4 border-black border-dashed flex flex-col items-center justify-center space-y-3 opacity-50">
                    <MonitorPlay className="w-16 h-16 text-slate-300" />
                    <p className="font-black text-slate-400 italic text-sm">TIDAK ADA VIDEO PADA MODUL INI</p>
                  </div>
                )}

                {/* Deskripsi Materi */}
                <div className="bg-white p-8 rounded-[2rem] border-2 border-black shadow-sm">
                   <h4 className="text-xs font-black uppercase text-[#00E5FF] mb-4 tracking-widest flex items-center italic">
                     <BookOpen className="w-4 h-4 mr-2" /> Penjelasan Materi
                   </h4>
                  <p className="text-base md:text-lg text-black font-bold leading-relaxed whitespace-pre-line">
                    {current.content}
                  </p>
                </div>

                {/* Tips Card */}
                <div className="flex items-start space-x-5 bg-[#FFD600] p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000]">
                  <div className="bg-white p-3 rounded-2xl border-2 border-black shadow-sm shrink-0">
                    <Info className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1.5 opacity-60 italic">Pesanan Redaktur</p>
                    <p className="text-lg font-black italic leading-tight text-black">"{current.meta}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Playlist */}
        <div className="w-full md:w-80 flex flex-col space-y-4 shrink-0 overflow-hidden min-h-0">
          <div className="bg-white p-5 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col h-full overflow-hidden">
            <h3 className="font-black uppercase text-xs mb-5 flex items-center italic text-black">
              <ListVideo className="w-4 h-4 mr-2 text-[#FF3D00]" /> Playlist Modul
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {current.videos.length > 0 ? (
                current.videos.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => { sounds.click(); setActiveVideoIdx(idx); }}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center space-x-4 group relative overflow-hidden ${activeVideoIdx === idx ? 'bg-[#FF3D00]/5 border-[#FF3D00] shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100 hover:border-black/10'}`}
                  >
                    {activeVideoIdx === idx && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF3D00]"></div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-black transition-transform group-hover:scale-105 ${activeVideoIdx === idx ? 'bg-[#FF3D00] text-white shadow-lg' : 'bg-white text-black'}`}>
                      {activeVideoIdx === idx ? <PlayCircle className="w-5 h-5" /> : <span className="text-xs font-black italic">{idx + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[11px] font-black uppercase leading-tight line-clamp-2 italic ${activeVideoIdx === idx ? 'text-[#FF3D00]' : 'text-black'}`}>
                        {vid.title}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 opacity-30 text-center">
                   <ListVideo className="w-10 h-10 mb-2" />
                   <p className="text-[10px] font-bold italic">Belum ada playlist</p>
                </div>
              )}
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-6 pt-5 border-t-4 border-slate-100 flex flex-col space-y-3 shrink-0">
              <button 
                onClick={activeIdx === lessons.length - 1 ? onBack : next}
                className="w-full py-4 bg-[#FF3D00] text-white border-4 border-black rounded-2xl hover:scale-102 active:translate-y-1 active:shadow-none transition-all font-black uppercase text-xs flex items-center justify-center shadow-[6px_6px_0px_#000] group"
              >
                <span>{activeIdx === lessons.length - 1 ? "SELESAI BELAJAR" : "LANJUT MODUL"}</span> 
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {activeIdx > 0 ? (
                <button onClick={prev} className="w-full py-3 bg-white text-black border-2 border-black rounded-xl font-black uppercase text-[10px] hover:bg-slate-50 flex items-center justify-center transition-colors">
                  <ChevronLeft className="mr-1.5 w-4 h-4" /> Modul Sebelumnya
                </button>
              ) : (
                <div className="h-10"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingRoom;
