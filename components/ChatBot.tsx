"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Merhaba! Ben Mahmut'un yapay zeka asistanıyım. Projeleri, deneyimleri veya yetenekleri hakkında bana soru sorabilirsiniz." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Üzgünüm, şu an yanıt veremiyorum." }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Bağlantı hatası oluştu." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      
      {/* Sohbet Penceresi */}
      {isOpen && (
        <div style={{ 
          width: "350px", 
          height: "500px", 
          background: "var(--bg)", 
          border: "1px solid var(--line)", 
          borderRadius: "16px", 
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          marginBottom: "16px",
          overflow: "hidden"
        }}>
          {/* Başlık */}
          <div style={{ background: "#161616", padding: "16px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* İKON RENGİ KIRMIZI YAPILDI */}
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E30A17", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>Portföy Asistanı</div>
                <div style={{ fontSize: "11px", color: "#8d8d8d" }}>Çevrimiçi</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={20} /></button>
          </div>

          {/* Mesaj Alanı */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-alt)" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                // KULLANICI MESAJI SİYAH ZEMİN BEYAZ YAZI
                background: msg.role === "user" ? "#161616" : "var(--bg)",
                color: msg.role === "user" ? "#ffffff" : "var(--text)",
                padding: "10px 14px",
                borderRadius: "12px",
                borderBottomRightRadius: msg.role === "user" ? "2px" : "12px",
                borderBottomLeftRadius: msg.role === "assistant" ? "2px" : "12px",
                maxWidth: "85%",
                fontSize: "13px",
                lineHeight: "1.5",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                border: msg.role === "assistant" ? "1px solid var(--line)" : "none"
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: "flex-start", background: "var(--bg)", padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--line)", fontSize: "13px", color: "var(--text-2)" }}>
                Düşünüyor...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Giriş Alanı */}
          <div style={{ padding: "12px", background: "var(--bg)", borderTop: "1px solid var(--line)", display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Bir soru sorun..."
              style={{ flex: 1, padding: "10px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--bg-alt)", color: "var(--text)", outline: "none", fontSize: "13px" }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              // GÖNDER BUTONU SİYAH YAPILDI
              style={{ background: "#161616", color: "#fff", border: "none", borderRadius: "8px", padding: "0 14px", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Açma/Kapama Butonu - Çerçevesiz, Renk Geçişli */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="chat-toggle-btn"
        aria-label="Sohbeti Aç"
      >
        {isOpen ? <X size={28} /> : <Bot size={32} />}
      </button>
    </div>
  );
}