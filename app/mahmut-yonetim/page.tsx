import { login, logout, saveExperience, saveProject, saveSkill, saveCertificate, saveIssuer, deleteItem, updateProfile } from "./actions";
import { isAdminAuthenticated } from "./auth";
import { prisma } from "@/lib/prisma";
import { Lock, ArrowRight, LogOut, Plus, Trash2, Save, Building2, Award, Pencil } from "lucide-react";

type Props = { searchParams: Promise<{ error?: string, tab?: string, edit?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const authenticated = await isAdminAuthenticated();
  const { error, tab = "profile", edit } = await searchParams;
  const editId = edit ? Number(edit) : null;

  if (!authenticated) {
    const errors: Record<string, string> = { invalid: "Hatalı giriş.", empty: "Boş alan.", config: "Sunucu hatası." };
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "var(--bg)", border: "1px solid var(--line)", padding: "40px" }}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", background: "var(--accent)", color: "#fff", marginBottom: "16px" }}><Lock size={24} /></div>
            <h1 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 8px 0" }}>Yönetici Girişi</h1>
          </div>
          <form action={login} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input name="username" placeholder="Kullanıcı Adı" required style={{ padding: "12px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
            <input name="password" type="password" placeholder="Şifre" required style={{ padding: "12px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
            {error && <div style={{ color: "#da1e28", fontSize: "13px" }}>{errors[error]}</div>}
            <button type="submit" className="btn-primary" style={{ justifyContent: "space-between" }}>Giriş Yap <ArrowRight size={16} /></button>
          </form>
        </div>
      </main>
    );
  }

  const profile = await prisma.profile.findFirst();
  const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
  const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
  const skills = await prisma.skill.findMany({ orderBy: { id: 'desc' } });
  const certificates = await prisma.certificate.findMany({ include: { issuer: true }, orderBy: { id: 'desc' } });
  const issuers = await prisma.issuer.findMany({ orderBy: { id: 'desc' } });

  const getEditData = (list: any[]) => list.find(item => item.id === editId) || {};

  const tabs = [
    { id: "profile", label: "Hakkımda" },
    { id: "experience", label: "Deneyimler" },
    { id: "project", label: "Projeler" },
    { id: "skill", label: "Yetenekler" },
    { id: "certificate", label: "Sertifikalar & Kurumlar" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-alt)" }}>
      <header style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)", height: "64px", display: "flex", alignItems: "center" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 40px" }}>
          <span style={{ fontWeight: "600", fontSize: "16px" }}>Yönetim Paneli</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="/" target="_blank" style={{ fontSize: "13px", color: "var(--accent)" }}>Siteyi Görüntüle ↗</a>
            <form action={logout}><button type="submit" style={{ display: "flex", gap: "6px", fontSize: "13px", color: "var(--text-2)" }}><LogOut size={14} /> Çıkış</button></form>
          </div>
        </div>
      </header>

      <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "flex", gap: "32px", overflowX: "auto" }}>
          {tabs.map(t => (
            <a key={t.id} href={`/mahmut-yonetim?tab=${t.id}`} style={{ padding: "16px 0", fontSize: "14px", color: tab === t.id ? "var(--accent)" : "var(--text-2)", borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent", fontWeight: tab === t.id ? "600" : "400", whiteSpace: "nowrap" }}>
              {t.label}
            </a>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: "48px 0", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", alignItems: "start" }}>
        
        <div style={{ background: "var(--bg)", border: "1px solid var(--line)", padding: "32px" }}>
          
          {tab === "profile" && profile && (
            <>
              <h2 style={{ fontSize: "18px", marginBottom: "24px" }}>Hakkımda</h2>
              <form action={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input type="hidden" name="id" value={profile.id} />
                <textarea name="bio" defaultValue={profile.bio} rows={10} style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <button type="submit" className="btn-primary"><Save size={16} /> Kaydet</button>
              </form>
            </>
          )}

          {tab === "experience" && (
            <>
              <h2 style={{ fontSize: "18px", marginBottom: "24px" }}>{editId ? "Deneyim Düzenle" : "Deneyim Ekle"}</h2>
              <form action={saveExperience} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {editId && <input type="hidden" name="id" value={editId} />}
                <input name="title" defaultValue={getEditData(experiences).title} placeholder="Ünvan" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <input name="company" defaultValue={getEditData(experiences).company} placeholder="Kurum" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <input name="type" defaultValue={getEditData(experiences).type} placeholder="Tür" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <input name="logo" defaultValue={getEditData(experiences).logo} placeholder="Logo Yolu" style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <button type="submit" className="btn-primary">{editId ? <><Save size={16} /> Güncelle</> : <><Plus size={16} /> Ekle</>}</button>
              </form>
            </>
          )}

          {tab === "project" && (
            <>
              <h2 style={{ fontSize: "18px", marginBottom: "24px" }}>{editId ? "Proje Düzenle" : "Proje Ekle"}</h2>
              <form action={saveProject} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {editId && <input type="hidden" name="id" value={editId} />}
                <input name="title" defaultValue={getEditData(projects).title} placeholder="Proje Adı" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <input name="category" defaultValue={getEditData(projects).category} placeholder="Kategori" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <textarea name="description" defaultValue={getEditData(projects).description} placeholder="Açıklama" required rows={3} style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <input name="tags" defaultValue={getEditData(projects).tags} placeholder="Etiketler" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <button type="submit" className="btn-primary">{editId ? <><Save size={16} /> Güncelle</> : <><Plus size={16} /> Ekle</>}</button>
              </form>
            </>
          )}

          {tab === "skill" && (
            <>
              <h2 style={{ fontSize: "18px", marginBottom: "24px" }}>{editId ? "Yetenek Düzenle" : "Yetenek Ekle"}</h2>
              <form action={saveSkill} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {editId && <input type="hidden" name="id" value={editId} />}
                <input name="category" defaultValue={getEditData(skills).category} placeholder="Kategori" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <input name="items" defaultValue={getEditData(skills).items} placeholder="Yetenekler (Virgülle)" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                <button type="submit" className="btn-primary">{editId ? <><Save size={16} /> Güncelle</> : <><Plus size={16} /> Ekle</>}</button>
              </form>
            </>
          )}

          {tab === "certificate" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div>
                <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}><Building2 size={20} /> {editId && getEditData(issuers).name ? "Kurum Düzenle" : "Kurum Ekle"}</h2>
                <form action={saveIssuer} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {editId && getEditData(issuers).name && <input type="hidden" name="id" value={editId} />}
                  <input name="name" defaultValue={getEditData(issuers).name} placeholder="Kurum Adı" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                  <input name="logo" defaultValue={getEditData(issuers).logo} placeholder="Logo Yolu" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                  <button type="submit" className="btn-primary">{editId && getEditData(issuers).name ? <><Save size={16} /> Güncelle</> : <><Plus size={16} /> Kurum Ekle</>}</button>
                </form>
              </div>
              <hr style={{ border: "0", borderTop: "1px solid var(--line)" }} />
              <div>
                <h2 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}><Award size={20} /> {editId && getEditData(certificates).name ? "Sertifika Düzenle" : "Sertifika Ekle"}</h2>
                <form action={saveCertificate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {editId && getEditData(certificates).name && <input type="hidden" name="id" value={editId} />}
                  <input name="name" defaultValue={getEditData(certificates).name} placeholder="Sertifika Adı" required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }} />
                  <select name="issuerId" defaultValue={getEditData(certificates).issuerId} required style={{ padding: "10px", background: "var(--bg-alt)", border: "1px solid var(--line)" }}>
                    <option value="">Bir Kurum Seçin</option>
                    {issuers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                  <button type="submit" className="btn-primary">{editId && getEditData(certificates).name ? <><Save size={16} /> Güncelle</> : <><Plus size={16} /> Sertifika Ekle</>}</button>
                </form>
              </div>
            </div>
          )}

        </div>

        <div style={{ background: "var(--bg)", border: "1px solid var(--line)", padding: "32px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "24px" }}>Mevcut Kayıtlar</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--line)", border: "1px solid var(--line)" }}>
            
            {tab === "profile" && profile && (
              <div style={{ background: "var(--bg)", padding: "20px" }}><p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0 }}>{profile.bio.substring(0, 150)}...</p></div>
            )}

            {tab === "experience" && experiences.map((exp) => (
              <div key={exp.id} style={{ background: "var(--bg)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><h3 style={{ fontSize: "14px", margin: "0 0 4px 0" }}>{exp.title}</h3><span style={{ fontSize: "12px" }}>{exp.company}</span></div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a href={`/mahmut-yonetim?tab=experience&edit=${exp.id}`} style={{ color: "var(--accent)" }}><Pencil size={16} /></a>
                  <form action={async () => { "use server"; await deleteItem("experience", exp.id); }}><button style={{ color: "#da1e28", background: "none", border: "none" }}><Trash2 size={16} /></button></form>
                </div>
              </div>
            ))}

            {tab === "project" && projects.map((p) => (
              <div key={p.id} style={{ background: "var(--bg)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><h3 style={{ fontSize: "14px", margin: "0 0 4px 0" }}>{p.title}</h3><span style={{ fontSize: "12px" }}>{p.category}</span></div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a href={`/mahmut-yonetim?tab=project&edit=${p.id}`} style={{ color: "var(--accent)" }}><Pencil size={16} /></a>
                  <form action={async () => { "use server"; await deleteItem("project", p.id); }}><button style={{ color: "#da1e28", background: "none", border: "none" }}><Trash2 size={16} /></button></form>
                </div>
              </div>
            ))}

            {tab === "skill" && skills.map((s) => (
              <div key={s.id} style={{ background: "var(--bg)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><h3 style={{ fontSize: "14px", margin: "0 0 4px 0" }}>{s.category}</h3><span style={{ fontSize: "12px" }}>{s.items}</span></div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a href={`/mahmut-yonetim?tab=skill&edit=${s.id}`} style={{ color: "var(--accent)" }}><Pencil size={16} /></a>
                  <form action={async () => { "use server"; await deleteItem("skill", s.id); }}><button style={{ color: "#da1e28", background: "none", border: "none" }}><Trash2 size={16} /></button></form>
                </div>
              </div>
            ))}

            {tab === "certificate" && (
              <>
                <div style={{ background: "var(--bg-alt)", padding: "8px 20px", fontWeight: "600", fontSize: "13px" }}>Kurumlar</div>
                {issuers.map((issuer) => (
                  <div key={issuer.id} style={{ background: "var(--bg)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Building2 size={16} color="var(--text-2)" />
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>{issuer.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <a href={`/mahmut-yonetim?tab=certificate&edit=${issuer.id}`} style={{ color: "var(--accent)" }}><Pencil size={16} /></a>
                      <form action={async () => { "use server"; await deleteItem("issuer", issuer.id); }}><button style={{ color: "#da1e28", background: "none", border: "none" }}><Trash2 size={16} /></button></form>
                    </div>
                  </div>
                ))}

                <div style={{ background: "var(--bg-alt)", padding: "8px 20px", fontWeight: "600", fontSize: "13px", marginTop: "16px" }}>Sertifikalar</div>
                {certificates.map((cert) => (
                  <div key={cert.id} style={{ background: "var(--bg)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "14px", margin: "0 0 4px 0" }}>{cert.name}</h3>
                      <span style={{ fontSize: "12px", color: "var(--text-2)" }}>{cert.issuer.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <a href={`/mahmut-yonetim?tab=certificate&edit=${cert.id}`} style={{ color: "var(--accent)" }}><Pencil size={16} /></a>
                      <form action={async () => { "use server"; await deleteItem("certificate", cert.id); }}><button style={{ color: "#da1e28", background: "none", border: "none" }}><Trash2 size={16} /></button></form>
                    </div>
                  </div>
                ))}
              </>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}