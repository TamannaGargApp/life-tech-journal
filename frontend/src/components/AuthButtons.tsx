"use client";
/**
 * Drop-in replacement for the Sign In / Subscribe buttons in any navbar.
 * Shows avatar + dropdown when signed in, Sign In button when not.
 *
 * Usage:
 *   import AuthButtons from "@/components/AuthButtons";
 *   ...
 *   <AuthButtons />
 */
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface User { name:string; email:string; role?:string; avatar?:string; }

export default function AuthButtons() {
  const [user,    setUser]    = useState<User|null>(null);
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(true);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }
    fetch(`${API}/auth/me`, { headers:{ "Authorization":`Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setUser({ name:d.name, email:d.email, role:d.role, avatar:d.avatar }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("access_token");
    setUser(null);
    setOpen(false);
    window.location.href = "/";
  };

  const initials = user ? user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "";

  if (loading) return (
    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
      <div style={{ width:80,height:34,background:"var(--border-light)",borderRadius:8,animation:"shimmer 1.5s infinite" }} />
      <div style={{ width:90,height:34,background:"var(--border-light)",borderRadius:8,animation:"shimmer 1.5s infinite" }} />
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
      <Link href={`/auth/login?from=${encodeURIComponent(typeof window!=="undefined"?window.location.pathname:"/")}`}
        style={{ padding:"7px 16px",fontSize:13,fontWeight:700,border:"1.5px solid var(--border)",borderRadius:8,color:"var(--ink-mid)",textDecoration:"none",transition:"all 0.15s" }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5";(e.currentTarget as HTMLElement).style.color="var(--primary-text)"}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.color="var(--ink-mid)"}}>
        Sign In
      </Link>
      <Link href="/newsletter"
        style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none",transition:"background 0.15s" }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#3730A3"}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#4F46E5"}}>
        Subscribe
      </Link>
    </div>
  );

  return (
    <div style={{ display:"flex",gap:8,flexShrink:0,alignItems:"center" }}>
      <Link href="/newsletter"
        style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none" }}>
        Subscribe
      </Link>

      {/* Avatar + dropdown */}
      <div ref={dropRef} style={{ position:"relative" }}>
        <button onClick={()=>setOpen(o=>!o)}
          style={{ width:38,height:38,borderRadius:"50%",border:"2px solid",cursor:"pointer",padding:0,overflow:"hidden",transition:"border-color 0.15s",background:"none",
            borderColor:open?"#4F46E5":"var(--border)" }}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          ) : (
            <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white" }}>
              {initials}
            </div>
          )}
        </button>

        {open && (
          <div style={{ position:"absolute",top:46,right:0,background:"var(--card)",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",border:"1px solid var(--border-light)",minWidth:220,zIndex:400,overflow:"hidden" }}>
            {/* User info */}
            <div style={{ padding:"14px 16px",borderBottom:"1px solid var(--border-light)",background:"var(--cream)" }}>
              <div style={{ fontWeight:700,fontSize:14,color:"var(--ink)" }}>{user.name}</div>
              <div style={{ fontSize:12,color:"var(--ink-light)",marginTop:2 }}>{user.email}</div>
              {user.role && user.role!=="reader" && (
                <span style={{ display:"inline-block",marginTop:6,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",background:"var(--primary-light)",color:"var(--primary-text)",padding:"2px 8px",borderRadius:100 }}>
                  {user.role}
                </span>
              )}
            </div>

            {/* Menu items */}
            <div style={{ padding:"6px 0" }}>
              {[
                { icon:"📖", label:"Reading List",  href:"/reading-list" },
                { icon:"🔖", label:"Saved Articles", href:"/saved" },
                { icon:"👤", label:"My Profile",     href:"/profile" },
              ].map(item=>(
                <Link key={item.label} href={item.href} onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"var(--ink-mid)",textDecoration:"none",transition:"background 0.1s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--cream)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--card)"}}>
                  <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
                </Link>
              ))}

              {/* Admin link if admin/author */}
              {(user.role==="admin"||user.role==="author") && (
                <Link href="/admin" onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"var(--primary-text)",textDecoration:"none",fontWeight:600,transition:"background 0.1s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--primary-light)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--card)"}}>
                  <span style={{ fontSize:15 }}>⚙️</span>Admin Panel
                </Link>
              )}
            </div>

            <div style={{ borderTop:"1px solid var(--border-light)",padding:"6px 0" }}>
              <button onClick={logout}
                style={{ width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",transition:"background 0.1s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#FEF2F2"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="none"}}>
                <span style={{ fontSize:15 }}>🚪</span>Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}