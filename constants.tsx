
import { Question, NewsFragment, InvestigationData, Lesson, PuzzleLevel, WritingEvent, HoaxPoolItem } from './types';

export const INVESTIGATION_FILES: InvestigationData[] = [
  { 
    id: 'f1', 
    type: 'PHOTO', 
    title: 'Label Kalori Etalase', 
    content: 'Foto menunjukkan label bertuliskan "250 kkal" pada porsi siomay di etalase kantin SMKN 57.', 
    isFact: true 
  },
  { 
    id: 'f2', 
    type: 'INTERVIEW', 
    title: 'Rekaman Suara Ibu Nanik', 
    content: '"Dulu saya jual maklor dan cilor, sekarang saya ganti jadi siomay dan jus buah agar lebih sehat," ujar Nanik.', 
    isFact: true 
  },
  { 
    id: 'f3', 
    type: 'PHOTO', 
    title: 'Sabun Minyak Jelantah', 
    content: 'Foto botol sabun cair hasil olahan limbah minyak goreng yang dikumpulkan siswa SMKN 57.', 
    isFact: true 
  },
  { 
    id: 'f4', 
    type: 'DOCUMENT', 
    title: 'SK Pokja Kantin', 
    content: 'Surat Keputusan yang mencantumkan Gerald (18) sebagai anggota pengelola kantin dari unsur siswa.', 
    isFact: true 
  },
  { 
    id: 'f5', 
    type: 'PHOTO', 
    title: 'Standar Higiene Pedagang', 
    content: 'Foto Ibu Nanik menggunakan masker, sarung tangan plastik, dan penutup kepala saat melayani siswa.', 
    isFact: true 
  }
];

export const LESSONS: Lesson[] = [
  {
    id: 'video-materi',
    title: 'Video: Menjadi Jurnalis Cilik',
    content: 'Selamat datang di dunia jurnalistik! Sebelum kita mulai menulis, mari saksikan video singkat tentang bagaimana seorang jurnalis bekerja di lapangan.',
    videos: [
      { id: 'v1', title: 'Langkah Wartawan Wawancara', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ],
    meta: 'Simak baik-baik langkah wartawan saat melakukan wawancara!'
  },
  {
    id: 'hakikat',
    title: 'Hakikat: Apa Itu Berita?',
    content: 'Berita bukan sekadar cerita fiksi. Hakikat berita adalah laporan mengenai suatu peristiwa yang baru terjadi (aktual) dan faktual.',
    videos: [],
    meta: 'Inti: Fakta yang baru, nyata, dan penting bagi orang banyak.'
  }
];

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: 'level-1',
    fragments: [
      { id: '1-1', text: "Siswa SMPN 3 Bonang Ciptakan Robot Penyiram Tanaman Otomatis", type: 'TITLE' },
      { id: '1-2', text: "BONANG - Inovasi membanggakan datang dari siswa kelas VII SMPN 3 Bonang yang berhasil membuat alat penyiram tanaman pintar.", type: 'LEAD' },
      { id: '1-3', text: "Alat ini menggunakan sensor kelembapan tanah untuk mendeteksi kapan tanaman membutuhkan air secara otomatis.", type: 'BODY' }
    ]
  }
];

export const WRITING_EVENTS: WritingEvent[] = [
  { id: 'lomba', title: 'Lomba Robotik', icon: '🤖' },
  { id: 'upacara', title: 'Upacara Bendera', icon: '🇮🇩' },
  { id: 'bakti', title: 'Kerja Bakti', icon: '🧹' },
  { id: 'seni', title: 'Pentas Seni', icon: '🎨' },
  { id: 'pramuka', title: 'Kemah Pramuka', icon: '⛺' }
];

export const HOAX_POOL_DEFAULT: HoaxPoolItem[] = [
  { id: 'h1', text: "Makan Mie Instan Tiap Hari Bikin Umur 100 Tahun!", isHoax: true },
  { id: 'h2', text: "Minum Air Es Setelah Olahraga Bisa Bekukan Paru-paru", isHoax: true },
  { id: 'h3', text: "Ketik 'AMIN' di Komen Agar HP Kamu Anti Pecah", isHoax: true },
  { id: 'f1', text: "BMKG: Waspada Potensi Hujan Lebat Sore Ini", isHoax: false },
  { id: 'f2', text: "Pemerintah Tetapkan Libur Nasional Idul Fitri", isHoax: false },
  { id: 'f3', text: "Vaksinasi Terbukti Mengurangi Resiko Sakit Parah", isHoax: false }
];

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Apa perbedaan utama antara berita fakta dan hoaks?",
    options: ["Hoaks lebih seru ceritanya", "Fakta didukung data dan sumber jelas", "Fakta harus ditulis oleh guru", "Hoaks biasanya sangat pendek"],
    correctAnswer: 1,
    explanation: "Fakta selalu punya bukti nyata dan narasumber yang bisa dipertanggungjawabkan."
  }
];
