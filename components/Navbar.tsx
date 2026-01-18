
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Newspaper, User, Check, X, Settings } from 'lucide-react';
import { Student, AppView } from '../types';
import { sounds } from '../services/audio';

interface NavbarProps {
  student: Student;
  currentView: AppView;
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ student, currentView, onLogout, onNavigate }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutInitiate = () => {
    sounds.click();
    setShowConfirm(true);
  };

  const handleCancelLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.click();
    setShowConfirm(false);
  };

  const handleFinalLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.success();
    onLogout();
  };

  return (
    <motion.nav 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-[100] w-full px-6 py-3 bg-white border-b-4 border-black shadow-[0_4px_0px_#000] h-[76px] flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo Section */}
        <button 
          onClick={() => { sounds.click(); onNavigate('LOBBY'); }}
          className="flex items-center space-x-2 group outline-none"
        >
          <div className="bg-[#FF3D00] p-1.5 rounded-lg border-2 border-black rotate-3 group-hover:rotate-0 transition-transform">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black uppercase italic tracking-tighter text-black">
            REDaksi <span className="text-[#FF3D00]">KITA</span>
          </span>
        </button>

        {/* User & Actions Section */}
        <div className="flex items-center space-x-3">
          {student.role === 'ADMIN' && (
            <button 
              onClick={() => { sounds.click(); onNavigate('ADMIN_SETTINGS'); }}
              className="p-2 bg-purple-100 text-purple-600 rounded-xl border-2 border-black hover:bg-purple-200 transition-colors"
              title="Pengaturan Admin"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 bg-[#FFD600] px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
            <div className="bg-white p-1 rounded-full border border-black">
              <User className="w-3 h-3 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-black/60 leading-none">
                {student.role === 'ADMIN' ? 'EDITOR UTAMA' : 'Jurnalis Aktif'}
              </span>
              <span className="text-[10px] font-black text-black leading-tight truncate max-w-[100px]">
                {student.name.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {!showConfirm ? (
                <motion.button
                  key="logout-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleLogoutInitiate}
                  className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl border-2 border-black transition-all font-black uppercase text-[10px] shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:shadow-none outline-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </motion.button>
              ) : (
                <motion.div
                  key="confirm-box"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center bg-black text-white rounded-xl border-2 border-white shadow-[3px_3px_0px_#000] overflow-hidden"
                >
                  <span className="px-2 text-[8px] font-black uppercase tracking-widest text-[#FFD600]">Keluar?</span>
                  <button onClick={handleFinalLogout} className="bg-[#FF3D00] p-1.5 hover:bg-red-600 transition-colors border-l border-white">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={handleCancelLogout} className="bg-slate-700 p-1.5 hover:bg-slate-600 transition-colors border-l border-white">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
