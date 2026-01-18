
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, School, ArrowRight, ShieldCheck } from 'lucide-react';
import { Student } from '../types';
import { sounds } from '../services/audio';

interface LoginProps {
  onLogin: (student: Student) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && school) {
      sounds.success();
      onLogin({ name, school, role: isAdmin ? 'ADMIN' : 'STUDENT' });
    }
  };

  return (
    <div className="h-screen bg-[#FFD600] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Circles - Adjusted for screen size */}
      <div className="absolute -top-20 -left-20 w-48 h-48 md:w-64 md:h-64 bg-[#FF3D00] rounded-full opacity-20"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 md:w-80 md:h-80 bg-[#00E5FF] rounded-full opacity-20"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card w-full max-w-md p-6 md:p-8 relative z-10 bg-white rounded-[2rem] md:rounded-[3rem] shadow-[12px_12px_0px_#000]"
      >
        <div className="text-center mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FF3D00] rounded-2xl mx-auto flex items-center justify-center border-4 border-black rotate-6 mb-3 shadow-md">
            <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase italic leading-none">REDaksi <span className="text-[#FF3D00]">KITA</span></h1>
          <p className="text-black font-bold mt-1 text-sm md:text-base">Masukan Kartu Pers Kamu!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-black font-black text-[10px] md:text-xs uppercase mb-1.5 ml-1 tracking-wider">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
              <input 
                required
                type="text"
                placeholder="Tulis namamu..."
                className="w-full pl-11 pr-4 py-3 md:py-3.5 rounded-xl border-4 border-black focus:ring-4 focus:ring-[#00E5FF]/30 outline-none font-bold text-sm md:text-base text-black bg-white placeholder:text-slate-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-black font-black text-[10px] md:text-xs uppercase mb-1.5 ml-1 tracking-wider">Asal Sekolah</label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
              <input 
                required
                type="text"
                placeholder="Tulis sekolahmu..."
                className="w-full pl-11 pr-4 py-3 md:py-3.5 rounded-xl border-4 border-black focus:ring-4 focus:ring-[#00E5FF]/30 outline-none font-bold text-sm md:text-base text-black bg-white placeholder:text-slate-300"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>
          </div>

          <div 
            className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-black transition-all group" 
            onClick={() => { sounds.click(); setIsAdmin(!isAdmin); }}
          >
            <div className={`w-5 h-5 border-2 border-black rounded flex items-center justify-center transition-colors ${isAdmin ? 'bg-[#FF3D00]' : 'bg-white'}`}>
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-[10px] font-black text-black uppercase tracking-tight group-hover:text-[#FF3D00]">Masuk sebagai Editor (Admin)</span>
          </div>

          <button 
            type="submit"
            onMouseEnter={sounds.hover}
            className="w-full bg-[#FF3D00] py-3.5 md:py-4 text-white font-black uppercase tracking-widest text-sm md:text-base border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] flex items-center justify-center space-x-3 hover:scale-[1.02] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span>Mulai Petualangan</span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </form>
      </motion.div>
      
      {/* Footer text for Login page only */}
      <div className="absolute bottom-4 text-[10px] font-black text-black/40 uppercase tracking-widest text-center w-full">
        REDaksi KITA - Petualangan Jurnalis Muda
      </div>
    </div>
  );
};

export default Login;
