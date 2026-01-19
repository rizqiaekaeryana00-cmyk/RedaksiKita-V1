
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, ArrowRight, PenTool, CheckCircle, Lightbulb, Sparkles, MessageSquare, Printer, Info, HelpCircle } from 'lucide-react';
import { sounds } from '../services/audio';
import { checkLanguage, getWritingClue } from '../services/gemini';
import { WritingEvent } from '../types';
import confetti from 'canvas-confetti';

interface WritingDeskProps {
    onBack: () => void;
    studentName: string;
    writingEvents: WritingEvent[];
}

const WritingDesk: React.FC<WritingDeskProps> = ({ onBack, studentName, writingEvents }) => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<WritingEvent | null>(null);
  const [answers, setAnswers] = useState({
    what: '', who: '', where: '', when: '', why: '', how: '', title: ''
  });
  const [clinicFeedback, setClinicFeedback] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [aiClue, setAiClue] = useState("");

  const next = () => { sounds.click(); setStep(s => s + 1); window.scrollTo(0,0); };
  const prev = () => { sounds.click(); setStep(s => s - 1); window.scrollTo(0,0); };

  const handleSelectEvent = (ev: WritingEvent) => {
    sounds.success();
    setSelectedEvent(ev);
    setTimeout(() => { setStep(2); window.scrollTo(0,0); }, 300);
  };

  const handleClinic = async () => {
    setIsChecking(true);
    sounds.click();
    const feedback = await checkLanguage(`${answers.title} ${answers.what} ${answers.how}`);
    setClinicFeedback(feedback);
    setIsChecking(false);
  };

  const handleAiClue = async (part: string) => {
    sounds.click();
    setAiClue("Editor AI sedang merangkai saran...");
    const clue = await getWritingClue(part, selectedEvent?.title || "kegiatan sekolah");
    setAiClue(clue);
  };

  const handleFinish = () => {
    sounds.success();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    next();
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-10 text-center py-4">
            <div>
               <h2 className="text-3xl md:text-4xl font-black uppercase text-black italic leading-none mb-2">Pilih Peristiwa</h2>
               <p className="text-xs md:text-sm font-bold text-slate-400">Pilih tema liputanmu untuk mulai menulis!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-2">
              {writingEvents.map(ev => (
                <motion.button
                  key={ev.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectEvent(ev)}
                  className={`p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-black flex flex-col items-center space-y-3 md:space-y-6 transition-all relative overflow-hidden group ${selectedEvent?.id === ev.id ? 'bg-[#FF3D00] text-white shadow-[6px_6px_0px_#000]' : 'bg-white text-black shadow-[4px_4px_0px_#000]'}`}
                >
                  <span className="text-4xl md:text-7xl group-hover:scale-110 transition-transform">{ev.icon}</span>
                  <span className="font-black uppercase tracking-tight text-[10px] md:text-lg leading-tight">{ev.title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[3px] border-black pb-6">
               <div>
                 <div className="flex items-center space-x-2">
                    <span className="text-2xl md:text-3xl">{selectedEvent?.icon}</span>
                    <h2 className="text-lg md:text-3xl font-black uppercase text-black italic">Liputan 5W + 1H</h2>
                 </div>
                 <p className="text-xs md:text-sm font-bold text-slate-500 italic mt-1">Tema: <span className="text-[#FF3D00] font-black">{selectedEvent?.title}</span></p>
               </div>
               <button onClick={() => handleAiClue('5W1H')} className="bg-[#FFD600] px-4 py-2.5 rounded-2xl border-[3px] border-black flex items-center text-[10px] md:text-xs font-black shadow-[4px_4px_0px_#000] hover:bg-yellow-400 self-start md:self-center">
                  <Sparkles className="w-4 h-4 mr-2" /> SARAN EDITOR AI
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {[
                { key: 'what', label: 'Apa Peristiwanya?', placeholder: 'Misal: Lomba Robotik antar kelas...' },
                { key: 'who', label: 'Siapa yang Terlibat?', placeholder: 'Misal: Siswa kelas 7, Pak Guru...' },
                { key: 'where', label: 'Di Mana Lokasinya?', placeholder: 'Misal: Di Aula SMPN 3 Bonang...' },
                { key: 'when', label: 'Kapan Terjadinya?', placeholder: 'Misal: Hari Senin, 12 Juni...' },
                { key: 'why', label: 'Mengapa Dilakukan?', placeholder: 'Misal: Untuk mengasah kreativitas...' },
                { key: 'how', label: 'Bagaimana Jalannya?', placeholder: 'Misal: Acara sangat meriah karena...' },
              ].map((item) => (
                <div key={item.key} className="relative">
                  <label className="text-[9px] font-black uppercase text-slate-500 mb-1.5 block tracking-widest">{item.label}</label>
                  <input 
                    type="text" 
                    className="w-full p-3.5 md:p-5 border-[3px] border-black rounded-xl md:rounded-2xl font-bold text-sm md:text-lg bg-white shadow-[3px_3px_0px_#000] focus:ring-2 outline-none"
                    value={(answers as any)[item.key]}
                    onChange={(e) => setAnswers({...answers, [item.key]: e.target.value})}
                    placeholder={item.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-10">
              <button onClick={prev} className="font-black uppercase text-[10px] md:text-sm p-2">Kembali</button>
              <button onClick={next} disabled={!answers.what || !answers.who} className="bg-[#FF3D00] text-white px-6 md:px-10 py-3.5 md:py-5 border-[3px] md:border-4 border-black rounded-xl md:rounded-2xl font-black uppercase text-xs md:text-xl shadow-[6px_6px_0px_#000]">Susun Berita <ArrowRight className="ml-2 inline-block w-4 h-4 md:w-5 md:h-5"/></button>
            </div>
          </div>
        );
      case 3:
        const fullDraft = `DEMAK - Telah terjadi ${selectedEvent?.title} yang dilaksanakan di ${answers.where || "[Lokasi]"} pada hari ${answers.when || "[Waktu]"}. Peristiwa ini melibatkan ${answers.who || "[Pihak Terkait]"}. Hal ini terjadi karena ${answers.why || "[Alasan]"}. ${answers.how || "[Kronologi kejadian]"}.`;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Meja <span className="text-[#00E5FF]">Editor</span></h2>
            <div className="space-y-6">
               <div>
                  <label className="block font-black uppercase text-[9px] mb-2 text-slate-500">Judul Headline Berita</label>
                  <input className="w-full p-4 md:p-6 border-[3px] border-black rounded-xl md:rounded-[2rem] text-lg md:text-4xl font-black bg-white shadow-[4px_4px_0px_#000] outline-none" value={answers.title} onChange={(e) => setAnswers({...answers, title: e.target.value})} placeholder="Tulis judul menarik..." />
               </div>
               <div>
                  <label className="block font-black uppercase text-[9px] mb-2 text-slate-500">Draft Isi Berita</label>
                  <textarea rows={6} className="w-full p-5 md:p-8 border-[3px] border-black rounded-xl md:rounded-[3rem] font-bold text-sm md:text-xl bg-white shadow-[4px_4px_0px_#000] outline-none leading-relaxed" value={fullDraft} readOnly></textarea>
               </div>
            </div>
            <div className="flex justify-between items-center mt-10">
              <button onClick={prev} className="font-black uppercase text-[10px] p-2">Kembali</button>
              <button onClick={handleFinish} className="bg-[#4CAF50] text-white px-6 md:px-12 py-3.5 md:py-5 border-[3px] md:border-4 border-black rounded-xl md:rounded-2xl font-black uppercase text-xs md:text-xl shadow-[8px_8px_0px_#000]">Terbitkan Berita! 🗞️</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center py-4 space-y-6 md:space-y-10 w-full px-2">
            <h1 className="text-2xl md:text-5xl font-black text-black uppercase italic tracking-tighter text-center leading-none">Hasil Karya Jurnalis</h1>
            
            {/* Paper Preview - Ultra Responsive Scaling */}
            <div className="w-full max-w-[95vw] md:max-w-2xl bg-white border-4 md:border-8 border-black p-5 md:p-12 shadow-[8px_8px_0px_#000] md:shadow-[16px_16px_0px_#000] rounded-sm relative overflow-hidden flex flex-col">
                {/* Responsive Decoration Decoration */}
                <div className="absolute top-0 right-0 w-6 md:w-16 h-full bg-black/5 flex flex-col justify-around py-10 pointer-events-none opacity-30">
                   <div className="h-0.5 w-full bg-black/10"></div>
                   <div className="h-0.5 w-full bg-black/10"></div>
                   <div className="h-0.5 w-full bg-black/10"></div>
                </div>

                <div className="text-center border-b-[3px] md:border-b-8 border-black pb-4 md:pb-8 mb-6 md:mb-10">
                  <h1 className="text-xl sm:text-4xl md:text-7xl font-black uppercase italic text-[#FF3D00] tracking-tighter leading-none whitespace-nowrap overflow-hidden">
                    KABAR <span className="text-black">DEMAK</span>
                  </h1>
                </div>
                
                <div className="space-y-4 md:space-y-10 relative z-10">
                  <h2 className="text-md md:text-4xl font-black uppercase text-black border-l-[5px] md:border-l-[12px] border-[#FF3D00] pl-3 md:pl-8 italic leading-tight break-words">
                    {answers.title || "SISWA SMPN 3 BONANG RAIH PRESTASI"}
                  </h2>
                  
                  <div className="text-[11px] md:text-lg font-bold text-justify text-black leading-relaxed space-y-3 md:space-y-4 break-words">
                    <p>
                      <span className="font-black bg-black text-white px-2 py-0.5 mr-2 uppercase text-[8px] md:text-sm inline-block">DEMAK, REDAKSI KITA</span> 
                      {answers.what || "Peristiwa menarik baru saja terjadi..."} dilaporkan berlangsung di {answers.where || "lokasi strategis"} yang melibatkan {answers.who || "pihak terkait"}. 
                    </p>
                    <p>
                      Hal ini terjadi karena {answers.why || "alasan yang mendasari kejadian tersebut"}. Berdasarkan pantauan reporter, {answers.how || "kronologi berlangsung dengan tertib dan lancar"}.
                    </p>
                  </div>
                  
                  <div className="border-t-[3px] md:border-t-4 border-black pt-5 md:pt-10 flex justify-between items-center mt-6">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-[7px] md:text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 truncate">Reporter Utama:</p>
                      <p className="text-sm md:text-3xl font-black italic uppercase tracking-tight text-black truncate">{studentName}</p>
                    </div>
                    <div className="bg-[#FFD600] p-1.5 md:p-3 rounded-lg border-2 border-black rotate-3 shrink-0">
                       <CheckCircle className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                  </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
              <button onClick={() => window.print()} className="flex-1 bg-white text-black py-4 px-6 rounded-2xl border-[3px] border-black font-black uppercase text-[10px] md:text-xs shadow-[4px_4px_0px_#000] hover:bg-slate-50 flex items-center justify-center">
                <Printer className="w-4 h-4 mr-2" /> CETAK FISIK
              </button>
              <button onClick={onBack} className="flex-1 bg-[#FF3D00] text-white py-4 px-6 rounded-2xl border-[3px] border-black font-black uppercase text-[10px] md:text-xs shadow-[4px_4px_0px_#000] hover:scale-102 transition-all">
                KEMBALI KE LOBI
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-8 flex flex-col items-center pb-20 overflow-x-hidden">
      {/* Responsive Navbar Writing Desk */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 bg-white p-3 md:p-6 rounded-2xl md:rounded-[2.5rem] border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] md:text-sm text-black hover:text-[#FF3D00] transition-colors">
          <Home className="mr-1.5 w-4 h-4 md:w-6 md:h-6"/> <span className="hidden sm:inline">LOBI</span>
        </button>
        <div className="flex items-center space-x-2">
          <PenTool className="w-5 h-5 md:w-8 md:h-8 text-[#FF3D00]" />
          <h2 className="text-sm md:text-3xl font-black uppercase italic tracking-tighter leading-none">Meja Tulis <span className="text-[#FF3D00]">Jurnalis</span></h2>
        </div>
        <div className="flex space-x-1.5 md:space-x-3">
           {[1, 2, 3, 4].map(i => <div key={i} className={`w-2.5 h-2.5 md:w-4 md:h-4 rounded-full border-2 border-black transition-colors ${step >= i ? 'bg-[#FF3D00]' : 'bg-slate-200'}`}></div>)}
        </div>
      </div>
      
      {/* Central Content Box */}
      <div className="w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[4rem] border-4 border-black p-4 md:p-16 shadow-[10px_10px_0px_#000] mb-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WritingDesk;
