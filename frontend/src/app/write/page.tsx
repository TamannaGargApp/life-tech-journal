"use client";
import { useState } from "react";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";

export default function WritePage() {
  const [form, setForm] = useState({ name:"", email:"", topic:"", sample:"", category:"" });
  const [submitted, setSubmitted] = useState(false);

  const guidelines = [
    { icon:"📝", title:"Original Content", desc:"All submissions must be 100% original and not published elsewhere. We check for plagiarism." },
    { icon:"📏", title:"Length: 800–3000 words", desc:"We prefer in-depth, well-structured articles. Listicles and fluff pieces are rarely accepted." },
    { icon:"🔗", title:"Cite Your Sources", desc:"Any claims, statistics, or research must be linked to credible sources." },
    { icon:"🖼️", title:"Include Visuals", desc:"If relevant, include suggestions for images, diagrams, or code blocks to support your writing." },
    { icon:"✅", title:"First-Person Voice", desc:"Write from your own experience. Readers connect with authentic, personal storytelling." },
    { icon:"⏱️", title:"Response in 5 Days", desc:"We review every pitch and respond within 5 business days with feedback or an acceptance." },
  ];

  const cats = ["Personal Growth","Career","Lifestyle","Productivity","Travel","Motivation","AI & ML","Programming","Web Development","Digital Marketing","Cybersecurity","Cloud Computing","Data Science"];

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 60%,#14B8A6 100%)",padding:"72px 32px",textAlign:"center" }}>
        <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:14 }}>Contribute</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:50,fontWeight:700,color:"white",marginBottom:14,lineHeight:1.1 }}>Write for<br /><em>Life & Tech Journal</em></h1>
        <p style={{ color:"rgba(255,255,255,0.72)",fontSize:17,maxWidth:520,margin:"0 auto",lineHeight:1.75 }}>
          Share your expertise, experiences, and ideas with 48,000+ monthly readers. We pay for accepted articles.
        </p>
      </div>

      <main style={{ maxWidth:1100,margin:"0 auto",padding:"0 32px" }}>
        {/* Perks */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:-28,marginBottom:72 }}>
          {[["💰","We Pay","Competitive rates for every accepted article. Rates vary by word count and topic."],["📈","Big Audience","Your work reaches 48,000+ monthly readers across 40+ countries."],["🚀","Career Boost","Published articles help build your personal brand and online authority."]].map(([icon,title,desc])=>(
            <div key={title} style={{ background:"var(--card)",borderRadius:16,padding:"28px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid var(--border-light)",textAlign:"center" }}>
              <div style={{ fontSize:32,marginBottom:12 }}>{icon}</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 380px",gap:40,marginBottom:80 }}>
          {/* Guidelines */}
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"var(--ink)",marginBottom:28 }}>Submission Guidelines</h2>
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              {guidelines.map(g=>(
                <div key={g.title} style={{ background:"var(--card)",borderRadius:14,padding:"20px 22px",border:"1px solid var(--border-light)",display:"flex",gap:16 }}>
                  <div style={{ fontSize:24,flexShrink:0 }}>{g.icon}</div>
                  <div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:4 }}>{g.title}</h3>
                    <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.65 }}>{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pitch Form */}
          <div>
            {submitted ? (
              <div style={{ background:"var(--card)",borderRadius:20,padding:40,border:"1px solid var(--border-light)",textAlign:"center" }}>
                <div style={{ fontSize:52,marginBottom:16 }}>🎉</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>Pitch Received!</h2>
                <p style={{ color:"var(--ink-muted)",lineHeight:1.7,marginBottom:24 }}>We'll review your pitch and get back to you at <strong>{form.email}</strong> within 5 business days.</p>
                <button onClick={()=>setSubmitted(false)} style={{ background:"#4F46E5",color:"white",padding:"10px 24px",borderRadius:8,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit" }}>Submit Another</button>
              </div>
            ) : (
              <div style={{ background:"var(--card)",borderRadius:20,padding:36,border:"1px solid var(--border-light)",position:"sticky",top:90 }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"var(--ink)",marginBottom:24 }}>Submit Your Pitch</h2>
                {[["Name","name","text","Aryan Joshi"],["Email","email","email","aryan@example.com"],["Article Topic / Headline","topic","text","5 Things I Learned Building My First SaaS…"]].map(([label,field,type,ph])=>(
                  <div key={field} style={{ marginBottom:16 }}>
                    <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>{label}</label>
                    <input type={type} value={(form as any)[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}
                      style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid var(--border)",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--ink)" }} />
                  </div>
                ))}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>Category</label>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                    style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid var(--border)",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--ink)",background:"var(--card)" }}>
                    <option value="">Select a category…</option>
                    {cats.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>Brief Description (200–300 words)</label>
                  <textarea value={form.sample} onChange={e=>setForm(f=>({...f,sample:e.target.value}))} rows={5} placeholder="Describe your article idea, your angle, and why readers of Life & Tech Journal would find it valuable…"
                    style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid var(--border)",outline:"none",fontSize:13,fontFamily:"inherit",color:"var(--ink)",resize:"vertical",lineHeight:1.65 }} />
                </div>
                <button onClick={()=>setSubmitted(true)} style={{ width:"100%",padding:"13px",background:"#4F46E5",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(79,70,229,0.3)" }}>
                  Submit Pitch →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}