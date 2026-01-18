
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, ArrowRight, PenTool, CheckCircle, Lightbulb, Sparkles, MessageSquare, Printer, Info, HelpCircle } from 'lucide-react';
import { WRITING_EVENTS, WRITING_CLUES } from '../constants';
import { sounds } from '../services/audio';
import { checkLanguage, getWritingClue } from '../services/gemini';
import confetti from 'canvas-confetti';

const WritingDesk = ({ onBack, studentName }: any) => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [answers, setAnswers] = useState({
    what: '', who: '', where: '', when: '', why: '', how: '', title: ''
  });
  const [clinicFeedback, setClinicFeedback] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [aiClue, setAiClue] = useState("");
  const [showHint, setShowHint] = useState<string | null>(null);

  const next = () => { sounds.click(); setStep(s => s + 1); window.scrollTo(0,0); };
  const prev = () => { sounds.click(); setStep(s => s - 1); window.scrollTo(0,0); };

  const handleSelectEvent = (ev: any) => {
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

  const toggleHint = (key: string) => {
    sounds.click();
    setShowHint(showHint === key ? null : key);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 md:space-y-10 text-center py-4">
            <div>
               <h2 className="text-2xl md:text-4xl font-black uppercase text-black italic leading-none mb-2">Pilih Peristiwa</h2>
               <p className="text-xs md:text-sm font-bold text-slate-400">Pilih tema liputanmu untuk mulai menulis!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto">
              {WRITING_EVENTS.map(ev => (
                <motion.button
                  key={ev.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectEvent(ev)}
                  className={`p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border-[3px] md:border-4 border-black flex flex-col items-center space-y-2 md:space-y-6 transition-all relative overflow-hidden group ${selectedEvent?.id === ev.id ? 'bg-[#FF3D00] text-white shadow-[6px_6px_0px_#000]' : 'bg-white text-black shadow-[4px_4px_0px_#000]'}`}
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
                    <h2 className="text-xl md:text-3xl font-black uppercase text-black italic">Liputan 5W + 1H</h2>
                 </div>
                 <p className="text-[10px] md:text-sm font-bold text-slate-500 italic mt-1">Tema: <span className="text-[#FF3D00] font-black">{selectedEvent?.title}</span></p>
               </div>
               <button onClick={() => handleAiClue('5W1H')} className="bg-[#FFD600] px-5 py-3 rounded-2xl border-[3px] border-black flex items-center text-[10px] md:text-xs font-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 hover:bg-yellow-400 transition-colors">
                  <Sparkles className="w-4 h-4 mr-2" /> SARAN EDITOR AI
               </button>
            </div>
            
            {aiClue && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#00E5FF]/10 p-5 rounded-2xl border-2 border-[#00E5FF] font-bold text-black text-xs md:text-base italic flex items-start">
                <Info className="w-5 h-5 mr-3 text-[#00E5FF] shrink-0" />
                {aiClue}
              </motion.div>
            )}

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
                  <label className="text-[10px] md:text-xs font-black uppercase text-slate-500 mb-2 block tracking-widest">{item.label}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full p-4 md:p-5 border-[3px] border-black rounded-2xl font-bold text-sm md:text-lg bg-white shadow-[3px_3px_0px_#000] focus:ring-4 focus:ring-[#00E5FF]/20 outline-none"
                      value={(answers as any)[item.key]}
                      onChange={(e) => setAnswers({...answers, [item.key]: e.target.value})}
                      placeholder={item.placeholder}
                    />
                    <button onClick={() => toggleHint(item.key)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-500">
                      <Lightbulb className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-10 pt-6 border-t-2 border-black">
              <button onClick={prev} className="font-black uppercase text-xs md:text-sm flex items-center justify-center p-4 hover:bg-slate-100 rounded-2xl">Kembali Pilih Tema</button>
              <button onClick={next} disabled={!answers.what || !answers.who} className="bg-[#FF3D00] text-white px-10 py-5 border-[4px] border-black rounded-2xl font-black uppercase text-sm md:text-xl shadow-[6px_6px_0px_#000] disabled:opacity-50 hover:scale-102 transition-transform">Susun Berita <ArrowRight className="ml-2 inline-block w-5 h-5"/></button>
            </div>
          </div>
        );
      case 3:
        const fullDraft = `DEMAK - Telah terjadi ${selectedEvent?.title} yang dilaksanakan di ${answers.where || "[Lokasi]"} pada hari ${answers.when || "[Waktu]"}. Peristiwa ini melibatkan ${answers.who || "[Pihak Terkait]"}. Hal ini terjadi karena ${answers.why || "[Alasan]"}. ${answers.how || "[Kronologi kejadian]"}.`;
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-black pb-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Meja <span className="text-[#00E5FF]">Editor</span></h2>
              <button onClick={handleClinic} disabled={isChecking} className="bg-[#00E5FF] px-6 py-3 rounded-2xl border-[3px] border-black font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_#000] active:translate-y-1">
                {isChecking ? 'Menyunting...' : '💉 Klinik Bahasa'}
              </button>
            </div>

            <div className="space-y-6">
               <div>
                  <label className="block font-black uppercase text-[10px] md:text-xs mb-2 text-slate-500 tracking-widest">Judul Headline Berita</label>
                  <input 
                    className="w-full p-4 md:p-6 border-[3px] border-black rounded-2xl md:rounded-[2rem] text-xl md:text-4xl font-black bg-white shadow-[4px_4px_0px_#000] outline-none"
                    value={answers.title}
                    onChange={(e) => setAnswers({...answers, title: e.target.value})}
                    placeholder="Tulis judul yang menarik..."
                  />
               </div>
               <div>
                  <label className="block font-black uppercase text-[10px] md:text-xs mb-2 text-slate-500 tracking-widest">Draft Isi Berita Lengkap</label>
                  <textarea 
                    rows={8}
                    className="w-full p-5 md:p-8 border-[3px] border-black rounded-[2rem] md:rounded-[3rem] font-bold text-sm md:text-xl leading-relaxed bg-white shadow-[4px_4px_0px_#000] outline-none"
                    value={fullDraft}
                    readOnly
                  ></textarea>
               </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-10 pt-6 border-t-2 border-black">
              <button onClick={prev} className="font-black uppercase text-xs md:text-sm p-4">Kembali</button>
              <button onClick={handleFinish} className="bg-[#4CAF50] text-white px-12 py-5 border-[4px] border-black rounded-2xl font-black uppercase text-sm md:text-xl shadow-[8px_8px_0px_#000] hover:scale-102">Terbitkan Berita! 🗞️</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center py-4 space-y-8">
            <div className="text-center">
               <h1 className="text-2xl md:text-5xl font-black text-black uppercase italic leading-none tracking-tighter">Hasil Karya Jurnalis</h1>
               <p className="text-[10px] md:text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Berhasil diterbitkan ke seluruh sekolah!</p>
            </div>

            {/* Kontainer Koran Adaptif */}
            <div className="w-full max-w-2xl px-2">
              <motion.div 
                initial={{ rotate: -1, y: 30, opacity: 0 }}
                animate={{ rotate: 0, y: 0, opacity: 1 }}
                className="bg-white border-[6px] md:border-8 border-black p-5 md:p-12 w-full shadow-[12px_12px_0px_rgba(0,0,0,1)] md:shadow-[24px_24px_0px_rgba(0,0,0,1)] rounded-sm overflow-hidden"
              >
                <div className="text-center border-b-[4px] md:border-b-8 border-black pb-4 md:pb-8 mb-6 md:mb-10">
                  <h1 className="text-3xl md:text-7xl font-black uppercase italic leading-none text-black tracking-tighter">KABAR <span className="text-[#FF3D00]">DEMAK</span></h1>
                  <div className="flex justify-between items-center text-[8px] md:text-[12px] font-black uppercase border-y-2 md:border-y-4 border-black mt-3 py-1 md:py-2 px-1">
                     <span>Vol. 01 • No. 001</span>
                     <span>Senin, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-10">
                  <h2 className="text-xl md:text-4xl font-black uppercase leading-tight text-black border-l-4 md:border-l-[12px] border-[#FF3D00] pl-4 md:pl-8 italic">
                    {answers.title || "SISWA SMPN 3 BONANG RAIH PRESTASI"}
                  </h2>
                  
                  <div className="aspect-video w-full bg-slate-100 border-2 md:border-4 border-black flex items-center justify-center text-5xl md:text-9xl shadow-inner">
                    {selectedEvent?.icon}
                  </div>
                  
                  <div className="text-[11px] md:text-lg font-bold text-justify text-black leading-relaxed space-y-4">
                    <p><span className="font-black bg-black text-white px-2 py-1 mr-2 text-[10px] md:text-base">DEMAK, REDAKSI KITA</span> {answers.what || "Berita hari ini..."} dilaporkan berlangsung di {answers.where || "lokasi"} yang melibatkan {answers.who || "pihak sekolah"}. Peristiwa ini terjadi pada {answers.when || "waktu kejadian"}.</p>
                    <p className="hidden md:block">Menurut narasumber, kegiatan ini sangat bermanfaat untuk perkembangan kreativitas siswa dan mendukung program sekolah sehat di lingkungan SMP Negeri 3 Bonang.</p>
                  </div>

                  <div className="border-t-2 md:border-t-4 border-black pt-6 md:pt-10 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] md:text-[11px] font-black uppercase text-slate-400 leading-none mb-1">Reporter Utama:</p>
                      <p className="text-sm md:text-2xl font-black italic uppercase tracking-tight text-black">{studentName}</p>
                    </div>
                    <div className="w-14 h-14 md:w-24 md:h-24 bg-[#FFD600] rounded-full border-2 md:border-4 border-black flex flex-col items-center justify-center -rotate-12 shadow-lg">
                      <span className="text-[8px] md:text-[12px] font-black text-center leading-none">REDAKSI<br/>VALID</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-8 flex flex-col md:flex-row gap-4 w-full max-w-md no-print">
              <button onClick={() => window.print()} className="w-full bg-white text-black p-5 rounded-2xl border-[3px] border-black font-black uppercase text-xs md:text-sm flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-slate-50 transition-colors">
                <Printer className="mr-2 w-5 h-5" /> Cetak Kabar Koran
              </button>
              <button onClick={onBack} className="w-full bg-[#FF3D00] text-white p-5 rounded-2xl border-[3px] border-black font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_#000] hover:scale-102 transition-transform">Kembali ke Lobi Redaksi</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 flex flex-col items-center pb-20">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 md:mb-10 bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border-[3px] md:border-4 border-black shadow-[4px_4px_0px_#000] no-print">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] md:text-sm text-black hover:text-[#FF3D00] transition-colors">
          <Home className="mr-2 w-4 h-4 md:w-6 md:h-6"/> <span className="hidden sm:inline">Lobi Utama</span>
        </button>
        <div className="flex items-center space-x-2 text-black">
          <div className="bg-black p-1.5 md:p-2.5 rounded-xl">
            <PenTool className="text-white w-4 h-4 md:w-7 md:h-7" />
          </div>
          <h2 className="text-sm md:text-3xl font-black uppercase italic tracking-tighter leading-none">Meja Tulis <span className="text-[#FF3D00]">Jurnalis</span></h2>
        </div>
        <div className="flex space-x-1.5 md:space-x-3">
           {[1, 2, 3].map(i => (
             <div key={i} className={`w-2.5 h-2.5 md:w-4 md:h-4 rounded-full border-2 border-black ${step >= i ? 'bg-[#FF3D00]' : 'bg-slate-200'} transition-colors`}></div>
           ))}
        </div>
      </div>
      
      <div className="w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[4rem] border-[3px] md:border-4 border-black p-5 md:p-16 relative shadow-[10px_10px_0px_#000]">
        <div className="absolute top-0 left-0 w-2 md:w-5 h-full bg-[#FF3D00] border-r-2 md:border-r-4 border-black hidden md:block"></div>
        {renderStep()}
      </div>

      <div className="mt-10 text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-[0.3em] no-print">
        Tips: Gunakan Struktur Piramida Terbalik untuk Berita Terbaik
      </div>
    </div>
  );
};

export default WritingDesk;
