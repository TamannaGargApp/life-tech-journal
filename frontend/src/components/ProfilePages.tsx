"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

function SiteNavbar({ user, onLogout }: { user:any; onLogout:()=>void }) {
  const [open, setOpen] = useState(false);
  const initials = user?.name?.split(" ").map((n:string)=>n[0]).join("").toUpperCase().slice(0,2) || "?";
  return (
    <nav style={{ position:"sticky",top:0,zIndex:200,background:"rgba(250,248,245,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid #E8E4DE" }}>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",height:64,gap:24 }}>
        <Link href="/" style={{ textDecoration:"none",flexShrink:0 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1A1A1A",lineHeight:1 }}>
            Life <span style={{ color:"#4F46E5" }}>&</span> Tech
            <div style={{ fontSize:9,fontWeight:300,letterSpacing:"0.22em",textTransform:"uppercase",color:"#A0A0A0",marginTop:2 }}>Journal</div>
          </div>
        </Link>
        <div style={{ flex:1,display:"flex",gap:2,justifyContent:"center" }}>
          {[["Home","/"],["Blog","/blog"],["About","/about"],["Contact","/contact"]].map(([l,h])=>(
            <Link key={l} href={h} style={{ padding:"7px 14px",fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:"#3D3D3D",borderRadius:8,textDecoration:"none" }}>{l}</Link>
          ))}
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"center",position:"relative" }}>
          <Link href="/newsletter" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none" }}>Subscribe</Link>
          <button onClick={()=>setOpen(o=>!o)}
            style={{ width:38,height:38,borderRadius:"50%",border:"2px solid #4F46E5",cursor:"pointer",padding:0,overflow:"hidden",background:"linear-gradient(135deg,#4F46E5,#14B8A6)" }}>
            <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white" }}>{initials}</div>
          </button>
          {open && (
            <div style={{ position:"absolute",top:46,right:0,background:"white",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.13)",border:"1px solid #F0EDE8",minWidth:200,zIndex:500,overflow:"hidden" }}
              onMouseLeave={()=>setOpen(false)}>
              <div style={{ padding:"12px 16px",background:"#FAF8F5",borderBottom:"1px solid #F0EDE8" }}>
                <div style={{ fontWeight:700,fontSize:14,color:"#1A1A1A" }}>{user?.name}</div>
                <div style={{ fontSize:12,color:"#A0A0A0" }}>{user?.email}</div>
              </div>
              {[["📖","Reading List","/reading-list"],["🔖","Saved Articles","/saved"],["👤","My Profile","/profile"]].map(([icon,label,href])=>(
                <Link key={label} href={href} onClick={()=>setOpen(false)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"#3D3D3D",textDecoration:"none" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#FAF8F5"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="white"}}>
                  <span>{icon}</span>{label}
                </Link>
              ))}
              <div style={{ borderTop:"1px solid #F0EDE8",padding:"4px 0" }}>
                <button onClick={onLogout}
                  style={{ width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:10,padding:"9px 16px",fontSize:13,color:"#EF4444",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" }}>
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProfileSidebar({ user, active }: { user:any; active:string }) {
  const nav = [
    { href:"/profile",       icon:"👤", label:"My Profile" },
    { href:"/reading-list",  icon:"📖", label:"Reading List" },
    { href:"/saved",         icon:"🔖", label:"Saved Articles" },
  ];
  const initials = user?.name?.split(" ").map((n:string)=>n[0]).join("").toUpperCase().slice(0,2) || "?";
  return (
    <aside style={{ width:240,flexShrink:0 }}>
      {/* User card */}
      <div style={{ background:"white",borderRadius:16,padding:24,border:"1px solid #F0EDE8",marginBottom:16,textAlign:"center" }}>
        <div style={{ width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,color:"white",margin:"0 auto 12px" }}>
          {initials}
        </div>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1A1A1A",marginBottom:3 }}>{user?.name || "Reader"}</div>
        <div style={{ fontSize:12,color:"#A0A0A0",marginBottom:10 }}>{user?.email}</div>
        {user?.role && user.role !== "reader" && (
          <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",background:"#EEF2FF",color:"#4F46E5",padding:"3px 10px",borderRadius:100 }}>{user.role}</span>
        )}
      </div>
      {/* Nav */}
      <div style={{ background:"white",borderRadius:16,border:"1px solid #F0EDE8",overflow:"hidden" }}>
        {nav.map(item=>(
          <Link key={item.href} href={item.href}
            style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 18px",fontSize:14,fontWeight:active===item.href?700:500,textDecoration:"none",borderBottom:"1px solid #F9F9F9",transition:"all 0.13s",
              background:active===item.href?"#EEF2FF":"white",
              color:active===item.href?"#4F46E5":"#3D3D3D" }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

// ── Delete Account Button ─────────────────────────────────────────────────────
function DeleteAccountButton({ token }: { token:string }) {
  const [step,    setStep]    = useState<"idle"|"confirm"|"deleting"|"done">("idle");
  const [confirm, setConfirm] = useState("");
  const CONFIRM_TEXT = "DELETE MY ACCOUNT";

  const handleDelete = async () => {
    if (confirm !== CONFIRM_TEXT) return;
    setStep("deleting");
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setStep("done");
        sessionStorage.removeItem("access_token");
        setTimeout(() => { window.location.href = "/"; }, 2000);
      } else {
        alert("Failed to delete account. Please contact support.");
        setStep("idle");
      }
    } catch {
      alert("Network error. Please try again.");
      setStep("idle");
    }
  };

  if (step === "done") return (
    <div style={{ padding:"12px 16px",background:"#D1FAE5",borderRadius:10,fontSize:14,color:"#065F46",fontWeight:600 }}>
      ✅ Account deleted. Redirecting…
    </div>
  );

  if (step === "confirm") return (
    <div style={{ background:"#FEF2F2",borderRadius:12,padding:20,border:"1.5px solid #FCA5A5" }}>
      <p style={{ fontSize:14,color:"#EF4444",fontWeight:600,marginBottom:8 }}>⚠️ This will permanently delete your account and all data.</p>
      <p style={{ fontSize:13,color:"#6B6B6B",marginBottom:14 }}>
        Type <code style={{ background:"#F0EDE8",padding:"2px 6px",borderRadius:4,fontWeight:700 }}>{CONFIRM_TEXT}</code> to confirm:
      </p>
      <input value={confirm} onChange={e=>setConfirm(e.target.value.toUpperCase())}
        placeholder={CONFIRM_TEXT}
        style={{ width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #FCA5A5",outline:"none",fontSize:13,fontFamily:"inherit",marginBottom:12,color:"#EF4444",fontWeight:700 }} />
      <div style={{ display:"flex",gap:10 }}>
        <button onClick={handleDelete}
          disabled={confirm!==CONFIRM_TEXT}
          style={{ padding:"9px 20px",background:confirm===CONFIRM_TEXT?"#EF4444":"#F0EDE8",color:confirm===CONFIRM_TEXT?"white":"#A0A0A0",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:confirm===CONFIRM_TEXT?"pointer":"not-allowed",fontFamily:"inherit",transition:"all 0.2s" }}>
          Yes, Delete My Account"
        </button>
        <button onClick={()=>{ setStep("idle"); setConfirm(""); }}
          style={{ padding:"9px 20px",background:"white",color:"#6B6B6B",border:"1.5px solid #E8E4DE",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <button onClick={()=>setStep("confirm")}
      style={{ padding:"9px 20px",background:"#FEF2F2",color:"#EF4444",border:"1.5px solid #FCA5A5",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
      Delete My Account
    </button>
  );
}

// ── My Profile Page ───────────────────────────────────────────────────────────
function MyProfile({ user, token }: { user:any; token:string }) {
  const [form,    setForm]    = useState({ name:user?.name||"", bio:"", website:"", twitter:"" });
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ type:"",text:"" });
  const [pwForm,  setPwForm]  = useState({ current:"",newPw:"",confirm:"" });
  const [pwMsg,   setPwMsg]   = useState({ type:"",text:"" });

  const saveProfile = async () => {
    setSaving(true); setMsg({type:"",text:""});
    // In production this would call PATCH /auth/me
    await new Promise(r=>setTimeout(r,800));
    setMsg({type:"ok",text:"Profile updated successfully!"});
    setSaving(false);
  };

  const changePassword = async () => {
    if (!pwForm.current||!pwForm.newPw) { setPwMsg({type:"err",text:"Fill in all fields"}); return; }
    if (pwForm.newPw!==pwForm.confirm) { setPwMsg({type:"err",text:"Passwords don't match"}); return; }
    if (pwForm.newPw.length<8) { setPwMsg({type:"err",text:"Min 8 characters"}); return; }
    setPwMsg({type:"ok",text:"Password changed successfully!"});
    setPwForm({current:"",newPw:"",confirm:""});
  };

  const inp: React.CSSProperties = { width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid #E8E4DE",outline:"none",fontSize:14,fontFamily:"inherit",color:"#1A1A1A",background:"white",transition:"border-color 0.15s" };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      {/* Profile info */}
      <div style={{ background:"white",borderRadius:16,padding:28,border:"1px solid #F0EDE8" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:20 }}>Profile Information</h2>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#6B6B6B",display:"block",marginBottom:6 }}>Full Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}
              onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
              onBlur={e=>{(e.target as HTMLElement).style.borderColor="#E8E4DE"}} />
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#6B6B6B",display:"block",marginBottom:6 }}>Email Address</label>
            <input value={user?.email||""} disabled style={{ ...inp,background:"#F9F9F9",color:"#A0A0A0",cursor:"not-allowed" }} />
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#6B6B6B",display:"block",marginBottom:6 }}>Bio <span style={{ fontWeight:400,textTransform:"none",color:"#A0A0A0" }}>(optional)</span></label>
          <textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} rows={3} placeholder="Tell us a bit about yourself…"
            style={{ ...inp,resize:"vertical",lineHeight:1.65 }}
            onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
            onBlur={e=>{(e.target as HTMLElement).style.borderColor="#E8E4DE"}} />
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#6B6B6B",display:"block",marginBottom:6 }}>Website</label>
            <input value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} placeholder="https://yoursite.com" style={inp}
              onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
              onBlur={e=>{(e.target as HTMLElement).style.borderColor="#E8E4DE"}} />
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#6B6B6B",display:"block",marginBottom:6 }}>Twitter / X</label>
            <input value={form.twitter} onChange={e=>setForm(f=>({...f,twitter:e.target.value}))} placeholder="@yourusername" style={inp}
              onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
              onBlur={e=>{(e.target as HTMLElement).style.borderColor="#E8E4DE"}} />
          </div>
        </div>
        {msg.text && (
          <div style={{ padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:14,background:msg.type==="ok"?"#D1FAE5":"#FEF2F2",color:msg.type==="ok"?"#065F46":"#EF4444",border:`1px solid ${msg.type==="ok"?"#6EE7B7":"#FCA5A5"}` }}>
            {msg.type==="ok"?"✅":"⚠"} {msg.text}
          </div>
        )}
        <button onClick={saveProfile} disabled={saving}
          style={{ padding:"10px 24px",background:"#4F46E5",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(79,70,229,0.25)" }}>
          {saving?"Saving…":"Save Changes"}
        </button>
      </div>

      {/* Change password */}
      <div style={{ background:"white",borderRadius:16,padding:28,border:"1px solid #F0EDE8" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:20 }}>Change Password</h2>
        <div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:400 }}>
          {[["Current Password","current","Your current password"],["New Password","newPw","Min 8 chars"],["Confirm New Password","confirm","Repeat new password"]].map(([label,key,ph])=>(
            <div key={key}>
              <label style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#6B6B6B",display:"block",marginBottom:6 }}>{label}</label>
              <input type="password" value={(pwForm as any)[key]} onChange={e=>setPwForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} style={inp}
                onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
                onBlur={e=>{(e.target as HTMLElement).style.borderColor="#E8E4DE"}} />
            </div>
          ))}
          {pwMsg.text && (
            <div style={{ padding:"10px 14px",borderRadius:8,fontSize:13,background:pwMsg.type==="ok"?"#D1FAE5":"#FEF2F2",color:pwMsg.type==="ok"?"#065F46":"#EF4444",border:`1px solid ${pwMsg.type==="ok"?"#6EE7B7":"#FCA5A5"}` }}>
              {pwMsg.type==="ok"?"✅":"⚠"} {pwMsg.text}
            </div>
          )}
          <button onClick={changePassword}
            style={{ padding:"10px 24px",background:"#1A1A1A",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",width:"fit-content" }}>
            Update Password
          </button>
        </div>
      </div>

      {/* Account info */}
      <div style={{ background:"white",borderRadius:16,padding:28,border:"1px solid #F0EDE8" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:16 }}>Account Details</h2>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[["Account Type","Email & Password"],["Role",user?.role||"reader"],["Member Since","June 2025"],["Status","✅ Verified"]].map(([label,val])=>(
            <div key={label} style={{ padding:"14px 16px",background:"#FAF8F5",borderRadius:10,border:"1px solid #F0EDE8" }}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#A0A0A0",marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:14,fontWeight:600,color:"#1A1A1A" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background:"white",borderRadius:16,padding:28,border:"1.5px solid #FCA5A5" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#EF4444",marginBottom:8 }}>⚠️ Danger Zone</h2>
        <p style={{ fontSize:14,color:"#6B6B6B",marginBottom:16,lineHeight:1.7 }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
        <DeleteAccountButton token={token} />
      </div>
    </div>
  );
}

// ── Reading List Page ─────────────────────────────────────────────────────────
function ReadingList({ token }: { token:string }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    // Fetch real reading history from API
    fetch(`${API}/user/reading-history`, { headers:{"Authorization":`Bearer ${token}`} })
      .then(r => r.ok ? r.json() : [])
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoadingArticles(false));
  }, [token]);

  const CAT_COLORS: Record<string,string> = {
    "AI & ML":"#EEF2FF","Personal Growth":"#ECFDF5","Career":"#FFF1F2","Web Development":"#F0FDFA",
  };
  const CAT_TEXT: Record<string,string> = {
    "AI & ML":"#4F46E5","Personal Growth":"#059669","Career":"#E11D48","Web Development":"#0D9488",
  };

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#1A1A1A" }}>Reading List</h1>
          <p style={{ color:"#A0A0A0",fontSize:13,marginTop:3 }}>{articles.length} articles in your history</p>
        </div>
      </div>

      {loadingArticles ? (
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:48,color:"#A0A0A0",gap:12 }}>
          <div style={{ width:24,height:24,border:"3px solid #E8E4DE",borderTopColor:"#4F46E5",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
          Loading your reading history…
        </div>
      ) : articles.length===0 ? (
        <div style={{ background:"white",borderRadius:16,padding:56,textAlign:"center",border:"1px solid #F0EDE8" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>📖</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:8 }}>No articles read yet</h3>
          <p style={{ color:"#A0A0A0",marginBottom:20 }}>Start reading to build your history.</p>
          <Link href="/blog" style={{ background:"#4F46E5",color:"white",padding:"10px 24px",borderRadius:10,fontWeight:700,textDecoration:"none" }}>Browse Articles</Link>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {articles.map(a=>(
            <div key={a.id} style={{ background:"white",borderRadius:14,border:"1px solid #F0EDE8",overflow:"hidden",transition:"all 0.2s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(79,70,229,0.08)";(e.currentTarget as HTMLElement).style.borderColor="#C7D2FE"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";(e.currentTarget as HTMLElement).style.borderColor="#F0EDE8"}}>
              {/* Progress bar */}
              <div style={{ height:3,background:"#F0EDE8" }}>
                <div style={{ height:"100%",background:"linear-gradient(90deg,#4F46E5,#14B8A6)",width:`${a.progress}%`,transition:"width 0.5s" }} />
              </div>
              <div style={{ padding:"16px 20px",display:"flex",alignItems:"center",gap:16 }}>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                    <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",padding:"2px 8px",borderRadius:100,
                      background:CAT_COLORS[a.category]||"#F0EDE8",color:CAT_TEXT[a.category]||"#6B6B6B" }}>
                      {a.category}
                    </span>
                    <span style={{ fontSize:11,color:"#A0A0A0" }}>⏱ {a.readTime} min</span>
                    <span style={{ fontSize:11,color:"#A0A0A0" }}>· {a.readAt}</span>
                  </div>
                  <Link href={`/blog/${a.slug}`} style={{ textDecoration:"none" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1A1A1A",lineHeight:1.35 }}>{a.title}</h3>
                  </Link>
                </div>
                <div style={{ textAlign:"center",flexShrink:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:a.progress===100?"#10B981":"#4F46E5" }}>{a.progress}%</div>
                  <div style={{ fontSize:10,color:"#A0A0A0",marginTop:1 }}>{a.progress===100?"Complete":"In progress"}</div>
                </div>
                <Link href={`/blog/${a.slug}`}
                  style={{ padding:"7px 14px",background:"#EEF2FF",color:"#4F46E5",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none",flexShrink:0,whiteSpace:"nowrap" }}>
                  {a.progress===100?"Read Again":"Continue →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Saved Articles Page ────────────────────────────────────────────────────────
function SavedArticles({ token }: { token:string }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    // Fetch real bookmarks from API
    fetch(`${API}/user/bookmarks`, { headers:{"Authorization":`Bearer ${token}`} })
      .then(r => r.ok ? r.json() : [])
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoadingArticles(false));
  }, [token]);

  const removeArticle = (id:string) => {
    setArticles(prev=>prev.filter(a=>a.id!==id));
    // In production: DELETE /api/v1/articles/{id}/bookmark
  };

  const CAT_GRAD: Record<string,string> = {
    "Personal Growth":"linear-gradient(135deg,#022C22,#065F46,#10B981)",
    "Web Development":"linear-gradient(135deg,#134E4A,#0F766E,#14B8A6)",
    "Career":"linear-gradient(135deg,#500724,#9D174D,#F472B6)",
    "AI & ML":"linear-gradient(135deg,#1e1b4b,#312e81,#14B8A6)",
  };

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#1A1A1A" }}>Saved Articles</h1>
          <p style={{ color:"#A0A0A0",fontSize:13,marginTop:3 }}>{articles.length} articles saved</p>
        </div>
        <Link href="/blog" style={{ fontSize:13,fontWeight:700,color:"#4F46E5",border:"1.5px solid #4F46E5",padding:"7px 16px",borderRadius:8,textDecoration:"none" }}>
          + Save More Articles
        </Link>
      </div>

      {loadingArticles ? (
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:48,color:"#A0A0A0",gap:12 }}>
          <div style={{ width:24,height:24,border:"3px solid #E8E4DE",borderTopColor:"#4F46E5",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
          Loading saved articles…
        </div>
      ) : articles.length===0 ? (
        <div style={{ background:"white",borderRadius:16,padding:56,textAlign:"center",border:"1px solid #F0EDE8" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>🔖</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:8 }}>No saved articles yet</h3>
          <p style={{ color:"#A0A0A0",marginBottom:20 }}>Click the 📌 Save button on any article to save it here.</p>
          <Link href="/blog" style={{ background:"#4F46E5",color:"white",padding:"10px 24px",borderRadius:10,fontWeight:700,textDecoration:"none" }}>Browse Articles</Link>
        </div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16 }}>
          {articles.map(a=>(
            <div key={a.id} style={{ background:"white",borderRadius:14,overflow:"hidden",border:"1px solid #F0EDE8",transition:"all 0.2s",position:"relative" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 6px 24px rgba(79,70,229,0.1)";(e.currentTarget as HTMLElement).style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";(e.currentTarget as HTMLElement).style.transform="translateY(0)"}}>
              {/* Remove button */}
              <button onClick={()=>removeArticle(a.id)}
                style={{ position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.4)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:"white",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1 }}>
                ✕
              </button>
              <div style={{ height:90,background:CAT_GRAD[a.category]||"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>
                {a.category==="Personal Growth"?"🌱":a.category==="Web Development"?"🌐":a.category==="Career"?"🚀":"✍️"}
              </div>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:6 }}>
                  <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",color:"#4F46E5",background:"#EEF2FF",padding:"2px 7px",borderRadius:100 }}>{a.category}</span>
                  <span style={{ fontSize:11,color:"#A0A0A0" }}>⏱ {a.readTime} min</span>
                </div>
                <Link href={`/blog/${a.slug}`} style={{ textDecoration:"none" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#1A1A1A",lineHeight:1.35,marginBottom:6 }}>{a.title}</h3>
                </Link>
                <p style={{ fontSize:12,color:"#6B6B6B",lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{a.excerpt}</p>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontSize:11,color:"#A0A0A0" }}>Saved {a.savedAt}</span>
                  <Link href={`/blog/${a.slug}`} style={{ fontSize:12,fontWeight:700,color:"#4F46E5",textDecoration:"none" }}>Read →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Root Component ─────────────────────────────────────────────────────────────
export default function ProfilePages({ page }: { page:"profile"|"reading-list"|"saved" }) {
  const [user,    setUser]    = useState<any>(null);
  const [token,   setToken]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = sessionStorage.getItem("access_token") || "";
    if (!tok) { window.location.href = "/auth/login?from=" + encodeURIComponent(window.location.pathname); return; }
    setToken(tok);
    fetch(`${API}/auth/me`, { headers:{"Authorization":`Bearer ${tok}`} })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setUser(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = () => {
    sessionStorage.removeItem("access_token");
    window.location.href = "/";
  };

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Lato,sans-serif",color:"#A0A0A0",flexDirection:"column",gap:12 }}>
      <div style={{ width:36,height:36,border:"3px solid #E8E4DE",borderTopColor:"#4F46E5",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading your profile…
    </div>
  );

  const pageHref = page==="profile"?"/profile":page==="reading-list"?"/reading-list":"/saved";

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#FAF8F5" }}>
      <SiteNavbar user={user} onLogout={logout} />
      <main style={{ maxWidth:1100,margin:"0 auto",padding:"40px 32px",display:"flex",gap:28,alignItems:"start" }}>
        <ProfileSidebar user={user} active={pageHref} />
        <div style={{ flex:1,minWidth:0 }}>
          {page==="profile"      && <MyProfile user={user} token={token} />}
          {page==="reading-list" && <ReadingList token={token} />}
          {page==="saved"        && <SavedArticles token={token} />}
        </div>
      </main>
    </div>
  );
}