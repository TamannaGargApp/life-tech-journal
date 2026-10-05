"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface Props {
  slug:    string;
  title:   string;
  content: string;
}

export default function AISummarizer({ slug, title, content }: Props) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ bullets: string[]; takeaway: string } | null>(null);
  const [error,   setError]   = useState("");

  const summarize = async () => {
    if (result) { setOpen(true); return; }
    setLoading(true); setError(""); setOpen(true);
    try {
      const res  = await fetch(`${API}/ai/summarize`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ slug, title, content }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail ?? "AI unavailable"); setLoading(false); return; }
      setResult(data);
    } catch { setError("Cannot reach AI. Is Ollama running?"); }
    setLoading(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button onClick={summarize}
        style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:10,
          border:"1.5px solid var(--border)", background:"var(--card)", fontSize:13, fontWeight:700,
          cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", color:"var(--primary-text)" }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--primary-light)";(e.currentTarget as HTMLElement).style.borderColor="#4F46E5"}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--card)";(e.currentTarget as HTMLElement).style.borderColor="var(--border)"}}>
        ⚡ Read in 30s
      </button>

      {/* Modal */}
      {open && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={e=>{ if(e.target===e.currentTarget) setOpen(false); }}>
          <div style={{ background:"var(--card)", borderRadius:20, padding:32, maxWidth:520, width:"100%",
            boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F46E5,#14B8A6)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"var(--ink)" }}>Quick Summary</div>
                  <div style={{ fontSize:11, color:"var(--ink-light)" }}>AI-generated · Read in 30 seconds</div>
                </div>
              </div>
              <button onClick={()=>setOpen(false)}
                style={{ background:"var(--border-light)", border:"none", borderRadius:"50%", width:28, height:28,
                  cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>

            {loading ? (
              <div style={{ padding:"32px 0", textAlign:"center" }}>
                <div style={{ width:36, height:36, border:"3px solid var(--border)", borderTopColor:"#4F46E5",
                  borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
                <div style={{ color:"var(--ink-light)", fontSize:13 }}>AI is reading the article…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : error ? (
              <div style={{ background:"#FEF2F2", borderRadius:10, padding:16, color:"#EF4444", fontSize:13 }}>
                ⚠ {error}
              </div>
            ) : result ? (
              <>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                  {result.bullets.map((b, i) => (
                    <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px",
                      background:"var(--surface-2)", borderRadius:10, border:"1px solid var(--border-light)" }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background:"#4F46E5",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:700, color:"white", flexShrink:0 }}>{i+1}</div>
                      <span style={{ fontSize:14, color:"var(--ink-mid)", lineHeight:1.55 }}>{b}</span>
                    </div>
                  ))}
                </div>
                {result.takeaway && (
                  <div style={{ background:"linear-gradient(135deg,var(--primary-light),#F0FDFA)", borderRadius:12,
                    padding:"14px 16px", borderLeft:"4px solid #4F46E5" }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                      letterSpacing:"0.07em", color:"var(--primary-text)", marginBottom:5 }}>Key Takeaway</div>
                    <div style={{ fontSize:14, color:"var(--ink)", fontWeight:600, lineHeight:1.55 }}>{result.takeaway}</div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}