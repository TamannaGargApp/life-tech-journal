"use client";
import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface Message { role:"user"|"assistant"; content:string; sources?:any[]; }

export default function AIChatWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role:"assistant", content:"Hi! 👋 I'm your Life & Tech Journal assistant. Ask me to find articles, recommend reading, or answer questions about our content!" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [aiReady, setAiReady] = useState<boolean|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API}/ai/status`)
      .then(r => r.json())
      .then(d => setAiReady(d.ready))
      .catch(() => setAiReady(false));
  }, []);

  useEffect(() => {
    if (open) { setTimeout(()=>inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role:"user", content:userMsg }]);
    setLoading(true);

    // Add placeholder for assistant
    setMessages(prev => [...prev, { role:"assistant", content:"" }]);

    try {
      const history = messages.slice(-6).map(m => ({ role:m.role, content:m.content }));
      const res = await fetch(`${API}/ai/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ message:userMsg, history }),
      });

      if (!res.ok || !res.body) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length-1] = { role:"assistant", content:"Sorry, I couldn't reach the AI. Make sure Ollama is running." };
          return updated;
        });
        setLoading(false);
        return;
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let sources: any[] = [];
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream:true });
        const lines = text.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "sources") { sources = data.articles || []; }
            else if (data.type === "token") {
              accumulated += data.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length-1] = { role:"assistant", content:accumulated, sources };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length-1] = { role:"assistant", content:"Network error. Please try again." };
        return updated;
      });
    }
    setLoading(false);
  };

  const SUGGESTIONS = [
    "Find articles about productivity",
    "What should I read about AI?",
    "Career growth tips",
    "Best tech articles this week",
  ];

  return (
    <>
      {/* Floating button */}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:900 }}>
        {!open && (
          <button onClick={()=>setOpen(true)}
            style={{ width:56, height:56, borderRadius:"50%", border:"none",
              background:"linear-gradient(135deg,#4F46E5,#14B8A6)",
              boxShadow:"0 4px 20px rgba(79,70,229,0.4)", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:24, transition:"transform 0.2s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.1)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)"}}>
            🤖
          </button>
        )}
      </div>

      {/* Chat window */}
      {open && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000,
          width:380, height:560, background:"var(--card)", borderRadius:20,
          boxShadow:"0 20px 60px rgba(0,0,0,0.2)", display:"flex",
          flexDirection:"column", overflow:"hidden", fontFamily:"Lato,sans-serif" }}>

          {/* Header */}
          <div style={{ padding:"16px 18px", background:"linear-gradient(135deg,#4F46E5,#14B8A6)",
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"white" }}>Journal Assistant</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%",
                    background: aiReady ? "#4ADE80" : aiReady===false ? "#F87171" : "#FCD34D",
                    display:"inline-block" }} />
                  {aiReady ? "AI Ready" : aiReady===false ? "AI Offline" : "Checking…"}
                </div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)}
              style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:"50%",
                width:28, height:28, cursor:"pointer", color:"white", fontSize:14,
                display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflow:"auto", padding:"14px 16px", display:"flex",
            flexDirection:"column", gap:12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column",
                alignItems: msg.role==="user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth:"85%", padding:"10px 14px", borderRadius:14, fontSize:13,
                  lineHeight:1.6,
                  background: msg.role==="user" ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : "#F8FAFC",
                  color: msg.role==="user" ? "white" : "#1A1A1A",
                  borderBottomRightRadius: msg.role==="user" ? 4 : 14,
                  borderBottomLeftRadius:  msg.role==="user" ? 14 : 4,
                }}>
                  {msg.content || (loading && i===messages.length-1 ? (
                    <span style={{ display:"flex", gap:3 }}>
                      {[0,1,2].map(j=>(
                        <span key={j} style={{ width:6, height:6, borderRadius:"50%",
                          background:"#A0A0A0", display:"inline-block",
                          animation:`bounce 0.8s ${j*0.2}s infinite` }} />
                      ))}
                    </span>
                  ) : "…")}
                </div>
                {/* Source articles */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:5, width:"100%" }}>
                    <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase",
                      letterSpacing:"0.07em", color:"var(--ink-light)" }}>Related Articles</div>
                    {msg.sources.map((s:any) => (
                      <a key={s.slug} href={`/blog/${s.slug}`}
                        style={{ fontSize:12, color:"var(--primary-text)", textDecoration:"none", fontWeight:600,
                          background:"var(--primary-light)", padding:"6px 10px", borderRadius:8,
                          display:"block", border:"1px solid var(--primary-border)" }}>
                        📄 {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Suggestions (only on first message) */}
            {messages.length === 1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.07em", color:"var(--ink-light)" }}>Try asking</div>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={()=>{ setInput(s); setTimeout(()=>send(),50); }}
                    style={{ textAlign:"left", padding:"8px 12px", background:"var(--surface-2)",
                      border:"1px solid var(--border)", borderRadius:8, fontSize:12, cursor:"pointer",
                      fontFamily:"inherit", color:"var(--ink-mid)", transition:"all 0.1s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--primary-light)"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="var(--surface-2)"}}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border-light)",
            display:"flex", gap:8, alignItems:"center" }}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
              placeholder="Ask about articles…" disabled={loading}
              style={{ flex:1, padding:"9px 14px", borderRadius:10,
                border:"1.5px solid var(--border)", outline:"none", fontSize:13,
                fontFamily:"inherit", color:"var(--ink)" }} />
            <button onClick={send} disabled={loading||!input.trim()}
              style={{ width:38, height:38, borderRadius:10,
                background: input.trim()&&!loading ? "linear-gradient(135deg,#4F46E5,#14B8A6)" : "var(--border-light)",
                border:"none", cursor: input.trim()&&!loading ? "pointer" : "not-allowed",
                color: input.trim()&&!loading ? "white" : "#A0A0A0",
                fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s" }}>
              ↑
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-4px); }
        }
      `}</style>
    </>
  );
}