import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend((process.env.RESEND_API_KEY || "re_dummy_key"));

export async function POST(request: Request) {
  try {
    const { subject, message, email } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Konu ve mesaj zorunludur." }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "Portfoy Iletisim <onboarding@resend.dev>",
      to: ["mahmutyucel866@gmail.com"],
      subject: `PortfÃ¶y Ä°letiÅŸim: ${subject}`,
      html: `
        <h3>Yeni MesajÄ±nÄ±z Var</h3>
        <p><strong>GÃ¶nderen Mail:</strong> ${email || "Belirtilmedi"}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Mail gÃ¶nderilemedi." }, { status: 500 });
  }
}