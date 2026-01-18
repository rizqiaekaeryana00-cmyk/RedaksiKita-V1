
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Newspaper, User, Check, X, Settings, Radio } from 'lucide-react';
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
      className="sticky top-0 z-[100] w-full px-4 bg-white border-b-4 border-black h-[64px] flex items-center shrink-0 shadow-md"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo Section - Professional News Branding */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { sounds.click(); onNavigate('LOBBY'); }}
            className="flex items-center space-x-2 group outline-none"
          >
            <div className="bg-[#FF3D00] p-1.5 rounded-lg border-2 border-black rotate-2 group-hover:rotate-0 transition-transform shadow-[2px_2px_0px_#000]">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <span className="text-base md:text-lg font-black uppercase italic tracking-tighter text-black leading-none">
              RED <span className="text-[#FF3D00]">KITA</span>
            </span>
          </button>

          {/* LIVE ON AIR Indicator */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border-2 border-black">
            <div className="w-2 h-2 bg-[#FF3D00] rounded-full blinking-dot"></div>
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic">LIVE ON AIR</span>
          </div>
        </div>

        {/* User & Actions Section */}
        <div className="flex items-center space-x-3">
          {student.role === 'ADMIN' && (
            <button 
              onClick={() => { sounds.click(); onNavigate('ADMIN_SETTINGS'); }}
              className="p-2 bg-purple-100 text-purple-700 rounded-xl border-2 border-black hover:bg-purple-200 transition-all shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:shadow-none"
              title="Pengaturan Admin"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center space-x-2 bg-[#FFD600] px-3 py-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]">
            <div className="flex flex-col text-right">
              <span className="text-[7px] font-black uppercase text-black/60 leading-none">
                {student.role === 'ADMIN' ? 'PEMIMPIN REDAKSI' : 'JURNALIS MUDA'}
              </span>
              <span className="text-[10px] font-black text-black leading-tight truncate max-w-[120px]">
                {student.name.toUpperCase()}
              </span>
            </div>
            <div className="bg-white p-1 rounded-full border-2 border-black shrink-0">
              <User className="w-3 h-3 text-black" />
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
                  className="flex items-center space-x-2 bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-xl border-2 border-black transition-all font-black uppercase text-[10px] shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:shadow-none outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">OFF AIR</span>
                </motion.button>
              ) : (
                <motion.div
                  key="confirm-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center bg-black text-white rounded-xl border-2 border-white shadow-[3px_3px_0px_#000] overflow-hidden"
                >
                  <span className="px-3 text-[8px] font-black uppercase tracking-widest text-[#FFD600]">Log Out?</span>
                  <button onClick={handleFinalLogout} className="bg-[#FF3D00] p-2 hover:bg-red-600 transition-colors border-l border-white">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={handleCancelLogout} className="bg-slate-700 p-2 hover:bg-slate-600 transition-colors border-l border-white">
                    <X className="w-4 h-4" />
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
