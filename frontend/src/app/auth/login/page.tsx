"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SiteNavbar from "@/components/SiteNavbar";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// Converts any FastAPI error detail (string | object | array) to a readable string
const getError = (detail: any): string => {
  if (!detail) return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e: any) => e.msg || String(e)).join(" · ");
  if (typeof detail === "object") return detail.msg || "Request failed";
  return String(detail);
};

function LoginContent() {
  const searchParams = useSearchParams();
  const [tab,      setTab]      = useState<"login"|"register">("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [status,   setStatus]   = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errMsg,   setErrMsg]   = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "google_failed") setErrMsg("Google sign-in failed. Please try again.");
    if (searchParams.get("registered") === "true") { setTab("login"); setErrMsg(""); }
  }, [searchParams]);

  const handleLogin = async () => {
    if (!email || !password) { setErrMsg("Please fill in all fields"); return; }
    setStatus("loading"); setErrMsg("");
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        credentials:"include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(getError(data.detail)); setStatus("error"); return; }
      sessionStorage.setItem("access_token", data.access_token);
      setStatus("success");
      const from = searchParams.get("from") || "/";
      window.location.href = from;
    } catch { setErrMsg("Cannot connect to server. Is the backend running on port 8080?"); setStatus("error"); }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) { setErrMsg("Please fill in all fields"); return; }
    if (password.length < 8) { setErrMsg("Password must be at least 8 characters"); return; }
    if (!/[A-Z]/.test(password)) { setErrMsg("Password must contain at least one uppercase letter"); return; }
    if (!/[0-9]/.test(password)) { setErrMsg("Password must contain at least one number"); return; }
    setStatus("loading"); setErrMsg("");
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(getError(data.detail)); setStatus("error"); return; }
      setStatus("success");
      setTimeout(() => {
        setTab("login"); setStatus("idle"); setErrMsg(""); setName(""); setPassword("");
      }, 1500);
    } catch { setErrMsg("Cannot connect to server. Is the backend running on port 8080?"); setStatus("error"); }
  };

  const handleGoogle = () => { window.location.href = `${API}/auth/google-redirect`; };

  const inp: React.CSSProperties = {
    width:"100%", padding:"12px 14px", borderRadius:10,
    border:"1.5px solid var(--border)", outline:"none",
    fontSize:14, fontFamily:"inherit", color:"var(--ink)",
    background:"var(--card)", transition:"border-color 0.15s",
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"Lato,sans-serif", display:"flex", flexDirection:"column" }}>
      <SiteNavbar />

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ width:"100%", maxWidth:420 }}>
          {/* Tab switcher */}
          <div style={{ display:"flex", background:"var(--card)", borderRadius:12, padding:4, border:"1.5px solid var(--border)", marginBottom:24 }}>
            {(["login","register"] as const).map(t=>(
              <button key={t} onClick={()=>{ setTab(t); setErrMsg(""); setStatus("idle"); }}
                style={{ flex:1, padding:"9px", borderRadius:9, border:"none", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
                  background:tab===t?"#4F46E5":"transparent", color:tab===t?"white":"var(--ink-muted)" }}>
                {t==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          <div style={{ background:"var(--card)", borderRadius:20, padding:36, boxShadow:"0 4px 20px rgba(0,0,0,0.07)", border:"1px solid var(--border-light)" }}>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"var(--ink)", marginBottom:6 }}>
              {tab==="login" ? "Welcome back" : "Join us today"}
            </h1>
            <p style={{ fontSize:14, color:"var(--ink-light)", marginBottom:24 }}>
              {tab==="login" ? "Sign in to your account" : "Create your free account to start reading"}
            </p>

            {/* Google */}
            <button onClick={handleGoogle}
              style={{ width:"100%", padding:"12px", borderRadius:10, border:"1.5px solid var(--border)", background:"var(--card)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:20 }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5";(e.currentTarget as HTMLElement).style.background="#F9FAFB"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.background="var(--card)"}}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.6-5 7.3v6h8.1c4.7-4.4 7.2-10.8 7.2-17.4z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.8 2.2-6 0-11.1-4-12.9-9.5H2.7v6.2C6.7 42.8 14.8 48 24 48z"/>
                <path fill="#FBBC04" d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.7C1 17.2 0 20.5 0 24s1 6.8 2.7 9.1l8.4-4.2z"/>
                <path fill="#E94235" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.9 2.4 30.4 0 24 0 14.8 0 6.7 5.2 2.7 12.9l8.4 6.2C12.9 13.5 18 9.5 24 9.5z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:"var(--border)" }} />
              <span style={{ fontSize:12, color:"var(--ink-light)" }}>or with email</span>
              <div style={{ flex:1, height:1, background:"var(--border)" }} />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {tab==="register" && (
                <div>
                  <label style={{ fontSize:13, fontWeight:700, color:"var(--ink-mid)", display:"block", marginBottom:6 }}>Full Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Aryan Joshi" style={inp}
                    onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
                    onBlur={e=>{(e.target as HTMLElement).style.borderColor="var(--border)"}} />
                </div>
              )}
              <div>
                <label style={{ fontSize:13, fontWeight:700, color:"var(--ink-mid)", display:"block", marginBottom:6 }}>Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="aryan@example.com" style={inp}
                  onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
                  onBlur={e=>{(e.target as HTMLElement).style.borderColor="var(--border)"}} />
              </div>
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <label style={{ fontSize:13, fontWeight:700, color:"var(--ink-mid)" }}>Password</label>
                  {tab==="login" && <Link href="/auth/forgot-password" style={{ fontSize:12, color:"var(--primary-text)", textDecoration:"none" }}>Forgot password?</Link>}
                </div>
                <div style={{ position:"relative" }}>
                  <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder={tab==="register"?"Min 8 chars, 1 uppercase, 1 number":"••••••••"}
                    style={{ ...inp, paddingRight:44 }}
                    onKeyDown={e=>e.key==="Enter"&&(tab==="login"?handleLogin():handleRegister())}
                    onFocus={e=>{(e.target as HTMLElement).style.borderColor="#4F46E5"}}
                    onBlur={e=>{(e.target as HTMLElement).style.borderColor="var(--border)"}} />
                  <button onClick={()=>setShowPass(s=>!s)} type="button"
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--ink-light)", fontSize:16 }}>
                    {showPass?"🙈":"👁️"}
                  </button>
                </div>
                {tab==="register" && (
                  <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                    {[["8+ chars", password.length>=8],["Uppercase",/[A-Z]/.test(password)],["Number",/[0-9]/.test(password)]].map(([label,ok])=>(
                      <span key={label as string} style={{ fontSize:11, padding:"2px 8px", borderRadius:100, background:ok?"#D1FAE5":"var(--border-light)", color:ok?"#065F46":"#A0A0A0", fontWeight:600 }}>
                        {ok?"✓":""} {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error — always a string now */}
            {errMsg && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:8, padding:"10px 14px", marginTop:14, fontSize:13, color:"#EF4444" }}>
                ⚠ {errMsg}
              </div>
            )}

            {status==="success" && tab==="register" && (
              <div style={{ background:"#D1FAE5", border:"1px solid #6EE7B7", borderRadius:8, padding:"12px 14px", marginTop:14, fontSize:13, color:"#065F46", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>✅</span>
                <div>
                  <div style={{ fontWeight:700 }}>Account created successfully!</div>
                  <div style={{ marginTop:2, opacity:0.85 }}>Switching to Sign In…</div>
                </div>
              </div>
            )}

            {status==="success" && tab==="login" && (
              <div style={{ background:"#D1FAE5", border:"1px solid #6EE7B7", borderRadius:8, padding:"12px 14px", marginTop:14, fontSize:13, color:"#065F46", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>✅</span>
                <div style={{ fontWeight:700 }}>Signed in! Redirecting…</div>
              </div>
            )}

            <button onClick={tab==="login"?handleLogin:handleRegister} disabled={status==="loading"||status==="success"}
              style={{ width:"100%", marginTop:20, padding:"13px",
                background:status==="success"?"#10B981":status==="loading"?"#6366f1":"#4F46E5",
                color:"white", border:"none", borderRadius:12, fontWeight:700, fontSize:15,
                cursor:status==="loading"||status==="success"?"not-allowed":"pointer",
                fontFamily:"inherit", boxShadow:"0 4px 14px rgba(79,70,229,0.3)", transition:"all 0.3s" }}>
              {status==="loading" ? "Please wait…"
                : status==="success" && tab==="register" ? "✓ Account Created"
                : status==="success" && tab==="login"    ? "✓ Signed In"
                : tab==="login" ? "Sign In →" : "Create Account →"}
            </button>

            <p style={{ textAlign:"center", fontSize:13, color:"var(--ink-light)", marginTop:16 }}>
              {tab==="login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={()=>{ setTab(tab==="login"?"register":"login"); setErrMsg(""); setStatus("idle"); }}
                style={{ color:"var(--primary-text)", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
                {tab==="login"?"Create one":"Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}