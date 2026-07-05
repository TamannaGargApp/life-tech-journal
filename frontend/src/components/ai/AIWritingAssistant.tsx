"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface Props {
  content:  string;
  onApply:  (newContent: string) => void;
}

const ACTIONS = [
  { id:"continue",     icon:"✍️",  label:"Continue Writing",  desc:"Add 2-3 more paragraphs" },
  { id:"improve",      icon:"✨",  label:"Improve Quality",   desc:"More engaging and clear" },
  { id:"shorten",      icon:"✂️",  label:"Shorten",           desc:"Cut by 40%, keep key points" },
  { id:"expand",       icon:"📝",  label:"Expand",            desc:"Add more detail and examples" },
  { id:"fix-grammar",  icon:"📖",  label:"Fix Grammar",       desc:"Correct all errors" },
];

export default function AIWritingAssistant({ content, onApply }: Props) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState("");
  const [action,  setAction]  = useState("");
  const [error,   setError]   = useState("");

  const run = async (selectedAction: string) => {
    if (!content.trim()) { setError("Add some content first"); return; }
    setAction(selectedAction); setLoading(true); setResult(""); setError("");
    try {
      const res = await fetch(`${API}/ai/writing-assist`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ content, action: selectedAction }),
      });
      if (!res.ok) { setError("AI unavailable"); setLoading(false); return; }
      if (!res.body) return;

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResult(accumulated);
      }
    } catch { setError("Cannot reach AI. Is Ollama running?"); }
    setLoading(false);
  };

  return (
    <>
      <button onClick={()=>setOpen(true)}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
          background:"#FFF7ED", color:"#C2410C", border:"1.5px solid #FED7AA",
          borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
        🪄 Writing AI
      </button>

      {open && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={e=>{ if(e.target===e.currentTarget){ setOpen(false); setResult(""); } }}>
          <div style={{ background:"white", borderRadius:20, padding:28, width:"100%", maxWidth:620,
            maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"#FFF7ED",
                  border:"1.5px solid #FED7AA", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:18 }}>🪄</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"#1A1A1A" }}>AI Writing Assistant</div>
                  <div style={{ fontSize:11, color:"#A0A0A0" }}>Choose an action to improve your content</div>
                </div>
              </div>
              <button onClick={()=>{ setOpen(false); setResult(""); }}
                style={{ background:"#F0EDE8", border:"none", borderRadius:"50%",
                  width:28, height:28, cursor:"pointer", fontSize:14 }}>✕</button>
            </div>

            {/* Action buttons */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {ACTIONS.map(a=>(
                <button key={a.id} onClick={()=>run(a.id)} disabled={loading}
                  style={{ padding:"12px 14px", borderRadius:10, border:"1.5px solid",
                    cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", textAlign:"left",
                    transition:"all 0.15s",
                    borderColor: action===a.id&&loading ? "#C2410C" : "#E8E4DE",
                    background:  action===a.id&&loading ? "#FFF7ED" : "white" }}>
                  <div style={{ fontSize:16, marginBottom:4 }}>{a.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1A1A1A" }}>{a.label}</div>
                  <div style={{ fontSize:11, color:"#A0A0A0" }}>{a.desc}</div>
                </button>
              ))}
            </div>

            {error && (
              <div style={{ background:"#FEF2F2", borderRadius:8, padding:"10px 14px",
                fontSize:13, color:"#EF4444", marginBottom:12 }}>⚠ {error}</div>
            )}

            {(result || loading) && (
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                    letterSpacing:"0.07em", color:"#6B6B6B" }}>
                    AI Output {loading && <span style={{ color:"#C2410C" }}>● Writing…</span>}
                  </label>
                </div>
                <textarea value={result} readOnly rows={10}
                  style={{ width:"100%", padding:"12px 14px", borderRadius:10,
                    border:"1.5px solid #E8E4DE", fontSize:13, fontFamily:"'Courier New',monospace",
                    color:"#1A1A1A", resize:"vertical", background:"#F8FAFC", lineHeight:1.7 }} />

                {result && !loading && (
                  <>
                    <details style={{ marginTop:8 }}>
                      <summary style={{ fontSize:12, color:"#4F46E5", cursor:"pointer", fontWeight:600 }}>
                        👁 Preview
                      </summary>
                      <div style={{ marginTop:8, padding:14, background:"#FAF8F5", borderRadius:10,
                        border:"1px solid #E8E4DE", fontSize:14, lineHeight:1.8, maxHeight:200, overflow:"auto" }}
                        dangerouslySetInnerHTML={{ __html: result }} />
                    </details>
                    <div style={{ display:"flex", gap:10, marginTop:12 }}>
                      <button onClick={()=>{ onApply(result); setOpen(false); setResult(""); }}
                        style={{ flex:1, padding:"11px", background:"#C2410C", color:"white",
                          border:"none", borderRadius:10, fontWeight:700, fontSize:14,
                          cursor:"pointer", fontFamily:"inherit" }}>
                        ✅ Replace Content
                      </button>
                      <button onClick={()=>{ onApply(content + "\n\n" + result); setOpen(false); setResult(""); }}
                        style={{ flex:1, padding:"11px", background:"#FFF7ED", color:"#C2410C",
                          border:"1.5px solid #FED7AA", borderRadius:10, fontWeight:700, fontSize:14,
                          cursor:"pointer", fontFamily:"inherit" }}>
                        ➕ Append to Content
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}