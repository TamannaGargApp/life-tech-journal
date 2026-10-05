"use client";
import { useState } from "react";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

type Status = "idle"|"loading"|"success"|"error";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:"var(--card)",borderRadius:14,border:`1.5px solid ${open?"var(--primary-border)":"var(--border-light)"}`,overflow:"hidden",transition:"border-color 0.2s" }}>
      <button onClick={() => setOpen(o=>!o)}
        style={{ width:"100%",textAlign:"left",padding:"20px 22px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,fontFamily:"inherit" }}>
        <span style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--ink)",lineHeight:1.35 }}>{q}</span>
        <span style={{ fontSize:18,color:"var(--primary-text)",flexShrink:0,transform:open?"rotate(45deg)":"rotate(0)",transition:"transform 0.2s" }}>+</span>
      </button>
      {open && (
        <div style={{ padding:"0 22px 20px",fontSize:14,color:"var(--ink-muted)",lineHeight:1.75,borderTop:"1px solid var(--border-light)" }}>
          <div style={{ paddingTop:14 }}>{a}</div>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name:"",email:"",subject:"",message:"",type:"general" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20) e.message = "At least 20 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1200));
    setStatus("success");
  };

  const update = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => { const n={...e}; delete n[field]; return n; });
  };

  const inquiryTypes = [
    { value:"general",       label:"General",    icon:"💬" },
    { value:"write",         label:"Write for Us",icon:"✍️" },
    { value:"advertising",   label:"Advertising",icon:"📣" },
    { value:"collaboration", label:"Collab",     icon:"🤝" },
    { value:"press",         label:"Press",      icon:"📰" },
    { value:"technical",     label:"Support",    icon:"🛠️" },
  ];

  const faqs = [
    { q:"How do I submit an article?", a:"Fill out the contact form selecting 'Write for Us', include your topic idea and a brief bio. We review all submissions within 5 business days." },
    { q:"What topics do you cover?",   a:"Life & personal development (career, lifestyle, productivity, travel) and technology (AI, web dev, programming, marketing, cloud, data science)." },
    { q:"Do you accept sponsored content?", a:"Yes — limited sponsored posts that align with our editorial standards. Select 'Advertising' and we'll share our media kit." },
    { q:"How long does it take to get a reply?", a:"We aim to respond within 24 hours on weekdays. Complex proposals may take up to 3 business days." },
  ];

  const inputStyle = (field: string) => ({
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${errors[field]?"#EF4444":"var(--border)"}`,
    outline:"none", fontSize:14, fontFamily:"inherit", color:"var(--ink)",
    background: errors[field]?"#FEF2F2":"var(--card)", transition:"border-color 0.15s",
  } as React.CSSProperties);

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 60%,#14B8A6 100%)",padding:"72px 32px",textAlign:"center" }}>
        <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:14 }}>Get In Touch</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:50,fontWeight:700,color:"white",marginBottom:14,lineHeight:1.1 }}>We'd Love to<br /><em style={{ fontStyle:"italic" }}>Hear From You</em></h1>
        <p style={{ color:"rgba(255,255,255,0.72)",fontSize:17,maxWidth:520,margin:"0 auto",lineHeight:1.75 }}>Whether you want to write for us, collaborate, advertise, or just say hello — we're here.</p>
      </div>

      <main style={{ maxWidth:1200,margin:"0 auto",padding:"0 32px" }}>

        {/* Info cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:-28,marginBottom:64 }}>
          {[["📧","Email Us","hello@lifetechjournal.com","Reply within 24 hours"],["𝕏","Twitter / X","@lifetechjournal","Join the conversation"],["in","LinkedIn","Life & Tech Journal","Connect professionally"],["📸","Instagram","@lifetechjournal","DM us anytime"]].map(([icon,title,value,sub])=>(
            <div key={title} style={{ background:"var(--card)",borderRadius:16,padding:"24px 20px",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid var(--border-light)",textAlign:"center",transition:"all 0.2s",cursor:"pointer" }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="translateY(-4px)";el.style.boxShadow="0 8px 28px rgba(79,70,229,0.12)";}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="translateY(0)";el.style.boxShadow="0 4px 20px rgba(0,0,0,0.07)";}}>
              <div style={{ fontSize:28,marginBottom:10 }}>{icon}</div>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ink-light)",marginBottom:5 }}>{title}</div>
              <div style={{ fontSize:14,fontWeight:700,color:"var(--ink)",marginBottom:3 }}>{value}</div>
              <div style={{ fontSize:12,color:"var(--ink-light)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Form + Sidebar */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:40,marginBottom:80 }}>

          {/* Form */}
          <div style={{ background:"var(--card)",borderRadius:20,padding:"40px 44px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid var(--border-light)" }}>
            {status==="success" ? (
              <div style={{ textAlign:"center",padding:"48px 0" }}>
                <div style={{ fontSize:56,marginBottom:20 }}>🎉</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"var(--ink)",marginBottom:12 }}>Message Sent!</h2>
                <p style={{ color:"var(--ink-muted)",fontSize:15,lineHeight:1.7,marginBottom:28 }}>Thank you! We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
                <button onClick={()=>{setStatus("idle");setForm({name:"",email:"",subject:"",message:"",type:"general"});}}
                  style={{ background:"#4F46E5",color:"white",padding:"12px 28px",borderRadius:10,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit" }}>
                  Send Another →
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:28 }}>
                  <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:6 }}>Contact Form</p>
                  <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--ink)" }}>Send Us a Message</h2>
                </div>

                {/* Type selector */}
                <div style={{ marginBottom:22 }}>
                  <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:10 }}>What's this about?</label>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
                    {inquiryTypes.map(t=>(
                      <button key={t.value} onClick={()=>update("type",t.value)}
                        style={{ padding:"10px 8px",borderRadius:10,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,textAlign:"center",transition:"all 0.15s",
                          borderColor:form.type===t.value?"#4F46E5":"var(--border)",
                          background: form.type===t.value?"var(--primary-light)":"var(--card)",
                          color:      form.type===t.value?"#4F46E5":"var(--ink-muted)" }}>
                        <div style={{ fontSize:18,marginBottom:4 }}>{t.icon}</div>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
                  <div>
                    <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>Full Name *</label>
                    <input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Aryan Joshi" style={inputStyle("name")} />
                    {errors.name && <span style={{ fontSize:11,color:"#EF4444",marginTop:3,display:"block" }}>⚠ {errors.name}</span>}
                  </div>
                  <div>
                    <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>Email Address *</label>
                    <input value={form.email} onChange={e=>update("email",e.target.value)} type="email" placeholder="aryan@example.com" style={inputStyle("email")} />
                    {errors.email && <span style={{ fontSize:11,color:"#EF4444",marginTop:3,display:"block" }}>⚠ {errors.email}</span>}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>Subject *</label>
                  <input value={form.subject} onChange={e=>update("subject",e.target.value)} placeholder="What would you like to discuss?" style={inputStyle("subject")} />
                  {errors.subject && <span style={{ fontSize:11,color:"#EF4444",marginTop:3,display:"block" }}>⚠ {errors.subject}</span>}
                </div>

                {/* Message */}
                <div style={{ marginBottom:24 }}>
                  <label style={{ fontSize:13,fontWeight:700,color:"var(--ink-mid)",display:"block",marginBottom:6 }}>Message *</label>
                  <textarea value={form.message} onChange={e=>update("message",e.target.value)} rows={5}
                    placeholder="Tell us more — the more detail, the better we can help..."
                    style={{ ...inputStyle("message"), resize:"vertical", lineHeight:1.65 } as React.CSSProperties} />
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:3 }}>
                    {errors.message ? <span style={{ fontSize:11,color:"#EF4444" }}>⚠ {errors.message}</span> : <span />}
                    <span style={{ fontSize:11,color:"var(--ink-light)" }}>{form.message.length} chars</span>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={status==="loading"}
                  style={{ width:"100%",padding:"14px",background:status==="loading"?"#6366f1":"#4F46E5",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:status==="loading"?"not-allowed":"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(79,70,229,0.3)",transition:"all 0.2s" }}>
                  {status==="loading" ? "Sending…" : "Send Message →"}
                </button>
                <p style={{ fontSize:12,color:"var(--ink-light)",textAlign:"center",marginTop:12 }}>We respect your privacy. Your information will never be shared.</p>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display:"flex",flexDirection:"column",gap:18 }}>
            <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",borderRadius:18,padding:28 }}>
              <div style={{ fontSize:28,marginBottom:12 }}>⚡</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"white",marginBottom:10 }}>Quick Response</h3>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.7,marginBottom:18 }}>We read every message and reply personally.</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {[["💬 General","24 hours"],["✍️ Write for Us","48 hours"],["📣 Advertising","2 business days"],["🤝 Partnerships","3 business days"]].map(([t,time])=>(
                  <div key={t} style={{ display:"flex",justifyContent:"space-between",fontSize:13 }}>
                    <span style={{ color:"rgba(255,255,255,0.6)" }}>{t}</span>
                    <span style={{ color:"white",fontWeight:600 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:"var(--card)",borderRadius:18,padding:24,border:"1px solid var(--border-light)" }}>
              <div style={{ fontSize:26,marginBottom:10 }}>✍️</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>Write for Us</h3>
              <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.7,marginBottom:14 }}>We accept pitches from writers in tech, career, and personal growth. We pay for accepted articles.</p>
              <Link href="/write" style={{ display:"block",textAlign:"center",padding:"9px",background:"var(--primary-light)",color:"var(--primary-text)",borderRadius:10,fontWeight:700,fontSize:13,textDecoration:"none",border:"1.5px solid var(--primary-border)" }}>Submit a Pitch →</Link>
            </div>

            <div style={{ background:"var(--cream)",borderRadius:18,padding:22,border:"1px solid var(--border)" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"var(--ink)",marginBottom:14 }}>🕐 Response Hours</h3>
              {[["Mon – Fri","9 AM – 6 PM IST"],["Saturday","10 AM – 2 PM IST"],["Sunday","Closed"]].map(([day,time])=>(
                <div key={day} style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8 }}>
                  <span style={{ color:"var(--ink-muted)" }}>{day}</span>
                  <span style={{ color:"var(--ink)",fontWeight:600 }}>{time}</span>
                </div>
              ))}
              <div style={{ marginTop:12,padding:"8px 12px",background:"#D1FAE5",borderRadius:8,fontSize:12,color:"#065F46",fontWeight:600 }}>🟢 Currently within response hours</div>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <section style={{ marginBottom:80 }}>
          <div style={{ textAlign:"center",marginBottom:36 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:8 }}>FAQ</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:"var(--ink)" }}>Common Questions</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            {faqs.map((f,i)=><FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)",borderRadius:24,padding:"52px 48px",textAlign:"center",marginBottom:0 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:"white",marginBottom:10 }}>Stay in the Loop</h2>
          <p style={{ color:"rgba(255,255,255,0.75)",fontSize:15,marginBottom:28,maxWidth:400,margin:"0 auto 28px" }}>Subscribe for weekly articles on life, technology, and everything in between.</p>
          <div style={{ display:"flex",gap:10,maxWidth:420,margin:"0 auto" }}>
            <input type="email" placeholder="your@email.com" style={{ flex:1,padding:"12px 18px",borderRadius:10,border:"none",outline:"none",fontSize:14,fontFamily:"inherit" }} />
            <button style={{ padding:"12px 22px",borderRadius:10,background:"#111827",color:"white",fontWeight:700,border:"none",cursor:"pointer",fontSize:14,whiteSpace:"nowrap",fontFamily:"inherit" }}>Subscribe →</button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}