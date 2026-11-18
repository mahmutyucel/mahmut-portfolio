"use client";

import { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

type Project = {
  id: number;
  number: string;
  category: string;
  title: string;
  description: string;
  tags: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article 
      className={`project-card ${isOpen ? "open" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="project-meta">
        <span>{project.number}</span>
        <span>{project.category}</span>
      </div>
      
      <h3>{project.title}</h3>
      
      {/* Açıklama kısmı */}
      <div className="project-description">
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.split(",").map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>

      {/* Alt Kısım: Detay ve Dış Link */}
      <div className="project-footer">
        {/* Sol Taraf: Siyah Detay Oku */}
        <div className="project-detail-btn">
          <ArrowDown 
            size={16} 
            style={{ 
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
              transition: "transform 0.3s ease" 
            }} 
          />
          <span>Detay</span>
        </div>
        
        {/* Sağ Taraf: Kırmızı Dış Link İkonu */}
        <a 
          href="#" 
          className="project-link" 
          onClick={(e) => e.stopPropagation()} 
          title="Projeyi İncele"
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
    </article>
  );
}