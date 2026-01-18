
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
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 }, colors: ['#FF3D00', '#FFD600', '#00E5FF'] });
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
          <div className="space-y-8 text-center">
            <h2 className="text-3xl font-black uppercase text-black italic">Tentukan Peristiwa</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {WRITING_EVENTS.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => { setSelectedEvent(ev); sounds.click(); }}
                  className={`p-8 rounded-[2.5rem] border-4 border-black flex flex-col items-center space-y-4 transition-all active:translate-y-2 active:shadow-none ${selectedEvent?.id === ev.id ? 'bg-[#FF3D00] text-white scale-110 shadow-[10px_10px_0px_#000]' : 'bg-white text-black hover:bg-slate-50 shadow-[6px_6px_0px_#000]'}`}
                >
                  <span className="text-6xl">{ev.icon}</span>
                  <span className="font-black uppercase tracking-tight">{ev.title}</span>
                </button>
              ))}
            </div>
            {selectedEvent && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={next} className="btn-primary px-16 py-5 text-white font-black uppercase text-xl rounded-2xl shadow-[8px_8px_0px_#000]">
                Mulai Menulis!
              </motion.button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b-4 border-black pb-4">
               <div>
                 <h2 className="text-2xl font-black uppercase text-black">Panduan 5W + 1H</h2>
                 <p className="text-sm font-bold text-slate-500">Isi tiap kolom dengan fakta yang kamu temukan.</p>
               </div>
               <div className="flex space-x-2">
                 <button onClick={() => handleAiClue('5W1H')} className="bg-[#FFD600] px-5 py-3 rounded-2xl border-4 border-black flex items-center text-xs font-black shadow-[4px_4px_0px_#000] hover:scale-105 transition-all">
                    <Sparkles className="w-5 h-5 mr-2 text-black" /> <span className="text-black">SARAN AI</span>
                 </button>
               </div>
            </div>
            
            {aiClue && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-[#00E5FF]/20 p-5 rounded-2xl border-2 border-black font-bold text-black flex items-start">
                <Sparkles className="w-5 h-5 mr-3 text-black shrink-0 mt-1" />
                <p className="italic leading-relaxed">{aiClue}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { key: 'what', label: 'Apa yang terjadi?', placeholder: 'Contoh: Lomba Robotik antar kelas...' },
                { key: 'who', label: 'Siapa yang terlibat?', placeholder: 'Contoh: Siswa kelas 7, Pak Guru...' },
                { key: 'where', label: 'Di mana lokasinya?', placeholder: 'Contoh: Di Aula SMPN 3 Bonang...' },
                { key: 'when', label: 'Kapan kejadiannya?', placeholder: 'Contoh: Hari Senin, 12 Juni 2026...' },
                { key: 'why', label: 'Mengapa terjadi?', placeholder: 'Contoh: Untuk memperingati hari teknologi...' },
                { key: 'how', label: 'Bagaimana jalannya?', placeholder: 'Contoh: Acara dimulai dengan doa, lalu...' },
              ].map((item) => (
                <div key={item.key} className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-black uppercase text-slate-600 tracking-wider">{item.label}</label>
                    <button 
                      onClick={() => toggleHint(item.key)}
                      className="p-1 text-slate-400 hover:text-[#FF3D00] transition-colors"
                      title="Klik untuk contoh"
                    >
                      <Lightbulb className={`w-5 h-5 ${showHint === item.key ? 'text-[#FFD600] fill-[#FFD600]' : ''}`} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder={item.placeholder}
                    className="w-full p-5 border-4 border-black rounded-2xl focus:bg-[#00E5FF]/10 font-bold text-black bg-white outline-none placeholder:text-slate-300 shadow-[2px_2px_0px_#000]"
                    value={(answers as any)[item.key]}
                    onChange={(e) => setAnswers({...answers, [item.key]: e.target.value})}
                  />
                  <AnimatePresence>
                    {showHint === item.key && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute z-20 top-full mt-2 left-0 right-0 bg-[#FFD600] p-4 rounded-xl border-2 border-black text-sm font-bold shadow-xl text-black"
                      >
                        💡 Tips: {item.placeholder}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-12 pt-6 border-t-4 border-black">
              <button onClick={prev} className="font-black uppercase flex items-center text-black px-6 py-2 hover:bg-slate-100 rounded-xl transition-colors"><ArrowLeft className="mr-2"/> Kembali</button>
              <button 
                onClick={next} 
                disabled={!answers.what || !answers.who}
                className="bg-[#FF3D00] text-white px-12 py-4 border-4 border-black rounded-2xl font-black uppercase text-lg shadow-[6px_6px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
              >
                Susun Berita <ArrowRight className="ml-2 inline-block w-5 h-5"/>
              </button>
            </div>
          </div>
        );
      case 3:
        const fullDraft = `DEMAK - Telah terjadi ${selectedEvent.title} yang dilaksanakan di ${answers.where || "[Lokasi]"} pada hari ${answers.when || "[Waktu]"}. Peristiwa ini melibatkan ${answers.who || "[Pihak Terkait]"}. Hal ini terjadi karena ${answers.why || "[Alasan]"}. ${answers.how || "[Kronologi kejadian]"}.`;
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 border-b-4 border-black pb-4">
              <div>
                <h2 className="text-3xl font-black uppercase text-black italic">Meja Editor</h2>
                <p className="text-sm font-bold text-slate-500">Sempurnakan judul dan isi beritamu.</p>
              </div>
              <button 
                onClick={handleClinic}
                disabled={isChecking}
                className="bg-[#00E5FF] px-6 py-3 rounded-2xl border-4 border-black font-black uppercase text-black text-sm shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1 hover:scale-105 transition-all"
              >
                {isChecking ? 'Sedang Memeriksa...' : '💉 Klinik Bahasa'}
              </button>
            </div>

            {clinicFeedback && (
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-green-100 p-6 rounded-[2rem] border-4 border-black flex items-start space-x-4 shadow-[4px_4px_0px_#000]">
                <div className="bg-white p-2 rounded-xl border-2 border-black">
                  <Sparkles className="text-green-600 shrink-0 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase text-green-700 mb-1">Analisis Klinik Bahasa</p>
                  <p className="text-base font-bold text-black leading-relaxed">{clinicFeedback}</p>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
               <div className="relative">
                  <label className="block font-black uppercase text-xs mb-2 text-slate-500 tracking-widest">Judul Headline</label>
                  <input 
                    type="text" 
                    placeholder="Tulis judul yang singkat dan padat..."
                    className="w-full p-6 border-4 border-black rounded-3xl text-3xl font-black bg-white text-black outline-none focus:ring-4 focus:ring-[#FFD600]/30 shadow-[4px_4px_0px_#000]"
                    value={answers.title}
                    onChange={(e) => setAnswers({...answers, title: e.target.value})}
                  />
               </div>
               <div className="relative">
                  <label className="block font-black uppercase text-xs mb-2 text-slate-500 tracking-widest">Isi Berita Lengkap (Body)</label>
                  <textarea 
                    rows={10}
                    className="w-full p-8 border-4 border-black rounded-[2.5rem] font-bold text-lg leading-relaxed bg-white text-black outline-none focus:ring-4 focus:ring-[#00E5FF]/30 shadow-[4px_4px_0px_#000]"
                    value={fullDraft}
                    readOnly
                  ></textarea>
                  <div className="absolute top-8 right-8 text-[10px] font-black uppercase text-slate-300">Format Preview</div>
               </div>
            </div>

            <div className="flex justify-between mt-12 pt-6 border-t-4 border-black">
              <button onClick={prev} className="font-black uppercase flex items-center text-black px-6 py-2 hover:bg-slate-100 rounded-xl transition-colors"><ArrowLeft className="mr-2"/> Kembali</button>
              <button onClick={handleFinish} className="bg-[#4CAF50] text-white px-16 py-5 border-4 border-black rounded-2xl font-black uppercase text-xl shadow-[8px_8px_0px_#000] hover:scale-105 transition-all">
                Terbitkan! <Printer className="ml-3 w-6 h-6 inline-block"/>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center py-6">
            <div className="text-center mb-8">
               <div className="inline-block bg-[#FFD600] px-6 py-2 rounded-full border-4 border-black font-black uppercase text-black text-sm mb-4">BERHASIL DITERBITKAN! 🎖️</div>
               <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">Hasil Karya Jurnalis Muda</h1>
            </div>

            <motion.div 
              initial={{ rotate: -2, y: 50, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              className="bg-[#F8FAFC] border-8 border-black p-12 max-w-2xl w-full shadow-[24px_24px_0px_rgba(0,0,0,1)] relative overflow-hidden rounded-sm"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-10 pointer-events-none"></div>
              
              <div className="text-center border-b-8 border-black pb-8 mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#FF3D00] rounded-2xl border-4 border-black flex items-center justify-center rotate-3">
                    <PenTool className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-2 text-black">KABAR <span className="text-[#FF3D00]">DEMAK</span></h1>
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-black px-1 border-y-2 border-black py-1">
                   <span>Vol. 01 • No. 001</span>
                   <span>Senin, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                   <span>Edisi Spesial</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-4xl font-black uppercase leading-tight mb-6 text-black border-l-8 border-[#FF3D00] pl-6 italic">{answers.title || "SISWA SMPN 3 BONANG RAIH PRESTASI"}</h2>
                <div className="aspect-video w-full bg-white border-4 border-black flex items-center justify-center mb-6 shadow-md">
                  <span className="text-9xl grayscale opacity-80">{selectedEvent.icon}</span>
                </div>
                <div className="columns-1 md:columns-2 gap-8 text-sm font-bold leading-relaxed text-black text-justify">
                  <p>
                    <span className="font-black uppercase bg-black text-white px-2 py-1 mr-2 text-xs">DEMAK, REDaksi KITA</span> 
                    Telah terjadi {selectedEvent.title} yang dilaksanakan di {answers.where || "[Lokasi]"} pada hari {answers.when || "[Waktu]"}. 
                    Peristiwa membanggakan ini melibatkan {answers.who || "beberapa pihak terkait"} dan berjalan dengan sangat antusias.
                  </p>
                  <p className="mt-4">
                    {answers.how || "Berdasarkan pantauan tim redaksi, kegiatan ini merupakan tonggak baru bagi kemajuan kreativitas siswa. Semua peserta tampak bersemangat mengikuti setiap tahapan yang ada."} 
                    Hal ini diharapkan mampu meningkatkan motivasi belajar seluruh siswa di SMP Negeri 3 Bonang.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t-4 border-black pt-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-400">Reporter Lapangan</div>
                  <div className="text-xl font-black uppercase italic tracking-tight text-black">{studentName}</div>
                </div>
                <div className="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center bg-[#FFD600] -rotate-12 shadow-md">
                   <div className="text-[10px] font-black uppercase text-center leading-none text-black">REDAKSI<br/>VALID</div>
                </div>
              </div>
            </motion.div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-6">
              <button onClick={() => window.print()} className="bg-white text-black px-10 py-4 rounded-2xl border-4 border-black font-black uppercase flex items-center shadow-[6px_6px_0px_#000] hover:scale-105 transition-all">
                <Printer className="mr-3 w-6 h-6" /> Cetak Kabar
              </button>
              <button onClick={onBack} className="bg-[#FF3D00] text-white px-12 py-4 border-4 border-black rounded-2xl font-black uppercase shadow-[8px_8px_0px_#000] hover:scale-105 transition-all">Lobi Redaksi</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-sm text-black hover:text-[#FF3D00] transition-colors">
          <Home className="mr-2 w-5 h-5"/> Lobi
        </button>
        <div className="flex items-center space-x-3 text-black">
          <div className="bg-black p-2 rounded-xl">
            <PenTool className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Meja Tulis <span className="text-[#FF3D00]">Jurnalis</span></h2>
        </div>
        <div className="flex items-center space-x-2">
           {[1, 2, 3].map(i => (
             <div key={i} className={`w-3 h-3 rounded-full border-2 border-black ${step >= i ? 'bg-[#FF3D00]' : 'bg-slate-200'}`}></div>
           ))}
        </div>
      </div>
      
      <div className="w-full max-w-5xl bg-white rounded-[3rem] border-4 border-black p-12 relative overflow-hidden shadow-[16px_16px_0px_#000]">
        <div className="absolute top-0 left-0 w-4 h-full bg-[#FF3D00] border-r-4 border-black"></div>
        {renderStep()}
      </div>

      <div className="mt-8 text-xs font-black uppercase text-slate-400">
        Tips: Gunakan Klinik Bahasa untuk memperbaiki tata bahasa karyamu!
      </div>
    </div>
  );
};

export default WritingDesk;
