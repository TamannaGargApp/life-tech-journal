"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SiteLogo from "@/components/SiteLogo";

// AI Components — loaded dynamically to avoid SSR issues
const AIExcerptGenerator = dynamic(() => import("@/components/ai/AIExcerptGenerator"), { ssr:false });
const AIDraftGenerator   = dynamic(() => import("@/components/ai/AIDraftGenerator"),   { ssr:false });
const AITagSuggester     = dynamic(() => import("@/components/ai/AITagSuggester"),     { ssr:false });
const AIWritingAssistant = dynamic(() => import("@/components/ai/AIWritingAssistant"), { ssr:false });
const AINewsLetterCurator = dynamic(() => import("@/components/ai/AINewsLetterCurator"), { ssr:false });

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
const ADMIN_PASSWORD  = process.env.NEXT_PUBLIC_ADMIN_UI_PASSWORD ?? "";
const ADMIN_API_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL        ?? "";
const ADMIN_API_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASSWORD      ?? "";

const CATS = [
  { value:"personal-growth", label:"Personal Growth", group:"Life" },
  { value:"career",          label:"Career",           group:"Life" },
  { value:"lifestyle",       label:"Lifestyle",        group:"Life" },
  { value:"relationships",   label:"Relationships",    group:"Life" },
  { value:"productivity",    label:"Productivity",     group:"Life" },
  { value:"travel",          label:"Travel",           group:"Life" },
  { value:"motivation",      label:"Motivation",       group:"Life" },
  { value:"musings",     label:"Musings",      group:"Life" },
  { value:"ai",              label:"AI & ML",          group:"Technology" },
  { value:"programming",     label:"Programming",      group:"Technology" },
  { value:"web-dev",         label:"Web Development",  group:"Technology" },
  { value:"marketing",       label:"Digital Marketing",group:"Technology" },
  { value:"cybersecurity",   label:"Cybersecurity",    group:"Technology" },
  { value:"cloud",           label:"Cloud Computing",  group:"Technology" },
  { value:"data-science",    label:"Data Science",     group:"Technology" },
];

const CAT_GRAD: Record<string,string> = {
  "personal-growth":"linear-gradient(135deg,#022C22,#065F46,#10B981)",
  career:"linear-gradient(135deg,#500724,#9D174D,#F472B6)",
  lifestyle:"linear-gradient(135deg,#450A0A,#991B1B,#F87171)",
  relationships:"linear-gradient(135deg,#500724,#BE123C,#FDA4AF)",
  productivity:"linear-gradient(135deg,#1E3A5F,#0369A1,#38BDF8)",
  travel:"linear-gradient(135deg,#1E1B4B,#3730A3,#818CF8)",
  motivation:"linear-gradient(135deg,#451A03,#B45309,#FCD34D)",
  "musings":"linear-gradient(135deg,#4A044E,#A21CAF,#F0ABFC)",
  ai:"linear-gradient(135deg,#1e1b4b,#312e81,#14B8A6)",
  programming:"linear-gradient(135deg,#451A03,#92400E,#F59E0B)",
  "web-dev":"linear-gradient(135deg,#134E4A,#0F766E,#14B8A6)",
  marketing:"linear-gradient(135deg,#2D1B69,#7C3AED,#C4B5FD)",
  cybersecurity:"linear-gradient(135deg,#0F172A,#1E293B,#475569)",
  cloud:"linear-gradient(135deg,#0C4A6E,#0369A1,#7DD3FC)",
  "data-science":"linear-gradient(135deg,#1E3A5F,#1D4ED8,#60A5FA)",
  default:"linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};

type View = "dashboard"|"articles"|"editor"|"seo"|"analytics"|"newsletter"|"settings";
interface Article {
  id:string; title:string; slug:string; excerpt:string; content:string;
  category_id:string; status:string; views:number; likes:number;
  bookmarks:number; read_time:number; featured:boolean; editors_pick:boolean;
  published_at:string|null; created_at:string; featured_image?:string;
  meta_title?:string; meta_description?:string; keywords?:string[];
}

// ── Admin Login ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin:(token:string)=>void }) {
  const [mode,    setMode]    = useState<"password"|"account">("password");
  const [pw,      setPw]      = useState("");
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const handlePassword = async () => {
    if (!ADMIN_PASSWORD) { setErr("Admin password is not configured in frontend/.env"); return; }
    if (pw !== ADMIN_PASSWORD) { setErr("Incorrect admin password"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include", body:JSON.stringify({ email:ADMIN_API_EMAIL, password:ADMIN_API_PASS }) });
      if (res.ok) { const d = await res.json(); sessionStorage.setItem("access_token", d.access_token); }
    } catch {}
    sessionStorage.setItem("admin_local","true");
    setLoading(false);
    onLogin("local");
  };

  const handleAccount = async () => {
    if (!email||!pass) { setErr("Fill in all fields"); return; }
    setLoading(true); setErr("");
    try {
      const res  = await fetch(`${API}/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include", body:JSON.stringify({ email, password:pass }) });
      const data = await res.json();
      if (!res.ok) { setErr(data.detail??"Login failed"); setLoading(false); return; }
      sessionStorage.setItem("access_token", data.access_token);
      onLogin(data.access_token);
    } catch { setErr(`Cannot connect to backend at ${API}`); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Lato,sans-serif" }}>
      <div style={{ width:380,background:"#1e293b",borderRadius:20,padding:36,border:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:8 }}><SiteLogo height={96} variant="dark" /></div>
          <div style={{ fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)" }}>Admin Panel</div>
        </div>
        <div style={{ display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:10,padding:3,marginBottom:24 }}>
          {[["password","🔑 Quick Access"],["account","👤 Account"]].map(([m,label])=>(
            <button key={m} onClick={()=>{setMode(m as any);setErr("");}}
              style={{ flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,transition:"all 0.15s",
                background:mode===m?"#6366f1":"transparent",color:mode===m?"white":"rgba(255,255,255,0.4)" }}>
              {label}
            </button>
          ))}
        </div>
        {mode==="password" ? (
          <>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:12,lineHeight:1.6 }}>Enter the admin password to access the dashboard.</p>
            <label style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.4)",display:"block",marginBottom:6 }}>Admin Password</label>
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handlePassword()} placeholder="Enter admin password"
              style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:6 }} />
            <p style={{ fontSize:11,color:"rgba(255,255,255,0.2)",marginBottom:14 }}>Configured from <code style={{ color:"#818CF8" }}>frontend/.env</code></p>
            {err && <div style={{ background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#fca5a5",marginBottom:12 }}>⚠ {err}</div>}
            <button onClick={handlePassword} disabled={loading}
              style={{ width:"100%",padding:"12px",background:"#6366f1",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
              {loading?"Signing in…":"Enter Admin Panel →"}
            </button>
          </>
        ) : (
          <>
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:12 }}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:14,outline:"none",fontFamily:"inherit" }} />
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAccount()} placeholder="••••••••"
                style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:14,outline:"none",fontFamily:"inherit" }} />
            </div>
            {err && <div style={{ background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"8px 12px",fontSize:13,color:"#fca5a5",marginBottom:12 }}>⚠ {err}</div>}
            <button onClick={handleAccount} disabled={loading}
              style={{ width:"100%",padding:"12px",background:"#6366f1",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
              {loading?"Signing in…":"Sign In →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ view, setView, counts, onLogout }: { view:View; setView:(v:View)=>void; counts:Record<string,number>; onLogout:()=>void }) {
  const items = [
    { id:"dashboard",   icon:"📊", label:"Dashboard" },
    { id:"articles",    icon:"📝", label:"Articles", badge:counts.total },
    { id:"editor",      icon:"✏️",  label:"New Article" },
    { id:"seo",         icon:"🔍", label:"SEO Manager" },
    { id:"analytics",   icon:"📈", label:"Analytics" },
    { id:"newsletter",  icon:"📬", label:"Newsletter AI" },
    { id:"settings",    icon:"⚙️",  label:"Settings" },
  ];
  return (
    <aside style={{ width:220,background:"#0f172a",minHeight:"100vh",display:"flex",flexDirection:"column",flexShrink:0,position:"fixed",top:0,left:0,bottom:0,zIndex:100 }}>
      <div style={{ padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <SiteLogo height={64} variant="dark" />
        <div style={{ fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginTop:3 }}>CMS Dashboard</div>
      </div>
      <nav style={{ flex:1,padding:"10px 10px" }}>
        {items.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id as View)}
            style={{ width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13,fontWeight:600,marginBottom:2,transition:"all 0.13s",
              background:view===item.id?"rgba(99,102,241,0.25)":"transparent",
              color:view===item.id?"#818CF8":"rgba(255,255,255,0.5)" }}
            onMouseEnter={e=>{if(view!==item.id)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.05)"}}
            onMouseLeave={e=>{if(view!==item.id)(e.currentTarget as HTMLElement).style.background="transparent"}}>
            <div style={{ display:"flex",alignItems:"center",gap:9 }}><span style={{ fontSize:15 }}>{item.icon}</span>{item.label}</div>
            {(item as any).badge>0&&<span style={{ background:"rgba(99,102,241,0.3)",color:"#818CF8",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:100 }}>{(item as any).badge}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" target="_blank" style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"none",padding:"7px 10px",borderRadius:8,marginBottom:4 }}>🌐 View Site</Link>
        <button onClick={onLogout} style={{ width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:"rgba(255,255,255,0.3)",background:"transparent" }}>🚪 Sign Out</button>
      </div>
    </aside>
  );
}

function StatCard({ icon, value, label, color, sub }: { icon:string; value:string|number; label:string; color:string; sub?:string }) {
  return (
    <div style={{ background:"var(--card)",borderRadius:14,padding:"22px 20px",border:"1px solid var(--border-light)",boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ width:40,height:40,borderRadius:10,background:`${color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:12 }}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"var(--ink)" }}>{value}</div>
      <div style={{ fontSize:12,color:"var(--ink-light)",marginTop:3,textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</div>
      {sub&&<div style={{ fontSize:12,color,marginTop:6,fontWeight:600 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ articles, onNew }: { articles:Article[]; onNew:()=>void }) {
  const published=articles.filter(a=>a.status==="published").length;
  const views=articles.reduce((s,a)=>s+a.views,0);
  const likes=articles.reduce((s,a)=>s+a.likes,0);
  const drafts=articles.filter(a=>a.status==="draft").length;
  const recent=[...articles].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,6);
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)" }}>Dashboard</h1>
          <p style={{ color:"var(--ink-light)",fontSize:13,marginTop:3 }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <button onClick={onNew} style={{ background:"#6366f1",color:"white",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(99,102,241,0.3)" }}>+ New Article</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
        <StatCard icon="📝" value={articles.length} label="Total Articles" color="#6366f1" sub={`${published} published`} />
        <StatCard icon="👁️" value={views.toLocaleString()} label="Total Views" color="#14b8a6" />
        <StatCard icon="❤️" value={likes.toLocaleString()} label="Total Likes" color="#f43f5e" />
        <StatCard icon="📋" value={drafts} label="Drafts" color="#f59e0b" />
      </div>
      {articles.length===0?(
        <div style={{ background:"var(--card)",borderRadius:14,padding:56,textAlign:"center",border:"2px dashed var(--border)" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>✍️</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>No articles yet</h3>
          <p style={{ color:"var(--ink-light)",marginBottom:24,fontSize:14 }}>Create your first article to get started.</p>
          <button onClick={onNew} style={{ background:"#6366f1",color:"white",border:"none",borderRadius:10,padding:"12px 28px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>Write Your First Article →</button>
        </div>
      ):(
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
          <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
            <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--border-light)",fontWeight:700,fontSize:14,color:"var(--ink)" }}>Recent Articles</div>
            {recent.map(a=>(
              <div key={a.id} style={{ padding:"12px 20px",borderBottom:"1px solid var(--border-light)",display:"flex",alignItems:"center",gap:10 }}>
                {a.featured_image
                  ? <img src={a.featured_image} alt="" style={{ width:36,height:36,borderRadius:6,objectFit:"cover",flexShrink:0 }} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                  : <div style={{ width:36,height:36,borderRadius:6,background:CAT_GRAD[a.category_id]??CAT_GRAD.default,flexShrink:0 }} />
                }
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:"var(--ink)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize:11,color:"var(--ink-light)",marginTop:1 }}>{CATS.find(c=>c.value===a.category_id)?.label}</div>
                </div>
                <span style={{ fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,flexShrink:0,
                  background:a.status==="published"?"#d1fae5":a.status==="draft"?"#fef3c7":"var(--border-light)",
                  color:a.status==="published"?"#065f46":a.status==="draft"?"#92400e":"var(--ink-muted)" }}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
          <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
            <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--border-light)",fontWeight:700,fontSize:14,color:"var(--ink)" }}>Top Performing</div>
            {[...articles].sort((a,b)=>b.views-a.views).slice(0,6).map((a,i)=>(
              <div key={a.id} style={{ padding:"12px 20px",borderBottom:"1px solid var(--border-light)",display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",background:i<2?"#6366f1":"var(--border-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<2?"white":"var(--ink-muted)",flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:"var(--ink)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{a.title}</div>
                </div>
                <span style={{ fontSize:12,color:"#6366f1",fontWeight:700 }}>👁 {a.views}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArticlesList({ articles, onEdit, onDelete, onNew }: { articles:Article[]; onEdit:(a:Article)=>void; onDelete:(id:string)=>void; onNew:()=>void }) {
  const [filter,setFilter]=useState("");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("newest");
  let list=filter?articles.filter(a=>a.status===filter):articles;
  if(search)list=list.filter(a=>a.title.toLowerCase().includes(search.toLowerCase()));
  list=[...list].sort((a,b)=>sort==="newest"?new Date(b.created_at).getTime()-new Date(a.created_at).getTime():sort==="views"?b.views-a.views:a.title.localeCompare(b.title));
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)" }}>Articles</h1>
          <p style={{ color:"var(--ink-light)",fontSize:13,marginTop:3 }}>{articles.length} total</p>
        </div>
        <button onClick={onNew} style={{ background:"#6366f1",color:"white",border:"none",borderRadius:10,padding:"9px 20px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>+ New Article</button>
      </div>
      <div style={{ background:"var(--card)",borderRadius:12,padding:"12px 14px",border:"1px solid var(--border-light)",marginBottom:14,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search…"
          style={{ flex:1,minWidth:180,padding:"8px 12px",borderRadius:8,border:"1.5px solid var(--border)",outline:"none",fontSize:13,fontFamily:"inherit" }} />
        <div style={{ display:"flex",gap:5 }}>
          {["","published","draft","archived"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              style={{ padding:"6px 12px",borderRadius:100,fontSize:12,fontWeight:600,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",
                borderColor:filter===s?"#6366f1":"var(--border)",background:filter===s?"#6366f1":"var(--card)",color:filter===s?"white":"var(--ink-muted)" }}>
              {s||"All"}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:"7px 10px",borderRadius:8,border:"1.5px solid var(--border)",fontSize:12,color:"var(--ink-mid)",background:"var(--card)",outline:"none",fontFamily:"inherit" }}>
          <option value="newest">Newest</option><option value="views">Most Viewed</option><option value="title">A–Z</option>
        </select>
      </div>
      <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"48px 1fr 130px 90px 60px 60px 100px",gap:10,padding:"10px 16px",background:"var(--surface-2)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",borderBottom:"1px solid var(--border-light)" }}>
          <span>Img</span><span>Title</span><span>Category</span><span>Status</span><span>Views</span><span>Likes</span><span>Actions</span>
        </div>
        {list.length===0?(
          <div style={{ padding:40,textAlign:"center",color:"var(--ink-light)",fontSize:14 }}>No articles found</div>
        ):list.map(a=>(
          <div key={a.id} style={{ display:"grid",gridTemplateColumns:"48px 1fr 130px 90px 60px 60px 100px",gap:10,padding:"10px 16px",borderBottom:"1px solid var(--border-light)",alignItems:"center" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--surface-2)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--card)"}}>
            {a.featured_image
              ? <img src={a.featured_image} alt="" style={{ width:36,height:36,borderRadius:6,objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
              : <div style={{ width:36,height:36,borderRadius:6,background:CAT_GRAD[a.category_id]??CAT_GRAD.default,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>📝</div>
            }
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13,fontWeight:600,color:"var(--ink)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{a.title}</div>
              <div style={{ fontSize:11,color:"var(--ink-light)",marginTop:1 }}>/{a.slug}</div>
            </div>
            <span style={{ fontSize:12,color:"var(--ink-muted)" }}>{CATS.find(c=>c.value===a.category_id)?.label||a.category_id}</span>
            <span style={{ fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:100,
              background:a.status==="published"?"#d1fae5":a.status==="draft"?"#fef3c7":"var(--border-light)",
              color:a.status==="published"?"#065f46":a.status==="draft"?"#92400e":"var(--ink-muted)" }}>
              {a.status}
            </span>
            <span style={{ fontSize:12,color:"#6366f1",fontWeight:600 }}>{a.views}</span>
            <span style={{ fontSize:12,color:"#f43f5e",fontWeight:600 }}>{a.likes}</span>
            <div style={{ display:"flex",gap:4 }}>
              <button onClick={()=>onEdit(a)} style={{ padding:"4px 10px",background:"var(--primary-light)",color:"#3b82f6",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Edit</button>
              <button onClick={()=>{ if(confirm(`Delete "${a.title}"?`)) onDelete(a.id); }}
                style={{ padding:"4px 10px",background:"#fef2f2",color:"#ef4444",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Image Upload Panel ────────────────────────────────────────────────────────
function ImagePanel({ onInsert, onSetBanner, bannerUrl }: { onInsert:(url:string)=>void; onSetBanner:(url:string)=>void; bannerUrl:string }) {
  const [tab, setTab]         = useState<"banner"|"content">("banner");
  const [urlInput, setUrlInput] = useState("");
  const [altText, setAltText]   = useState("");
  const [recent, setRecent]     = useState<string[]>([]);

  const addBanner = () => {
    if (!urlInput.trim()) return;
    onSetBanner(urlInput.trim());
    setRecent(p => [urlInput.trim(), ...p.filter(u=>u!==urlInput.trim())].slice(0,6));
    setUrlInput("");
  };

  const addContent = (template: (u:string,a:string)=>string) => {
    if (!urlInput.trim()) { alert("Enter an image URL first"); return; }
    onInsert(template(urlInput.trim(), altText||"image"));
    setRecent(p => [urlInput.trim(), ...p.filter(u=>u!==urlInput.trim())].slice(0,6));
    setUrlInput("");
    setAltText("");
  };

  const inp: React.CSSProperties = { width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid var(--border)",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--ink)" };

  return (
    <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
      {/* Header with tabs */}
      <div style={{ padding:"12px 18px",borderBottom:"1px solid var(--border-light)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ fontWeight:700,fontSize:14,color:"var(--ink)",display:"flex",alignItems:"center",gap:8 }}>🖼️ Images</div>
        <div style={{ display:"flex",gap:3,background:"var(--surface-2)",borderRadius:8,padding:3 }}>
          {[["banner","🏔️ Banner"],["content","📷 In-Content"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              style={{ padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,transition:"all 0.15s",
                background:tab===t?"#6366f1":"transparent",color:tab===t?"white":"var(--ink-muted)" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:16 }}>
        {tab==="banner" ? (
          <div>
            {/* Banner preview */}
            {bannerUrl && (
              <div style={{ marginBottom:12,position:"relative",borderRadius:10,overflow:"hidden" }}>
                <img src={bannerUrl} alt="Banner" style={{ width:"100%",height:100,objectFit:"cover" }}
                  onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                <button onClick={()=>onSetBanner("")}
                  style={{ position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.6)",color:"white",border:"none",borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>✕</button>
                <div style={{ position:"absolute",bottom:6,left:8,fontSize:11,fontWeight:700,color:"white",background:"rgba(0,0,0,0.5)",padding:"2px 8px",borderRadius:5 }}>✅ Banner set</div>
              </div>
            )}
            <p style={{ fontSize:12,color:"var(--ink-light)",marginBottom:10,lineHeight:1.5 }}>Hero image shown at the top of your article. Recommended: 1200×630px.</p>
            <div style={{ display:"flex",gap:6 }}>
              <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addBanner()}
                placeholder="https://images.unsplash.com/…"
                style={{ ...inp,flex:1 }} />
              <button onClick={addBanner}
                style={{ padding:"9px 14px",background:"#6366f1",color:"white",border:"none",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>
                Set
              </button>
            </div>
            <p style={{ fontSize:11,color:"var(--ink-light)",marginTop:8 }}>
              Free: <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color:"#6366f1" }}>Unsplash</a> · <a href="https://pexels.com" target="_blank" rel="noreferrer" style={{ color:"#6366f1" }}>Pexels</a>
            </p>
            {recent.length>0&&(
              <div style={{ marginTop:10 }}>
                <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:6 }}>Recent</div>
                <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                  {recent.map((u,i)=>(
                    <img key={i} src={u} alt="" onClick={()=>setUrlInput(u)}
                      style={{ width:48,height:48,objectFit:"cover",borderRadius:6,cursor:"pointer",border:"1.5px solid var(--border)" }}
                      onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontSize:12,color:"var(--ink-light)",marginBottom:10,lineHeight:1.5 }}>Insert images into your article content. Images are inserted at cursor position.</p>
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",display:"block",marginBottom:4 }}>Image URL</label>
              <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addContent((u,a)=>`<img src="${u}" alt="${a}" style="width:100%;border-radius:12px;margin:1.5rem 0">`)}
                placeholder="https://…/image.jpg" style={inp} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",display:"block",marginBottom:4 }}>Alt Text / Caption</label>
              <input value={altText} onChange={e=>setAltText(e.target.value)} placeholder="Describe the image…" style={inp} />
            </div>
            {/* Layout buttons */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10 }}>
              {[
                ["Full Width",    (u:string,a:string)=>`<img src="${u}" alt="${a}" style="width:100%;border-radius:12px;margin:1.5rem 0">`],
                ["With Caption",  (u:string,a:string)=>`<figure style="margin:2rem 0"><img src="${u}" alt="${a}" style="width:100%;border-radius:12px"><figcaption style="text-align:center;font-size:13px;color:var(--ink-light);margin-top:8px;font-style:italic">${a}</figcaption></figure>`],
                ["Half Width",    (u:string,a:string)=>`<img src="${u}" alt="${a}" style="width:50%;border-radius:10px;margin:1rem auto;display:block">`],
                ["Float Right",   (u:string,a:string)=>`<img src="${u}" alt="${a}" style="width:40%;border-radius:10px;float:right;margin:0 0 1rem 1.5rem;clear:right">`],
              ].map(([label, fn])=>(
                <button key={label as string} onClick={()=>addContent(fn as any)}
                  style={{ padding:"7px 8px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",color:"var(--ink-mid)",fontFamily:"inherit",transition:"all 0.1s",textAlign:"center" }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="var(--primary-light)";el.style.borderColor="#6366f1";el.style.color="#6366f1"}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="var(--surface-2)";el.style.borderColor="var(--border)";el.style.color="var(--ink-mid)"}}>
                  {label as string}
                </button>
              ))}
            </div>
            {/* Quick insert */}
            <button onClick={()=>addContent((u,a)=>`<img src="${u}" alt="${a}" style="width:100%;border-radius:12px;margin:1.5rem 0">`)}
              style={{ width:"100%",padding:"9px",background:"var(--primary-light)",color:"#6366f1",border:"1.5px solid #c7d2fe",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              + Insert Full Width
            </button>
            {recent.length>0&&(
              <div style={{ marginTop:10 }}>
                <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:6 }}>Recent — click to reuse</div>
                <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                  {recent.map((u,i)=>(
                    <img key={i} src={u} alt="" onClick={()=>setUrlInput(u)}
                      style={{ width:48,height:48,objectFit:"cover",borderRadius:6,cursor:"pointer",border:"1.5px solid var(--border)" }}
                      onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                  ))}
                </div>
              </div>
            )}
            <p style={{ fontSize:11,color:"var(--ink-light)",marginTop:10 }}>
              Free: <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color:"#6366f1" }}>Unsplash</a> · <a href="https://pexels.com" target="_blank" rel="noreferrer" style={{ color:"#6366f1" }}>Pexels</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Article Editor ────────────────────────────────────────────────────────────
function ArticleEditor({ existing, onSave, onCancel }: { existing?:Article|null; onSave:()=>void; onCancel:()=>void }) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving]   = useState(false);
  const [msg,    setMsg]      = useState({ type:"",text:"" });
  const [tab,    setTab]      = useState<"content"|"seo"|"settings">("content");
  const [form,   setForm]     = useState({
    title:           existing?.title            || "",
    slug:            existing?.slug             || "",
    excerpt:         existing?.excerpt          || "",
    content:         existing?.content          || "",
    category_id:     existing?.category_id      || "ai",
    status:          existing?.status           || "draft",
    featured:        existing?.featured         || false,
    editors_pick:    existing?.editors_pick     || false,
    meta_title:      existing?.meta_title       || "",
    meta_description:existing?.meta_description || "",
    keywords:        (existing?.keywords||[]).join(", "),
    featured_image:  existing?.featured_image   || "",
  });

  const autoSlug = (t:string) => t.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").slice(0,80);
  const set      = (k:string,v:any) => setForm(f=>({...f,[k]:v}));

  // Insert image HTML at cursor in content textarea
  const insertImageHtml = (html: string) => {
    const ta = contentRef.current;
    if (!ta) { set("content", form.content + "\n\n" + html); return; }
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const before = form.content.substring(0, start);
    const after  = form.content.substring(end);
    const newContent = before + "\n\n" + html + "\n\n" + after;
    set("content", newContent);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start+html.length+4, start+html.length+4); }, 50);
  };

  const handleSave = async (publish=false) => {
    if (!form.title.trim()) { setMsg({type:"err",text:"Title is required"}); return; }
    if (!form.excerpt.trim()) { setMsg({type:"err",text:"Excerpt is required"}); return; }
    if (!form.content.trim()) { setMsg({type:"err",text:"Content is required"}); return; }
    const token = sessionStorage.getItem("access_token")||"";
    if (!token) { setMsg({type:"err",text:"Not authenticated. Sign in first."}); return; }
    setSaving(true); setMsg({type:"",text:""});
    const payload = { ...form, slug:form.slug||autoSlug(form.title), status:publish?"published":form.status, tag_ids:[], keywords:form.keywords.split(",").map((k:string)=>k.trim()).filter(Boolean) };
    try {
      const url    = existing?`${API}/articles/${existing.id}`:`${API}/articles`;
      const method = existing?"PUT":"POST";
      const res    = await fetch(url,{ method,headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(payload) });
      const data   = await res.json();
      if (!res.ok) { setMsg({type:"err",text:data.detail??"Failed to save"}); setSaving(false); return; }
      setMsg({type:"ok",text:publish?"Published! 🎉":"Saved!"});
      setTimeout(onSave,900);
    } catch { setMsg({type:"err",text:"Network error"}); }
    setSaving(false);
  };

  const inp: React.CSSProperties = { width:"100%",padding:"10px 13px",borderRadius:9,border:"1.5px solid var(--border)",outline:"none",fontSize:14,fontFamily:"inherit",color:"var(--ink)",background:"var(--card)" };
  const lbl: React.CSSProperties = { fontSize:11,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em" };

  const insertSnippet = (s:string) => {
    const ta = contentRef.current;
    if (!ta) { set("content",form.content+(form.content?"\n\n":"")+s); return; }
    const start=ta.selectionStart, end=ta.selectionEnd;
    set("content",form.content.substring(0,start)+(form.content?"\n\n":"")+s+form.content.substring(end));
  };

  const grad = CAT_GRAD[form.category_id] ?? CAT_GRAD.default;

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:20 }}>
        <button onClick={onCancel} style={{ background:"var(--surface-3)",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>←</button>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"var(--ink)",flex:1 }}>{existing?"Edit Article":"New Article"}</h1>

        {/* AI Toolbar */}
        <div style={{ display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" }}>
          <AIDraftGenerator onApply={(draft)=>set("content",draft)} />
          <AIExcerptGenerator
            title={form.title}
            content={form.content}
            onApply={(d)=>{ set("excerpt",d.excerpt); set("meta_title",d.meta_title); set("meta_description",d.meta_description); set("keywords",d.keywords); }} />
          <AITagSuggester
            title={form.title}
            content={form.content}
            onApply={(d)=>{ set("category_id",d.category); set("keywords",d.keywords); }} />
          <AIWritingAssistant
            content={form.content}
            onApply={(c)=>set("content",c)} />
        </div>

        {msg.text&&<div style={{ padding:"7px 14px",borderRadius:8,fontSize:13,fontWeight:600,background:msg.type==="ok"?"#d1fae5":"#fef2f2",color:msg.type==="ok"?"#065f46":"#ef4444" }}>{msg.type==="ok"?"✅":"⚠"} {msg.text}</div>}
        <button onClick={()=>handleSave(false)} disabled={saving} style={{ padding:"8px 16px",background:"var(--surface-3)",color:"var(--ink-mid)",border:"none",borderRadius:9,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>💾 Draft</button>
        <button onClick={()=>handleSave(true)}  disabled={saving} style={{ padding:"8px 16px",background:"#6366f1",color:"white",border:"none",borderRadius:9,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(99,102,241,0.3)" }}>{saving?"Saving…":"🚀 Publish"}</button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:2,background:"var(--card)",borderRadius:10,padding:4,border:"1px solid var(--border-light)",marginBottom:18,width:"fit-content" }}>
        {(["content","seo","settings"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:"6px 16px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize",transition:"all 0.15s",
              background:tab===t?"#6366f1":"transparent",color:tab===t?"white":"var(--ink-muted)" }}>
            {t==="content"?"📝 Content":t==="seo"?"🔍 SEO":"⚙️ Settings"}
          </button>
        ))}
      </div>

      {/* 2-column grid: main | sidebar */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 260px",gap:20 }}>

        {/* Main */}
        <div>
          {tab==="content"&&(
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              {/* Banner preview */}
              {form.featured_image&&(
                <div style={{ borderRadius:14,overflow:"hidden",height:160,position:"relative" }}>
                  <img src={form.featured_image} alt="Banner" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                  <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent,rgba(0,0,0,0.4))" }} />
                  <div style={{ position:"absolute",bottom:10,left:14,fontSize:11,fontWeight:700,color:"white",background:"rgba(0,0,0,0.4)",padding:"3px 8px",borderRadius:6 }}>🏔️ Banner Image</div>
                </div>
              )}

              <div style={{ background:"var(--card)",borderRadius:14,padding:20,border:"1px solid var(--border-light)" }}>
                <div style={{ marginBottom:14 }}>
                  <label style={lbl}>Title *</label>
                  <input value={form.title} onChange={e=>{ set("title",e.target.value); if(!existing)set("slug",autoSlug(e.target.value)); }}
                    placeholder="Write a compelling, SEO-friendly title…"
                    style={{ ...inp,fontSize:19,fontFamily:"'Playfair Display',serif",fontWeight:700,padding:"12px 14px" }} />
                  <div style={{ fontSize:11,color:"var(--ink-light)",marginTop:3 }}>{form.title.length}/200</div>
                </div>
                <div>
                  <label style={lbl}>URL Slug</label>
                  <div style={{ display:"flex",background:"var(--surface-2)",border:"1.5px solid var(--border)",borderRadius:9,overflow:"hidden" }}>
                    <span style={{ padding:"10px 12px",color:"var(--ink-light)",fontSize:13,borderRight:"1px solid var(--border)",background:"var(--surface-3)",whiteSpace:"nowrap" }}>/blog/</span>
                    <input value={form.slug} onChange={e=>set("slug",e.target.value)} style={{ flex:1,border:"none",outline:"none",padding:"10px 12px",fontSize:13,fontFamily:"inherit",color:"var(--ink-mid)",background:"transparent" }} />
                    <button onClick={()=>set("slug",autoSlug(form.title))} style={{ padding:"8px 12px",background:"none",border:"none",color:"#6366f1",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",borderLeft:"1px solid var(--border)" }}>Auto</button>
                  </div>
                </div>
              </div>

              <div style={{ background:"var(--card)",borderRadius:14,padding:20,border:"1px solid var(--border-light)" }}>
                <label style={lbl}>Excerpt * <span style={{ color:"var(--ink-light)",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(shown on article cards)</span></label>
                <textarea value={form.excerpt} onChange={e=>set("excerpt",e.target.value)} rows={3}
                  placeholder="A compelling 1-2 sentence summary…"
                  style={{ ...inp,resize:"vertical",lineHeight:1.65 }} />
                <div style={{ fontSize:11,color:form.excerpt.length>400?"#ef4444":"#94a3b8",textAlign:"right",marginTop:3 }}>{form.excerpt.length}/400</div>
              </div>

              {/* ── Images ── */}
              <ImagePanel
                bannerUrl={form.featured_image}
                onSetBanner={(url)=>set("featured_image",url)}
                onInsert={insertImageHtml}
              />

              <div style={{ background:"var(--card)",borderRadius:14,padding:20,border:"1px solid var(--border-light)" }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
                  <label style={lbl}>Content * <span style={{ color:"var(--ink-light)",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(HTML)</span></label>
                  <span style={{ fontSize:11,color:"var(--ink-light)" }}>~{Math.max(1,Math.ceil(form.content.split(/\s+/).filter(Boolean).length/200))} min read</span>
                </div>
                {/* Toolbar */}
                <div style={{ display:"flex",gap:4,marginBottom:8,flexWrap:"wrap" }}>
                  {[["H2","<h2>Section Heading</h2>"],["H3","<h3>Sub-heading</h3>"],["Para","<p>Your paragraph text here.</p>"],["Bold","<strong>bold</strong>"],["Italic","<em>italic</em>"],["Link",'<a href="URL">link text</a>'],["List","<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>"],["Quote","<blockquote>Your quote here.</blockquote>"],["Code","<code>inline code</code>"],["Block","<pre><code>// code block\nconst x = 1;</code></pre>"],["HR","<hr>"]].map(([l,s])=>(
                    <button key={l} type="button" onClick={()=>insertSnippet(s)}
                      style={{ padding:"3px 9px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer",color:"var(--ink-mid)",fontFamily:"inherit",transition:"all 0.1s" }}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="var(--primary-light)";el.style.borderColor="#6366f1";el.style.color="#6366f1"}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="var(--surface-2)";el.style.borderColor="var(--border)";el.style.color="var(--ink-mid)"}}>
                      {l}
                    </button>
                  ))}
                </div>
                <textarea ref={contentRef} value={form.content} onChange={e=>set("content",e.target.value)} rows={22}
                  placeholder={"<h2>Introduction</h2>\n<p>Start writing here…</p>"}
                  style={{ ...inp,resize:"vertical",lineHeight:1.75,fontFamily:"'Courier New',monospace",fontSize:13 }} />
                {form.content&&(
                  <details style={{ marginTop:10 }}>
                    <summary style={{ fontSize:12,color:"#6366f1",cursor:"pointer",fontWeight:600 }}>👁 Preview</summary>
                    <div style={{ marginTop:10,padding:18,background:"var(--surface-2)",borderRadius:10,border:"1px solid var(--border)",fontSize:14,lineHeight:1.75,color:"var(--ink-mid)" }}
                      dangerouslySetInnerHTML={{ __html:form.content }} />
                  </details>
                )}
              </div>
            </div>
          )}

          {tab==="seo"&&(
            <div style={{ background:"var(--card)",borderRadius:14,padding:24,border:"1px solid var(--border-light)",display:"flex",flexDirection:"column",gap:18 }}>
              <div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--ink)",marginBottom:4 }}>🔍 SEO Settings</h3>
                <p style={{ fontSize:13,color:"var(--ink-light)" }}>Optimise how this article appears in Google.</p>
              </div>
              <div style={{ background:"var(--surface-2)",borderRadius:10,padding:16,border:"1px solid var(--border)" }}>
                <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:10 }}>Google Preview</div>
                <div style={{ fontSize:17,color:"#1a0dab",fontWeight:500,marginBottom:2 }}>{form.meta_title||form.title||"Article Title"}</div>
                <div style={{ fontSize:13,color:"#006621",marginBottom:4 }}>lifetechjournal.com › blog › {form.slug||"slug"}</div>
                <div style={{ fontSize:13,color:"#545454",lineHeight:1.5 }}>{form.meta_description||form.excerpt||"Description…"}</div>
              </div>
              <div>
                <label style={lbl}>Meta Title <span style={{ color:"var(--ink-light)",fontWeight:400,textTransform:"none" }}>(50–60 chars ideal)</span></label>
                <input value={form.meta_title} onChange={e=>set("meta_title",e.target.value)} placeholder={form.title||"SEO title…"} style={{ ...inp,borderColor:form.meta_title.length>60?"#f59e0b":"var(--border)" }} />
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:3,fontSize:11 }}>
                  <span style={{ color:form.meta_title.length>60?"#f59e0b":form.meta_title.length>=50?"#10b981":"#94a3b8" }}>
                    {form.meta_title.length===0?"Falls back to article title":form.meta_title.length<50?"A bit short":form.meta_title.length<=60?"✓ Perfect length":"Too long"}
                  </span>
                  <span style={{ color:"var(--ink-light)" }}>{form.meta_title.length}/60</span>
                </div>
              </div>
              <div>
                <label style={lbl}>Meta Description <span style={{ color:"var(--ink-light)",fontWeight:400,textTransform:"none" }}>(120–158 chars ideal)</span></label>
                <textarea value={form.meta_description} onChange={e=>set("meta_description",e.target.value)} rows={3}
                  placeholder={form.excerpt||"Compelling description…"}
                  style={{ ...inp,resize:"vertical",borderColor:form.meta_description.length>158?"#f59e0b":"var(--border)" }} />
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:3,fontSize:11 }}>
                  <span style={{ color:form.meta_description.length>158?"#f59e0b":form.meta_description.length>=120?"#10b981":"#94a3b8" }}>
                    {form.meta_description.length===0?"Falls back to excerpt":form.meta_description.length<120?"Too short":form.meta_description.length<=158?"✓ Perfect":"Too long"}
                  </span>
                  <span style={{ color:"var(--ink-light)" }}>{form.meta_description.length}/158</span>
                </div>
              </div>
              <div>
                <label style={lbl}>Keywords</label>
                <input value={form.keywords} onChange={e=>set("keywords",e.target.value)} placeholder="nextjs, fastapi, blogging" style={inp} />
                <div style={{ display:"flex",gap:5,marginTop:6,flexWrap:"wrap" }}>
                  {form.keywords.split(",").filter(k=>k.trim()).map((k,i)=>(
                    <span key={i} style={{ background:"var(--primary-light)",color:"#6366f1",fontSize:11,padding:"2px 8px",borderRadius:100,fontWeight:600 }}>{k.trim()}</span>
                  ))}
                </div>
              </div>
              <div style={{ background:"#f0fdf4",borderRadius:10,padding:14,border:"1px solid #bbf7d0" }}>
                <div style={{ fontSize:11,fontWeight:700,color:"#15803d",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em" }}>SEO Checklist</div>
                {[[form.title.length>=30,"Title is 30+ characters"],[form.excerpt.length>=80,"Excerpt is 80+ characters"],[form.content.split(/\s+/).filter(Boolean).length>=300,"Content has 300+ words"],[!!form.featured_image,"Banner image set"],[form.meta_title.length>=30||form.title.length>=30,"Meta title set"],[form.meta_description.length>=80||form.excerpt.length>=80,"Meta description set"],[form.keywords.trim().length>0,"Keywords defined"],[form.slug.length>0,"URL slug set"]].map(([ok,label],i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,color:ok?"#15803d":"#94a3b8",marginBottom:3 }}>{ok?"✅":"○"} {label as string}</div>
                ))}
              </div>
            </div>
          )}

          {tab==="settings"&&(
            <div style={{ background:"var(--card)",borderRadius:14,padding:24,border:"1px solid var(--border-light)",display:"flex",flexDirection:"column",gap:16 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--ink)" }}>⚙️ Article Settings</h3>
              <div>
                <label style={lbl}>Status</label>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
                  {[["draft","📋","Draft"],["published","🚀","Published"],["archived","📦","Archived"]].map(([val,icon,label])=>(
                    <button key={val} onClick={()=>set("status",val)}
                      style={{ padding:"10px",borderRadius:10,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.13s",
                        borderColor:form.status===val?"#6366f1":"var(--border)",background:form.status===val?"var(--primary-light)":"var(--card)" }}>
                      <div style={{ fontSize:18,marginBottom:3 }}>{icon}</div>
                      <div style={{ fontSize:12,fontWeight:700,color:form.status===val?"#6366f1":"#374151" }}>{label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {[["featured","⭐ Featured","Shown in homepage featured section"],["editors_pick","✏️ Editor's Pick","Highlighted as hand-picked"]].map(([key,label,desc])=>(
                  <label key={key} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:`1.5px solid ${(form as any)[key]?"#6366f1":"var(--border)"}`,cursor:"pointer",background:(form as any)[key]?"var(--primary-light)":"var(--card)" }}>
                    <input type="checkbox" checked={(form as any)[key]} onChange={e=>set(key,e.target.checked)} style={{ width:16,height:16,accentColor:"#6366f1" }} />
                    <div>
                      <div style={{ fontSize:13,fontWeight:700,color:(form as any)[key]?"#6366f1":"#374151" }}>{label}</div>
                      <div style={{ fontSize:11,color:"var(--ink-light)" }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>



        {/* Right sidebar */}
        <div style={{ display:"flex",flexDirection:"column",gap:14,position:"sticky",top:80,alignSelf:"start" }}>
          <div style={{ background:"var(--card)",borderRadius:14,padding:18,border:"1px solid var(--border-light)" }}>
            <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:12 }}>Publish</div>
            <button onClick={()=>handleSave(true)} disabled={saving}
              style={{ width:"100%",padding:"11px",background:"#6366f1",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginBottom:8,boxShadow:"0 4px 12px rgba(99,102,241,0.3)" }}>
              {saving?"Saving…":"🚀 Publish Now"}
            </button>
            <button onClick={()=>handleSave(false)} disabled={saving}
              style={{ width:"100%",padding:"9px",background:"var(--surface-2)",color:"var(--ink-mid)",border:"1.5px solid var(--border)",borderRadius:10,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              💾 Save Draft
            </button>
          </div>
          <div style={{ background:"var(--card)",borderRadius:14,padding:18,border:"1px solid var(--border-light)" }}>
            <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:12 }}>Category</div>
            {["Life","Technology"].map(group=>(
              <div key={group} style={{ marginBottom:10 }}>
                <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#cbd5e1",marginBottom:5 }}>{group}</div>
                {CATS.filter(c=>c.group===group).map(c=>(
                  <button key={c.value} onClick={()=>set("category_id",c.value)}
                    style={{ width:"100%",textAlign:"left",padding:"5px 9px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:form.category_id===c.value?700:400,marginBottom:1,transition:"all 0.1s",
                      background:form.category_id===c.value?"var(--primary-light)":"transparent",
                      color:form.category_id===c.value?"#6366f1":"var(--ink-muted)" }}>
                    {form.category_id===c.value?"● ":"○ "}{c.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {/* Live preview */}
          {form.title&&(
            <div style={{ background:"var(--card)",borderRadius:14,padding:16,border:"1px solid var(--border-light)" }}>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:10 }}>Card Preview</div>
              <div style={{ borderRadius:10,overflow:"hidden",border:"1px solid var(--border-light)" }}>
                {form.featured_image
                  ? <img src={form.featured_image} alt="" style={{ width:"100%",height:70,objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
                  : <div style={{ height:70,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>✍️</div>
                }
                <div style={{ padding:10 }}>
                  <span style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"#6366f1",background:"var(--primary-light)",padding:"2px 6px",borderRadius:100 }}>{CATS.find(c=>c.value===form.category_id)?.label}</span>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:"var(--ink)",marginTop:5,lineHeight:1.4 }}>{form.title}</div>
                  <div style={{ fontSize:11,color:"var(--ink-light)",marginTop:3,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{form.excerpt||"Excerpt…"}</div>
                </div>
              </div>
            </div>
          )}
          {existing&&(
            <div style={{ background:"var(--card)",borderRadius:14,padding:18,border:"1px solid var(--border-light)" }}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--ink-light)",marginBottom:10 }}>Stats</div>
              {[["👁️","Views",existing.views],["❤️","Likes",existing.likes],["🔖","Saves",existing.bookmarks],["⏱️","Read",`${existing.read_time}m`]].map(([icon,label,val])=>(
                <div key={label as string} style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6 }}>
                  <span style={{ color:"var(--ink-muted)" }}>{icon} {label}</span>
                  <span style={{ fontWeight:700,color:"var(--ink)" }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SEOManager({ articles }: { articles:Article[] }) {
  const good=articles.filter(a=>a.meta_title&&a.meta_description);
  const score=articles.length?Math.round((good.length/articles.length)*100):0;
  return (
    <div>
      <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)",marginBottom:6 }}>SEO Manager</h1>
      <p style={{ color:"var(--ink-light)",fontSize:13,marginBottom:24 }}>Monitor and improve your content's search visibility.</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
        <StatCard icon="🎯" value={`${score}%`} label="SEO Score" color="#6366f1" sub={score>=70?"Good":"Needs work"} />
        <StatCard icon="✅" value={good.length} label="Fully Optimised" color="#10b981" />
        <StatCard icon="⚠️" value={articles.length-good.length} label="Need Attention" color="#f59e0b" />
        <StatCard icon="📝" value={articles.filter(a=>a.status==="published").length} label="Published" color="#14b8a6" />
      </div>
      <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
        <div style={{ padding:"14px 20px",borderBottom:"1px solid var(--border-light)",fontWeight:700,fontSize:14,color:"var(--ink)" }}>Article SEO Status</div>
        {articles.length===0?<div style={{ padding:36,textAlign:"center",color:"var(--ink-light)" }}>No articles yet</div>
          :articles.map(a=>{
            const checks=[!!a.meta_title,!!a.meta_description,(a.keywords||[]).length>0,!!a.featured_image];
            const n=checks.filter(Boolean).length;
            return (
              <div key={a.id} style={{ padding:"13px 20px",borderBottom:"1px solid var(--border-light)",display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:4 }}>{a.title}</div>
                  <div style={{ display:"flex",gap:5 }}>
                    {[["Title",checks[0]],["Desc",checks[1]],["Keywords",checks[2]],["Image",checks[3]]].map(([l,ok])=>(
                      <span key={l as string} style={{ fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:100,background:ok?"#d1fae5":"#fee2e2",color:ok?"#065f46":"#991b1b" }}>{ok?"✓":"✗"} {l}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:18,fontWeight:700,color:n===4?"#10b981":n>=2?"#f59e0b":"#ef4444" }}>{n}/4</div>
                  <div style={{ fontSize:10,color:"var(--ink-light)" }}>score</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function Analytics({ articles }: { articles:Article[] }) {
  const totalViews=articles.reduce((s,a)=>s+a.views,0);
  const totalLikes=articles.reduce((s,a)=>s+a.likes,0);
  const top=[...articles].sort((a,b)=>b.views-a.views).slice(0,10);
  const maxV=Math.max(...top.map(a=>a.views),1);
  const byCat=CATS.map(c=>({ ...c,count:articles.filter(a=>a.category_id===c.value).length,views:articles.filter(a=>a.category_id===c.value).reduce((s,a)=>s+a.views,0) })).filter(c=>c.count>0).sort((a,b)=>b.views-a.views);
  return (
    <div>
      <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)",marginBottom:6 }}>Analytics</h1>
      <p style={{ color:"var(--ink-light)",fontSize:13,marginBottom:24 }}>Track your content performance.</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
        <StatCard icon="👁️" value={totalViews.toLocaleString()} label="Total Views"  color="#6366f1" />
        <StatCard icon="❤️" value={totalLikes.toLocaleString()} label="Total Likes"  color="#f43f5e" />
        <StatCard icon="📝" value={articles.length}             label="Articles"     color="#14b8a6" />
        <StatCard icon="📊" value={articles.length?Math.round(totalViews/articles.length):0} label="Avg Views" color="#f59e0b" />
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20 }}>
        <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
          <div style={{ padding:"14px 20px",borderBottom:"1px solid var(--border-light)",fontWeight:700,fontSize:14,color:"var(--ink)" }}>Top Articles</div>
          {top.length===0?<div style={{ padding:32,textAlign:"center",color:"var(--ink-light)" }}>No data yet</div>
            :top.map((a,i)=>(
              <div key={a.id} style={{ padding:"11px 20px",borderBottom:"1px solid var(--border-light)" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:"var(--ink)",flex:1,minWidth:0,marginRight:10,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{i+1}. {a.title}</div>
                  <span style={{ fontSize:12,fontWeight:700,color:"#6366f1",flexShrink:0 }}>{a.views.toLocaleString()}</span>
                </div>
                <div style={{ height:4,background:"var(--surface-3)",borderRadius:2 }}>
                  <div style={{ height:"100%",background:"linear-gradient(90deg,#6366f1,#14b8a6)",borderRadius:2,width:`${(a.views/maxV)*100}%` }} />
                </div>
              </div>
            ))}
        </div>
        <div style={{ background:"var(--card)",borderRadius:14,border:"1px solid var(--border-light)",overflow:"hidden" }}>
          <div style={{ padding:"14px 20px",borderBottom:"1px solid var(--border-light)",fontWeight:700,fontSize:14,color:"var(--ink)" }}>By Category</div>
          {byCat.length===0?<div style={{ padding:32,textAlign:"center",color:"var(--ink-light)" }}>No data yet</div>
            :byCat.map(c=>(
              <div key={c.value} style={{ padding:"11px 20px",borderBottom:"1px solid var(--border-light)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:"var(--ink)" }}>{c.label}</div>
                  <div style={{ fontSize:11,color:"var(--ink-light)" }}>{c.count} articles</div>
                </div>
                <span style={{ fontSize:13,fontWeight:700,color:"#6366f1" }}>{c.views.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [saved,setSaved]=useState(false);
  const [s,setS]=useState({ siteName:"Life & Tech Journal",tagline:"Stories That Inspire. Technology That Empowers.",email:"hello@lifetechjournal.com",youtube:"https://www.youtube.com/@LifeTechJournal",articlesPerPage:"8",enableComments:true,enableNewsletter:true });
  const inp: React.CSSProperties={ width:"100%",padding:"10px 13px",borderRadius:9,border:"1.5px solid var(--border)",outline:"none",fontSize:14,fontFamily:"inherit",color:"var(--ink)" };
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)" }}>Settings</h1>
          <p style={{ color:"var(--ink-light)",fontSize:13,marginTop:3 }}>Configure your blog settings</p>
        </div>
        <button onClick={()=>setSaved(true)} style={{ background:saved?"#10b981":"#6366f1",color:"white",border:"none",borderRadius:10,padding:"9px 20px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
          {saved?"✅ Saved!":"Save Settings"}
        </button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
        <div style={{ background:"var(--card)",borderRadius:14,padding:24,border:"1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:18 }}>Site Identity</h3>
          {[["Site Name","siteName"],["Tagline","tagline"],["Contact Email","email"],["YouTube URL","youtube"]].map(([label,key])=>(
            <div key={key} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em" }}>{label}</label>
              <input value={(s as any)[key]} onChange={e=>setS(f=>({...f,[key]:e.target.value}))} style={inp} />
            </div>
          ))}
        </div>
        <div style={{ background:"var(--card)",borderRadius:14,padding:24,border:"1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:18 }}>Features</h3>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em" }}>Articles Per Page</label>
            <select value={s.articlesPerPage} onChange={e=>setS(f=>({...f,articlesPerPage:e.target.value}))} style={{ ...inp,cursor:"pointer" }}>
              {["5","8","10","12","15","20"].map(n=><option key={n} value={n}>{n} articles</option>)}
            </select>
          </div>
          {[["enableComments","💬 Enable Comments","Allow readers to comment"],["enableNewsletter","📬 Enable Newsletter","Show subscription forms"]].map(([key,label,desc])=>(
            <label key={key} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:`1.5px solid ${(s as any)[key]?"#6366f1":"var(--border)"}`,cursor:"pointer",background:(s as any)[key]?"var(--primary-light)":"var(--card)",marginBottom:10 }}>
              <input type="checkbox" checked={(s as any)[key]} onChange={e=>setS(f=>({...f,[key]:e.target.checked}))} style={{ width:16,height:16,accentColor:"#6366f1" }} />
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:(s as any)[key]?"#6366f1":"#374151" }}>{label}</div>
                <div style={{ fontSize:11,color:"var(--ink-light)" }}>{desc}</div>
              </div>
            </label>
          ))}
          <div style={{ background:"#fef3c7",borderRadius:10,padding:14,border:"1px solid #fde68a",marginTop:8 }}>
            <div style={{ fontSize:12,fontWeight:700,color:"#92400e",marginBottom:4 }}>⚠️ Admin Password</div>
            <div style={{ fontSize:12,color:"#92400e" }}>Change <code>NEXT_PUBLIC_ADMIN_UI_PASSWORD</code> in <code>frontend/.env</code> before production.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,  setAuthed]  = useState(false);
  const [view,    setView]    = useState<View>("dashboard");
  const [articles,setArticles]= useState<Article[]>([]);
  const [editing, setEditing] = useState<Article|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const local = sessionStorage.getItem("admin_local");
    const tok   = sessionStorage.getItem("access_token");
    if (local==="true"||tok) { setAuthed(true); loadArticles(tok||""); }
  }, []);

  const loadArticles = async (tok:string) => {
    setLoading(true);
    try {
      const headers: Record<string,string> = {};
      if (tok) headers["Authorization"]=`Bearer ${tok}`;
      const res  = await fetch(`${API}/articles?size=50`, { headers });
      const data = await res.json();
      setArticles(data.items??[]);
    } catch {}
    setLoading(false);
  };

  const handleLogin  = (tok:string) => { setAuthed(true); loadArticles(sessionStorage.getItem("access_token")||""); };
  const handleLogout = () => { sessionStorage.removeItem("admin_local"); sessionStorage.removeItem("access_token"); setAuthed(false); };
  const handleDelete = async (id:string) => {
    const tok=sessionStorage.getItem("access_token")||"";
    const res=await fetch(`${API}/articles/${id}`,{ method:"DELETE",headers:{"Authorization":`Bearer ${tok}`} });
    if(res.ok||res.status===204) setArticles(p=>p.filter(a=>a.id!==id));
  };
  const handleEdit  = (a:Article) => { setEditing(a); setView("editor"); };
  const handleNew   = () => { setEditing(null); setView("editor"); };
  const handleSaved = () => { loadArticles(sessionStorage.getItem("access_token")||""); setView("articles"); setEditing(null); };

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div style={{ fontFamily:"Lato,-apple-system,sans-serif",display:"flex",minHeight:"100vh",background:"var(--surface-2)" }}>
      <Sidebar view={view} setView={v=>{setView(v);if(v!=="editor")setEditing(null);}} counts={{ total:articles.length }} onLogout={handleLogout} />
      <main style={{ flex:1,marginLeft:220,padding:"32px 36px",minHeight:"100vh" }}>
        {loading?(
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"50vh",flexDirection:"column",gap:12 }}>
            <div style={{ width:36,height:36,border:"3px solid var(--border)",borderTopColor:"#6366f1",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
            <span style={{ color:"var(--ink-light)" }}>Loading…</span>
          </div>
        ):view==="dashboard"?<Dashboard articles={articles} onNew={handleNew} />
          :view==="articles"?<ArticlesList articles={articles} onEdit={handleEdit} onDelete={handleDelete} onNew={handleNew} />
          :view==="editor"  ?<ArticleEditor existing={editing} onSave={handleSaved} onCancel={()=>setView(editing?"articles":"articles")} />
          :view==="seo"     ?<SEOManager articles={articles} />
          :view==="analytics"?<Analytics articles={articles} />
          :view==="settings"   ?<SettingsPanel />
          :view==="newsletter" ?<div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)" }}>Newsletter AI</h1>
              <p style={{ color:"var(--ink-light)",fontSize:13,marginTop:3 }}>Auto-curate and draft your weekly newsletter</p>
            </div>
            <AINewsLetterCurator />
          </div>
          :null}
      </main>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>
    </div>
  );
}
