"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
      <div style={{ width:72,height:34,background:"var(--border-light)",borderRadius:8 }} />
      <div style={{ width:90,height:34,background:"var(--primary-light)",borderRadius:8 }} />
    </div>
  );

  if (!user) return (
    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
      <Link href={`/auth/login?from=${encodeURIComponent(typeof window!=="undefined"?window.location.pathname:"/")}`}
        style={{ fontSize:13,fontWeight:700,color:"var(--ink-muted)",padding:"7px 14px",borderRadius:8,border:"1.5px solid var(--border)",textDecoration:"none",transition:"all 0.15s" }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5";(e.currentTarget as HTMLElement).style.color="var(--primary-text)"}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.color="var(--ink-muted)"}}>
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
          style={{ width:38,height:38,borderRadius:"50%",border:`2px solid ${open?"#4F46E5":"var(--border)"}`,cursor:"pointer",padding:0,overflow:"hidden",background:"none",transition:"border-color 0.15s" }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white" }}>{initials}</div>
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
      { label: "Musings",     href: "/blog?category=musings" },
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
        background: scrolled ? "var(--nav-bg)" : "var(--cream)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.25s",
      }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: 32 }}>

          {/* ── Logo — clicking takes you to home ── */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0, cursor: "pointer" }}>
            <SiteLogo height={56} />
          </Link>

          {/* ── Nav links ── */}
          <div style={{ display: "flex", flex: 1, justifyContent: "center", gap: 4 }}>

            {/* Home — explicit link */}
            <Link href="/"
              style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap", textTransform: "uppercase", color: "var(--ink-mid)", borderRadius: 8, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--primary-text)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-mid)"; }}>
              Home
            </Link>

            {/* Life + Technology with dropdowns */}
            {Object.keys(menus).map(key => (
              <div key={key} style={{ position: "relative" }}
                onMouseEnter={() => setActiveMenu(key)}>
                <Link
                  href={key === "Life" ? "/blog?group=life" : "/blog?group=tech"}
                  style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap", textTransform: "uppercase", color: activeMenu === key ? "#4F46E5" : "var(--ink-mid)", borderRadius: 8, display: "flex", alignItems: "center", gap: 4, textDecoration: "none", transition: "color 0.15s" }}>
                  {key}
                  <span style={{ fontSize: 9, color: "var(--ink-light)", transform: activeMenu === key ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", display: "inline-block" }}>▼</span>
                </Link>
              </div>
            ))}

            {/* Other nav links */}
            {[["Blog", "/blog"], ["Musings", "/blog?category=musings"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
              <Link key={label} href={href}
                style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap", textTransform: "uppercase", color: "var(--ink-mid)", borderRadius: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--primary-text)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink-mid)"; }}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
            <ThemeSwitcher />
            <NavAuthButtons />
          </div>
        </div>

        {/* Dropdown */}
        {activeMenu && menus[activeMenu] && (
          <div
            style={{ position: "absolute", left: 0, right: 0, background: "var(--card)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "20px 32px", display: "flex", gap: 8, flexWrap: "wrap", zIndex: 300 }}
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}>
            {menus[activeMenu].map(item => (
              <Link key={item.label} href={item.href}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, color: "var(--ink-mid)", border: "1px solid var(--border-light)", background: "var(--cream)", textDecoration: "none", transition: "all 0.15s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--primary-light)"; (e.currentTarget as HTMLElement).style.color = "var(--primary-text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-border)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream)"; (e.currentTarget as HTMLElement).style.color = "var(--ink-mid)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)"; }}
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
