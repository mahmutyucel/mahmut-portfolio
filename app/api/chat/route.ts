import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || "dummy-key-for-build"),
});

// Chatbot'un Bilgi BankasÄ± (Senin hakkÄ±nda bilmesini istediklerin)
const SYSTEM_PROMPT = `
Sen Mahmut YÃ¼cel'in kiÅŸisel portfÃ¶y sitesindeki yapay zeka asistanÄ±sÄ±n. 
GÃ¶revin, ziyaretÃ§ilere Mahmut hakkÄ±nda bilgi vermek ve sorularÄ±nÄ± yanÄ±tlamaktÄ±r.

Mahmut HakkÄ±nda Bilgiler:
- AdÄ±: Mahmut YÃ¼cel
- EÄŸitimi: Harran Ãœniversitesi Bilgisayar MÃ¼hendisliÄŸi (ÅanlÄ±urfa) ve KahramanmaraÅŸ Merkez AtatÃ¼rk Anadolu Lisesi.
- Yetenekleri: Python, C++, C#, PHP, React, Next.js, YOLOv8, OpenCV, TensorFlow Lite, Git, Linux.
- Deneyimleri: DSÄ° 20. BÃ¶lge MÃ¼dÃ¼rlÃ¼ÄŸÃ¼ (Staj), AkedaÅŸ DaÄŸÄ±tÄ±m A.Å. (Staj), Harran Ãœniversitesi (YarÄ± ZamanlÄ±).
- Projeleri: Lifescan UAV (Otonom Ä°HA - TEKNOFEST), Mobil Chazza (Yapay Zeka), DoÄŸal Ä°tiÅŸe (DonanÄ±m), PII Detective, KMBB Dijital Platform, Kurum Ä°Ã§i Portal.
- SertifikalarÄ±: Siber Vatan Finalist, Beyaz ÅapkalÄ± Hacker EÄŸitimi, Python, C++, GiriÅŸimcilik (TÃœBÄ°TAK Bilgem vb.)

Kurallar:
- Her zaman nazik, profesyonel ve yardÄ±msever ol.
- CevaplarÄ±nÄ± TÃ¼rkÃ§e ver.
- Sadece Mahmut ve iÅŸleri hakkÄ±nda konuÅŸ. Konu dÄ±ÅŸÄ± sorulara kibarca "Ben sadece Mahmut hakkÄ±nda bilgi verebilirim" diye yanÄ±t ver.
- CevaplarÄ±n kÄ±sa ve Ã¶z olsun.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Daha uygun fiyatlÄ± ve hÄ±zlÄ± bir model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI HatasÄ±:", error);
    return NextResponse.json({ error: "Bir hata oluÅŸtu." }, { status: 500 });
  }
}