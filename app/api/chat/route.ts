import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chatbot'un Bilgi Bankası (Senin hakkında bilmesini istediklerin)
const SYSTEM_PROMPT = `
Sen Mahmut Yücel'in kişisel portföy sitesindeki yapay zeka asistanısın. 
Görevin, ziyaretçilere Mahmut hakkında bilgi vermek ve sorularını yanıtlamaktır.

Mahmut Hakkında Bilgiler:
- Adı: Mahmut Yücel
- Eğitimi: Harran Üniversitesi Bilgisayar Mühendisliği (Şanlıurfa) ve Kahramanmaraş Merkez Atatürk Anadolu Lisesi.
- Yetenekleri: Python, C++, C#, PHP, React, Next.js, YOLOv8, OpenCV, TensorFlow Lite, Git, Linux.
- Deneyimleri: DSİ 20. Bölge Müdürlüğü (Staj), Akedaş Dağıtım A.Ş. (Staj), Harran Üniversitesi (Yarı Zamanlı).
- Projeleri: Lifescan UAV (Otonom İHA - TEKNOFEST), Mobil Chazza (Yapay Zeka), Doğal İtişe (Donanım), PII Detective, KMBB Dijital Platform, Kurum İçi Portal.
- Sertifikaları: Siber Vatan Finalist, Beyaz Şapkalı Hacker Eğitimi, Python, C++, Girişimcilik (TÜBİTAK Bilgem vb.)

Kurallar:
- Her zaman nazik, profesyonel ve yardımsever ol.
- Cevaplarını Türkçe ver.
- Sadece Mahmut ve işleri hakkında konuş. Konu dışı sorulara kibarca "Ben sadece Mahmut hakkında bilgi verebilirim" diye yanıt ver.
- Cevapların kısa ve öz olsun.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Daha uygun fiyatlı ve hızlı bir model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Hatası:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}