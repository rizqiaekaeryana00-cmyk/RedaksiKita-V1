
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, FileText, Camera, Mic, CheckCircle2, XCircle, Info, ExternalLink, Newspaper } from 'lucide-react';
import { InvestigationData } from '../types';
import { sounds } from '../services/audio';

const InvestigationRoom = ({ onBack, investigationFiles }: { onBack: () => void, investigationFiles: InvestigationData[] }) => {
  const [foundFacts, setFoundFacts] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const toggleFact = (id: string, isFact: boolean) => {
    if (isFact) {
      sounds.correct();
      if (!foundFacts.includes(id)) setFoundFacts([...foundFacts, id]);
    } else {
      sounds.wrong();
      const hoaxEl = document.getElementById('hoax-alert');
      if (hoaxEl) {
        hoaxEl.style.display = 'flex';
        setTimeout(() => { hoaxEl.style.display = 'none'; }, 2000);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-[#00E5FF] p-4 flex flex-col items-center overflow-hidden">
      {showInstructions && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="glass-card max-w-sm p-6 text-center bg-white rounded-[2.5rem]">
            <Search className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <h2 className="text-xl font-black uppercase mb-2">Misi Investigasi</h2>
            <p className="font-bold mb-6 text-sm text-slate-700">Analisis kliping berita, lalu temukan FAKTA valid di folder bukti. Waspadai Hoaks!</p>
            <button onClick={() => { sounds.click(); setShowInstructions(false); }} className="btn-primary w-full py-3 text-white font-black uppercase rounded-xl">Mulai Misi</button>
          </div>
        </motion.div>
      )}

      <div id="hoax-alert" className="fixed inset-0 z-[250] hidden items-center justify-center bg-red-600/90 pointer-events-none">
        <div className="text-center text-white p-8">
          <XCircle className="w-24 h-24 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-black uppercase italic">AWAS HOAKS!</h2>
        </div>
      </div>

      <div className="w-full max-w-5xl flex justify-between items-center mb-4 bg-white p-3 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black hover:text-[#FF3D00] transition-colors"><ArrowLeft className="mr-1.5 w-4 h-4" /> Lobi</button>
        <div className="flex items-center space-x-2"><Search className="text-blue-600 w-5 h-5" /><h2 className="text-lg font-black uppercase italic tracking-tighter">Meja <span className="text-blue-600">Investigasi</span></h2></div>
        <div className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase italic">Progres: {foundFacts.length} Fakta</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-5xl flex-1 overflow-hidden">
        <div className="flex flex-col space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-sm font-black uppercase text-black flex items-center"><FileText className="w-4 h-4 mr-2" /> Folder Barang Bukti</h3>
          {investigationFiles.map((file) => (
            <motion.div key={file.id} onClick={() => toggleFact(file.id, file.isFact)} className={`p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] cursor-pointer flex items-center space-x-3 ${foundFacts.includes(file.id) ? 'bg-green-100' : 'bg-white hover:bg-slate-50'}`}>
              <div className={`p-2 rounded-lg border-2 border-black ${foundFacts.includes(file.id) ? 'bg-green-500' : 'bg-slate-100'}`}>
                {file.type === 'PHOTO' && <Camera className={foundFacts.includes(file.id) ? 'text-white' : 'text-blue-500'} />}
                {file.type === 'INTERVIEW' && <Mic className={foundFacts.includes(file.id) ? 'text-white' : 'text-red-500'} />}
                {file.type === 'DOCUMENT' && <FileText className={foundFacts.includes(file.id) ? 'text-white' : 'text-orange-500'} />}
              </div>
              <div className="flex-1 min-w-0"><h4 className="font-black uppercase text-xs text-black truncate">{file.title}</h4><p className="text-[11px] font-bold text-slate-600 truncate">{file.content}</p></div>
              {foundFacts.includes(file.id) && <CheckCircle2 className="text-green-600 w-6 h-6 shrink-0" />}
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-2xl border-4 border-black overflow-hidden flex flex-col relative">
          <div className="border-b-4 border-black pb-3 mb-3 flex justify-between items-end"><div className="text-[10px] font-black uppercase italic tracking-tighter">Kliping Berita Digital</div></div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFBF7] p-4 rounded-lg border-2 border-black border-dashed">
             <h3 className="text-xl font-black uppercase leading-tight text-black italic mb-2">Kantin Sehat Jakarta Tingkatkan Kesadaran Gizi</h3>
             <p className="text-xs font-bold leading-relaxed text-slate-800">Program kantin sehat mewajibkan informasi kalori. Pemprov Jakarta berencana memberikan subsidi di beberapa sekolah percontohan...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationRoom;
