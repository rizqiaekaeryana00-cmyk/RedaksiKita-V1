
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Save, Plus, Trash2, BookOpen, ClipboardCheck, Gamepad2, Search, Video, Youtube, List, X } from 'lucide-react';
import { Lesson, Question, NewsFragment, InvestigationData, VideoItem } from '../types';
import { sounds } from '../services/audio';

interface AdminSettingsProps {
  lessons: Lesson[];
  setLessons: (l: Lesson[]) => void;
  quizzes: Question[];
  setQuizzes: (q: Question[]) => void;
  puzzles: NewsFragment[][];
  setPuzzles: (p: NewsFragment[][]) => void;
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
    <div className="h-[calc(100vh-80px)] bg-slate-100 flex flex-col overflow-hidden">
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
            <div className="bg-purple-100 p-4 rounded-xl border-2 border-purple-600 border-dashed">
              <p className="text-[10px] font-black text-purple-700 uppercase leading-none mb-1">Info Database</p>
              <p className="text-xs font-bold text-purple-900">Perubahan pada materi akan otomatis tersimpan di Firebase. Gunakan URL YouTube (v=xxx atau youtu.be) untuk playlist.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {props.lessons.map(lesson => (
                <div key={lesson.id} className="bg-white p-6 rounded-[2rem] border-4 border-black flex flex-col space-y-4 shadow-md relative group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-black uppercase text-lg italic text-black leading-none mb-2">{lesson.title}</h4>
                      <p className="text-[11px] font-bold text-slate-500 line-clamp-2 italic">"{lesson.content}"</p>
                    </div>
                    <button onClick={() => deleteItem('LESSONS', lesson.id)} className="p-3 bg-red-50 text-red-600 border-2 border-black rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  
                  {/* Playlist Manager */}
                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-black border-dashed space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                      <Youtube className="w-3 h-3 mr-1 text-red-500" /> Playlist Video YouTube
                    </h5>
                    <div className="space-y-2">
                      {lesson.videos.map((vid, vIdx) => (
                        <div key={vid.id} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-black/10">
                          <span className="text-[10px] font-black text-slate-300 w-4">{vIdx + 1}</span>
                          <input 
                            className="flex-1 text-[10px] font-bold outline-none border-r border-black/5 pr-2" 
                            value={vid.title} 
                            placeholder="Judul Video"
                            onChange={(e) => {
                              const newVids = [...lesson.videos];
                              newVids[vIdx].title = e.target.value;
                              updateLessonVideos(lesson.id, newVids);
                            }}
                          />
                          <input 
                            className="flex-1 text-[10px] font-mono outline-none text-blue-600" 
                            value={vid.url} 
                            placeholder="Link YouTube"
                            onChange={(e) => {
                              const newVids = [...lesson.videos];
                              newVids[vIdx].url = e.target.value;
                              updateLessonVideos(lesson.id, newVids);
                            }}
                          />
                          <button onClick={() => {
                            updateLessonVideos(lesson.id, lesson.videos.filter((_, idx) => idx !== vIdx));
                          }} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          updateLessonVideos(lesson.id, [...lesson.videos, { id: Date.now().toString(), title: "Video Baru", url: "" }]);
                        }}
                        className="w-full py-2 bg-white border-2 border-black border-dotted rounded-xl text-[10px] font-black uppercase flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Tambah Video ke Playlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AddLessonForm onAdd={(l) => props.setLessons([...props.lessons, l])} />
          </div>
        )}

        {/* Tab lain tetap sama tapi dengan styling yang konsisten */}
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
            <p className="text-center text-[10px] font-black text-slate-400 border-2 border-black border-dotted p-6 rounded-2xl">Fitur tambah kuis via dashboard akan segera hadir.</p>
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
