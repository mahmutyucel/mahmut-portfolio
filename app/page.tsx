export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import ProfileCarousel from "@/components/ProfileCarousel";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";
import { ArrowUpRight } from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import ChatBot from "@/components/ChatBot";

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
  const projects = await prisma.project.findMany({ orderBy: { id: 'asc' } });
  const skills = await prisma.skill.findMany();
  
  const certificates = await prisma.certificate.findMany({ 
    include: { issuer: true },
    orderBy: { id: 'asc' }
  });

  const groupedCertificates = certificates.reduce((acc, cert) => {
    const issuerName = cert.issuer.name;
    if (!acc[issuerName]) {
      acc[issuerName] = { logo: cert.issuer.logo, certs: [] };
    }
    acc[issuerName].certs.push(cert);
    return acc;
  }, {} as Record<string, { logo: string, certs: typeof certificates }>);

  return (
    <main id="top" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <div style={{ flex: 1 }}>
        {/* 01 - HAKKIMDA */}
        <section className="section" id="hakkimda">
          <div className="wrap">
            <div className="section-head">
              <span className="section-label">01 — Hakkımda</span>
              <h2 className="section-title">Geçmişim ve <strong>yazılım serüvenim</strong>.</h2>
            </div>
            
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "center" }}>
              <div style={{ maxWidth: "650px" }}>
                <p className="lead" style={{ whiteSpace: "pre-line", marginBottom: "16px" }}>
                  Merhaba, ben Mahmut. Lise eğitimimi Kahramanmaraş Merkez Atatürk Anadolu Lisesi'nde tamamladım. Üniversite hayatıma ise Şanlıurfa'da, Harran Üniversitesi Bilgisayar Mühendisliği bölümünde devam ediyorum.
                </p>
                <p style={{ color: "var(--text-2)", fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" }}>
                  Yazılım geliştirme sürecinde sadece kod yazmaya değil, aynı zamanda bir problemi analiz edip ona sürdürülebilir bir çözüm üretmeye odaklanıyorum. TEKNOFEST gibi büyük organizasyonlarda yer alarak otonom İHA sistemleri, mobil uygulamalar ve yapay zekÃ¢ alanlarında takım çalışması ve proje yönetimi konularında deneyim kazandım.
                </p>
                <p style={{ color: "var(--text-2)", fontSize: "15px", lineHeight: "1.7" }}>
                  Yeni teknolojileri öğrenmeyi ve öğrendiklerimi gerçek dünya problemlerine uygulamayı seviyorum. Boş zamanlarımda siber güvenlik pratikleri yapıyor, açık kaynak projeleri inceliyor ve yazılım mimarileri üzerine araştırmalar yapıyorum.
                </p>
              </div>
              
              <ProfileCarousel />
            </div>
          </div>
        </section>

        {/* 02 - DENEYİM (STAJLAR) */}
        <section className="section" id="deneyim">
          <div className="wrap">
            <div className="section-head">
              <span className="section-label">02 — Deneyim</span>
              <h2 className="section-title">İş ve <strong>staj deneyimlerim</strong>.</h2>
            </div>
            <div className="about-grid">
              <span />
              
              {/* GÜNCELLENEN KISIM: Boşluklar alındı, sıkıştırıldı */}
              <div className="experience-grid">
                {experiences.map((exp) => (
                  <div key={exp.id} className="experience-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
                    <div style={{ width: "60px", height: "60px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={exp.logo} alt={exp.company} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                    <div className="exp-content" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div>
                        <h3 className="exp-title" style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{exp.title}</h3>
                        <p className="exp-company" style={{ fontSize: "13px", color: "var(--text-2)", margin: 0 }}>{exp.company}</p>
                      </div>
                      <span className="exp-type" style={{ fontSize: "11px", fontFamily: "IBM Plex Mono", color: "var(--text-3)", padding: "2px 6px", background: "var(--bg-alt)", width: "fit-content" }}>
                        {exp.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 03 - PROJELER */}
        <section className="section" id="projeler">
          <div className="wrap">
            <div className="section-head">
              <span className="section-label">03 — Projeler</span>
              <h2 className="section-title">Üzerinde çalıştığım <strong>seçili projeler</strong>.</h2>
            </div>
            <div className="projects-grid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>

        {/* 04 - YETKİNLİKLER & SERTİFİKALAR */}
        <section className="section" id="yetkinlikler">
          <div className="wrap">
            <div className="section-head">
              <span className="section-label">04 — Yetkinlikler</span>
              <h2 className="section-title">Teknik <strong>becerilerim ve sertifikalarım</strong>.</h2>
            </div>

            <div style={{ marginBottom: "48px" }}>
              <span className="section-label" style={{ display: "block", marginBottom: "16px", color: "var(--text)" }}>TEKNİK BECERİLER</span>
              <div className="skills-grid">
                {skills.map((skillGroup) => (
                  <div key={skillGroup.id} className="skill-card">
                    <strong>{skillGroup.category}</strong>
                    <span>{skillGroup.items.replace(/,/g, " · ")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="section-label" style={{ display: "block", marginBottom: "16px", color: "var(--text)" }}>SERTİFİKALAR</span>
              <div className="certificates-grid">
                {Object.entries(groupedCertificates).map(([issuerName, data]) => (
                  <div key={issuerName} style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
                    <div className="cert-header" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderBottom: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                      <div className="cert-logo" style={{ width: "64px", height: "64px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={data.logo} alt={issuerName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                      <h3 className="cert-title" style={{ fontSize: "14px", fontWeight: "600", margin: 0, lineHeight: 1.3 }}>{issuerName}</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {data.certs.map((cert) => (
                        <div key={cert.id} className="cert-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--line)", transition: "background 0.2s" }}>
                          <span className="cert-name" style={{ fontSize: "12px", color: "var(--text)" }}>{cert.name}</span>
                          <a href="#" style={{ color: "var(--red)", display: "flex", alignItems: "center" }} title="Sertifikayı Görüntüle">
                            <ArrowUpRight size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SİYAH FOOTER */}
      <footer id="iletisim" style={{ background: "#161616", color: "#f4f4f4", paddingTop: "20px", paddingBottom: "12px" }}>
        <div className="wrap">
          
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "24px", marginBottom: "20px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 className="footer-name" style={{ fontFamily: "'Lora', serif", fontSize: "48px", fontWeight: "700", color: "#ffffff", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                MAHMUT <br /> YÜCEL
              </h3>
            </div>

            <div className="footer-col">
              <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#ffffff", marginBottom: "12px" }}>Keşfet</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li><a href="#hakkimda" style={{ fontSize: "17px", color: "#c6c6c6" }} className="footer-link">Hakkımda</a></li>
                <li><a href="#deneyim" style={{ fontSize: "17px", color: "#c6c6c6" }} className="footer-link">Deneyimler</a></li>
                <li><a href="#projeler" style={{ fontSize: "17px", color: "#c6c6c6" }} className="footer-link">Projeler</a></li>
                <li><a href="#yetkinlikler" style={{ fontSize: "17px", color: "#c6c6c6" }} className="footer-link">Yetkinlikler</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#ffffff", marginBottom: "12px" }}>Sosyal Medya</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li><a href="https://www.linkedin.com/in/mahmutyucel" target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", color: "#c6c6c6" }} className="footer-link"><FaLinkedin size={20} color="#0A66C2" /> @mahmutyucel</a></li>
                <li><a href="https://github.com/mahmutyucel" target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", color: "#c6c6c6" }} className="footer-link"><FaGithub size={20} color="#ffffff" /> @mahmutyucel</a></li>
                <li><a href="https://instagram.com/mahmutyucel" target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", color: "#c6c6c6" }} className="footer-link"><FaInstagram size={20} color="#E1306C" /> @mahmutyucel</a></li>
                <li><a href="https://x.com/mahmutyucel" target="_blank" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", color: "#c6c6c6" }} className="footer-link"><FaXTwitter size={20} color="#ffffff" /> @mahmutyucel</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-form-container">
            <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#ffffff", marginBottom: "12px" }}>Bana Ulaşın</h4>
            <div style={{ background: "#262626", padding: "12px", borderRadius: "4px" }}>
              <ContactForm isDark={true} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #393939", paddingTop: "10px", marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "#c6c6c6" }}>© {new Date().getFullYear()} Mahmut Yücel</span>
            <a href="#top" style={{ fontSize: "13px", color: "#c6c6c6", display: "flex", alignItems: "center", gap: "6px" }} className="footer-link">Başa dön â†‘</a>
          </div>
        </div>
      </footer>
      <ChatBot />
    </main>
  );
}