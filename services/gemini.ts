
import { GoogleGenAI } from "@google/genai";

// Inisialisasi API menggunakan variabel lingkungan
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function checkLanguage(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bertindak sebagai editor bahasa. Periksa apakah teks ini sudah menggunakan Bahasa Indonesia yang baku dan ejaan yang benar (PUEBI). Berikan saran perbaikan singkat: "${text}"`,
    });
    return response.text || "Teks terlihat bagus!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, Klinik Bahasa sedang istirahat. Gunakan PUEBI ya!";
  }
}

export async function getWritingClue(part: string, content: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Siswa sedang menulis bagian "${part}" berita tentang "${content}". Berikan 1 kalimat saran kreatif agar tulisannya lebih menarik.`,
    });
    return response.text || "Coba tambahkan detail suasana di sana.";
  } catch {
    return "Gunakan kata sifat yang kuat untuk mendeskripsikan kejadian.";
  }
}

export async function getLiveNewsHeadlines(): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Buatkan 5 headline berita singkat dan menarik (maksimal 10 kata) tentang prestasi siswa, inovasi teknologi, atau kegiatan sekolah dalam Bahasa Indonesia. Format sebagai JSON array string.",
      config: { responseMimeType: "application/json" },
    });
    return response.text ? JSON.parse(response.text) : ["REDaksi KITA: Media Pembelajaran Menulis Berita Terpercaya!"];
  } catch {
    return ["Headline: Selamat Datang di REDaksi KITA!"];
  }
}

export async function getEditorFeedback(answer: string, correct: boolean): Promise<string> {
  try {
    const prompt = `Anda adalah seorang Pemimpin Redaksi senior. Berikan feedback singkat (maks 2 kalimat) untuk siswa yang ${correct ? 'menjawab benar' : 'menjawab salah'} tentang: ${answer}. Gunakan nada yang menyemangati dan profesional.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || (correct ? "Bagus! Teruskan bakat jurnalisismu!" : "Jangan menyerah, periksa kembali faktanya.");
  } catch {
    return correct ? "Kerja bagus, Jurnalis!" : "Ayo coba lagi, perhatikan detailnya.";
  }
}
