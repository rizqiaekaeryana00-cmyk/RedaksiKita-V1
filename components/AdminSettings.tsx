
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Save, Plus, Trash2, BookOpen, ClipboardCheck, Gamepad2, Search, Video, Youtube, List, X, Link as LinkIcon } from 'lucide-react';
import { Lesson, Question, NewsFragment, InvestigationData, VideoItem, PuzzleLevel } from '../types';
import { sounds } from '../services/audio';

interface AdminSettingsProps {
  lessons: Lesson[];
  setLessons: (l: Lesson[]) => void;
  quizzes: Question[];
  setQuizzes: (q: Question[]) => void;
  puzzles: PuzzleLevel[];
  setPuzzles: (p: PuzzleLevel[]) => void;
  investigations: InvestigationData[];
  setInvestigations: (i: InvestigationData[]) => void;
  onBack: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'LESSONS' | 'QUIZ' | 'PUZZLE' | 'INVESTIGATION'>('LESSONS');

  const deleteItem = (type: string, id: string | number) => {
    sounds.wrong();
    if (type === 'LESSONS') props.setLessons(props.lessons.filter(l => l.id !== id));
    if (type === 'QUIZ') props.setQuizzes(props.quizzes.filter(q => q.id !== id));
    if (type === 'INVESTIGATION') props.setInvestigations(props.investigations.filter(i => i.id !== id));
    if (type === 'PUZZLE') props.setPuzzles(props.puzzles.filter((_, idx) => idx !== id));
  };

  const updateLessonVideos = (lessonId: string, videos: VideoItem[]) => {
    props.setLessons(props.lessons.map(l => l.id === lessonId ? { ...l, videos } : l));
  };

  return (
    <div className="h-full bg-slate-100 flex flex-col overflow-hidden">
      {/* Settings Header */}
      <div className="bg-white p-4 border-b-4 border-black flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-xl border-2 border-black rotate-3">
            <Save className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Pusat <span className="text-purple-600">Konten Redaksi</span></h2>
        </div>
        <button onClick={props.onBack} className="btn-primary px-6 py-2 text-white font-black uppercase rounded-xl flex items-center shadow-sm">
          <Home className="mr-2 w-4 h-4" /> Lobi
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b-2 border-black flex overflow-x-auto no-scrollbar">
        {[
          { id: 'LESSONS', label: 'Briefing (Materi)', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'QUIZ', label: 'Evaluasi (Kuis)', icon: <ClipboardCheck className="w-4 h-4" /> },
          { id: 'PUZZLE', label: 'Arena (Puzzle)', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'INVESTIGATION', label: 'Investigasi', icon: <Search className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { sounds.click(); setActiveTab(tab.id as any); }}
            className={`px-8 py-4 font-black uppercase text-[10px] md:text-xs flex items-center space-x-2 border-r-2 border-black transition-colors shrink-0 ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'hover:bg-purple-50 text-black'}`}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {activeTab === 'LESSONS' && (
          <div className="space-y-6">
            <div className="bg-purple-100 p-4 rounded-2xl border-2 border-purple-600 border-dashed flex items-start space-x-3">
              <Youtube className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <p className="text-[10px] font-black text-purple-700 uppercase leading-none mb-1">Panduan Video</p>
                <p className="text-xs font-bold text-purple-900 leading-tight">Masukkan link YouTube yang valid. Sistem akan otomatis memutar video tersebut di halaman materi siswa.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {props.lessons.map(lesson => (
                <div key={lesson.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black flex flex-col space-y-6 shadow-[8px_8px_0px_#000] relative group">
                  <div className="flex justify-between items-start border-b-2 border-slate-100 pb-4">
                    <div className="flex-1">
                      <h4 className="font-black uppercase text-xl italic text-black leading-none mb-2">{lesson.title}</h4>
                      <p className="text-[11px] font-bold text-slate-500 line-clamp-2 italic">"{lesson.content}"</p>
                    </div>
                    <button 
                      onClick={() => deleteItem('LESSONS', lesson.id)} 
                      className="p-3 bg-red-50 text-red-600 border-2 border-black rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                      title="Hapus Materi"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Playlist Manager */}
                  <div className="bg-slate-50 p-6 rounded-3xl border-2 border-black border-dashed space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-black uppercase text-slate-500 flex items-center italic">
                        <Youtube className="w-4 h-4 mr-2 text-red-600" /> Pengaturan Playlist Video
                      </h5>
                      <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-black/10">
                        {lesson.videos.length} VIDEO AKTIF
                      </span>
                    </div>

                    <div className="space-y-4">
                      {lesson.videos.map((vid, vIdx) => (
                        <div key={vid.id} className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] relative group/video">
                          <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-md z-10">
                            {vIdx + 1}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center">
                                <Video className="w-3 h-3 mr-1" /> Judul Tampilan
                              </label>
                              <input 
                                className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold text-xs outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-300" 
                                value={vid.title} 
                                placeholder="Contoh: Langkah-langkah Wawancara"
                                onChange={(e) => {
                                  const newVids = [...lesson.videos];
                                  newVids[vIdx].title = e.target.value;
                                  updateLessonVideos(lesson.id, newVids);
                                }}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center">
                                <LinkIcon className="w-3 h-3 mr-1" /> Link URL YouTube
                              </label>
                              <div className="relative">
                                <input 
                                  className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 font-mono text-[10px] text-blue-600 outline-none focus:border-red-500 focus:bg-white transition-all pr-10 placeholder:text-slate-300" 
                                  value={vid.url} 
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  onChange={(e) => {
                                    const newVids = [...lesson.videos];
                                    newVids[vIdx].url = e.target.value;
                                    updateLessonVideos(lesson.id, newVids);
                                  }}
                                />
                                <Youtube className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 opacity-20" />
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              sounds.wrong();
                              updateLessonVideos(lesson.id, lesson.videos.filter((_, idx) => idx !== vIdx));
                            }} 
                            className="absolute -top-2 -right-2 p-2 bg-red-50 text-red-600 rounded-xl border border-black hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover/video:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button 
                        onClick={() => {
                          sounds.click();
                          updateLessonVideos(lesson.id, [...lesson.videos, { id: Date.now().toString(), title: "", url: "" }]);
                        }}
                        className="w-full py-5 bg-white border-4 border-black border-dashed rounded-[1.5rem] text-[10px] font-black uppercase flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all group/add"
                      >
                        <Plus className="w-5 h-5 mr-2" /> Tambah Video Ke Playlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AddLessonForm onAdd={(l) => props.setLessons([...props.lessons, l])} />
          </div>
        )}

        {activeTab === 'PUZZLE' && (
          <div className="space-y-4">
             <h3 className="font-black uppercase text-black italic">Arena Puzzle (Level)</h3>
             <div className="grid grid-cols-1 gap-4">
                {props.puzzles.map((level, idx) => (
                  <div key={level.id} className="bg-white p-4 rounded-2xl border-4 border-black flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-black text-sm mb-1 uppercase tracking-tight">Level {idx + 1}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic">{level.fragments.length} Fragmen Berita</p>
                    </div>
                    <button onClick={() => deleteItem('PUZZLE', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'QUIZ' && (
          <div className="space-y-4">
            <h3 className="font-black uppercase text-black italic">Daftar Soal Kuis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {props.quizzes.map(quiz => (
                <div key={quiz.id} className="bg-white p-5 rounded-2xl border-4 border-black flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-black text-sm mb-2">{quiz.question}</p>
                    <p className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black inline-block uppercase">Benar: {quiz.options[quiz.correctAnswer]}</p>
                  </div>
                  <button onClick={() => deleteItem('QUIZ', quiz.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'INVESTIGATION' && (
          <div className="space-y-4">
            <h3 className="font-black uppercase text-black italic">Daftar Bukti Investigasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {props.investigations.map(inv => (
                <div key={inv.id} className="bg-white p-4 rounded-2xl border-4 border-black flex justify-between items-center shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl border-2 border-black ${inv.isFact ? 'bg-green-100' : 'bg-red-100'}`}>
                        {inv.type === 'PHOTO' && <Search className="w-4 h-4" />}
                        {inv.type === 'INTERVIEW' && <Video className="w-4 h-4" />}
                        {inv.type === 'DOCUMENT' && <List className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase leading-none mb-1">{inv.title}</p>
                      <p className={`text-[8px] font-black px-2 py-0.5 rounded-full inline-block border border-black ${inv.isFact ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{inv.isFact ? 'FAKTA' : 'HOAKS'}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem('INVESTIGATION', inv.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AddLessonForm = ({ onAdd }: { onAdd: (l: Lesson) => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState('');

  const submit = () => {
    if (title && content) {
      sounds.success();
      onAdd({ 
        id: Date.now().toString(), 
        title, 
        content, 
        videos: [], 
        meta: meta || "Pesan Redaktur" 
      });
      setTitle(''); setContent(''); setMeta('');
    }
  };

  return (
    <div className="bg-purple-50 p-8 rounded-[3rem] border-4 border-purple-600 border-dashed space-y-4 shadow-inner">
      <div className="flex items-center space-x-2 text-purple-600 mb-2">
        <Plus className="w-6 h-6" />
        <h4 className="font-black uppercase text-sm tracking-tighter">Tambah Materi Baru</h4>
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul Modul..." className="w-full p-4 border-4 border-black rounded-2xl font-bold text-sm shadow-[2px_2px_0px_#000]" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Isi materi lengkap..." rows={4} className="w-full p-4 border-4 border-black rounded-2xl font-bold text-sm shadow-[2px_2px_0px_#000]" />
      <input value={meta} onChange={e => setMeta(e.target.value)} placeholder="Tips Redaktur..." className="w-full p-4 border-4 border-black rounded-2xl font-bold text-sm shadow-[2px_2px_0px_#000]" />
      <button onClick={submit} className="bg-purple-600 text-white w-full py-4 rounded-2xl font-black uppercase flex items-center justify-center shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
        <Save className="mr-2" /> Publikasikan ke Siswa
      </button>
    </div>
  );
};

export default AdminSettings;
