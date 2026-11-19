export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || "dummy-key-for-build"),
});

// Chatbot'un Bilgi BankasÃ„± (Senin hakkÃ„±nda bilmesini istediklerin)
const SYSTEM_PROMPT = `
Sen Mahmut YÃƒ¼cel'in kiÃ…Å¸isel portfÃƒ¶y sitesindeki yapay zeka asistanÃ„±sÃ„±n. 
GÃƒ¶revin, ziyaretÃƒ§ilere Mahmut hakkÃ„±nda bilgi vermek ve sorularÃ„±nÃ„± yanÃ„±tlamaktÃ„±r.

Mahmut HakkÃ„±nda Bilgiler:
- AdÃ„±: Mahmut YÃƒ¼cel
- EÃ„Å¸itimi: Harran ÃƒÅ“niversitesi Bilgisayar MÃƒ¼hendisliÃ„Å¸i (Ã…anlÃ„±urfa) ve KahramanmaraÃ…Å¸ Merkez AtatÃƒ¼rk Anadolu Lisesi.
- Yetenekleri: Python, C++, C#, PHP, React, Next.js, YOLOv8, OpenCV, TensorFlow Lite, Git, Linux.
- Deneyimleri: DSÃ„° 20. BÃƒ¶lge MÃƒ¼dÃƒ¼rlÃƒ¼Ã„Å¸Ãƒ¼ (Staj), AkedaÃ…Å¸ DaÃ„Å¸Ã„±tÃ„±m A.Ã…. (Staj), Harran ÃƒÅ“niversitesi (YarÃ„± ZamanlÃ„±).
- Projeleri: Lifescan UAV (Otonom Ã„°HA - TEKNOFEST), Mobil Chazza (Yapay Zeka), DoÃ„Å¸al Ã„°tiÃ…Å¸e (DonanÃ„±m), PII Detective, KMBB Dijital Platform, Kurum Ã„°Ãƒ§i Portal.
- SertifikalarÃ„±: Siber Vatan Finalist, Beyaz Ã…apkalÃ„± Hacker EÃ„Å¸itimi, Python, C++, GiriÃ…Å¸imcilik (TÃƒÅ“BÃ„°TAK Bilgem vb.)

Kurallar:
- Her zaman nazik, profesyonel ve yardÃ„±msever ol.
- CevaplarÃ„±nÃ„± TÃƒ¼rkÃƒ§e ver.
- Sadece Mahmut ve iÃ…Å¸leri hakkÃ„±nda konuÃ…Å¸. Konu dÃ„±Ã…Å¸Ã„± sorulara kibarca "Ben sadece Mahmut hakkÃ„±nda bilgi verebilirim" diye yanÃ„±t ver.
- CevaplarÃ„±n kÃ„±sa ve Ãƒ¶z olsun.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Daha uygun fiyatlÃ„± ve hÃ„±zlÃ„± bir model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI HatasÃ„±:", error);
    return NextResponse.json({ error: "Bir hata oluÃ…Å¸tu." }, { status: 500 });
  }
}