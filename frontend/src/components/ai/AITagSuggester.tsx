"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface Props {
  title:   string;
  content: string;
  onApply: (data: { category: string; keywords: string }) => void;
}

export default function AITagSuggester({ title, content, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState("");
  const [open,    setOpen]    = useState(false);

  const suggest = async () => {
    setLoading(true); setError(""); setOpen(true); setResult(null);
    try {
      const res  = await fetch(`${API}/ai/tags`, {
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
    onApply({ category: result.category, keywords: result.keywords.join(", ") });
    setOpen(false);
  };

  const confidence = result ? Math.round(result.confidence * 100) : 0;

  return (
    <>
      <button onClick={suggest} disabled={loading}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
          background:"#F0FDF4", color:"#059669", border:"1.5px solid #6EE7B7",
          borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
        🏷️ {loading ? "Analyzing…" : "Auto-Tag"}
      </button>

      {open && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={e=>{ if(e.target===e.currentTarget) setOpen(false); }}>
          <div style={{ background:"var(--card)", borderRadius:20, padding:28, maxWidth:440, width:"100%",
            boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#F0FDF4",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏷️</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"var(--ink)" }}>AI Tag Suggester</div>
                  <div style={{ fontSize:11, color:"var(--ink-light)" }}>Auto-classify your article</div>
                </div>
              </div>
              <button onClick={()=>setOpen(false)}
                style={{ background:"var(--border-light)", border:"none", borderRadius:"50%",
                  width:28, height:28, cursor:"pointer", fontSize:14 }}>✕</button>
            </div>

            {loading ? (
              <div style={{ padding:"28px 0", textAlign:"center" }}>
                <div style={{ width:32, height:32, border:"3px solid var(--border)", borderTopColor:"#059669",
                  borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
                <div style={{ color:"var(--ink-light)", fontSize:13 }}>Analyzing article content…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : error ? (
              <div style={{ background:"#FEF2F2", borderRadius:10, padding:14,
                color:"#EF4444", fontSize:13 }}>⚠ {error}</div>
            ) : result ? (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:"#F0FDF4", borderRadius:12, padding:16,
                  border:"1.5px solid #6EE7B7" }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                    letterSpacing:"0.07em", color:"#059669", marginBottom:8 }}>Suggested Category</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:16, fontWeight:700, color:"var(--ink)" }}>{result.category}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#059669",
                      background:"#DCFCE7", padding:"3px 10px", borderRadius:100 }}>
                      {confidence}% confidence
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                    letterSpacing:"0.07em", color:"var(--ink-muted)", marginBottom:8 }}>Suggested Keywords</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {result.keywords.map((k: string) => (
                      <span key={k} style={{ background:"var(--primary-light)", color:"var(--primary-text)",
                        fontSize:12, padding:"4px 12px", borderRadius:100, fontWeight:600 }}>{k}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={apply}
                    style={{ flex:1, padding:"10px", background:"#059669", color:"white",
                      border:"none", borderRadius:10, fontWeight:700, fontSize:14,
                      cursor:"pointer", fontFamily:"inherit" }}>
                    ✅ Apply Tags
                  </button>
                  <button onClick={suggest}
                    style={{ padding:"10px 16px", background:"var(--surface-2)", color:"var(--ink-mid)",
                      border:"1.5px solid var(--border)", borderRadius:10, fontWeight:600,
                      fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    🔄
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