"use client";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

const SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/lifetechjournal",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@LifeTechJournal",
    icon: <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg> },
  { key: "gallery", label: "Gallery", href: "/gallery",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg> },
];

export default function SiteFooter() {
  const cols = [
    { title: "Life", links: [
      ["Personal Growth", "/blog?category=personal-growth"],
      ["Career",          "/blog?category=career"],
      ["Lifestyle",       "/blog?category=lifestyle"],
      ["Productivity",    "/blog?category=productivity"],
      ["Travel",          "/blog?category=travel"],
      ["Motivation",      "/blog?category=motivation"],
      ["Musings",     "/blog?category=musings"],
      ["Poems",       "/poems"],
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
              <div style={{ marginBottom: 14, display: "inline-block" }}><SiteLogo height={96} /></div>
            </Link>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Stories That Inspire. Technology That Empowers. Published weekly for curious minds.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIALS.map(s => {
                const external = s.href.startsWith("http");
                return (
                  <a key={s.label} href={s.href} aria-label={s.label} title={s.label}
                    className={`footer-social is-${s.key}`}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                    {s.icon}
                  </a>
                );
              })}
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
              style={{ padding: "9px 18px", background: "#6C63F2", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#5048D8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#6C63F2"; }}>
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
