
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
      className="sticky top-0 z-[100] w-full px-4 bg-white border-b-2 border-black h-[56px] flex items-center shrink-0"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo Section - Smaller */}
        <button 
          onClick={() => { sounds.click(); onNavigate('LOBBY'); }}
          className="flex items-center space-x-2 group outline-none"
        >
          <div className="bg-[#FF3D00] p-1 rounded-md border-2 border-black rotate-2 group-hover:rotate-0 transition-transform">
            <Newspaper className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black uppercase italic tracking-tighter text-black">
            RED <span className="text-[#FF3D00]">KITA</span>
          </span>
        </button>

        {/* User & Actions Section - Compact */}
        <div className="flex items-center space-x-2">
          {student.role === 'ADMIN' && (
            <button 
              onClick={() => { sounds.click(); onNavigate('ADMIN_SETTINGS'); }}
              className="p-1.5 bg-purple-50 text-purple-600 rounded-lg border-2 border-black hover:bg-purple-100 transition-colors shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none"
              title="Pengaturan Admin"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 bg-[#FFD600] px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
            <div className="flex flex-col text-right">
              <span className="text-[7px] font-black uppercase text-black/60 leading-none">
                {student.role === 'ADMIN' ? 'EDITOR' : 'JURNALIS'}
              </span>
              <span className="text-[9px] font-black text-black leading-tight truncate max-w-[80px]">
                {student.name.toUpperCase()}
              </span>
            </div>
            <div className="bg-white p-0.5 rounded-full border border-black shrink-0">
              <User className="w-2.5 h-2.5 text-black" />
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
                  className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-lg border-2 border-black transition-all font-black uppercase text-[9px] shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none outline-none"
                >
                  <LogOut className="w-3 h-3" />
                  <span>KELUAR</span>
                </motion.button>
              ) : (
                <motion.div
                  key="confirm-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center bg-black text-white rounded-lg border-2 border-white shadow-[2px_2px_0px_#000] overflow-hidden"
                >
                  <span className="px-2 text-[7px] font-black uppercase tracking-widest text-[#FFD600]">Yakin?</span>
                  <button onClick={handleFinalLogout} className="bg-[#FF3D00] p-1 hover:bg-red-600 transition-colors border-l border-white">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={handleCancelLogout} className="bg-slate-700 p-1 hover:bg-slate-600 transition-colors border-l border-white">
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
