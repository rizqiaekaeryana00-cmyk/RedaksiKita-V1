
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC921tDPwf-HWof4CaZTVHvbt4lmayvIrQ",
  authDomain: "redaksikita-v1-39aac.firebaseapp.com",
  projectId: "redaksikita-v1-39aac",
  storageBucket: "redaksikita-v1-39aac.firebasestorage.app",
  messagingSenderId: "33254277142",
  appId: "1:33254277142:web:80da5a6856e8802b8db537"
};

// Inisialisasi Firebase secara langsung
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🚀 Firebase System: Menghubungkan ke project redaksikita-v1-39aac...");

/**
 * Menyimpan seluruh data aplikasi ke Firestore
 */
export const saveAppData = async (data: any) => {
  try {
    console.log("📤 Memulai sinkronisasi data ke Cloud...");
    // Menggunakan ID dokumen 'main' di dalam koleksi 'app_content'
    const docRef = doc(db, "app_content", "main");
    await setDoc(docRef, data, { merge: true });
    console.log("✅ Sinkronisasi Berhasil: Data tersimpan di Cloud Firestore.");
    return true;
  } catch (e: any) {
    console.error("❌ Gagal simpan ke Firebase. Pastikan Security Rules diizinkan!", e);
    alert("Gagal Sinkron: " + e.message);
    return false;
  }
};

/**
 * Mengambil data aplikasi dari Firestore
 */
export const loadAppData = async () => {
  try {
    console.log("📥 Mengunduh data dari Cloud...");
    const docRef = doc(db, "app_content", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      console.log("📦 Data Cloud ditemukan dan diterapkan.");
      return snap.data();
    }
    console.warn("⚠️ Data Cloud kosong, menggunakan data default.");
    return null;
  } catch (e: any) {
    console.error("❌ Gagal memuat data dari Firebase:", e);
    return null;
  }
};
