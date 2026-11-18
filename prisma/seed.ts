import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.profile.create({
    data: {
      bio: "Merhaba, ben Mahmut. Lise eğitimimi Kahramanmaraş Merkez Atatürk Anadolu Lisesi'nde tamamladım. Üniversite hayatıma ise Şanlıurfa'da, Harran Üniversitesi Bilgisayar Mühendisliği bölümünde devam ediyorum. TEKNOFEST gibi organizasyonlarda yer alarak otonom İHA sistemleri, mobil uygulamalar ve yapay zekâ alanlarında projeler geliştirdim."
    }
  })

  await prisma.experience.createMany({
    data: [
      { title: "Stajyer", company: "DSİ 20. Bölge Müdürlüğü", type: "Staj", logo: "/logos/dsi.png" },
      { title: "Stajyer", company: "Akedaş Dağıtım A.Ş.", type: "Staj", logo: "/logos/akedas.png" },
      { title: "Yarı Zamanlı Satış Asistanı", company: "Harran Üniversitesi / Belli Kültür Spor Derneği", type: "Yarı Zamanlı", logo: "/logos/harran.png" },
    ]
  })

  await prisma.project.createMany({
    data: [
      { number: "01", category: "İHA / Otonom Sistemler", title: "Lifescan UAV", description: "Otonom uçuş, görüntü işleme ve yapay zekâ kullanarak afet sonrası enkaz altındaki canlıları tespit etmek için geliştirilen otonom İHA projesi.", tags: "Python,YOLOv8,Jetson Nano,MAVLink,OpenCV" },
      { number: "02", category: "Mobil Uygulama", title: "Mobil Chazza", description: "Kişiyi doğrudan ve dolaylı tanımlayan verileri kullanarak çalışan, mobil cihaz üzerinde çevrimdışı çalışan yapay zekâ modeli.", tags: "Android,TensorFlow Lite,Python,NLP" },
      { number: "03", category: "Donanım", title: "Doğal İtişe", description: "İnsan gücüyle hareket eden mekanik bir jeneratör. Günlük hayatta kullanılabilecek taşınabilir bir enerji üretim sistemi.", tags: "Donanım,Mekanik,Enerji" },
      { number: "04", category: "Android / Yapay Zekâ", title: "PII Detective", description: "Mobil cihaz üzerinde OCR ve yapay zekâ destekli kişisel veri tespiti ve dinamik maskeleme yaklaşımı.", tags: "Android,OCR,DistilBERT,Python" },
      { number: "05", category: "Web / Kamu", title: "KMBB Dijital Platform", description: "Modern arayüz, erişilebilirlik ve kullanıcı deneyimi odağında geliştirilen belediye dijital platformu.", tags: "Next.js,TypeScript,CSS" },
      { number: "06", category: "Web / Yönetim", title: "Kurum İçi Portal", description: "Duyuru, kullanıcı ve içerik yönetimi süreçlerini tek noktada birleştiren PHP tabanlı portal çalışması.", tags: "PHP,MySQL,Bootstrap" },
    ]
  })

  await prisma.skill.createMany({
    data: [
      { category: "Programlama Dilleri", items: "C,C++,Python,C#,PHP" },
      { category: "Web & Veritabanı", items: "HTML,CSS,JavaScript,MySQL,SQL" },
      { category: "Yapay Zekâ", items: "YOLOv8,OpenCV,TensorFlow Lite" },
      { category: "Araçlar", items: "Git,Linux,Jetson Nano,MAVLink" },
    ]
  })

  const tubitak = await prisma.issuer.create({
    data: { name: "TÜBİTAK Bilgem", logo: "/logos/tubitak.png" }
  })
  
  const ssb = await prisma.issuer.create({
    data: { name: "Savunma Sanayii Başkanlığı", logo: "/logos/ssb.png" }
  })

  await prisma.certificate.createMany({
    data: [
      { name: "Siber Vatan Finalist", issuerId: ssb.id },
      { name: "Beyaz Şapkalı Hacker Eğitimi", issuerId: tubitak.id },
      { name: "Python Programlama", issuerId: tubitak.id },
      { name: "C++ Programlama", issuerId: tubitak.id },
    ]
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })