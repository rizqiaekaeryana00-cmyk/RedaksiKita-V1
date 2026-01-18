
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, Student, Lesson, Question, NewsFragment, InvestigationData, PuzzleLevel, WritingEvent, HoaxPoolItem } from './types';
import Login from './components/Login';
import Lobby from './components/Lobby';
import BriefingRoom from './components/BriefingRoom';
import NewsArena from './components/NewsArena';
import EvaluationDesk from './components/EvaluationDesk';
import WritingDesk from './components/WritingDesk';
import InvestigationRoom from './components/InvestigationRoom';
import HoaxShooter from './components/HoaxShooter';
import Navbar from './components/Navbar';
import AdminSettings from './components/AdminSettings';
import { LESSONS, QUIZ_QUESTIONS, PUZZLE_LEVELS, INVESTIGATION_FILES, WRITING_EVENTS, HOAX_POOL_DEFAULT } from './constants';
import { loadAppData, saveAppData } from './services/firebase';
import { Copyright, Tv } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('LOGIN');
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // States yang bisa diedit Admin
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [quizzes, setQuizzes] = useState<Question[]>(QUIZ_QUESTIONS);
  const [puzzles, setPuzzles] = useState<PuzzleLevel[]>(PUZZLE_LEVELS);
  const [investigations, setInvestigations] = useState<InvestigationData[]>(INVESTIGATION_FILES);
  const [writingEvents, setWritingEvents] = useState<WritingEvent[]>(WRITING_EVENTS);
  const [hoaxPool, setHoaxPool] = useState<HoaxPoolItem[]>(HOAX_POOL_DEFAULT);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadAppData();
        if (data) {
          if (data.lessons) setLessons(data.lessons);
          if (data.quizzes) setQuizzes(data.quizzes);
          if (data.puzzles) setPuzzles(data.puzzles);
          if (data.investigations) setInvestigations(data.investigations);
          if (data.writingEvents) setWritingEvents(data.writingEvents);
          if (data.hoaxPool) setHoaxPool(data.hoaxPool);
        }
      } catch (err) {
        console.error("Gagal sinkron awal:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  const updateContent = async (type: string, newData: any) => {
    let updatedLessons = lessons;
    let updatedQuizzes = quizzes;
    let updatedPuzzles = puzzles;
    let updatedInvestigations = investigations;
    let updatedWritingEvents = writingEvents;
    let updatedHoaxPool = hoaxPool;

    if (type === 'LESSONS') { updatedLessons = newData; setLessons(newData); }
    if (type === 'QUIZ') { updatedQuizzes = newData; setQuizzes(newData); }
    if (type === 'PUZZLE') { updatedPuzzles = newData; setPuzzles(newData); }
    if (type === 'INVESTIGATION') { updatedInvestigations = newData; setInvestigations(newData); }
    if (type === 'WRITING_EVENTS') { updatedWritingEvents = newData; setWritingEvents(newData); }
    if (type === 'HOAX_POOL') { updatedHoaxPool = newData; setHoaxPool(newData); }

    await saveAppData({
      lessons: updatedLessons,
      quizzes: updatedQuizzes,
      puzzles: updatedPuzzles,
      investigations: updatedInvestigations,
      writingEvents: updatedWritingEvents,
      hoaxPool: updatedHoaxPool
    });
  };

  const handleLogin = (data: Student) => {
    setStudent(data);
    setCurrentView('LOBBY');
  };

  const handleLogout = () => {
    setStudent(null);
    setCurrentView('LOGIN');
  };

  const renderView = () => {
    if (!isLoaded) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFD600] space-y-4 p-6">
        <div className="w-16 h-16 border-8 border-black border-t-[#FF3D00] rounded-full animate-spin"></div>
        <p className="font-black uppercase italic tracking-tighter text-center">Menyiapkan Ruang Redaksi...</p>
      </div>
    );

    if (currentView === 'LOGIN') return <Login onLogin={handleLogin} />;
    if (!student) return <Login onLogin={handleLogin} />;

    switch (currentView) {
      case 'LOBBY': return <Lobby student={student} onNavigate={setCurrentView} />;
      case 'BRIEFING': return <BriefingRoom lessons={lessons} onBack={() => setCurrentView('LOBBY')} />;
      case 'ARENA': return <NewsArena puzzleLevels={puzzles} onBack={() => setCurrentView('LOBBY')} />;
      case 'EVALUATION': return <EvaluationDesk quizQuestions={quizzes} onBack={() => setCurrentView('LOBBY')} />;
      case 'WRITING_DESK': return <WritingDesk onBack={() => setCurrentView('LOBBY')} studentName={student.name} writingEvents={writingEvents} />;
      case 'INVESTIGATION': return <InvestigationRoom investigationFiles={investigations} onBack={() => setCurrentView('LOBBY')} />;
      case 'HOAX_SHOOTER': return <HoaxShooter onBack={() => setCurrentView('LOBBY')} hoaxPoolItems={hoaxPool} />;
      case 'ADMIN_SETTINGS':
        return (
          <AdminSettings 
            lessons={lessons} setLessons={(l) => updateContent('LESSONS', l)}
            quizzes={quizzes} setQuizzes={(q) => updateContent('QUIZ', q)}
            puzzles={puzzles} setPuzzles={(p) => updateContent('PUZZLE', p)}
            investigations={investigations} setInvestigations={(i) => updateContent('INVESTIGATION', i)}
            writingEvents={writingEvents} setWritingEvents={(e) => updateContent('WRITING_EVENTS', e)}
            hoaxPool={hoaxPool} setHoaxPool={(h) => updateContent('HOAX_POOL', h)}
            onBack={() => setCurrentView('LOBBY')} 
          />
        );
      case 'INFO':
        return (
          <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6">
            <div className="glass-card max-w-2xl w-full p-8 md:p-12 text-center bg-white border-4 border-black shadow-[12px_12px_0px_#000] rounded-[2.5rem]">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 text-black italic tracking-tighter">Informasi Media</h2>
              <div className="space-y-4 text-left font-bold mb-10 text-black leading-tight text-sm md:text-base">
                <p>📍 <span className="text-[#FF3D00]">Tujuan:</span> Melatih siswa SMP Kelas VII menulis teks berita sesuai struktur 5W+1H.</p>
                <p>👩‍🏫 <span className="text-[#FF3D00]">Pembuat:</span> Rizqia Eka Eryana</p>
                <p>🏫 <span className="text-[#FF3D00]">Institusi:</span> SMP Negeri 3 Bonang, Kabupaten Demak</p>
                <p>🎓 <span className="text-[#FF3D00]">Pendidikan:</span> S2 Pendidikan Bahasa Indonesia UNNES</p>
              </div>
              <button onClick={() => setCurrentView('LOBBY')} className="w-full md:w-auto bg-[#FF3D00] px-12 py-4 text-white font-black uppercase rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_#000]">Tutup Info</button>
            </div>
          </div>
        );
      default: return <Lobby student={student} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="font-playful selection:bg-[#FF3D00] selection:text-white min-h-screen flex flex-col bg-[#F8FAFC]">
      {currentView !== 'LOGIN' && student && (
        <Navbar student={student} currentView={currentView} onLogout={handleLogout} onNavigate={setCurrentView} />
      )}
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentView} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>

        {currentView !== 'HOAX_SHOOTER' && (
          <div className="fixed bottom-0 right-0 p-2 md:p-4 z-[999] pointer-events-none no-print">
            <div className="bg-white/80 backdrop-blur-md border-2 border-black px-3 py-1.5 md:px-5 md:py-2 rounded-full shadow-lg flex items-center space-x-2">
              <div className="bg-black p-1 rounded-full">
                <Tv className="w-3 h-3 text-[#FF3D00]" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-black">
                REDaksiKITA_MPI_Rizqia Eka Eryana
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
