
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, Student, Lesson, Question, NewsFragment, InvestigationData } from './types';
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
import { LESSONS, QUIZ_QUESTIONS, PUZZLE_LEVELS, INVESTIGATION_FILES } from './constants';
import { loadAppData, saveAppData } from './services/firebase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('LOGIN');
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // State Konten
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [quizzes, setQuizzes] = useState<Question[]>(QUIZ_QUESTIONS);
  const [puzzles, setPuzzles] = useState<NewsFragment[][]>(PUZZLE_LEVELS);
  const [investigations, setInvestigations] = useState<InvestigationData[]>(INVESTIGATION_FILES);

  // Load data dari Firebase saat startup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadAppData();
        if (data) {
          if (data.lessons) setLessons(data.lessons);
          if (data.quizzes) setQuizzes(data.quizzes);
          if (data.puzzles) setPuzzles(data.puzzles);
          if (data.investigations) setInvestigations(data.investigations);
        }
      } catch (err) {
        console.error("Gagal sinkron awal:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Fungsi Helper untuk Update dan Sync
  const updateContent = async (type: string, newData: any) => {
    // 1. Update State Lokal dulu agar UI responsif
    let updatedLessons = lessons;
    let updatedQuizzes = quizzes;
    let updatedPuzzles = puzzles;
    let updatedInvestigations = investigations;

    if (type === 'LESSONS') { updatedLessons = newData; setLessons(newData); }
    if (type === 'QUIZ') { updatedQuizzes = newData; setQuizzes(newData); }
    if (type === 'PUZZLE') { updatedPuzzles = newData; setPuzzles(newData); }
    if (type === 'INVESTIGATION') { updatedInvestigations = newData; setInvestigations(newData); }

    // 2. Kirim ke Firebase Cloud
    await saveAppData({
      lessons: updatedLessons,
      quizzes: updatedQuizzes,
      puzzles: updatedPuzzles,
      investigations: updatedInvestigations
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#FFD600] space-y-4">
        <div className="w-16 h-16 border-8 border-black border-t-[#FF3D00] rounded-full animate-spin"></div>
        <p className="font-black uppercase italic tracking-tighter">Sinkronisasi Cloud...</p>
      </div>
    );

    if (currentView === 'LOGIN') return <Login onLogin={handleLogin} />;
    if (!student) return <Login onLogin={handleLogin} />;

    switch (currentView) {
      case 'LOBBY': return <Lobby student={student} onNavigate={setCurrentView} />;
      case 'BRIEFING': return <BriefingRoom lessons={lessons} onBack={() => setCurrentView('LOBBY')} />;
      case 'ARENA': return <NewsArena puzzleLevels={puzzles} onBack={() => setCurrentView('LOBBY')} />;
      case 'EVALUATION': return <EvaluationDesk quizQuestions={quizzes} onBack={() => setCurrentView('LOBBY')} />;
      case 'WRITING_DESK': return <WritingDesk onBack={() => setCurrentView('LOBBY')} studentName={student.name} />;
      case 'INVESTIGATION': return <InvestigationRoom investigationFiles={investigations} onBack={() => setCurrentView('LOBBY')} />;
      case 'HOAX_SHOOTER': return <HoaxShooter onBack={() => setCurrentView('LOBBY')} />;
      case 'ADMIN_SETTINGS':
        return (
          <AdminSettings 
            lessons={lessons} setLessons={(l) => updateContent('LESSONS', l)}
            quizzes={quizzes} setQuizzes={(q) => updateContent('QUIZ', q)}
            puzzles={puzzles} setPuzzles={(p) => updateContent('PUZZLE', p)}
            investigations={investigations} setInvestigations={(i) => updateContent('INVESTIGATION', i)}
            onBack={() => setCurrentView('LOBBY')} 
          />
        );
      case 'INFO':
        return (
          <div className="h-full bg-slate-100 flex items-center justify-center p-6 overflow-hidden">
            <div className="glass-card max-w-2xl p-8 md:p-12 text-center bg-white border-4 border-black shadow-[12px_12px_0px_#000] rounded-[2.5rem]">
              <h2 className="text-3xl font-black uppercase mb-6 text-black italic tracking-tighter">Informasi Media</h2>
              <div className="space-y-3 text-left font-bold mb-10 text-black leading-tight">
                <p>📍 <span className="text-[#FF3D00]">Tujuan:</span> Melatih siswa SMP Kelas VII menulis teks berita sesuai struktur 5W+1H.</p>
                <p>👩‍🏫 <span className="text-[#FF3D00]">Pembuat:</span> Rizqia Eka Eryana</p>
                <p>🏫 <span className="text-[#FF3D00]">Institusi:</span> SMP Negeri 3 Bonang, Kabupaten Demak</p>
                <p>🎓 <span className="text-[#FF3D00]">Pendidikan:</span> Mahasiswa S2 Pendidikan Bahasa Indonesia UNNES</p>
              </div>
              <button onClick={() => setCurrentView('LOBBY')} className="btn-primary px-12 py-4 text-white font-black uppercase rounded-2xl border-2 border-black hover:scale-105 transition-transform">Tutup Info</button>
            </div>
          </div>
        );
      default: return <Lobby student={student} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="font-playful selection:bg-[#FF3D00] selection:text-white h-screen flex flex-col overflow-hidden bg-[#F8FAFC]">
      {currentView !== 'LOGIN' && student && (
        <Navbar student={student} currentView={currentView} onLogout={handleLogout} onNavigate={setCurrentView} />
      )}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
