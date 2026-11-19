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
      <style>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          position: relative;
          height: 100%;
          padding: 0 40px;
        }
        .header-nav-desktop {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 32px;
          height: 100%;
          align-items: center;
        }
        .header-ataturk {
          display: flex;
          align-items: center;
          height: 100%;
          padding: 8px 0;
        }
        .header-ataturk img {
          height: 80px;
          width: auto;
          object-fit: contain;
        }
        .header-right-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 900px) {
          .header-inner {
            padding: 0 16px;
          }
          .header-nav-desktop {
            display: none !important;
          }
          .header-ataturk img {
            height: 52px;
          }
          .brand {
            font-size: 18px !important;
          }
        }
      `}</style>

      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top">Mahmut YÜCEL</a>

          <nav className="nav-desktop header-nav-desktop">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={{ height: "100%" }}>{link.label}</a>
            ))}
          </nav>

          <div className="header-right-group">
            <div className="header-ataturk">
              <img src="/images/ataturk.jpeg" alt="Mustafa Kemal Atatürk" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/atatürk.jpeg"; }} />
            </div>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menüyü Aç/Kapat"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

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