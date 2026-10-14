"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SiteLogo from "@/components/SiteLogo";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

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
      <div style={{ width:80,height:38,background:"var(--border-light)",borderRadius:999 }} />
      <div style={{ width:100,height:38,background:"var(--primary-light)",borderRadius:999 }} />
    </div>
  );

  if (!user) return (
    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
      <Link className="btn-ghost" href={`/auth/login?from=${encodeURIComponent(typeof window!=="undefined"?window.location.pathname:"/")}`}>
        Sign In
      </Link>
      <Link className="btn-primary" href="/newsletter">Subscribe</Link>
    </div>
  );

  return (
    <div style={{ display:"flex",gap:8,flexShrink:0,alignItems:"center",position:"relative" }}>
      <Link className="btn-primary" href="/newsletter">Subscribe</Link>
      <div style={{ position:"relative" }}>
        <button onClick={()=>setOpen(o=>!o)}
          style={{ width:38,height:38,borderRadius:"50%",border:`2px solid ${open?"#6C63F2":"var(--border)"}`,cursor:"pointer",padding:0,overflow:"hidden",background:"none",transition:"border-color 0.15s" }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#6C63F2,#4D79F6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white" }}>{initials}</div>
          }
        </button>
        {open && (
          <div style={{ position:"absolute",top:46,right:0,background:"var(--card)",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.13)",border:"1px solid var(--border-light)",minWidth:220,zIndex:500,overflow:"hidden" }}
            onMouseLeave={()=>setOpen(false)}>
            <div style={{ padding:"14px 16px",background:"var(--cream)",borderBottom:"1px solid var(--border-light)" }}>
              <div style={{ fontWeight:700,fontSize:14,color:"var(--ink)" }}>{user.name}</div>
              <div style={{ fontSize:12,color:"var(--ink-light)",marginTop:2 }}>{user.email}</div>
              {user.role&&user.role!=="reader"&&(
                <span style={{ display:"inline-block",marginTop:6,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",background:"var(--primary-light)",color:"var(--primary-text)",padding:"2px 8px",borderRadius:100 }}>{user.role}</span>
              )}
            </div>
            <div style={{ padding:"6px 0" }}>
              {[["📖","Reading List","/reading-list"],["🔖","Saved Articles","/saved"],["👤","My Profile","/profile"]].map(([icon,label,href])=>(
                <Link key={label} href={href} onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"var(--ink-mid)",textDecoration:"none" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--cream)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--card)"}}>
                  <span>{icon}</span>{label}
                </Link>
              ))}
              {(user.role==="admin"||user.role==="author")&&(
                <Link href="/admin" onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"var(--primary-text)",textDecoration:"none",fontWeight:600 }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--primary-light)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--card)"}}>
                  <span>⚙️</span>Admin Panel
                </Link>
              )}
            </div>
            <div style={{ borderTop:"1px solid var(--border-light)",padding:"6px 0" }}>
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

export default function SiteNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const menus: Record<string, { group: string; items: { label: string; icon: string; href: string }[] }> = {
    Life: { group: "life", items: [
      { label: "Personal Growth", icon: "🌱", href: "/blog?category=personal-growth" },
      { label: "Career",          icon: "💼", href: "/blog?category=career" },
      { label: "Lifestyle",       icon: "☀️", href: "/blog?category=lifestyle" },
      { label: "Relationships",   icon: "❤️", href: "/blog?category=relationships" },
      { label: "Productivity",    icon: "⚡", href: "/blog?category=productivity" },
      { label: "Travel",          icon: "✈️", href: "/blog?category=travel" },
      { label: "Motivation",      icon: "🔥", href: "/blog?category=motivation" },
      { label: "Musings",         icon: "💭", href: "/blog?category=musings" },
      { label: "Poems",           icon: "🪶", href: "/poems" },
    ]},
    Technology: { group: "tech", items: [
      { label: "Artificial Intelligence", icon: "🤖", href: "/blog?category=ai" },
      { label: "Programming",             icon: "⌨️", href: "/blog?category=programming" },
      { label: "Web Development",         icon: "🌐", href: "/blog?category=web-dev" },
      { label: "Digital Marketing",       icon: "📣", href: "/blog?category=marketing" },
      { label: "Cybersecurity",           icon: "🛡️", href: "/blog?category=cybersecurity" },
      { label: "Cloud Computing",         icon: "☁️", href: "/blog?category=cloud" },
      { label: "Data Science",            icon: "📊", href: "/blog?category=data-science" },
    ]},
  };

  const isActive = (href: string) => href === "/" ? pathname === "/" : !href.includes("?") && !!pathname?.startsWith(href);
  const caret = (
    <svg className="nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
  );

  return (
    <nav className={`site-nav${scrolled ? " is-scrolled" : ""}`} onMouseLeave={() => setActiveMenu(null)}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 72, gap: 24 }}>

          {/* ── Logo — clicking takes you to home ── */}
          <Link href="/" aria-label="Life & Tech Journal home" style={{ textDecoration: "none", flexShrink: 0 }}>
            <SiteLogo height={62} />
          </Link>

          {/* ── Nav links ── */}
          <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
            <div className="nav-track">
              <Link href="/" className={`nav-link${isActive("/") ? " is-active" : ""}`}>Home</Link>

              {Object.entries(menus).map(([key, menu]) => (
                <div key={key} style={{ position: "relative" }} onMouseEnter={() => setActiveMenu(key)}>
                  <Link href={`/blog?group=${menu.group}`} onClick={() => setActiveMenu(null)}
                    className={`nav-link${activeMenu === key ? " is-open" : ""}`}>
                    {key}{caret}
                  </Link>
                  {activeMenu === key && (
                    <div className="nav-dropdown" onMouseLeave={() => setActiveMenu(null)}>
                      {menu.items.map(item => (
                        <Link key={item.label} href={item.href} className="nav-dd-item" onClick={() => setActiveMenu(null)}>
                          <span className="nav-dd-icon" aria-hidden>{item.icon}</span>{item.label}
                        </Link>
                      ))}
                      <Link href={`/blog?group=${menu.group}`} className="nav-dd-all" onClick={() => setActiveMenu(null)}>
                        <span>All {key} articles</span><span aria-hidden>→</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              {[["Blog", "/blog"], ["Musings", "/blog?category=musings"], ["Poems", "/poems"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                <Link key={label} href={href} className={`nav-link${isActive(href) ? " is-active" : ""}`}>{label}</Link>
              ))}
            </div>
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
            <ThemeSwitcher />
            <NavAuthButtons />
          </div>
        </div>
      </div>
    </nav>
  );
}
