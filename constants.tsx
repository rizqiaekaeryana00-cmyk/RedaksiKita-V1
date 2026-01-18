
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
  // --- 30 HOAKS (HARUS DITEMBAK) ---
  { id: 'h1', text: "Rahasia: Minum Air Putih di Pagi Hari Ternyata Mematikan!", isHoax: true },
  { id: 'h2', text: "NASA Konfirmasi Bumi Berbentuk Segitiga Mulai Tahun 2026", isHoax: true },
  { id: 'h3', text: "Ketik 'AMIN' di Komentar Agar Layar HP Kamu Anti Pecah", isHoax: true },
  { id: 'h4', text: "Viral: Buah Pisang Bisa Berubah Jadi Emas Jika Disiram Cuka", isHoax: true },
  { id: 'h5', text: "Radiasi HP Bisa Memasak Telur Sampai Matang Dalam 5 Menit", isHoax: true },
  { id: 'h6', text: "Bawang Putih di Telinga Sembuhkan Penyakit Jantung Instan", isHoax: true },
  { id: 'h7', text: "Peringatan: Jaringan Internet Akan Dimatikan Selamanya Besok", isHoax: true },
  { id: 'h8', text: "Makan Mie Instan Tiap Hari Bikin Umur Sampai 150 Tahun", isHoax: true },
  { id: 'h9', text: "Minum Air Es Setelah Olahraga Bikin Paru-Paru Beku", isHoax: true },
  { id: 'h10', text: "Cokelat Hitam Bisa Membuat Tubuh Manusia Terbang Rendah", isHoax: true },
  { id: 'h11', text: "Kantung Plastik Direbus Jadi Emas, Ilmuwan Amerika Heboh", isHoax: true },
  { id: 'h12', text: "Sekolah Diliburkan Setahun Karena Hujan Meteor di Demak", isHoax: true },
  { id: 'h13', text: "Wifi Sekolah Bisa Menyedot Energi Manusia Hingga Lemas", isHoax: true },
  { id: 'h14', text: "Mandi Malam Berbahaya, Bisa Bikin Tulang Jadi Keropos", isHoax: true },
  { id: 'h15', text: "Lemon Campur Garam Bisa Hilangkan Kanker Dalam Semalam", isHoax: true },
  { id: 'h16', text: "Micin Terbukti Bikin Otak Jenius Secara Instan Tanpa Belajar", isHoax: true },
  { id: 'h17', text: "Awas! Mengisi Daya HP Saat Hujan Pasti Meledak Kena Petir", isHoax: true },
  { id: 'h18', text: "Koin 500 Rupiah Edisi Lama Laku Dijual Seharga 1 Miliar", isHoax: true },
  { id: 'h19', text: "Minyak Goreng Bekas Bisa Obati Luka Bakar Tanpa Bekas", isHoax: true },
  { id: 'h20', text: "Taburkan Garam di Bawah Kasur Agar Tidak Mimpi Buruk", isHoax: true },
  { id: 'h21', text: "Makan Cabai Rawit 1 Kg Bikin Tubuh Jadi Kebal Terhadap Api", isHoax: true },
  { id: 'h22', text: "Nasi Sisa Semalam Mengandung Racun Mematikan Bagi Anak", isHoax: true },
  { id: 'h23', text: "Jus Sasetan Terbukti Bisa Mengganti Fungsi Darah Manusia", isHoax: true },
  { id: 'h24', text: "Tidur Dengan Mulut Terbuka Undang Setan Masuk Ke Tubuh", isHoax: true },
  { id: 'h25', text: "Masker Wajah Dari Lem Kertas Bikin Kulit Putih Permanen", isHoax: true },
  { id: 'h26', text: "Pasta Gigi Bisa Hilangkan Jerawat Dalam Waktu 2 Detik Saja", isHoax: true },
  { id: 'h27', text: "Minum Tinta Pulpen Bikin Tulisan Tangan Jadi Sangat Bagus", isHoax: true },
  { id: 'h28', text: "Kaus Kaki Basah Saat Demam Bisa Sedot Panas Tubuh Keluar", isHoax: true },
  { id: 'h29', text: "Lihat Gerhana Matahari Bikin Warna Mata Berubah Jadi Merah", isHoax: true },
  { id: 'h30', text: "Kerokan Paling Ampuh Hilangkan Virus Berbahaya Dari Paru", isHoax: true },

  // --- 30 FAKTA (JANGAN DITEMBAK) ---
  { id: 'f1', text: "BMKG Himbau Warga Demak Waspada Potensi Hujan Lebat Sore Ini", isHoax: false },
  { id: 'f2', text: "Pemerintah Tetapkan Libur Nasional Idul Fitri 1446 Hijriah", isHoax: false },
  { id: 'f3', text: "Vaksinasi Terbukti Ampuh Mengurangi Risiko Gejala Sakit Berat", isHoax: false },
  { id: 'f4', text: "Siswa SMPN 3 Bonang Menangi Lomba Karya Tulis Ilmiah Nasional", isHoax: false },
  { id: 'f5', text: "Indonesia Kirim Bantuan Medis Untuk Korban Gempa di Turki", isHoax: false },
  { id: 'f6', text: "Teknologi AI Membantu Dokter Deteksi Penyakit Sejak Dini", isHoax: false },
  { id: 'f7', text: "Siswa SMP Ciptakan Aplikasi Peringatan Dini Banjir Berbasis Web", isHoax: false },
  { id: 'f8', text: "Presiden Resmikan Jembatan Baru Penghubung Antar Desa di Jawa", isHoax: false },
  { id: 'f9', text: "Harga Pangan Stabil di Pasar Induk Menjelang Bulan Ramadan", isHoax: false },
  { id: 'f10', text: "Timnas Indonesia Lolos Babak Kualifikasi Piala Asia Tahun Ini", isHoax: false },
  { id: 'f11', text: "Festival Kuliner Tradisional Demak Resmi Dibuka di Alun-Alun", isHoax: false },
  { id: 'f12', text: "Penanaman 10.000 Mangrove Dilakukan di Pesisir Pantai Demak", isHoax: false },
  { id: 'f13', text: "Beasiswa Unggulan Kembali Dibuka Untuk Siswa Berprestasi", isHoax: false },
  { id: 'f14', text: "Pameran UMKM Lokal Menarik Ribuan Pengunjung di Akhir Pekan", isHoax: false },
  { id: 'f15', text: "Rekayasa Lalu Lintas Mulai Diterapkan Untuk Kelancaran Mudik", isHoax: false },
  { id: 'f16', text: "Workshop Literasi Digital SMK Berhasil Tarik Minat Siswa", isHoax: false },
  { id: 'f17', text: "Penemuan Situs Purbakala Baru Gegerkan Warga Desa Karanganyar", isHoax: false },
  { id: 'f18', text: "Olimpiade Sains Tingkat Provinsi Diikuti Ribuan Siswa Hebat", isHoax: false },
  { id: 'f19', text: "Peresmian Perpustakaan Keliling Untuk Tingkatkan Minat Baca", isHoax: false },
  { id: 'f20', text: "Launching Bus Sekolah Gratis Untuk Siswa di Wilayah Terpencil", isHoax: false },
  { id: 'f21', text: "Sosialisasi Anti-Bullying Digelar Serentak di Sekolah Menengah", isHoax: false },
  { id: 'f22', text: "Penggunaan Panel Surya Mulai Diterapkan di Kantor Pemerintah", isHoax: false },
  { id: 'f23', text: "Restorasi Gedung Bersejarah Demak Targetkan Selesai Tahun Depan", isHoax: false },
  { id: 'f24', text: "Panen Raya Padi Petani Lokal Demak Capai Rekor Tertinggi", isHoax: false },
  { id: 'f25', text: "Program Magang Industri Ke Luar Negeri Dibuka Untuk Lulusan SMK", isHoax: false },
  { id: 'f26', text: "Lomba Pidato Bahasa Indonesia Diikuti Perwakilan Tiap Kelas", isHoax: false },
  { id: 'f27', text: "Kampanye Buang Sampah Pada Tempatnya Mulai Masuk Kurikulum", isHoax: false },
  { id: 'f28', text: "Peluncuran Satelit Komunikasi Baru Perkuat Sinyal di Desa", isHoax: false },
  { id: 'f29', text: "Penutupan Akses Jalan Protokol Untuk Acara Maraton Tahunan", isHoax: false },
  { id: 'f30', text: "Donor Darah Massal Berhasil Kumpulkan Ratusan Kantong Darah", isHoax: false }
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
