
import { Question, NewsFragment, InvestigationData, Lesson, PuzzleLevel } from './types';

export const INVESTIGATION_FILES: InvestigationData[] = [
  { 
    id: 'f1', 
    type: 'PHOTO', 
    title: 'Foto Kantin', 
    content: 'Foto menunjukkan menu nasi jagung sehat dengan stempel resmi sekolah.', 
    isFact: true 
  },
  { 
    id: 'f2', 
    type: 'INTERVIEW', 
    title: 'Wawancara Kepsek', 
    content: '"Kami berencana memberikan subsidi, bukan gratis total," ujar Ibu Kepsek.', 
    isFact: true 
  },
  { 
    id: 'h1', 
    type: 'DOCUMENT', 
    title: 'Pesan Berantai', 
    content: 'Pesan WA tanpa nama: "BESOK MAKAN GRATIS DI KANTIN! SEBARKAN!"', 
    isFact: false 
  }
];

export const WRITING_CLUES = {
  why: "Gunakan kata penghubung seperti: 'Hal ini disebabkan oleh...', 'Karena...', atau 'Sebagai upaya untuk...'",
  how: "Ceritakan urutan kejadiannya: 'Awalnya...', 'Kemudian...', 'Lalu ditutup dengan...'",
  angle: "Coba tulis dari sudut pandang siswa yang merasakan langsung, bukan cuma penonton."
};

export const LESSONS: Lesson[] = [
  {
    id: 'video-materi',
    title: 'Video: Menjadi Jurnalis Cilik',
    content: 'Selamat datang di dunia jurnalistik! Sebelum kita mulai menulis, mari saksikan video singkat tentang bagaimana seorang jurnalis bekerja di lapangan. Perhatikan bagaimana mereka mencari narasumber, mencatat fakta penting, dan mengolahnya menjadi laporan yang bermanfaat bagi orang banyak.',
    videos: [
      { id: 'v1', title: 'Langkah Wartawan Wawancara', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ],
    meta: 'Simak baik-baik langkah wartawan saat melakukan wawancara!'
  },
  {
    id: 'hakikat',
    title: 'Hakikat: Apa Itu Berita?',
    content: 'Berita bukan sekadar cerita fiksi. Hakikat berita adalah laporan mengenai suatu peristiwa yang baru terjadi (aktual), benar-benar terjadi (faktual), dan memiliki dampak atau daya tarik bagi masyarakat. \n\nBerita bertujuan untuk menginformasikan, mendidik, dan memberikan pengetahuan baru. Sebuah berita yang baik harus bisa menjawab rasa ingin tahu pembaca secara objektif dan jujur.',
    videos: [],
    meta: 'Inti: Fakta yang baru, nyata, dan penting bagi orang banyak.'
  },
  {
    id: 'ciri-ciri',
    title: 'Ciri-Ciri Teks Berita',
    content: 'Untuk membedakan berita dengan teks lain, perhatikan 5 ciri utama ini:\n\n1. Faktual: Harus berdasarkan kenyataan, bukan gosip atau karangan.\n2. Aktual: Peristiwa yang dilaporkan masih baru atau sedang hangat diperbincangkan.\n3. Objektif: Penulis tidak boleh memasukkan opini pribadi. Sampaikan apa adanya sesuai fakta lapangan.\n4. Seimbang: Tidak memihak satu pihak saja (cover both sides).\n5. Bahasa Komunikatif: Menggunakan Bahasa Indonesia yang baku namun mudah dipahami oleh semua orang.',
    videos: [],
    meta: 'Ingat! Tanpa fakta yang kuat, tulisanmu hanyalah sebuah cerita, bukan berita.'
  },
  {
    id: 'struktur',
    title: 'Struktur: Piramida Terbalik',
    content: 'Berita disusun dengan pola Piramida Terbalik, artinya informasi paling penting diletakkan di bagian atas:\n\n1. Kepala (Judul): Mewakili seluruh isi berita dalam kalimat singkat.\n2. Teras (Lead): Bagian paling vital. Berisi ringkasan 5W+1H agar pembaca langsung tahu inti kejadian.\n3. Tubuh (Body): Penjelasan detail kronologi, kutipan wawancara, dan data pendukung.\n4. Ekor (Tail): Informasi tambahan yang melengkapi berita namun tidak bersifat wajib.',
    videos: [],
    meta: 'Tips: Fokuskan tenagamu pada Teras Berita agar pembaca langsung tertarik!'
  },
  {
    id: 'contoh',
    title: 'Bedah Contoh Berita Nyata',
    content: 'Mari bedah berita berikut:\n\n"Siswa SMPN 3 Bonang Panen Sayur Hidroponik"\n\n(Teras): Sebanyak 50 siswa kelas VII SMPN 3 Bonang sukses memanen sawi hidroponik di kebun sekolah pada Senin (10/3) pagi. \n\n(Tubuh): Kegiatan ini merupakan bagian dari proyek P5 lingkungan. Kepala Sekolah, Ibu Siti, menyatakan panen ini akan dijual di kantin sekolah. Siswa mengaku senang karena bisa belajar bercocok tanam secara modern tanpa tanah.',
    videos: [],
    meta: 'Analisis: Judul menarik, Teras jelas (Who, What, Where, When), Tubuh detail (Why, How).'
  },
  {
    id: 'langkah',
    title: 'Langkah Menulis Teks Berita',
    content: 'Ikuti 5 langkah jitu untuk menghasilkan berita yang berkualitas:\n\n1. Penemuan Peristiwa: Cari kejadian yang unik atau penting di sekitarmu.\n2. Pengumpulan Informasi: Lakukan observasi langsung dan wawancarai orang yang terlibat.\n3. Mencatat 5W+1H: Pastikan kamu punya data: Apa, Siapa, Di mana, Kapan, Mengapa, dan Bagaimana.\n4. Menyusun Kerangka: Gunakan struktur piramida terbalik agar alur tulisan logis.\n5. Menulis & Menyunting: Tulis draft pertamamu, lalu periksa ejaan dan tanda baca sesuai PUEBI.',
    videos: [],
    meta: 'Action: Jangan takut salah, editor hebat selalu bermula dari penulis yang berani mencoba!'
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
  },
  {
    id: 'level-2',
    fragments: [
      { id: '2-1', text: "Lomba Kebersihan Kelas: VII-A Raih Juara Umum", type: 'TITLE' },
      { id: '2-2', text: "DEMAK - Setelah penilaian ketat selama satu bulan, kelas VII-A akhirnya dinobatkan sebagai kelas terbersih tahun ini.", type: 'LEAD' },
      { id: '2-3', text: "Kriteria penilaian meliputi kerapian meja, ketersediaan alat kebersihan, dan dekorasi pojok baca yang kreatif.", type: 'BODY' },
      { id: '2-4', text: "Hadiah diserahkan langsung oleh Pembina OSIS pada upacara bendera Senin pagi tadi.", type: 'TAIL' }
    ]
  },
  {
    id: 'level-3',
    fragments: [
      { id: '3-1', text: "Sulap Sampah Plastik Jadi Kursi Estetik, Siswa SMPN 3 Bonang Tuai Pujian", type: 'TITLE' },
      { id: '3-2', text: "BONANG - Kepedulian terhadap lingkungan ditunjukkan siswa SMPN 3 Bonang dengan mengubah ribuan botol plastik bekas menjadi perabotan sekolah yang bermanfaat.", type: 'LEAD' },
      { id: '3-3', text: "Melalui teknik ecobrick, para siswa mengumpulkan sampah dari lingkungan sekitar lalu merangkainya menjadi kursi dan meja yang kokoh selama dua minggu terakhir.", type: 'BODY' },
      { id: '3-4', text: "Hasil karya kreatif ini kini dipajang di taman sekolah dan dapat digunakan oleh seluruh warga sekolah saat jam istirahat.", type: 'TAIL' }
    ]
  }
];

export const WRITING_EVENTS = [
  { id: 'lomba', title: 'Lomba Robotik', icon: '🤖' },
  { id: 'upacara', title: 'Upacara Bendera', icon: '🇮🇩' },
  { id: 'bakti', title: 'Kerja Bakti', icon: '🧹' },
  { id: 'seni', title: 'Pentas Seni', icon: '🎨' },
  { id: 'pramuka', title: 'Kemah Pramuka', icon: '⛺' }
];

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Apa perbedaan utama antara berita fakta dan hoaks?",
    options: ["Hoaks lebih seru ceritanya", "Fakta didukung data dan sumber jelas", "Fakta harus ditulis oleh guru", "Hoaks biasanya sangat pendek"],
    correctAnswer: 1,
    explanation: "Fakta selalu punya bukti nyata dan narasumber yang bisa dipertanggungjawabkan."
  },
  {
    id: 2,
    question: "Dalam struktur piramida terbalik, bagian manakah yang paling penting?",
    options: ["Ekor Berita", "Judul & Teras (Lead)", "Iklan", "Komentar Pembaca"],
    correctAnswer: 1,
    explanation: "Judul dan Teras berita berisi inti dari seluruh kejadian yang dilaporkan."
  },
  {
    id: 3,
    question: "Unsur 'Who' dalam berita SMPN 3 Bonang biasanya merujuk pada...",
    options: ["Lokasi kejadian", "Siswa, Guru, atau Kepala Sekolah", "Waktu upacara", "Cara membuat robot"],
    correctAnswer: 1,
    explanation: "'Who' merujuk pada orang atau pihak yang terlibat dalam peristiwa tersebut."
  },
  {
    id: 4,
    question: "Kalimat: 'Acara dimulai pukul 08.00 WIB di Aula Sekolah.' Kalimat ini menjawab unsur...",
    options: ["What & Why", "When & Where", "Who & How", "Why & Who"],
    correctAnswer: 1,
    explanation: "Pukul 08.00 menjawab 'When' (Kapan) dan Aula Sekolah menjawab 'Where' (Dimana)."
  },
  {
    id: 5,
    question: "Manakah judul berita yang paling objektif dan netral?",
    options: ["Siswa Hebat Banget Juara Lomba!", "Hasil Lomba Robotik SMPN 3 Bonang", "Lomba Paling Seru Sedunia", "Kekalahan Menyedihkan Tim Basket"],
    correctAnswer: 1,
    explanation: "Judul berita harus netral, singkat, dan hanya menyampaikan fakta tanpa opini berlebihan."
  },
  {
    id: 6,
    question: "Mengapa seorang jurnalis harus melakukan wawancara?",
    options: ["Biar kelihatan keren", "Untuk mendapatkan data akurat dari sumber", "Supaya cepat pulang", "Hanya formalitas saja"],
    correctAnswer: 1,
    explanation: "Wawancara memastikan informasi yang didapat valid dan memiliki sudut pandang ahli/saksi."
  },
  {
    id: 7,
    question: "Apa fungsi dari unsur 'Why' dalam sebuah teks berita?",
    options: ["Menjelaskan alasan atau latar belakang", "Memberitahu harga tiket", "Menyebutkan nama pemenang", "Menjelaskan lokasi parkir"],
    correctAnswer: 0,
    explanation: "'Why' menjelaskan mengapa sebuah peristiwa bisa terjadi atau alasan di baliknya."
  },
  {
    id: 8,
    question: "Bagian 'Body' atau Tubuh berita biasanya berisi...",
    options: ["Hanya nama penulis", "Detail kronologi dan penjelasan lengkap", "Daftar pustaka", "Alamat sekolah"],
    correctAnswer: 1,
    explanation: "Tubuh berita memperjelas informasi yang sudah ada di Teras berita dengan lebih mendalam."
  },
  {
    id: 9,
    question: "Jika kamu ingin memberitakan 'Kerja Bakti', data apa yang paling penting dikumpulkan?",
    options: ["Warna baju siswa", "Jenis sampah yang dibersihkan & tujuannya", "Harga sapu yang dipakai", "Menu makan siang jurnalis"],
    correctAnswer: 1,
    explanation: "Inti berita kerja bakti adalah apa yang dibersihkan, siapa yang ikut, dan tujuannya."
  },
  {
    id: 10,
    question: "Apa yang harus dilakukan jika mendapatkan informasi yang meragukan?",
    options: ["Langsung sebar ke grup WA", "Cek kebenarannya (Verifikasi)", "Dihapus saja tanpa dibaca", "Dibagikan ke teman sebangku"],
    correctAnswer: 1,
    explanation: "Verifikasi adalah kunci utama jurnalisme untuk menghindari penyebaran berita palsu."
  }
];
