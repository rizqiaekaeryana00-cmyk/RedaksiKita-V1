
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, FileText, Camera, Mic, CheckCircle2, XCircle, Info, Newspaper, Play, Eye, Clipboard, MapPin, Calendar, Sparkles } from 'lucide-react';
import { InvestigationData } from '../types';
import { sounds } from '../services/audio';

const InvestigationRoom = ({ onBack, investigationFiles }: { onBack: () => void, investigationFiles: InvestigationData[] }) => {
  const [foundFacts, setFoundFacts] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const totalFactsNeeded = investigationFiles.filter(f => f.isFact).length;
  const isMissionComplete = foundFacts.length === totalFactsNeeded;

  const toggleFact = (id: string, isFact: boolean) => {
    if (foundFacts.includes(id)) return;
    
    if (isFact) {
      sounds.correct();
      setFoundFacts([...foundFacts, id]);
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
                  Baca artikel berita di panel kanan untuk memahami konteks peristiwa SMKN 57.
                </p>
                <p className="text-sm font-bold text-slate-700 flex items-start">
                  <Clipboard className="w-5 h-5 mr-3 text-green-600 shrink-0" /> 
                  Cari bukti fisik (Foto, Wawancara, Dokumen) di panel kiri yang mendukung isi berita.
                </p>
                <p className="text-xs italic text-red-500 font-black uppercase">Waspada! Ada banyak bukti palsu yang sengaja disebar untuk menipumu!</p>
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
          <p className="text-xl font-bold mt-2">Data ini bertentangan dengan isi berita asli Kompas.id.</p>
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
        <div className="flex items-center space-x-4">
           <div className={`px-6 py-2 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center italic transition-colors ${isMissionComplete ? 'bg-green-500 text-white' : 'bg-black text-white'}`}>
             <span className="mr-2 opacity-60">FAKTA DITEMUKAN:</span> {foundFacts.length} / {totalFactsNeeded}
           </div>
           {isMissionComplete && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-yellow-400 text-black px-4 py-2 rounded-xl border-2 border-black font-black text-[10px] uppercase italic animate-bounce shadow-md">
                MISI TUNTAS! 🏆
             </motion.div>
           )}
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
            <span className="text-[10px] font-black text-slate-500 uppercase italic">Klik kartu untuk memverifikasi</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {investigationFiles.map((file) => (
              <motion.div 
                key={file.id} 
                whileHover={{ x: foundFacts.includes(file.id) ? 0 : 5 }}
                onClick={() => toggleFact(file.id, file.isFact)} 
                className={`p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] cursor-pointer flex items-center space-x-4 transition-all active:shadow-none active:translate-y-1 ${foundFacts.includes(file.id) ? 'bg-green-100 border-green-600 shadow-[3px_3px_0px_#166534] opacity-80' : 'bg-white hover:bg-slate-50'}`}
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
               <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Digital News Archive • Kompas.id Edition</span>
             </div>
             <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#FDFBF7] custom-scrollbar">
            {/* Berita Lengkap Kompas.id */}
            <article className="max-w-4xl mx-auto space-y-8">
              
              <header className="space-y-4">
                <div className="flex items-center space-x-4 text-[10px] font-black uppercase text-blue-600 italic">
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded">JAKARTA SEHAT</span>
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> JUMAT, 23 MEI 2025</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase leading-[1.1] text-black italic tracking-tighter">
                  Kantin Sehat Jakarta Tingkatkan Kesadaran Gizi dan Pengelolaan Kalori Siswa
                </h1>
                <div className="flex items-center space-x-2 border-y-2 border-black/10 py-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center font-black border-2 border-black text-white text-xl rotate-3">K</div>
                  <div>
                    <p className="text-[12px] font-black uppercase leading-none italic">Liputan Khusus Kompas.id</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Amanat Hati Nurani Rakyat</p>
                  </div>
                </div>
              </header>

              {/* Main Image 1 - Hero Image */}
              <figure className="space-y-3">
                <div className="aspect-[16/9] w-full bg-slate-100 border-[6px] border-black overflow-hidden relative group rounded-sm shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1574007557239-afe6d306b451?q=80&w=1200&auto=format&fit=crop" 
                    alt="Kantin Sehat Jakarta" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                     <p className="text-white text-[11px] md:text-sm font-bold italic border-l-4 border-[#00E5FF] pl-4">
                       Kantin Sehat Jakarta: Siswa Bisa Makan Enak dan Bergizi, tetapi Rendah Kalori. Program ini membantu siswa lebih sadar mengontrol asupan gizi harian.
                     </p>
                  </div>
                </div>
                <figcaption className="text-[10px] text-slate-400 font-bold uppercase italic text-right px-2">Foto: Kompas / Dokumentasi Sekolah</figcaption>
              </figure>

              <div className="text-sm md:text-lg font-bold text-slate-800 leading-relaxed space-y-6 text-justify font-serif">
                <p>
                  Siswa menyambut positif program Kantin Sehat Jakarta Cerdas Berkelanjutan yang mulai diterapkan di tiga sekolah di Jakarta. Program ini tidak hanya menyediakan pilihan makanan sehat dan bergizi. Siswa juga dibantu lebih sadar mengontrol asupan kalori harian.
                </p>

                <p>
                  Di kantin sehat SMKN 57 Jakarta, sembilan stan berjejer rapi. Ada menu sehat dan bergizi di dalamnya. Tidak hanya itu, di setiap etalase, terpampang jelas informasi jumlah kalori pada setiap porsi makanan. Besarannya, 100-300 kalori per porsi.
                </p>

                {/* News Image 2 - Poster Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                  <div className="space-y-3">
                    <div className="aspect-[4/5] border-[4px] border-black rounded-3xl overflow-hidden relative shadow-lg">
                       <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
                       <div className="absolute top-4 left-4 bg-[#FFD600] text-black px-3 py-1 font-black text-[10px] uppercase border-2 border-black shadow-md -rotate-2">Edukasi Gizi</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 italic text-center">Poster "Isi Piringku" dan Etika Batuk yang terpasang di area kantin sebagai media edukasi.</p>
                  </div>
                  <div className="flex flex-col justify-center space-y-4 p-6 bg-white border-4 border-black border-dashed rounded-[3rem]">
                     <h4 className="font-black text-xl uppercase italic tracking-tighter text-[#FF3D00] flex items-center">
                       <Sparkles className="w-5 h-5 mr-2" /> Standar Ketat
                     </h4>
                     <p className="text-xs md:text-sm font-bold leading-relaxed text-slate-600 italic">
                       Penyajian informasi kalori ini menjadi bagian penting dari edukasi gizi. Tujuannya, agar siswa dapat ikut mengontrol asupan kalori hariannya secara mandiri.
                     </p>
                  </div>
                </div>

                <p>
                  Para penjual di kantin juga tidak ketinggalan menjamin standardisasi kesehatan. Mereka berpenutup kepala. Sarung tangan plastik jadi kewajiban. Masker mesti dikenakan selama proses penyajian makanan. Untuk memastikan keakuratan informasi kalori, Dinas Kesehatan Jakarta juga terlibat. Mereka rutin mengambil sampel makanan dan menguji jumlah kalorinya.
                </p>

                {/* News Image 3 - Siswa Investigasi */}
                <figure className="space-y-3">
                  <div className="aspect-[21/9] border-[4px] border-black rounded-xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 italic text-center">Gerald (18) bersama anggota Pokja Kantin lainnya saat memantau stok bahan baku segar.</p>
                </figure>

                <p>
                  Gerald (18), siswa kelas 11 di SMKN 57 Jakarta, antusias menyambut kantin sehat. Tidak hanya ingin mencoba makanannya, ia tertarik menjadi anggota Kelompok Kerja (Pokja) Kantin. Pokja bertanggung jawab mengelola dan memantau kegiatan di kantin sekolah.
                </p>

                <div className="bg-[#1a1a1a] text-[#00E5FF] p-8 rounded-[2.5rem] border-4 border-black italic relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Mic className="w-20 h-20" /></div>
                   <p className="text-lg md:text-xl font-black leading-tight mb-4 tracking-tight">
                     "Kantin sehat membantu siswa makan lebih bergizi dengan mengetahui jumlah kalori. Dengan informasi tersebut, saya bisa memantau asupan kalori harian dan mengatur pola makan agar tidak berlebihan,"
                   </p>
                   <p className="text-xs font-black uppercase text-white/60 tracking-widest">— Gerald, SMKN 57 Jakarta</p>
                </div>

                <p>
                  Siswa semakin aktif terlibat mengelola kantin sejak diresmikan Gubernur Jakarta Pramono Anung, Selasa (20/5/2025). Siswi SMKN 57 Jakarta lainnya, Tatia (18), menambahkan, sekolah juga memastikan kualitas bahan baku. ”Minyaknya bukan jelantah. Kami bekerja sama mengolah sisa minyak menjadi bahan pembuatan sabun,” kata Tatia. Siswa juga dibekali pengetahuan mengenai pengelolaan limbah makanan menjadi kompos.
                </p>

                <p>
                  Salah satu pedagang di kantin, Nanik (51), juga bersemangat. Telah berjualan sejak 1994, baru kali ini ia menerapkan standar kesehatan ketat. ”Ada tiga menu yang harus saya hilangkan karena tidak sesuai standar kesehatan. Selain maklor dan cilor ada minuman sasetan. Sekarang, saya hanya jual siomay, batagor, dan jus buah,” jelas Nanik.
                </p>

                <p>
                  Harga makanan disesuaikan dengan kantong siswa, tidak lebih dari Rp 20.000 per porsi. Komposisi makanan diatur agar rendah garam, gula, minyak, dan lemak. Pembimbing Pokja, Euis Kastuti dan Trismiati, menjelaskan bahwa kantin dirancang sebagai ruang terbuka (open space) yang ramah dan nyaman, dan segera akan direnovasi oleh Pemprov Jakarta.
                </p>
              </div>

              {/* Footer Article */}
              <div className="pt-10 border-t-8 border-black pb-10 space-y-4">
                 <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest italic">Sumber Asli: Kompas.id / Arsip Investigasi</p>
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-[#FF3D00] font-black uppercase text-xs italic bg-white px-4 py-2 rounded-xl border-2 border-black shadow-sm">
                       <MapPin className="w-4 h-4 mr-2" /> SMKN 57 JAKARTA SELATAN
                    </div>
                    <div className="flex items-center text-blue-600 font-black uppercase text-xs italic bg-white px-4 py-2 rounded-xl border-2 border-black shadow-sm">
                       <CheckCircle2 className="w-4 h-4 mr-2" /> TERVERIFIKASI AKURAT
                    </div>
                 </div>
              </div>
            </article>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-6 right-10 bg-black text-white px-4 py-2 rounded-full animate-bounce pointer-events-none flex items-center text-[10px] font-black uppercase shadow-xl border-2 border-white/20 z-50">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div> GULIR UNTUK MEMBACA LENGKAP
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border-radius: 10px; border: 2px solid #FDFBF7; }
        .font-serif { font-family: 'Times New Roman', Times, serif; }
      `}</style>
    </div>
  );
};

export default InvestigationRoom;
