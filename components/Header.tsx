"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Hakkımda", href: "#hakkimda" },
    { label: "Projeler", href: "#projeler" },
    { label: "Yetkinlikler", href: "#yetkinlikler" },
    { label: "İletişim", href: "#iletisim" },
  ];

  return (
    <>
      <header className="site-header">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", position: "relative", height: "100%" }}>
          
          <a className="brand" href="#top" style={{ marginLeft: "40px" }}>Mahmut YÜCEL</a>
          
          <nav className="nav-desktop" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "32px", height: "100%", alignItems: "center" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={{ height: "100%" }}>{link.label}</a>
            ))}
          </nav>

          <div style={{ marginRight: "40px", display: "flex", alignItems: "center", height: "100%", padding: "10px 0" }}>
            <img src="/images/atatürk.jpeg" alt="Mustafa Kemal Atatürk" style={{ height: "85px", width: "auto", objectFit: "contain" }} />
          </div>

          {/* Mobil Hamburger Menü Butonu */}
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      <style>{`@media (max-width: 768px) { .nav-desktop { display: none !important; } .brand { margin-left: 16px !important; } }`}</style></header>

      {/* Mobil Menü */}
      {menuOpen && (
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}