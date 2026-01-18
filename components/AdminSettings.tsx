
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Save, Plus, Trash2, BookOpen, ClipboardCheck, Gamepad2, Search, 
  Video, Youtube, List, X, Link as LinkIcon, CloudCheck, Loader2, Edit3, 
  Check, AlertTriangle, FileText, Layers, Hash, ShieldAlert, PenTool, Smile
} from 'lucide-react';
import { Lesson, Question, NewsFragment, InvestigationData, VideoItem, PuzzleLevel, WritingEvent, HoaxPoolItem } from '../types';
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
  writingEvents: WritingEvent[];
  setWritingEvents: (e: WritingEvent[]) => void;
  hoaxPool: HoaxPoolItem[];
  setHoaxPool: (h: HoaxPoolItem[]) => void;
  onBack: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'LESSONS' | 'QUIZ' | 'PUZZLE' | 'INVESTIGATION' | 'WRITING' | 'HOAX'>('LESSONS');
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [lastSaved, setLastSaved] = useState<string>('');

  useEffect(() => {
    if (syncStatus === 'SUCCESS') {
      const timer = setTimeout(() => setSyncStatus('IDLE'), 3000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  const wrapUpdate = async (type: string, action: () => void) => {
    setSyncStatus('SAVING');
    action();
    setTimeout(() => {
      setSyncStatus('SUCCESS');
      setLastSaved(new Date().toLocaleTimeString());
    }, 800);
  };

  const deleteItem = (type: string, id: string | number) => {
    if (!window.confirm("Yakin ingin menghapus item ini? Data tidak bisa dikembalikan.")) return;
    sounds.wrong();
    wrapUpdate(type, () => {
      if (type === 'LESSONS') props.setLessons(props.lessons.filter(l => l.id !== id));
      if (type === 'QUIZ') props.setQuizzes(props.quizzes.filter(q => q.id !== id));
      if (type === 'INVESTIGATION') props.setInvestigations(props.investigations.filter(i => i.id !== id));
      if (type === 'PUZZLE') props.setPuzzles(props.puzzles.filter(p => p.id !== id));
      if (type === 'WRITING') props.setWritingEvents(props.writingEvents.filter(e => e.id !== id));
      if (type === 'HOAX') props.setHoaxPool(props.hoaxPool.filter(h => h.id !== id));
    });
  };

  return (
    <div className="h-full bg-slate-100 flex flex-col overflow-hidden">
      {/* Settings Header */}
      <div className="bg-white p-4 border-b-4 border-black flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-xl border-2 border-black rotate-3">
            <Save className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">Editor <span className="text-purple-600">Utama Redaksi</span></h2>
            <div className="flex items-center mt-1">
              <AnimatePresence mode="wait">
                {syncStatus === 'SAVING' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center text-[9px] font-black text-blue-600 uppercase italic">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Menyimpan Ke Cloud...
                  </motion.div>
                )}
                {syncStatus === 'SUCCESS' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center text-[9px] font-black text-green-600 uppercase italic">
                    <CloudCheck className="w-3 h-3 mr-1" /> Sinkron Berhasil {lastSaved && `(${lastSaved})`}
                  </motion.div>
                )}
                {syncStatus === 'IDLE' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-[9px] font-black text-slate-400 uppercase italic">
                    Mode Editor Aktif
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <button onClick={props.onBack} className="bg-black text-white px-6 py-2 font-black uppercase rounded-xl flex items-center shadow-sm border-2 border-white hover:bg-slate-900 transition-all">
          <Home className="mr-2 w-4 h-4" /> Tutup
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b-2 border-black flex overflow-x-auto no-scrollbar">
        {[
          { id: 'LESSONS', label: 'Briefing', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'QUIZ', label: 'Evaluasi', icon: <ClipboardCheck className="w-4 h-4" /> },
          { id: 'PUZZLE', label: 'Arena', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'INVESTIGATION', label: 'Investigasi', icon: <Search className="w-4 h-4" /> },
          { id: 'WRITING', label: 'Menulis', icon: <PenTool className="w-4 h-4" /> },
          { id: 'HOAX', label: 'Hoax Shot', icon: <ShieldAlert className="w-4 h-4" /> },
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

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#F8FAFC]">
        {activeTab === 'LESSONS' && (
          <div className="grid grid-cols-1 gap-6">
            {props.lessons.map(lesson => (
              <LessonEditor 
                key={lesson.id} 
                lesson={lesson} 
                onUpdate={(updated) => wrapUpdate('LESSONS', () => props.setLessons(props.lessons.map(l => l.id === lesson.id ? updated : l)))}
                onDelete={() => deleteItem('LESSONS', lesson.id)}
              />
            ))}
            <AddButton label="Tambah Modul Materi" onClick={() => {
              const newLesson: Lesson = { id: Date.now().toString(), title: "Modul Baru", content: "Isi materi di sini...", videos: [], meta: "Tips Redaktur" };
              props.setLessons([...props.lessons, newLesson]);
            }} />
          </div>
        )}

        {activeTab === 'QUIZ' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {props.quizzes.map((quiz) => (
              <QuizEditor 
                key={quiz.id} 
                quiz={quiz} 
                onUpdate={(updated) => wrapUpdate('QUIZ', () => props.setQuizzes(props.quizzes.map(q => q.id === quiz.id ? updated : q)))}
                onDelete={() => deleteItem('QUIZ', quiz.id)}
              />
            ))}
            <AddButton label="Tambah Soal Kuis" onClick={() => {
              const newQuiz: Question = { id: Date.now(), question: "Pertanyaan Baru?", options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"], correctAnswer: 0, explanation: "Penjelasan kebenaran fakta." };
              props.setQuizzes([...props.quizzes, newQuiz]);
            }} />
          </div>
        )}

        {activeTab === 'INVESTIGATION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.investigations.map(inv => (
              <InvestigationEditor 
                key={inv.id} 
                data={inv} 
                onUpdate={(updated) => wrapUpdate('INVESTIGATION', () => props.setInvestigations(props.investigations.map(i => i.id === inv.id ? updated : i)))}
                onDelete={() => deleteItem('INVESTIGATION', inv.id)}
              />
            ))}
            <AddButton label="Tambah Bukti Investigasi" onClick={() => {
              const newInv: InvestigationData = { id: Date.now().toString(), title: "Bukti Baru", type: 'PHOTO', content: "Deskripsi bukti...", isFact: true };
              props.setInvestigations([...props.investigations, newInv]);
            }} />
          </div>
        )}

        {activeTab === 'PUZZLE' && (
          <div className="grid grid-cols-1 gap-8">
            {props.puzzles.map((level, pIdx) => (
              <PuzzleEditor 
                key={level.id} 
                level={level} 
                index={pIdx}
                onUpdate={(updated) => wrapUpdate('PUZZLE', () => props.setPuzzles(props.puzzles.map(p => p.id === level.id ? updated : p)))}
                onDelete={() => deleteItem('PUZZLE', level.id)}
              />
            ))}
            <AddButton label="Tambah Level Puzzle" onClick={() => {
              const newLevel: PuzzleLevel = { id: Date.now().toString(), fragments: [{ id: Date.now().toString(), text: "Fragmen Baru", type: 'TITLE' }] };
              props.setPuzzles([...props.puzzles, newLevel]);
            }} />
          </div>
        )}

        {activeTab === 'WRITING' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {props.writingEvents.map(event => (
              <WritingEventEditor
                key={event.id}
                event={event}
                onUpdate={(updated) => wrapUpdate('WRITING', () => props.setWritingEvents(props.writingEvents.map(e => e.id === event.id ? updated : e)))}
                onDelete={() => deleteItem('WRITING', event.id)}
              />
            ))}
            <AddButton label="Tambah Tema Menulis" onClick={() => {
              const newEvent: WritingEvent = { id: Date.now().toString(), title: "Tema Baru", icon: "📝" };
              props.setWritingEvents([...props.writingEvents, newEvent]);
            }} />
          </div>
        )}

        {activeTab === 'HOAX' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {props.hoaxPool.map(item => (
              <HoaxItemEditor
                key={item.id}
                item={item}
                onUpdate={(updated) => wrapUpdate('HOAX', () => props.setHoaxPool(props.hoaxPool.map(h => h.id === item.id ? updated : h)))}
                onDelete={() => deleteItem('HOAX', item.id)}
              />
            ))}
            <AddButton label="Tambah Item Hoax Shot" onClick={() => {
              const newItem: HoaxPoolItem = { id: Date.now().toString(), text: "[Tulis Kalimat Berita Di Sini]", isHoax: true };
              props.setHoaxPool([...props.hoaxPool, newItem]);
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS EDITOR ---

const AddButton = ({ label, onClick }: any) => (
  <button onClick={() => { sounds.click(); onClick(); }} className="h-full min-h-[150px] bg-white border-4 border-black border-dashed rounded-[2rem] flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-600 hover:text-purple-600 transition-all group">
    <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
    <span className="font-black uppercase text-xs">{label}</span>
  </button>
);

const LessonEditor: React.FC<{ lesson: Lesson, onUpdate: (l: Lesson) => void, onDelete: () => void }> = ({ lesson, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(lesson);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0px_#000] space-y-4">
      <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          < BookOpen className="text-purple-600 w-5 h-5" />
          <h4 className="font-black uppercase text-sm italic">{draft.title}</h4>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => { if(isEditing) onUpdate(draft); setIsEditing(!isEditing); sounds.click(); }} className={`p-2 rounded-lg border-2 border-black ${isEditing ? 'bg-green-500 text-white' : 'bg-slate-100'}`}>
            {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
          <button onClick={onDelete} className="p-2 bg-red-50 text-red-600 border-2 border-black rounded-lg hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <input className="w-full p-3 border-2 border-black rounded-xl font-bold" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="Judul Modul" />
          <textarea className="w-full p-3 border-2 border-black rounded-xl font-bold text-sm" rows={4} value={draft.content} onChange={e => setDraft({...draft, content: e.target.value})} placeholder="Isi materi..." />
          <div className="bg-slate-50 p-4 rounded-xl space-y-3">
             <p className="text-[10px] font-black uppercase text-slate-400">Video (YouTube URL)</p>
             {draft.videos.map((vid, idx) => (
               <div key={idx} className="flex gap-2">
                 <input className="flex-1 p-2 border-2 border-slate-200 rounded-lg text-xs" value={vid.title} onChange={e => {
                   const v = [...draft.videos]; v[idx].title = e.target.value; setDraft({...draft, videos: v});
                 }} placeholder="Judul Video" />
                 <input className="flex-1 p-2 border-2 border-slate-200 rounded-lg text-xs" value={vid.url} onChange={e => {
                   const v = [...draft.videos]; v[idx].url = e.target.value; setDraft({...draft, videos: v});
                 }} placeholder="Link YouTube" />
                 <button onClick={() => { const v = draft.videos.filter((_, i) => i !== idx); setDraft({...draft, videos: v}); }} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
               </div>
             ))}
             <button onClick={() => setDraft({...draft, videos: [...draft.videos, {id: Date.now().toString(), title: "", url: ""}]})} className="w-full py-2 bg-white border-2 border-dashed border-black rounded-lg text-[10px] font-black uppercase">+ Video</button>
          </div>
        </div>
      ) : (
        <p className="text-xs font-bold text-slate-500 italic line-clamp-3">"{draft.content}"</p>
      )}
    </div>
  );
};

const QuizEditor: React.FC<{ quiz: Question, onUpdate: (q: Question) => void, onDelete: () => void }> = ({ quiz, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(quiz);

  return (
    <div className="bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_#000] space-y-4">
      <div className="flex justify-between items-start">
        <h4 className="font-black text-xs uppercase text-slate-400">Soal Kuis</h4>
        <div className="flex space-x-1">
          <button onClick={() => { if(isEditing) onUpdate(draft); setIsEditing(!isEditing); sounds.click(); }} className="p-1.5 bg-slate-50 border-2 border-black rounded-lg">
            {isEditing ? <Check className="w-3 h-3 text-green-600" /> : <Edit3 className="w-3 h-3" />}
          </button>
          <button onClick={onDelete} className="p-1.5 bg-red-50 text-red-600 border-2 border-black rounded-lg"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea className="w-full p-2 border-2 border-black rounded-xl font-bold text-xs" value={draft.question} onChange={e => setDraft({...draft, question: e.target.value})} />
          <div className="grid grid-cols-1 gap-2">
            {draft.options.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input type="radio" checked={draft.correctAnswer === i} onChange={() => setDraft({...draft, correctAnswer: i})} />
                <input className="flex-1 p-2 border-2 border-slate-100 rounded-lg text-[10px]" value={opt} onChange={e => {
                  const o = [...draft.options]; o[i] = e.target.value; setDraft({...draft, options: o});
                }} />
              </div>
            ))}
          </div>
          <input className="w-full p-2 border-2 border-slate-100 rounded-lg text-[10px] italic" value={draft.explanation} onChange={e => setDraft({...draft, explanation: e.target.value})} placeholder="Penjelasan jawaban..." />
        </div>
      ) : (
        <p className="font-black text-sm tracking-tight leading-tight">{draft.question}</p>
      )}
    </div>
  );
};

const InvestigationEditor: React.FC<{ data: InvestigationData, onUpdate: (i: InvestigationData) => void, onDelete: () => void }> = ({ data, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(data);

  return (
    <div className={`bg-white p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] space-y-4 ${!draft.isFact ? 'border-red-500' : 'border-black'}`}>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${draft.isFact ? 'bg-green-500' : 'bg-red-500'}`}>{draft.isFact ? 'FAKTA' : 'HOAKS'}</span>
        <div className="flex space-x-1">
          <button onClick={() => { if(isEditing) onUpdate(draft); setIsEditing(!isEditing); sounds.click(); }} className="p-1.5 bg-slate-50 border-2 border-black rounded-lg">
            {isEditing ? <Check className="w-3 h-3 text-green-600" /> : <Edit3 className="w-3 h-3" />}
          </button>
          <button onClick={onDelete} className="p-1.5 bg-red-50 text-red-600 border-2 border-black rounded-lg"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input className="w-full p-2 border-2 border-black rounded-lg font-black text-xs" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="Judul Bukti" />
          <textarea className="w-full p-2 border-2 border-slate-100 rounded-lg text-[10px]" rows={2} value={draft.content} onChange={e => setDraft({...draft, content: e.target.value})} placeholder="Isi Bukti..." />
          <div className="flex gap-2">
            <select className="flex-1 p-2 border-2 border-slate-100 rounded-lg text-[10px]" value={draft.type} onChange={e => setDraft({...draft, type: e.target.value as any})}>
              <option value="PHOTO">PHOTO</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="DOCUMENT">DOCUMENT</option>
            </select>
            <button onClick={() => setDraft({...draft, isFact: !draft.isFact})} className={`flex-1 p-2 rounded-lg text-[10px] font-black uppercase ${draft.isFact ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {draft.isFact ? 'Jadikan Hoaks' : 'Jadikan Fakta'}
            </button>
          </div>
        </div>
      ) : (
        <h5 className="font-black text-xs uppercase italic">{draft.title}</h5>
      )}
    </div>
  );
};

const PuzzleEditor: React.FC<{ level: PuzzleLevel, index: number, onUpdate: (p: PuzzleLevel) => void, onDelete: () => void }> = ({ level, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(level);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0px_#000] space-y-6">
      <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
        <h4 className="font-black uppercase text-sm italic">Puzzle Level {index + 1}</h4>
        <div className="flex space-x-2">
          <button onClick={() => { if(isEditing) onUpdate(draft); setIsEditing(!isEditing); sounds.click(); }} className={`p-2 rounded-lg border-2 border-black ${isEditing ? 'bg-green-500 text-white' : 'bg-slate-100'}`}>
            {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
          <button onClick={onDelete} className="p-2 bg-red-50 text-red-600 border-2 border-black rounded-lg hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="space-y-3">
        {draft.fragments.map((frag, fIdx) => (
          <div key={frag.id} className="bg-slate-50 p-4 rounded-xl border-2 border-black flex items-start gap-4">
            <div className="bg-black text-white w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0">{fIdx + 1}</div>
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <textarea className="w-full p-2 border-2 border-slate-200 rounded-lg text-xs font-bold" value={frag.text} onChange={e => {
                  const f = [...draft.fragments]; f[fIdx].text = e.target.value; setDraft({...draft, fragments: f});
                }} />
                <div className="flex justify-between items-center">
                  <select className="p-1 border-2 border-slate-200 rounded-lg text-[9px] font-black uppercase" value={frag.type} onChange={e => {
                    const f = [...draft.fragments]; f[fIdx].type = e.target.value as any; setDraft({...draft, fragments: f});
                  }}>
                    <option value="TITLE">TITLE</option>
                    <option value="LEAD">LEAD</option>
                    <option value="BODY">BODY</option>
                    <option value="TAIL">TAIL</option>
                  </select>
                  <button onClick={() => { const f = draft.fragments.filter((_, i) => i !== fIdx); setDraft({...draft, fragments: f}); }} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <span className="text-[8px] font-black uppercase bg-black text-white px-1.5 py-0.5 rounded mb-1 inline-block">{frag.type}</span>
                <p className="text-xs font-bold text-slate-800 leading-tight">{frag.text}</p>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <button onClick={() => setDraft({...draft, fragments: [...draft.fragments, {id: Date.now().toString(), text: "Teks baru...", type: 'BODY'}]})} className="w-full py-3 bg-white border-2 border-dashed border-black rounded-xl text-[10px] font-black uppercase">+ Fragmen</button>
        )}
      </div>
    </div>
  );
};

const WritingEventEditor: React.FC<{ event: WritingEvent, onUpdate: (e: WritingEvent) => void, onDelete: () => void }> = ({ event, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(event);

  return (
    <div className="bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_#000] space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-2xl">{draft.icon}</span>
        <div className="flex space-x-1">
          <button onClick={() => { if(isEditing) onUpdate(draft); setIsEditing(!isEditing); sounds.click(); }} className="p-1.5 bg-slate-50 border-2 border-black rounded-lg">
            {isEditing ? <Check className="w-3 h-3 text-green-600" /> : <Edit3 className="w-3 h-3" />}
          </button>
          <button onClick={onDelete} className="p-1.5 bg-red-50 text-red-600 border-2 border-black rounded-lg"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <input className="w-full p-2 border-2 border-black rounded-lg font-black text-xs" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="Judul Tema" />
          <input className="w-full p-2 border-2 border-black rounded-lg font-black text-xs" value={draft.icon} onChange={e => setDraft({...draft, icon: e.target.value})} placeholder="Icon (Emoji)" />
        </div>
      ) : (
        <h5 className="font-black text-sm uppercase italic">{draft.title}</h5>
      )}
    </div>
  );
};

const HoaxItemEditor: React.FC<{ item: HoaxPoolItem, onUpdate: (h: HoaxPoolItem) => void, onDelete: () => void }> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(item);

  return (
    <div className={`bg-white p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_#000] space-y-4 ${draft.isHoax ? 'border-red-500' : 'border-blue-500'}`}>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${draft.isHoax ? 'bg-red-500' : 'bg-blue-500'}`}>{draft.isHoax ? 'HOAX' : 'FAKTA'}</span>
        <div className="flex space-x-1">
          <button onClick={() => { if(isEditing) onUpdate(draft); setIsEditing(!isEditing); sounds.click(); }} className="p-1.5 bg-slate-50 border-2 border-black rounded-lg">
            {isEditing ? <Check className="w-3 h-3 text-green-600" /> : <Edit3 className="w-3 h-3" />}
          </button>
          <button onClick={onDelete} className="p-1.5 bg-red-50 text-red-600 border-2 border-black rounded-lg"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea className="w-full p-2 border-2 border-black rounded-lg font-black text-xs" value={draft.text} onChange={e => setDraft({...draft, text: e.target.value})} />
          <button onClick={() => setDraft({...draft, isHoax: !draft.isHoax})} className={`w-full p-2 rounded-lg text-[10px] font-black uppercase ${draft.isHoax ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {draft.isHoax ? 'Ganti ke FAKTA' : 'Ganti ke HOAX'}
          </button>
        </div>
      ) : (
        <p className="font-black text-xs italic line-clamp-2">"{draft.text}"</p>
      )}
    </div>
  );
};

export default AdminSettings;
