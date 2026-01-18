
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

  const next = () => { sounds.click(); setStep(s => s + 1); };
  const prev = () => { sounds.click(); setStep(s => s - 1); };

  const handleSelectEvent = (ev: any) => {
    sounds.success();
    setSelectedEvent(ev);
    setTimeout(() => { setStep(2); }, 300);
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
    setAiClue("Tunggu sebentar, Editor AI sedang berpikir...");
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
          <div className="space-y-6 md:space-y-8 text-center py-2">
            <div>
               <h2 className="text-2xl md:text-3xl font-black uppercase text-black italic leading-none mb-2">Pilih Peristiwa</h2>
               <p className="text-xs md:text-sm font-bold text-slate-400">Pilih tema liputanmu hari ini!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
              {WRITING_EVENTS.map(ev => (
                <motion.button
                  key={ev.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectEvent(ev)}
                  className={`p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] border-[3px] md:border-4 border-black flex flex-col items-center space-y-2 md:space-y-4 transition-all relative overflow-hidden group ${selectedEvent?.id === ev.id ? 'bg-[#FF3D00] text-white shadow-[4px_4px_0px_#000]' : 'bg-white text-black shadow-[4px_4px_0px_#000]'}`}
                >
                  <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform">{ev.icon}</span>
                  <span className="font-black uppercase tracking-tight text-[10px] md:text-base leading-tight">{ev.title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[3px] border-black pb-4">
               <div>
                 <div className="flex items-center space-x-2">
                    <span className="text-xl md:text-2xl">{selectedEvent?.icon}</span>
                    <h2 className="text-lg md:text-2xl font-black uppercase text-black">Data 5W + 1H</h2>
                 </div>
                 <p className="text-[10px] md:text-sm font-bold text-slate-500 italic">Meliput: <span className="text-[#FF3D00]">{selectedEvent?.title}</span></p>
               </div>
               <button onClick={() => handleAiClue('5W1H')} className="bg-[#FFD600] px-4 py-2 rounded-xl border-[3px] border-black flex items-center text-[10px] font-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 self-start md:self-auto">
                  <Sparkles className="w-4 h-4 mr-2" /> SARAN EDITOR AI
               </button>
            </div>
            
            {aiClue && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#00E5FF]/10 p-4 rounded-xl border-2 border-black font-bold text-black text-xs md:text-sm italic">
                {aiClue}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { key: 'what', label: 'Apa?', placeholder: 'Contoh: Lomba Robotik...' },
                { key: 'who', label: 'Siapa?', placeholder: 'Contoh: Siswa kelas 7...' },
                { key: 'where', label: 'Di mana?', placeholder: 'Contoh: Aula Sekolah...' },
                { key: 'when', label: 'Kapan?', placeholder: 'Contoh: Senin, 12 Juni...' },
                { key: 'why', label: 'Mengapa?', placeholder: 'Contoh: Memperingati HUT...' },
                { key: 'how', label: 'Bagaimana?', placeholder: 'Contoh: Acara seru karena...' },
              ].map((item) => (
                <div key={item.key} className="relative">
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">{item.label}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full p-3 md:p-4 border-[3px] border-black rounded-xl md:rounded-2xl font-bold text-sm md:text-base bg-white shadow-[2px_2px_0px_#000]"
                      value={(answers as any)[item.key]}
                      onChange={(e) => setAnswers({...answers, [item.key]: e.target.value})}
                      placeholder={item.placeholder}
                    />
                    <button onClick={() => toggleHint(item.key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-500">
                      <Lightbulb className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8 pt-4 border-t-2 border-black">
              <button onClick={prev} className="font-black uppercase text-xs flex items-center justify-center p-3">Kembali Pilih Tema</button>
              <button onClick={next} disabled={!answers.what || !answers.who} className="bg-[#FF3D00] text-white px-8 py-4 border-[3px] border-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_#000] disabled:opacity-50">Susun Berita</button>
            </div>
          </div>
        );
      case 3:
        const fullDraft = `DEMAK - Telah terjadi ${selectedEvent?.title} yang dilaksanakan di ${answers.where || "[Lokasi]"} pada hari ${answers.when || "[Waktu]"}. Peristiwa ini melibatkan ${answers.who || "[Pihak Terkait]"}. Hal ini terjadi karena ${answers.why || "[Alasan]"}. ${answers.how || "[Kronologi kejadian]"}.`;
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-black pb-4">
              <h2 className="text-xl md:text-2xl font-black uppercase italic">Meja Editor</h2>
              <button onClick={handleClinic} disabled={isChecking} className="bg-[#00E5FF] px-4 py-2 rounded-xl border-[3px] border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000]">
                {isChecking ? 'Memeriksa...' : '💉 Klinik Bahasa'}
              </button>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block font-black uppercase text-[10px] mb-1 text-slate-500">Judul Headline</label>
                  <input 
                    className="w-full p-4 border-[3px] border-black rounded-xl md:rounded-2xl text-lg md:text-2xl font-black bg-white shadow-[3px_3px_0px_#000]"
                    value={answers.title}
                    onChange={(e) => setAnswers({...answers, title: e.target.value})}
                    placeholder="Tulis judul berita..."
                  />
               </div>
               <div>
                  <label className="block font-black uppercase text-[10px] mb-1 text-slate-500">Isi Berita</label>
                  <textarea 
                    rows={8}
                    className="w-full p-4 md:p-6 border-[3px] border-black rounded-2xl md:rounded-[2rem] font-bold text-sm md:text-base leading-relaxed bg-white shadow-[3px_3px_0px_#000]"
                    value={fullDraft}
                    readOnly
                  ></textarea>
               </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between gap-4 mt-8 pt-4 border-t-2 border-black">
              <button onClick={prev} className="font-black uppercase text-xs p-3">Kembali</button>
              <button onClick={handleFinish} className="bg-[#4CAF50] text-white px-8 py-4 border-[3px] border-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_#000]">Terbitkan Berita!</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center py-4">
            <div className="text-center mb-6">
               <h1 className="text-xl md:text-3xl font-black text-black uppercase italic leading-none">Hasil Karya Jurnalis</h1>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Berhasil diterbitkan ke seluruh sekolah!</p>
            </div>

            <div className="w-full flex justify-center overflow-x-auto no-scrollbar py-4 px-2">
              <motion.div 
                initial={{ rotate: -1, y: 20 }}
                animate={{ rotate: 0, y: 0 }}
                className="bg-white border-[6px] md:border-8 border-black p-6 md:p-10 w-full max-w-lg shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_rgba(0,0,0,1)] rounded-sm shrink-0"
              >
                <div className="text-center border-b-[4px] md:border-b-8 border-black pb-4 md:pb-6 mb-4 md:mb-6">
                  <h1 className="text-3xl md:text-5xl font-black uppercase italic leading-none text-black">KABAR <span className="text-[#FF3D00]">DEMAK</span></h1>
                  <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase border-t-2 border-black mt-2 pt-1">
                     <span>Vol. 01 • No. 001</span>
                     <span>{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-3xl font-black uppercase leading-tight text-black border-l-4 md:border-l-8 border-[#FF3D00] pl-3 md:pl-4 italic">
                    {answers.title || "Laporan Utama Redaksi"}
                  </h2>
                  <div className="aspect-video w-full bg-slate-100 border-2 md:border-4 border-black flex items-center justify-center text-4xl md:text-6xl">
                    {selectedEvent?.icon}
                  </div>
                  <div className="text-[11px] md:text-sm font-bold text-justify text-black leading-relaxed">
                    <p><span className="font-black bg-black text-white px-1 mr-1">DEMAK</span> {answers.what || "Berita hari ini..."} dilaporkan berlangsung di {answers.where || "lokasi"} yang melibatkan {answers.who || "pihak sekolah"}. Acara ini bertujuan untuk {answers.why || "tujuan tertentu"}.</p>
                  </div>
                  <div className="border-t-2 border-black pt-4 flex justify-between items-end">
                    <div className="text-[9px] md:text-[11px] font-black">
                      <p className="text-slate-400 uppercase">Reporter:</p>
                      <p className="text-sm md:text-lg italic uppercase">{studentName}</p>
                    </div>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFD600] rounded-full border-2 md:border-4 border-black flex items-center justify-center -rotate-12">
                      <span className="text-[8px] md:text-[10px] font-black text-center leading-none">REDAKSI<br/>VALID</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-10 flex flex-col md:flex-row gap-4 w-full max-w-sm">
              <button onClick={() => window.print()} className="bg-white text-black p-4 rounded-xl border-[3px] border-black font-black uppercase text-xs flex items-center justify-center shadow-[4px_4px_0px_#000]">
                <Printer className="mr-2 w-4 h-4" /> Cetak Koran
              </button>
              <button onClick={onBack} className="bg-[#FF3D00] text-white p-4 rounded-xl border-[3px] border-black font-black uppercase text-xs shadow-[4px_4px_0px_#000]">Lobi Redaksi</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-6 flex flex-col items-center overflow-y-auto">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border-[3px] md:border-4 border-black shadow-[4px_4px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] md:text-sm text-black">
          <Home className="mr-1.5 md:mr-2 w-4 h-4 md:w-5 md:h-5"/> <span className="hidden sm:inline">Lobi</span>
        </button>
        <div className="flex items-center space-x-2 text-black">
          <div className="bg-black p-1.5 rounded-lg">
            <PenTool className="text-white w-4 h-4 md:w-6 md:h-6" />
          </div>
          <h2 className="text-sm md:text-2xl font-black uppercase italic tracking-tight">Meja Tulis <span className="text-[#FF3D00]">Jurnalis</span></h2>
        </div>
        <div className="flex space-x-1">
           {[1, 2, 3].map(i => (
             <div key={i} className={`w-2 h-2 md:w-3 md:h-3 rounded-full border border-black ${step >= i ? 'bg-[#FF3D00]' : 'bg-slate-200'}`}></div>
           ))}
        </div>
      </div>
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3rem] border-[3px] md:border-4 border-black p-5 md:p-12 relative overflow-hidden shadow-[8px_8px_0px_#000] mb-10">
        <div className="absolute top-0 left-0 w-2 md:w-4 h-full bg-[#FF3D00] border-r-2 md:border-r-4 border-black hidden sm:block"></div>
        {renderStep()}
      </div>
    </div>
  );
};

export default WritingDesk;
