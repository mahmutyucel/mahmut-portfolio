export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || "dummy-key-for-build"),
});

// Chatbot'un Bilgi BankasÃ„Â± (Senin hakkÃ„Â±nda bilmesini istediklerin)
const SYSTEM_PROMPT = `
Sen Mahmut YÃƒÂ¼cel'in kiÃ…Å¸isel portfÃƒÂ¶y sitesindeki yapay zeka asistanÃ„Â±sÃ„Â±n. 
GÃƒÂ¶revin, ziyaretÃƒÂ§ilere Mahmut hakkÃ„Â±nda bilgi vermek ve sorularÃ„Â±nÃ„Â± yanÃ„Â±tlamaktÃ„Â±r.

Mahmut HakkÃ„Â±nda Bilgiler:
- AdÃ„Â±: Mahmut YÃƒÂ¼cel
- EÃ„Å¸itimi: Harran ÃƒÅ“niversitesi Bilgisayar MÃƒÂ¼hendisliÃ„Å¸i (Ã…ÂanlÃ„Â±urfa) ve KahramanmaraÃ…Å¸ Merkez AtatÃƒÂ¼rk Anadolu Lisesi.
- Yetenekleri: Python, C++, C#, PHP, React, Next.js, YOLOv8, OpenCV, TensorFlow Lite, Git, Linux.
- Deneyimleri: DSÃ„Â° 20. BÃƒÂ¶lge MÃƒÂ¼dÃƒÂ¼rlÃƒÂ¼Ã„Å¸ÃƒÂ¼ (Staj), AkedaÃ…Å¸ DaÃ„Å¸Ã„Â±tÃ„Â±m A.Ã…Â. (Staj), Harran ÃƒÅ“niversitesi (YarÃ„Â± ZamanlÃ„Â±).
- Projeleri: Lifescan UAV (Otonom Ã„Â°HA - TEKNOFEST), Mobil Chazza (Yapay Zeka), DoÃ„Å¸al Ã„Â°tiÃ…Å¸e (DonanÃ„Â±m), PII Detective, KMBB Dijital Platform, Kurum Ã„Â°ÃƒÂ§i Portal.
- SertifikalarÃ„Â±: Siber Vatan Finalist, Beyaz Ã…ÂapkalÃ„Â± Hacker EÃ„Å¸itimi, Python, C++, GiriÃ…Å¸imcilik (TÃƒÅ“BÃ„Â°TAK Bilgem vb.)

Kurallar:
- Her zaman nazik, profesyonel ve yardÃ„Â±msever ol.
- CevaplarÃ„Â±nÃ„Â± TÃƒÂ¼rkÃƒÂ§e ver.
- Sadece Mahmut ve iÃ…Å¸leri hakkÃ„Â±nda konuÃ…Å¸. Konu dÃ„Â±Ã…Å¸Ã„Â± sorulara kibarca "Ben sadece Mahmut hakkÃ„Â±nda bilgi verebilirim" diye yanÃ„Â±t ver.
- CevaplarÃ„Â±n kÃ„Â±sa ve ÃƒÂ¶z olsun.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Daha uygun fiyatlÃ„Â± ve hÃ„Â±zlÃ„Â± bir model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI HatasÃ„Â±:", error);
    return NextResponse.json({ error: "Bir hata oluÃ…Å¸tu." }, { status: 500 });
  }
}