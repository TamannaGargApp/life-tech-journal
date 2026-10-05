"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface Props {
  title:   string;
  content: string;
  onApply: (data: { excerpt: string; meta_title: string; meta_description: string; keywords: string }) => void;
}

export default function AIExcerptGenerator({ title, content, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState("");

  const generate = async () => {
    if (!title.trim() && !content.trim()) {
      setError("Add a title and some content first"); setOpen(true); return;
    }
    setLoading(true); setError(""); setOpen(true); setResult(null);
    try {
      const res  = await fetch(`${API}/ai/excerpt`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail ?? "AI unavailable"); setLoading(false); return; }
      setResult(data);
    } catch { setError("Cannot reach AI. Is Ollama running?"); }
    setLoading(false);
  };

  const apply = () => {
    if (!result) return;
    onApply({
      excerpt:          result.excerpt,
      meta_title:       result.meta_title,
      meta_description: result.meta_description,
      keywords:         result.keywords.join(", "),
    });
    setOpen(false);
  };

  return (
    <>
      <button onClick={generate} disabled={loading}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
          background:"linear-gradient(135deg,#4F46E5,#7C3AED)", color:"white",
          border:"none", borderRadius:8, fontSize:12, fontWeight:700,
          cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
          boxShadow:"0 2px 8px rgba(79,70,229,0.3)" }}>
        ✨ {loading ? "Generating…" : "AI Generate"}
      </button>

      {open && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={e=>{ if(e.target===e.currentTarget) setOpen(false); }}>
          <div style={{ background:"var(--card)", borderRadius:20, padding:32, maxWidth:560, width:"100%",
            boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10,
                  background:"linear-gradient(135deg,#4F46E5,#7C3AED)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✨</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"var(--ink)" }}>AI Excerpt Generator</div>
                  <div style={{ fontSize:11, color:"var(--ink-light)" }}>Powered by Ollama · {loading ? "Generating…" : "Ready"}</div>
                </div>
              </div>
              <button onClick={()=>setOpen(false)}
                style={{ background:"var(--border-light)", border:"none", borderRadius:"50%", width:28, height:28,
                  cursor:"pointer", fontSize:14 }}>✕</button>
            </div>

            {loading ? (
              <div style={{ padding:"32px 0", textAlign:"center" }}>
                <div style={{ width:36, height:36, border:"3px solid var(--border)", borderTopColor:"#4F46E5",
                  borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
                <div style={{ color:"var(--ink-light)", fontSize:13 }}>Analyzing your article content…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : error ? (
              <div style={{ background:"#FEF2F2", borderRadius:10, padding:16, color:"#EF4444", fontSize:13 }}>
                ⚠ {error}
              </div>
            ) : result ? (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Excerpt", key:"excerpt", rows:3 },
                  { label:"Meta Title", key:"meta_title", rows:1 },
                  { label:"Meta Description", key:"meta_description", rows:2 },
                ].map(({ label, key, rows }) => (
                  <div key={key}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <label style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                        letterSpacing:"0.07em", color:"var(--ink-muted)" }}>{label}</label>
                      <span style={{ fontSize:11, color:"var(--ink-light)" }}>{result[key]?.length} chars</span>
                    </div>
                    <textarea readOnly value={result[key]} rows={rows}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:9,
                        border:"1.5px solid var(--border)", fontSize:13, fontFamily:"inherit",
                        color:"var(--ink)", resize:"none", background:"var(--surface-2)", lineHeight:1.6 }} />
                  </div>
                ))}
                {result.keywords?.length > 0 && (
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                      letterSpacing:"0.07em", color:"var(--ink-muted)", display:"block", marginBottom:8 }}>Keywords</label>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {result.keywords.map((k: string) => (
                        <span key={k} style={{ background:"var(--primary-light)", color:"var(--primary-text)",
                          fontSize:11, padding:"3px 10px", borderRadius:100, fontWeight:600 }}>{k}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display:"flex", gap:10, marginTop:6 }}>
                  <button onClick={apply}
                    style={{ flex:1, padding:"11px", background:"#4F46E5", color:"white",
                      border:"none", borderRadius:10, fontWeight:700, fontSize:14,
                      cursor:"pointer", fontFamily:"inherit" }}>
                    ✅ Apply to Article
                  </button>
                  <button onClick={generate}
                    style={{ padding:"11px 18px", background:"var(--surface-2)", color:"var(--ink-mid)",
                      border:"1.5px solid var(--border)", borderRadius:10, fontWeight:600,
                      fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}