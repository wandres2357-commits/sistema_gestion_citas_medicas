//src/components/FooterSitemapSingle.jsx
import Logo from "@/components/ui/Logo";
import "../styles/footer-sitemap-single.css";

import { useState } from "react";

export default function FooterSitemapSingle({ items = [], onNavigate }) {
  const [open, setOpen] = useState(null);
  const toggle = (key) => setOpen(open === key ? null : key);

  return (
    <footer className="fs1-footer">
      <div className="fs1-inner">
        {/* Cabecera y Logo */}
        <div className="fs1-brand">
          <Logo size={36} className="logo" />
          <div>
            <div className="fs1-title">SGCM — Mapa del sitio</div>
              <div className="fs1-sub">Navegación rápida</div>
          </div>
      </div>
        {/* Lista única */}
        <div className="fs1-list-wrap">
          <ul className="fs1-list" role="list">
            {items.map((group) => (
              <li key={group.key} className="fs1-group">
                <button
                  className={`fs1-group-title ${open === group.key ? "is-open" : ""}`}
                  onClick={() => toggle(group.key)}
                  aria-expanded={open === group.key}
                  aria-controls={`panel-${group.key}`}
                >
                  {group.title}
                  <span className="fs1-arrow" aria-hidden="true">▾</span>
                </button>

                <ul
                  id={`panel-${group.key}`}
                  className={`fs1-sublist ${open === group.key ? "is-open" : ""}`}
                  role="list"
                >
                  {group.links.map((lnk, i) => (
                    <li key={`${group.key}-${i}`} className="fs1-item">
                      <button
                        className="fs1-link"
                        onClick={() => onNavigate?.(lnk.view)}
                        title={lnk.label}
                      >
                        <span className="fs1-bullet" aria-hidden="true">•</span>
                        <span>{lnk.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="fs1-bottom">
          <small>© {new Date().getFullYear()} SGCM. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}
``