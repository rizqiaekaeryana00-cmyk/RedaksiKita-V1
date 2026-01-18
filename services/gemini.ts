
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Always use const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); directly.

/**
 * Checks Indonesian language usage (PUEBI) using Gemini.
 */
export async function checkLanguage(text: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bertindak sebagai editor bahasa. Periksa apakah teks ini sudah menggunakan Bahasa Indonesia yang baku dan ejaan yang benar (PUEBI). Berikan saran perbaikan singkat: "${text}"`,
    });
    // Guideline: Use the .text property (not text())
    return response.text || "Teks terlihat bagus!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, Editor sedang sibuk. Gunakan PUEBI ya!";
  }
}

/**
 * Provides a creative writing clue for news construction.
 */
export async function getWritingClue(part: string, content: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Siswa sedang menulis bagian "${part}" berita tentang "${content}". Berikan 1 kalimat saran kreatif agar tulisannya lebih menarik.`,
    });
    return response.text || "Coba tambahkan detail suasana di sana.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gunakan kata sifat yang kuat untuk mendeskripsikan kejadian.";
  }
}

/**
 * Fetches live news headlines formatted as a JSON array using responseSchema.
 */
export async function getLiveNewsHeadlines(): Promise<string[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Buatkan 5 headline berita singkat dan menarik (maksimal 10 kata) tentang prestasi siswa, inovasi teknologi, atau kegiatan sekolah dalam Bahasa Indonesia.",
      config: { 
        responseMimeType: "application/json",
        // Guideline: Configure a responseSchema for the expected output.
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });
    
    const jsonStr = response.text?.trim();
    return jsonStr ? JSON.parse(jsonStr) : ["REDaksi KITA: Belajar Menulis Berita Jadi Seru!"];
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Headline: Selamat Datang di REDaksi KITA!"];
  }
}

/**
 * Provides editorial feedback for student quiz answers.
 */
export async function getEditorFeedback(answer: string, correct: boolean): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Anda adalah seorang Pemimpin Redaksi senior. Berikan feedback singkat (maks 2 kalimat) untuk siswa yang ${correct ? 'menjawab benar' : 'menjawab salah'} tentang kuis teks berita. Jawaban siswa: ${answer}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || (correct ? "Bagus! Teruskan bakat jurnalisismu!" : "Jangan menyerah, periksa kembali faktanya.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return correct ? "Kerja bagus, Jurnalis!" : "Ayo coba lagi, perhatikan detailnya.";
  }
}
