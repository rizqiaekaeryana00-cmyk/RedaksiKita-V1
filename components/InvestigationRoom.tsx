
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, FileText, Camera, Mic, CheckCircle2, XCircle, Info, ExternalLink, Newspaper } from 'lucide-react';
import { INVESTIGATION_FILES } from '../constants';
import { sounds } from '../services/audio';

const InvestigationRoom = ({ onBack }: { onBack: () => void }) => {
  const [foundFacts, setFoundFacts] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const toggleFact = (id: string, isFact: boolean) => {
    if (isFact) {
      sounds.correct();
      if (!foundFacts.includes(id)) setFoundFacts([...foundFacts, id]);
    } else {
      sounds.wrong();
      // Using a more modern overlay instead of native alert for better UX
      const hoaxEl = document.getElementById('hoax-alert');
      if (hoaxEl) {
        hoaxEl.style.display = 'flex';
        setTimeout(() => { hoaxEl.style.display = 'none'; }, 2000);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-[#00E5FF] p-4 flex flex-col items-center overflow-hidden">
      {/* Instructions Modal */}
      {showInstructions && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="glass-card max-w-sm p-6 text-center bg-white rounded-[2.5rem]">
            <Search className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <h2 className="text-xl font-black uppercase mb-2">Misi Investigasi</h2>
            <p className="font-bold mb-6 text-sm text-slate-700">Kamu adalah detektif berita! Analisis kliping koran di kanan, lalu temukan 2 FAKTA valid di folder kiri. Waspadai Hoaks!</p>
            <button onClick={() => { sounds.click(); setShowInstructions(false); }} className="btn-primary w-full py-3 text-white font-black uppercase rounded-xl">Mulai Misi</button>
          </div>
        </motion.div>
      )}

      {/* Custom Hoax Alert Overlay */}
      <div id="hoax-alert" className="fixed inset-0 z-[250] hidden items-center justify-center bg-red-600/90 pointer-events-none">
        <div className="text-center text-white p-8">
          <XCircle className="w-24 h-24 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-black uppercase italic">AWAS HOAKS!</h2>
          <p className="text-xl font-bold italic">Informasi ini tidak akurat dan menyesatkan.</p>
        </div>
      </div>

      <div className="w-full max-w-5xl flex justify-between items-center mb-4 bg-white p-3 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black hover:text-[#FF3D00] transition-colors">
          <ArrowLeft className="mr-1.5 w-4 h-4" /> Lobi
        </button>
        <div className="flex items-center space-x-2">
           <Search className="text-blue-600 w-5 h-5" />
           <h2 className="text-lg font-black uppercase italic tracking-tighter">Meja <span className="text-blue-600">Investigasi</span></h2>
        </div>
        <div className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase italic">
          Progres: {foundFacts.length}/2 Fakta
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-5xl flex-1 overflow-hidden">
        {/* Evidence Zone - Left */}
        <div className="flex flex-col space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-sm font-black uppercase text-black tracking-widest flex items-center">
            <FileText className="w-4 h-4 mr-2" /> Folder Barang Bukti
          </h3>
          {INVESTIGATION_FILES.map((file) => (
            <motion.div 
              key={file.id} 
              whileHover={{ x: 5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleFact(file.id, file.isFact)}
              className={`p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] cursor-pointer flex items-center space-x-3 transition-colors ${
                foundFacts.includes(file.id) ? 'bg-green-100' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg border-2 border-black ${foundFacts.includes(file.id) ? 'bg-green-500' : 'bg-slate-100'}`}>
                {file.type === 'PHOTO' && <Camera className={foundFacts.includes(file.id) ? 'text-white' : 'text-blue-500'} />}
                {file.type === 'INTERVIEW' && <Mic className={foundFacts.includes(file.id) ? 'text-white' : 'text-red-500'} />}
                {file.type === 'DOCUMENT' && <FileText className={foundFacts.includes(file.id) ? 'text-white' : 'text-orange-500'} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black uppercase text-xs text-black truncate">{file.title}</h4>
                <p className="text-[11px] font-bold text-slate-600 leading-tight line-clamp-2">{file.content}</p>
              </div>
              {foundFacts.includes(file.id) && <CheckCircle2 className="text-green-600 w-6 h-6 shrink-0" />}
            </motion.div>
          ))}
          
          <div className="mt-auto bg-black text-white p-4 rounded-xl border-2 border-white italic">
             <p className="text-[10px] font-bold leading-tight">"Detektif, bandingkan berita di sebelah kanan dengan bukti-bukti di atas. Hanya pilih folder yang berisi informasi VALID sesuai sumber!"</p>
          </div>
        </div>

        {/* Newspaper Zone - Right */}
        <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
             <Newspaper className="w-40 h-40 rotate-12" />
          </div>
          
          <div className="border-b-4 border-black pb-3 mb-3 flex justify-between items-end">
             <div className="text-[10px] font-black uppercase italic tracking-tighter">Kliping Berita Digital</div>
             <div className="text-[9px] font-bold text-slate-400">SUMBER: KOMPAS.ID</div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFBF7] p-4 rounded-lg border-2 border-black border-dashed">
             <div className="text-center mb-4">
                <h3 className="text-xl md:text-2xl font-black uppercase leading-tight text-black italic mb-2">
                  Kantin Sehat Jakarta Tingkatkan Kesadaran Gizi dan Pengelolaan Kalori Siswa
                </h3>
                <div className="h-1 w-20 bg-black mx-auto mb-2"></div>
             </div>

             <div className="space-y-3 text-xs font-bold leading-relaxed text-slate-800 text-justify">
                <p>
                  <span className="bg-black text-white px-1.5 py-0.5 mr-1 font-black italic">JAKARTA</span> 
                  Program kantin sehat di Jakarta kini mulai mewajibkan penyediaan informasi kalori pada setiap menu yang disajikan. Hal ini bertujuan untuk mengedukasi siswa agar lebih sadar akan asupan nutrisi harian mereka.
                </p>
                <p>
                  Pemerintah Provinsi Jakarta bekerja sama dengan ahli gizi memastikan bahwa makanan di kantin sekolah tidak hanya mengenyangkan, tetapi juga sehat dan terjangkau melalui sistem subsidi di beberapa sekolah percontohan.
                </p>
                <p className="italic border-l-4 border-blue-500 pl-3 py-1 bg-blue-50">
                  "Siswa diharapkan mampu memilih makanan yang mendukung pertumbuhan mereka, bukan sekadar camilan tanpa gizi," ujar salah satu perwakilan pengelola kantin sehat.
                </p>
                
                <div className="mt-4 pt-4 border-t-2 border-slate-200">
                   <a 
                     href="https://www.kompas.id/artikel/kantin-sehat-jakarta-tingkatkan-kesadaran-gizi-dan-pengelolaan-kalori-siswa" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center text-[10px] font-black text-blue-600 hover:underline"
                   >
                     BACA ARTIKEL ASLI <ExternalLink className="w-3 h-3 ml-1" />
                   </a>
                </div>
             </div>
          </div>

          <div className="mt-3 bg-[#FFD600] p-3 rounded-xl border-2 border-black shadow-sm shrink-0">
             <div className="flex items-center space-x-2 mb-1">
               <Info className="w-4 h-4 text-black" />
               <p className="text-[10px] font-black uppercase tracking-wide">Fokus Investigasi</p>
             </div>
             <p className="text-[11px] font-bold text-black leading-tight italic">
               Apakah berita ini menyebutkan makanan akan diberikan gratis total? Periksa bukti di sebelah kiri!
             </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-[9px] font-black uppercase text-black/40 tracking-widest flex items-center bg-white/50 px-4 py-1 rounded-full border border-black/10">
        Detektif Hebat tidak pernah terburu-buru mengambil kesimpulan.
      </div>
    </div>
  );
};

export default InvestigationRoom;
