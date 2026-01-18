
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Konfigurasi Firebase Asli Anda
 * Ini menghubungkan aplikasi langsung ke project: redaksikita-v1-39aac
 */
const firebaseConfig = {
  apiKey: "AIzaSyC921tDPwf-HWof4CaZTVHvbt4lmayvIrQ",
  authDomain: "redaksikita-v1-39aac.firebaseapp.com",
  projectId: "redaksikita-v1-39aac",
  storageBucket: "redaksikita-v1-39aac.firebasestorage.app",
  messagingSenderId: "33254277142",
  appId: "1:33254277142:web:80da5a6856e8802b8db537"
};

let db: any = null;

try {
  // Inisialisasi Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("🔥 Firebase Terkoneksi: REDaksi KITA v1 siap digunakan.");
} catch (e) {
  console.error("Gagal inisialisasi Firebase:", e);
}

/**
 * Menyimpan seluruh data aplikasi (Materi, Kuis, dll) ke Firestore
 */
export const saveAppData = async (data: any) => {
  if (!db) {
    console.error("Database tidak siap.");
    return;
  }
  try {
    // Menyimpan di koleksi 'app_content' dengan ID dokumen 'main'
    await setDoc(doc(db, "app_content", "main"), data);
    console.log("✅ Data Berhasil Disinkronkan ke Cloud Firebase");
  } catch (e) {
    console.error("❌ Gagal simpan ke Firebase:", e);
  }
};

/**
 * Mengambil data aplikasi dari Firestore saat aplikasi pertama kali dibuka
 */
export const loadAppData = async () => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "app_content", "main"));
    if (snap.exists()) {
      console.log("📦 Data Berhasil Dimuat dari Cloud");
      return snap.data();
    }
    return null;
  } catch (e) {
    console.error("❌ Gagal mengambil data dari Firebase:", e);
    return null;
  }
};
