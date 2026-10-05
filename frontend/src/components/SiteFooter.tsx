"use client";
import Link from "next/link";

export default function SiteFooter() {
  const cols = [
    { title: "Life", links: [
      ["Personal Growth", "/blog?category=personal-growth"],
      ["Career",          "/blog?category=career"],
      ["Lifestyle",       "/blog?category=lifestyle"],
      ["Productivity",    "/blog?category=productivity"],
      ["Travel",          "/blog?category=travel"],
      ["Motivation",      "/blog?category=motivation"],
    ]},
    { title: "Technology", links: [
      ["AI & ML",           "/blog?category=ai"],
      ["Programming",       "/blog?category=programming"],
      ["Web Development",   "/blog?category=web-dev"],
      ["Digital Marketing", "/blog?category=marketing"],
      ["Cloud Computing",   "/blog?category=cloud"],
      ["Data Science",      "/blog?category=data-science"],
    ]},
    { title: "Company", links: [
      ["About Us",      "/about"],
      ["Write for Us",  "/write"],
      ["Newsletter",    "/newsletter"],
      ["Contact",       "/contact"],
      ["Privacy Policy","/privacy"],
    ]},
  ];

  return (
    <footer style={{ background: "var(--footer-bg)", borderTop: "1px solid var(--border)", marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid var(--border)" }}>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "var(--ink)", marginBottom: 14, cursor: "pointer" }}>
                Life <span style={{ color: "var(--accent)" }}>&</span> Tech Journal
              </div>
            </Link>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Stories That Inspire. Technology That Empowers. Published weekly for curious minds.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["𝕏", "in", "📸", "▶"].map(icon => (
                <span key={icon} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-light)", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--ink-light)"; }}>
                  {icon}
                </span>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-light)", marginBottom: 20 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontSize: 14, color: "var(--ink-muted)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--primary-text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-muted)"; }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 0", borderBottom: "1px solid var(--border)", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Get stories in your inbox</div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>Every Tuesday — curated articles about life & tech.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="email" placeholder="your@email.com"
              style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--ink)", fontSize: 13, outline: "none", fontFamily: "inherit", width: 210 }} />
            <button
              style={{ padding: "9px 18px", background: "#4F46E5", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#3730A3"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; }}>
              Subscribe →
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", fontSize: 13, color: "var(--ink-light)", flexWrap: "wrap", gap: 12 }}>
          <span>© 2025 Life & Tech Journal. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Sitemap", "/sitemap.xml"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ color: "var(--ink-light)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-mid)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-light)"; }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
