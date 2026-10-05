"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export default function AINewsletterCurator() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState("");
  const [weeks,   setWeeks]   = useState(1);
  const [copied,  setCopied]  = useState(false);

  const generate = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`${API}/ai/newsletter`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ weeks_back: weeks, max_articles: 5 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail ?? "AI unavailable"); setLoading(false); return; }
      setResult(data);
    } catch { setError("Cannot reach AI. Is Ollama running?"); }
    setLoading(false);
  };

  const copyHtml = () => {
    if (!result) return;
    const html = `
<h2>${result.subject}</h2>
<p><em>${result.preview_text}</em></p>
<p>${result.intro}</p>
${result.articles.map((a: any) => `
<h3><a href="${a.url}">${a.title}</a></h3>
<p>${a.excerpt}</p>
<p><strong>${a.readTime} min read</strong></p>
`).join("")}
<p>${result.outro}</p>`;
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background:"var(--card)", borderRadius:16, border:"1px solid var(--border-light)", overflow:"hidden" }}>
      <div style={{ padding:"18px 20px", background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>📬</span>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"white" }}>AI Newsletter Curator</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>Auto-select & write weekly digest</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <label style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Last</label>
            <select value={weeks} onChange={e=>setWeeks(Number(e.target.value))}
              style={{ padding:"4px 8px", borderRadius:6, border:"none", fontSize:12,
                fontFamily:"inherit", background:"rgba(255,255,255,0.2)", color:"white",
                cursor:"pointer" }}>
              {[1,2,3,4].map(w=><option key={w} value={w}>{w} week{w>1?"s":""}</option>)}
            </select>
          </div>
          <button onClick={generate} disabled={loading}
            style={{ padding:"8px 18px", background:"rgba(255,255,255,0.2)", color:"white",
              border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:8, fontWeight:700,
              fontSize:12, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
            {loading ? "✍️ Writing…" : "🚀 Generate"}
          </button>
        </div>
      </div>

      <div style={{ padding:20 }}>
        {!result && !loading && !error && (
          <div style={{ textAlign:"center", padding:"32px 0", color:"var(--ink-light)" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>📬</div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>Generate your weekly newsletter</div>
            <div style={{ fontSize:13 }}>AI will pick the best articles and write an engaging email draft</div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ width:32, height:32, border:"3px solid var(--border)", borderTopColor:"#4F46E5",
              borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
            <div style={{ color:"var(--ink-light)", fontSize:13 }}>Curating this week's best articles…</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <div style={{ background:"#FEF2F2", borderRadius:10, padding:14,
            color:"#EF4444", fontSize:13 }}>⚠ {error}</div>
        )}

        {result && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Subject + preview */}
            <div style={{ background:"var(--surface-2)", borderRadius:12, padding:16,
              border:"1px solid var(--border)" }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.07em", color:"var(--ink-light)", marginBottom:6 }}>Email Subject</div>
              <div style={{ fontSize:16, fontWeight:700, color:"var(--ink)",
                marginBottom:8 }}>{result.subject}</div>
              <div style={{ fontSize:12, color:"var(--ink-muted)",
                fontStyle:"italic" }}>{result.preview_text}</div>
            </div>

            {/* Intro */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.07em", color:"var(--ink-light)", marginBottom:6 }}>Opening</div>
              <div style={{ fontSize:14, color:"var(--ink-mid)", lineHeight:1.7,
                background:"var(--cream)", padding:"12px 14px", borderRadius:10,
                border:"1px solid var(--border-light)" }}>{result.intro}</div>
            </div>

            {/* Articles */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.07em", color:"var(--ink-light)", marginBottom:10 }}>
                Featured Articles ({result.articles.length})
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.articles.map((a: any, i: number) => (
                  <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px",
                    background:"var(--card)", borderRadius:10, border:"1px solid var(--border-light)",
                    alignItems:"flex-start" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%",
                      background:"linear-gradient(135deg,#4F46E5,#14B8A6)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:700, color:"white", flexShrink:0 }}>{i+1}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--ink)",
                        marginBottom:3 }}>{a.title}</div>
                      <div style={{ fontSize:12, color:"var(--ink-muted)", lineHeight:1.5,
                        display:"-webkit-box", WebkitLineClamp:2,
                        WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.excerpt}</div>
                      <div style={{ display:"flex", gap:10, marginTop:5 }}>
                        <span style={{ fontSize:10, color:"var(--ink-light)" }}>⏱ {a.readTime} min</span>
                        <span style={{ fontSize:10, color:"var(--ink-light)" }}>👁 {a.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outro */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.07em", color:"var(--ink-light)", marginBottom:6 }}>Sign-off</div>
              <div style={{ fontSize:14, color:"var(--ink-mid)", lineHeight:1.7,
                background:"var(--cream)", padding:"12px 14px", borderRadius:10,
                border:"1px solid var(--border-light)" }}>{result.outro}</div>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={copyHtml}
                style={{ flex:1, padding:"10px", background:copied?"#059669":"#1e1b4b",
                  color:"white", border:"none", borderRadius:10, fontWeight:700,
                  fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>
                {copied ? "✅ Copied HTML!" : "📋 Copy as HTML"}
              </button>
              <button onClick={generate}
                style={{ padding:"10px 18px", background:"var(--surface-2)", color:"var(--ink-mid)",
                  border:"1.5px solid var(--border)", borderRadius:10, fontWeight:600,
                  fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                🔄 Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}