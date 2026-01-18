
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { AppView, Student } from './types';
import Login from './components/Login';
import Lobby from './components/Lobby';
import BriefingRoom from './components/BriefingRoom';
import NewsArena from './components/NewsArena';
import EvaluationDesk from './components/EvaluationDesk';
import WritingDesk from './components/WritingDesk';
import InvestigationRoom from './components/InvestigationRoom';
import HoaxShooter from './components/HoaxShooter';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('LOGIN');
  const [student, setStudent] = useState<Student | null>(null);

  const handleLogin = (data: Student) => {
    setStudent(data);
    setCurrentView('LOBBY');
  };

  const handleLogout = () => {
    setStudent(null);
    setCurrentView('LOGIN');
  };

  const renderView = () => {
    if (currentView === 'LOGIN') return <Login onLogin={handleLogin} />;
    if (!student) return <Login onLogin={handleLogin} />;

    switch (currentView) {
      case 'LOBBY':
        return <Lobby student={student} onNavigate={setCurrentView} />;
      case 'BRIEFING':
        return <BriefingRoom onBack={() => setCurrentView('LOBBY')} />;
      case 'ARENA':
        return <NewsArena onBack={() => setCurrentView('LOBBY')} />;
      case 'EVALUATION':
        return <EvaluationDesk onBack={() => setCurrentView('LOBBY')} />;
      case 'WRITING_DESK':
        return <WritingDesk onBack={() => setCurrentView('LOBBY')} studentName={student.name} />;
      case 'INVESTIGATION':
        return <InvestigationRoom onBack={() => setCurrentView('LOBBY')} />;
      case 'HOAX_SHOOTER':
        return <HoaxShooter onBack={() => setCurrentView('LOBBY')} />;
      case 'INFO':
        return (
          <div className="h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center p-6 overflow-hidden">
            <div className="glass-card max-w-2xl p-8 md:p-12 text-center bg-white border-4 border-black shadow-[12px_12px_0px_#000] rounded-[2.5rem]">
              <h2 className="text-3xl font-black uppercase mb-6 text-black italic italic tracking-tighter">Informasi Media</h2>
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
      default:
        return <Lobby student={student} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="font-playful selection:bg-[#FF3D00] selection:text-white h-screen flex flex-col overflow-hidden bg-[#F8FAFC]">
      {currentView !== 'LOGIN' && student && (
        <Navbar 
          student={student} 
          currentView={currentView} 
          onLogout={handleLogout} 
          onNavigate={setCurrentView}
        />
      )}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
