"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ─── Shared Navbar ─────────────────────────────────────────────────────────────
// ── Nav Auth Buttons (shows avatar when signed in) ───────────────────────────
function NavAuthButtons() {
  const [user,    setUser]    = useState<{name:string;email:string;role?:string;avatar?:string}|null>(null);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }
    fetch(`${API}/auth/me`, { headers:{"Authorization":`Bearer ${token}`} })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setUser({name:d.name,email:d.email,role:d.role,avatar:d.avatar}); })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const logout = () => {
    sessionStorage.removeItem("access_token");
    setUser(null); setOpen(false);
    window.location.href = "/";
  };

  const initials = user ? user.name.split(" ").map((n:string)=>n[0]).join("").toUpperCase().slice(0,2) : "";

  if (loading) return (
    <div style={{ display:"flex",gap:8 }}>
      <div style={{ width:72,height:34,background:"#F0EDE8",borderRadius:8 }} />
      <div style={{ width:90,height:34,background:"#EEF2FF",borderRadius:8 }} />
    </div>
  );

  if (!user) return (
    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
      <Link href={`/auth/login?from=${encodeURIComponent(typeof window!=="undefined"?window.location.pathname:"/")}`}
        style={{ fontSize:13,fontWeight:700,color:"#6B6B6B",padding:"7px 14px",borderRadius:8,border:"1.5px solid #E8E4DE",textDecoration:"none",transition:"all 0.15s" }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5";(e.currentTarget as HTMLElement).style.color="#4F46E5"}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#E8E4DE";(e.currentTarget as HTMLElement).style.color="#6B6B6B"}}>
        Sign In
      </Link>
      <Link href="/newsletter"
        style={{ fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",padding:"7px 16px",borderRadius:8,textDecoration:"none" }}>
        Subscribe
      </Link>
    </div>
  );

  return (
    <div style={{ display:"flex",gap:8,flexShrink:0,alignItems:"center",position:"relative" }}>
      <Link href="/newsletter" style={{ fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",padding:"7px 16px",borderRadius:8,textDecoration:"none" }}>Subscribe</Link>
      <div style={{ position:"relative" }}>
        <button onClick={()=>setOpen(o=>!o)}
          style={{ width:38,height:38,borderRadius:"50%",border:`2px solid ${open?"#4F46E5":"#E8E4DE"}`,cursor:"pointer",padding:0,overflow:"hidden",background:"none",transition:"border-color 0.15s" }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white" }}>{initials}</div>
          }
        </button>
        {open && (
          <div style={{ position:"absolute",top:46,right:0,background:"white",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.13)",border:"1px solid #F0EDE8",minWidth:220,zIndex:500,overflow:"hidden" }}
            onMouseLeave={()=>setOpen(false)}>
            <div style={{ padding:"14px 16px",background:"#FAF8F5",borderBottom:"1px solid #F0EDE8" }}>
              <div style={{ fontWeight:700,fontSize:14,color:"#1A1A1A" }}>{user.name}</div>
              <div style={{ fontSize:12,color:"#A0A0A0",marginTop:2 }}>{user.email}</div>
              {user.role&&user.role!=="reader"&&(
                <span style={{ display:"inline-block",marginTop:6,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",background:"#EEF2FF",color:"#4F46E5",padding:"2px 8px",borderRadius:100 }}>{user.role}</span>
              )}
            </div>
            <div style={{ padding:"6px 0" }}>
              {[["📖","Reading List","/reading-list"],["🔖","Saved Articles","/saved"],["👤","My Profile","/profile"]].map(([icon,label,href])=>(
                <Link key={label} href={href} onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"#3D3D3D",textDecoration:"none" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#FAF8F5"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="white"}}>
                  <span>{icon}</span>{label}
                </Link>
              ))}
              {(user.role==="admin"||user.role==="author")&&(
                <Link href="/admin" onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"#4F46E5",textDecoration:"none",fontWeight:600 }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#EEF2FF"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="white"}}>
                  <span>⚙️</span>Admin Panel
                </Link>
              )}
            </div>
            <div style={{ borderTop:"1px solid #F0EDE8",padding:"6px 0" }}>
              <button onClick={logout}
                style={{ width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#FEF2F2"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="none"}}>
                <span>🚪</span>Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const menus: Record<string, { label: string; href: string }[]> = {
    Life: [
      { label: "Personal Growth", href: "/blog?category=personal-growth" },
      { label: "Career",          href: "/blog?category=career" },
      { label: "Lifestyle",       href: "/blog?category=lifestyle" },
      { label: "Relationships",   href: "/blog?category=relationships" },
      { label: "Productivity",    href: "/blog?category=productivity" },
      { label: "Travel",          href: "/blog?category=travel" },
      { label: "Motivation",      href: "/blog?category=motivation" },
    ],
    Technology: [
      { label: "Artificial Intelligence", href: "/blog?category=ai" },
      { label: "Programming",            href: "/blog?category=programming" },
      { label: "Web Development",        href: "/blog?category=web-dev" },
      { label: "Digital Marketing",      href: "/blog?category=marketing" },
      { label: "Cybersecurity",          href: "/blog?category=cybersecurity" },
      { label: "Cloud Computing",        href: "/blog?category=cloud" },
      { label: "Data Science",           href: "/blog?category=data-science" },
    ],
  };

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 200,
        background: scrolled ? "rgba(250,248,245,0.97)" : "#FAF8F5",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E8E4DE",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.25s",
      }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: 32 }}>

          {/* ── Logo — clicking takes you to home ── */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0, cursor: "pointer" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Life <span style={{ color: "#4F46E5" }}>&</span> Tech
              <div style={{ fontSize: 10, fontFamily: "Lato, sans-serif", fontWeight: 300, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A0A0A0", marginTop: 2 }}>
                Journal
              </div>
            </div>
          </Link>

          {/* ── Nav links ── */}
          <div style={{ display: "flex", flex: 1, justifyContent: "center", gap: 4 }}>

            {/* Home — explicit link */}
            <Link href="/"
              style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3D3D3D", borderRadius: 8, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#4F46E5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#3D3D3D"; }}>
              Home
            </Link>

            {/* Life + Technology with dropdowns */}
            {Object.keys(menus).map(key => (
              <div key={key} style={{ position: "relative" }}
                onMouseEnter={() => setActiveMenu(key)}>
                <Link
                  href={key === "Life" ? "/blog?group=life" : "/blog?group=tech"}
                  style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: activeMenu === key ? "#4F46E5" : "#3D3D3D", borderRadius: 8, display: "flex", alignItems: "center", gap: 4, textDecoration: "none", transition: "color 0.15s" }}>
                  {key}
                  <span style={{ fontSize: 9, color: "#A0A0A0", transform: activeMenu === key ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", display: "inline-block" }}>▼</span>
                </Link>
              </div>
            ))}

            {/* Other nav links */}
            {[["Blog", "/blog"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
              <Link key={label} href={href}
                style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3D3D3D", borderRadius: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#4F46E5"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#3D3D3D"; }}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
            <NavAuthButtons />
          </div>
        </div>

        {/* Dropdown */}
        {activeMenu && menus[activeMenu] && (
          <div
            style={{ position: "absolute", left: 0, right: 0, background: "white", borderTop: "1px solid #F0EDE8", borderBottom: "1px solid #E8E4DE", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "20px 32px", display: "flex", gap: 8, flexWrap: "wrap", zIndex: 300 }}
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}>
            {menus[activeMenu].map(item => (
              <Link key={item.label} href={item.href}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, color: "#3D3D3D", border: "1px solid #F0EDE8", background: "#FAF8F5", textDecoration: "none", transition: "all 0.15s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EEF2FF"; (e.currentTarget as HTMLElement).style.color = "#4F46E5"; (e.currentTarget as HTMLElement).style.borderColor = "#C7D2FE"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#FAF8F5"; (e.currentTarget as HTMLElement).style.color = "#3D3D3D"; (e.currentTarget as HTMLElement).style.borderColor = "#F0EDE8"; }}
                onClick={() => setActiveMenu(null)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Shared Footer ──────────────────────────────────────────────────────────────
function SiteFooter() {
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
    <footer style={{ background: "#1A1A1A", marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "white", marginBottom: 14, cursor: "pointer" }}>
                Life <span style={{ color: "#818CF8" }}>&</span> Tech Journal
              </div>
            </Link>
            <p style={{ fontSize: 14, color: "#5D5D5D", lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Stories That Inspire. Technology That Empowers. Published weekly for curious minds.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["𝕏", "in", "📸", "▶"].map(icon => (
                <span key={icon} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#818CF8"; (e.currentTarget as HTMLElement).style.color = "#818CF8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#6B7280"; }}>
                  {icon}
                </span>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontSize: 14, color: "#5D5D5D", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#5D5D5D"; }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "white", marginBottom: 4 }}>Get stories in your inbox</div>
            <div style={{ fontSize: 13, color: "#5D5D5D" }}>Every Tuesday — curated articles about life & tech.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="email" placeholder="your@email.com"
              style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", width: 210 }} />
            <button
              style={{ padding: "9px 18px", background: "#4F46E5", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#3730A3"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; }}>
              Subscribe →
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", fontSize: 13, color: "#4B4B4B", flexWrap: "wrap", gap: 12 }}>
          <span>© 2025 Life & Tech Journal. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Sitemap", "/sitemap.xml"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ color: "#4B4B4B", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#4B4B4B"; }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
const CAT_GRAD: Record<string, string> = {
  ai: "linear-gradient(135deg,#1e1b4b,#312e81,#14B8A6)",
  "web-dev": "linear-gradient(135deg,#134E4A,#0F766E,#14B8A6)",
  programming: "linear-gradient(135deg,#451A03,#92400E,#F59E0B)",
  career: "linear-gradient(135deg,#500724,#9D174D,#F472B6)",
  "personal-growth": "linear-gradient(135deg,#022C22,#065F46,#10B981)",
  lifestyle: "linear-gradient(135deg,#450A0A,#991B1B,#F87171)",
  travel: "linear-gradient(135deg,#1E1B4B,#3730A3,#818CF8)",
  marketing: "linear-gradient(135deg,#2D1B69,#7C3AED,#C4B5FD)",
  cybersecurity: "linear-gradient(135deg,#0F172A,#1E293B,#475569)",
  "data-science": "linear-gradient(135deg,#1E3A5F,#1D4ED8,#60A5FA)",
  default: "linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};
const CAT_EMOJI: Record<string, string> = {
  ai: "🤖", "web-dev": "🌐", programming: "⌨️", career: "🚀",
  "personal-growth": "🌱", lifestyle: "☀️", travel: "✈️",
  marketing: "📣", cybersecurity: "🛡️", "data-science": "📊", default: "✍️",
};

function ArticleCard({ article, featured = false }: { article: any; featured?: boolean }) {
  const cat   = (article.category_id ?? "default").toLowerCase().replace(/\s+/g, "-");
  const grad  = CAT_GRAD[cat]  ?? CAT_GRAD.default;
  const emoji = CAT_EMOJI[cat] ?? CAT_EMOJI.default;

  return (
    <Link href={`/blog/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0EDE8", transition: "all 0.25s", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 28px rgba(79,70,229,0.12)"; el.style.transform = "translateY(-4px)"; el.style.borderColor = "#C7D2FE"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; el.style.transform = "translateY(0)"; el.style.borderColor = "#F0EDE8"; }}>
        <div style={{ height: featured ? 240 : 170, background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: featured ? 48 : 36, flexShrink: 0, position: "relative", overflow: "hidden" }}>
          {article.featured_image
            ? <img src={article.featured_image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            : <span style={{ zIndex: 1 }}>{emoji}</span>}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", background: "rgba(255,255,255,0.92)", color: "#4F46E5", padding: "3px 9px", borderRadius: 100 }}>
              {article.category_id ?? "General"}
            </span>
          </div>
        </div>
        <div style={{ padding: featured ? "22px 24px" : "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: featured ? 20 : 16, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35, marginBottom: 8, flex: 1 }}>
            {article.title}
          </h3>
          <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.65, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {article.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#A0A0A0", borderTop: "1px solid #F0EDE8", paddingTop: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: grad, flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: "#6B6B6B" }}>{article.author_id?.slice(0, 10) ?? "Author"}</span>
            <span>·</span>
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}</span>
            <span style={{ marginLeft: "auto", background: "#F0EDE8", padding: "1px 7px", borderRadius: 100 }}>⏱ {article.read_time ?? 1}m</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Newsletter Form ──────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"err">("idle");

  const submit = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const r = await fetch(`${API}/newsletter/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setStatus(r.ok ? "done" : "err");
    } catch { setStatus("err"); }
  };

  return (
    <section id="newsletter" style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)", borderRadius: 24, padding: "64px 48px", textAlign: "center", margin: "72px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>Newsletter</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "white", marginBottom: 12, lineHeight: 1.2 }}>Stories in Your Inbox</h2>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, marginBottom: 36, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 36px" }}>
          Every Tuesday — our best articles about life, technology, and the beautiful intersection of both.
        </p>
        {status === "done" ? (
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "16px 32px", display: "inline-block", color: "white", fontSize: 16, fontWeight: 600 }}>
            🎉 Welcome aboard! Check your inbox.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto" }}>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              type="email" placeholder="your@email.com"
              style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", background: "rgba(255,255,255,0.95)" }} />
            <button onClick={submit} disabled={status === "loading"}
              style={{ padding: "14px 24px", borderRadius: 10, background: "#111827", color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14, whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.15s", opacity: status === "loading" ? 0.7 : 1 }}>
              {status === "loading" ? "…" : "Subscribe →"}
            </button>
          </div>
        )}
        {status === "err" && <p style={{ color: "#FCA5A5", marginTop: 10, fontSize: 13 }}>Something went wrong. Please try again.</p>}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 20 }}>
          {["✅ No spam", "📧 Weekly", "🔓 Unsubscribe anytime"].map(t => (
            <span key={t} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const LIFE_CATS = [
  { icon: "🌱", name: "Personal Growth", slug: "personal-growth", desc: "Habits, mindset & clarity" },
  { icon: "💼", name: "Career",           slug: "career",          desc: "Work, growth & leadership" },
  { icon: "☀️", name: "Lifestyle",        slug: "lifestyle",       desc: "Everyday living, elevated" },
  { icon: "❤️", name: "Relationships",    slug: "relationships",   desc: "Love, friendship & family" },
  { icon: "⚡", name: "Productivity",     slug: "productivity",    desc: "Do more, stress less" },
  { icon: "✈️", name: "Travel",           slug: "travel",          desc: "Adventures near & far" },
  { icon: "🔥", name: "Motivation",       slug: "motivation",      desc: "Stories that move you" },
];
const TECH_CATS = [
  { icon: "🤖", name: "AI & ML",          slug: "ai",              desc: "The intelligence revolution" },
  { icon: "⌨️", name: "Programming",      slug: "programming",     desc: "Code that matters" },
  { icon: "🌐", name: "Web Development",  slug: "web-dev",         desc: "Building the modern web" },
  { icon: "📣", name: "Digital Marketing",slug: "marketing",       desc: "Reach, engage, grow" },
  { icon: "🛡️", name: "Cybersecurity",    slug: "cybersecurity",   desc: "Stay safe out there" },
  { icon: "☁️", name: "Cloud Computing",  slug: "cloud",           desc: "Scale without limits" },
  { icon: "📊", name: "Data Science",     slug: "data-science",    desc: "Numbers tell stories" },
];

// ─── Main Homepage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/articles?size=6&status=published`).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${API}/articles/featured`).then(r => r.json()).catch(() => ({})),
    ]).then(([list, feat]) => {
      setArticles(list.items ?? []);
      setTrending(feat?.trending ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SiteNavbar />
      <main style={{ fontFamily: "Lato, sans-serif", maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Hero ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 64, alignItems: "center", padding: "80px 0 64px" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A0A0A0", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "#4F46E5" }} />
              New Articles Every Week
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,5vw,58px)", fontWeight: 700, lineHeight: 1.1, color: "#1A1A1A", marginBottom: 22 }}>
              Stories That{" "}
              <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#4F46E5,#14B8A6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Inspire.</em>
              <br />
              Technology That{" "}
              <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#4F46E5,#14B8A6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Empowers.</em>
            </h1>
            <p style={{ fontSize: 17, color: "#6B6B6B", lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
              Life lessons, career journeys, personal growth stories, AI innovations, technology trends, and practical insights — in one place.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/blog"
                style={{ background: "#4F46E5", color: "white", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(79,70,229,0.35)", transition: "all 0.18s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#3730A3"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                Start Reading →
              </Link>
              <Link href="/blog?group=tech"
                style={{ background: "transparent", color: "#3D3D3D", padding: "13px 24px", borderRadius: 10, fontWeight: 600, fontSize: 15, border: "1.5px solid #E8E4DE", textDecoration: "none", transition: "all 0.18s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#4F46E5"; (e.currentTarget as HTMLElement).style.color = "#4F46E5"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DE"; (e.currentTarget as HTMLElement).style.color = "#3D3D3D"; }}>
                Explore Tech ⚙
              </Link>
            </div>
            <div style={{ display: "flex", gap: 40, marginTop: 48, paddingTop: 32, borderTop: "1px solid #F0EDE8" }}>
              {[["48K+", "Monthly Readers"], ["320+", "Articles"], ["12K+", "Subscribers"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1A1A1A" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div style={{ position: "relative" }}>
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.12)", border: "1px solid #F0EDE8" }}>
              <div style={{ height: 210, background: "linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>🤖</div>
              <div style={{ padding: 22 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#4F46E5", background: "#EEF2FF", padding: "3px 10px", borderRadius: 100 }}>Artificial Intelligence</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginTop: 10, marginBottom: 8, lineHeight: 1.35 }}>How AI Is Reshaping How We Work, Learn & Create</h3>
                <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>A deep dive beyond the hype — into real-world practice.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12, color: "#A0A0A0" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#4F46E5,#14B8A6)" }} />
                  <span>Aryan Joshi · 8 min read</span>
                  <span style={{ marginLeft: "auto" }}>🔥 Editor's Pick</span>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", top: -16, right: -16, background: "white", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span>📈</span><div><div style={{ fontWeight: 700, fontSize: 12, color: "#1A1A1A" }}>Trending</div><div style={{ fontSize: 11, color: "#A0A0A0" }}>42 readers today</div></div>
            </div>
            <div style={{ position: "absolute", bottom: -16, left: -16, background: "white", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 600, color: "#4F46E5", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} /> New this week
            </div>
          </div>
        </section>

        {/* ── Trending ── */}
        {trending.length > 0 && (
          <section style={{ marginBottom: 72 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ flex: 1, height: 1, background: "#E8E4DE" }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>Trending This Week</h2>
              <div style={{ flex: 1, height: 1, background: "#E8E4DE" }} />
            </div>
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
              {trending.slice(0, 5).map((a: any, i: number) => (
                <Link key={a.id ?? i} href={`/blog/${a.slug}`} style={{ textDecoration: "none", flexShrink: 0, width: 240 }}>
                  <div style={{ background: "white", borderRadius: 14, padding: 20, border: "1.5px solid #F0EDE8", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#4F46E5"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(79,70,229,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#F0EDE8"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#E8E4DE", lineHeight: 1, marginBottom: 10 }}>0{i + 1}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#4F46E5", background: "#EEF2FF", padding: "2px 8px", borderRadius: 100, display: "inline-block", marginBottom: 8 }}>
                      {a.category_id ?? "General"}
                    </div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.4 }}>{a.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Latest Articles ── */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A0A0A0", marginBottom: 4 }}>Latest</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1A1A1A" }}>Fresh Off the Press</h2>
            </div>
            <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: "#4F46E5", border: "1.5px solid #4F46E5", padding: "7px 16px", borderRadius: 8, textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#4F46E5"; }}>
              View All →
            </Link>
          </div>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ background: "#F0EDE8", borderRadius: 16, height: 290, animation: "shimmer 1.5s infinite" }} />)}
            </div>
          ) : articles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {articles.map((a: any, i: number) => <ArticleCard key={a.id ?? i} article={a} featured={i === 0} />)}
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 20, padding: 52, textAlign: "center", border: "1px solid #F0EDE8" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✍️</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>No articles yet</h3>
              <p style={{ color: "#A0A0A0", fontSize: 14, marginBottom: 20 }}>Create your first article via the API to see it here.</p>
              <a href="http://localhost:8080/api/docs" target="_blank" rel="noreferrer" style={{ background: "#4F46E5", color: "white", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Open API Docs →</a>
            </div>
          )}
        </section>

        {/* ── Life Categories ── */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "#E8E4DE" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>Life & Personal Stories</h2>
            <div style={{ flex: 1, height: 1, background: "#E8E4DE" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(152px,1fr))", gap: 14 }}>
            {LIFE_CATS.map(c => (
              <Link key={c.slug} href={`/blog?category=${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "white", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1.5px solid #F0EDE8", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#4F46E5"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 6px 18px rgba(79,70,229,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#F0EDE8"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#A0A0A0" }}>{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Tech Categories ── */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "#E8E4DE" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>Technology & Innovation</h2>
            <div style={{ flex: 1, height: 1, background: "#E8E4DE" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(152px,1fr))", gap: 14 }}>
            {TECH_CATS.map(c => (
              <Link key={c.slug} href={`/blog?category=${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "white", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1.5px solid #F0EDE8", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#4F46E5"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 6px 18px rgba(79,70,229,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#F0EDE8"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#A0A0A0" }}>{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <NewsletterForm />

        {/* ── Footer ── */}
      </main>
      <SiteFooter />

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}