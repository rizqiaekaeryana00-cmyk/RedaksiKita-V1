
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, FileText, Camera, Mic, CheckCircle2, XCircle, Info, ExternalLink, Newspaper, Play, Eye, Clipboard, MapPin, Calendar } from 'lucide-react';
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
    <div className="h-screen bg-[#00E5FF] p-4 flex flex-col items-center overflow-hidden relative">
      {/* Modal Instruksi Awal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white max-w-lg w-full p-10 text-center rounded-[3rem] border-[6px] border-black shadow-[16px_16px_0px_#000]"
            >
              <div className="w-24 h-24 bg-blue-500 rounded-3xl border-4 border-black flex items-center justify-center mx-auto mb-6 rotate-3 shadow-xl">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Misi Investigasi</h2>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-black border-dashed text-left mb-8 space-y-3">
                <p className="text-sm font-bold text-slate-700 flex items-start">
                  <Eye className="w-5 h-5 mr-3 text-blue-600 shrink-0" /> 
                  Baca artikel berita di panel kanan untuk memahami konteks peristiwa.
                </p>
                <p className="text-sm font-bold text-slate-700 flex items-start">
                  <Clipboard className="w-5 h-5 mr-3 text-green-600 shrink-0" /> 
                  Cari bukti fisik (Foto, Wawancara, Dokumen) di panel kiri yang mendukung isi berita.
                </p>
                <p className="text-xs italic text-red-500 font-black uppercase">Waspadai Bukti Palsu / Hoaks!</p>
              </div>
              <button 
                onClick={() => { sounds.click(); setShowInstructions(false); }} 
                className="w-full py-5 bg-blue-600 text-white font-black uppercase rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center space-x-3"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>MULAI INVESTIGASI</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Alert Hoaks */}
      <div id="hoax-alert" className="fixed inset-0 z-[600] hidden items-center justify-center bg-red-600/95 pointer-events-none">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center text-white p-8">
          <XCircle className="w-32 h-32 mx-auto mb-6 animate-ping" />
          <h2 className="text-6xl font-black uppercase italic tracking-tighter">BUKTI PALSU!</h2>
          <p className="text-xl font-bold mt-2">Ini adalah informasi hoaks yang menyesatkan.</p>
        </motion.div>
      </div>

      {/* Header Room */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-4 bg-white p-4 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] z-50">
        <button onClick={onBack} className="flex items-center font-black uppercase text-[10px] text-black hover:text-[#FF3D00] transition-colors">
          <ArrowLeft className="mr-2 w-5 h-5" /> KEMBALI
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-xl border-2 border-black rotate-2 shadow-md">
            <Search className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black">
            Meja <span className="text-blue-600">Investigasi</span>
          </h2>
        </div>
        <div className="bg-black text-white px-6 py-2 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center italic">
          <span className="text-[#00E5FF] mr-2">FAKTA DITEMUKAN:</span> {foundFacts.length} / 2
        </div>
      </div>

      {/* Main Investigation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full max-w-7xl flex-1 overflow-hidden pb-4">
        
        {/* Panel Kiri: Folder Bukti (2/5) */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase text-black flex items-center italic">
              <FileText className="w-5 h-5 mr-2 text-blue-600" /> Folder Barang Bukti
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {investigationFiles.map((file) => (
              <motion.div 
                key={file.id} 
                whileHover={{ x: 5 }}
                onClick={() => toggleFact(file.id, file.isFact)} 
                className={`p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] cursor-pointer flex items-center space-x-4 transition-all active:shadow-none active:translate-y-1 ${foundFacts.includes(file.id) ? 'bg-green-100 border-green-600 shadow-[6px_6px_0px_#166534]' : 'bg-white hover:bg-slate-50'}`}
              >
                <div className={`w-14 h-14 rounded-xl border-2 border-black shrink-0 flex items-center justify-center shadow-md ${foundFacts.includes(file.id) ? 'bg-green-500 text-white' : 'bg-slate-100'}`}>
                  {file.type === 'PHOTO' && <Camera className={foundFacts.includes(file.id) ? 'w-8 h-8' : 'w-8 h-8 text-blue-500'} />}
                  {file.type === 'INTERVIEW' && <Mic className={foundFacts.includes(file.id) ? 'w-8 h-8' : 'w-8 h-8 text-red-500'} />}
                  {file.type === 'DOCUMENT' && <FileText className={foundFacts.includes(file.id) ? 'w-8 h-8' : 'w-8 h-8 text-orange-500'} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black uppercase text-xs text-black mb-1">{file.title}</h4>
                  <p className="text-[11px] font-bold text-slate-500 leading-tight italic line-clamp-2">"{file.content}"</p>
                </div>
                {foundFacts.includes(file.id) && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-600 p-1.5 rounded-full border-2 border-white">
                    <CheckCircle2 className="text-white w-5 h-5" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Panel Kanan: Kliping Berita Utama (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border-4 border-black overflow-hidden flex flex-col shadow-[12px_12px_0px_#000] relative">
          
          {/* Newspaper Header */}
          <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center shrink-0">
             <div className="flex items-center space-x-3">
               <Newspaper className="w-5 h-5 text-[#00E5FF]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Digital News Archive • 2025</span>
             </div>
             <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#FDFBF7] custom-scrollbar">
            {/* Berita Lengkap Kompas.id */}
            <article className="max-w-3xl mx-auto space-y-8">
              
              <header className="space-y-4">
                <div className="flex items-center space-x-4 text-[10px] font-black uppercase text-blue-600 italic">
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded">JAKARTA</span>
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> 23 MEI 2025</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight text-black italic tracking-tighter">
                  Kantin Sehat Jakarta Tingkatkan Kesadaran Gizi dan Pengelolaan Kalori Siswa
                </h1>
                <div className="flex items-center space-x-2 border-y-2 border-black/10 py-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black border-2 border-black">K</div>
                  <div>
                    <p className="text-[11px] font-black uppercase leading-none">Liputan Khusus Redaksi</p>
                    <p className="text-[10px] font-bold text-slate-400">SMPN 3 Bonang Collaboration</p>
                  </div>
                </div>
              </header>

              {/* Main Image 1 */}
              <figure className="space-y-2">
                <div className="aspect-[16/9] w-full bg-slate-100 border-4 border-black overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1574007557239-afe6d306b451?q=80&w=1000&auto=format&fit=crop" 
                    alt="Suasana Kantin Sehat" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                     <p className="text-white text-[10px] font-bold italic">Suasana tertib siswa saat memilih menu bergizi di kantin sehat SMKN 57 Jakarta.</p>
                  </div>
                </div>
              </figure>

              <div className="text-sm md:text-base font-bold text-slate-800 leading-relaxed space-y-6 text-justify">
                <p>
                  Siswa menyambut positif program Kantin Sehat Jakarta Cerdas Berkelanjutan yang mulai diterapkan di tiga sekolah di Jakarta. Program ini tidak hanya menyediakan pilihan makanan sehat dan bergizi. Siswa juga dibantu lebih sadar mengontrol asupan kalori harian.
                </p>

                <p>
                  Di kantin sehat SMKN 57 Jakarta, sembilan stan berjejer rapi. Ada menu sehat dan bergizi di dalamnya. Tidak hanya itu, di setiap etalase, terpampang jelas informasi jumlah kalori pada setiap porsi makanan. Besarannya, 100-300 kalori per porsi.
                </p>

                {/* Sub-Image Grid */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="aspect-square border-4 border-black rounded-2xl overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover" />
                     <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-0.5 font-black text-[8px] uppercase border-2 border-black">POSTER GIZI</div>
                  </div>
                  <div className="aspect-square border-4 border-black rounded-2xl overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover" />
                     <div className="absolute top-2 left-2 bg-blue-400 text-white px-2 py-0.5 font-black text-[8px] uppercase border-2 border-black">PROSES MASAK</div>
                  </div>
                </div>

                <p>
                  Penyajian informasi ini menjadi bagian penting dari edukasi gizi. Tujuannya, agar siswa dapat ikut mengontrol asupan kalori hariannya. Para penjual di kantin juga tidak ketinggalan menjamin standardisasi kesehatan. Mereka berpenutup kepala. Sarung tangan plastik jadi kewajiban. Masker mesti dikenakan selama proses penyajian makanan.
                </p>

                <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-600 border-dashed italic">
                   "Kantin sehat membantu siswa makan lebih bergizi dengan mengetahui jumlah kalori. Dengan informasi tersebut, saya bisa memantau asupan kalori harian dan mengatur pola makan agar tidak berlebihan," ujar <strong>Gerald (18)</strong>, siswa kelas 11 SMKN 57 Jakarta.
                </div>

                <p>
                  Untuk memastikan keakuratan informasi kalori, Dinas Kesehatan Jakarta juga terlibat. Mereka rutin mengambil sampel makanan dan menguji jumlah kalorinya. Sejak diresmikan Gubernur Jakarta Pramono Anung, Selasa (20/5/2025), siswa semakin aktif terlibat mengelola kantin melalui Kelompok Kerja (Pokja) Kantin.
                </p>

                <p>
                  Siswi lainnya, Tatia (18), menambahkan bahwa sekolah juga memastikan kualitas bahan baku. ”Minyaknya bukan jelantah. Kami bekerja sama mengolah sisa minyak menjadi bahan pembuatan sabun,” katanya. Selain itu, siswa juga dibekali pengetahuan mengenai pengelolaan limbah makanan menjadi kompos.
                </p>

                <p>
                  Salah satu pedagang, Nanik (51), harus menghilangkan tiga menu lama (maklor, cilor, dan minuman sasetan) agar sesuai standar. "Sekarang saya hanya jual siomay, batagor, dan jus buah," jelasnya bersemangat. Pembimbing Pokja, Euis Kastuti, menegaskan harga setiap porsi tetap terjangkau bagi kantong siswa, yakni tidak lebih dari Rp 20.000.
                </p>
              </div>

              {/* Footer Article */}
              <div className="pt-10 border-t-4 border-black pb-10">
                 <p className="text-[10px] font-black uppercase text-slate-400">Sumber: Kompas.id (Diolah untuk Media Pembelajaran)</p>
                 <div className="flex items-center mt-4 text-[#FF3D00] font-black uppercase text-xs italic">
                    <MapPin className="w-4 h-4 mr-1" /> SMKN 57 JAKARTA SELATAN
                 </div>
              </div>
            </article>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-6 right-6 bg-black/10 p-2 rounded-full animate-bounce pointer-events-none">
             <div className="w-1 h-4 bg-black rounded-full"></div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InvestigationRoom;
