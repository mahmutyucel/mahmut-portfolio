"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm({ isDark = false }: { isDark?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const subject = formData.get("subject") as string;
    const message = formData.get("body") as string;
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, email }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    padding: "10px",
    background: isDark ? "#161616" : "var(--bg-alt)",
    border: isDark ? "1px solid #393939" : "1px solid var(--line)",
    color: isDark ? "#f4f4f4" : "var(--text)",
    fontSize: "13px",
    outline: "none",
    borderRadius: "2px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input 
        type="email" 
        name="email" 
        placeholder="E-posta Adresiniz (İsteğe Bağlı)" 
        style={inputStyle} 
      />
      <input 
        type="text" 
        name="subject" 
        placeholder="Konu" 
        required 
        style={inputStyle} 
      />
      <textarea 
        name="body" 
        placeholder="Mesajınız..." 
        required 
        rows={3} 
        style={{ ...inputStyle, resize: "vertical" }} 
      />
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-primary" 
        style={{ 
          padding: "10px", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "6px", 
          borderRadius: "2px", 
          opacity: isSubmitting ? 0.7 : 1, 
          cursor: isSubmitting ? "not-allowed" : "pointer",
          background: isDark ? "#0f62fe" : "var(--accent)",
          color: "#ffffff",
          border: "none"
        }}
      >
        <Send size={14} /> {isSubmitting ? "Gönderiliyor..." : "Gönder"}
      </button>

      {status === "success" && (
        <p style={{ color: "#42be65", fontSize: "12px", marginTop: "4px" }}>Başarıyla gönderildi!</p>
      )}
      {status === "error" && (
        <p style={{ color: "#fa4d56", fontSize: "12px", marginTop: "4px" }}>Bir hata oluştu.</p>
      )}
    </form>
  );
}