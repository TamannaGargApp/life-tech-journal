"use client";
import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

function SiteNavbar() {
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
          {[["Home","/"],["Life","/blog?group=life"],["Technology","/blog?group=tech"],["About","/about"],["Contact","/contact"]].map(([l,h])=>(
            <Link key={l} href={h} style={{ padding:"7px 14px",fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:"#3D3D3D",borderRadius:8,textDecoration:"none" }}>{l}</Link>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <Link href="/auth/login" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,border:"1.5px solid #E8E4DE",borderRadius:8,color:"#3D3D3D",textDecoration:"none" }}>Sign In</Link>
          <Link href="/newsletter" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none" }}>Subscribe</Link>
        </div>
      </div>
    </nav>
  );
}

function SiteFooter() {
  const cols = [
    { title:"Life", links:[["Personal Growth","/blog?category=personal-growth"],["Career","/blog?category=career"],["Lifestyle","/blog?category=lifestyle"],["Productivity","/blog?category=productivity"],["Travel","/blog?category=travel"],["Motivation","/blog?category=motivation"]] },
    { title:"Technology", links:[["AI & ML","/blog?category=ai"],["Programming","/blog?category=programming"],["Web Development","/blog?category=web-dev"],["Digital Marketing","/blog?category=marketing"],["Cloud Computing","/blog?category=cloud"],["Data Science","/blog?category=data-science"]] },
    { title:"Company", links:[["About Us","/about"],["Write for Us","/write"],["Newsletter","/newsletter"],["Contact","/contact"],["Privacy Policy","/privacy"]] },
  ];
  return (
    <footer style={{ background:"#1A1A1A",marginTop:80 }}>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"64px 32px 0" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1.8fr 1fr 1fr 1fr",gap:48,paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:"white",marginBottom:14 }}>Life <span style={{ color:"#818CF8" }}>&</span> Tech Journal</div>
            <p style={{ fontSize:14,color:"#5D5D5D",lineHeight:1.8,maxWidth:260,marginBottom:24 }}>Stories That Inspire. Technology That Empowers. Published weekly.</p>
            <div style={{ display:"flex",gap:10 }}>
              {["𝕏","in","📸","▶"].map(icon=>(
                <span key={icon} style={{ width:36,height:36,borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#6B7280",fontSize:13,cursor:"pointer" }}>{icon}</span>
              ))}
            </div>
          </div>
          {cols.map(col=>(
            <div key={col.title}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.3)",marginBottom:20 }}>{col.title}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {col.links.map(([label,href])=>(
                  <Link key={label} href={href} style={{ fontSize:14,color:"#5D5D5D",textDecoration:"none" }}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",padding:"20px 0",fontSize:13,color:"#4B4B4B" }}>
          <span>© 2025 Life & Tech Journal. All rights reserved.</span>
          <div style={{ display:"flex",gap:24 }}>
            {[["Privacy","/privacy"],["Terms","/terms"],["Sitemap","/sitemap.xml"]].map(([l,h])=>(
              <Link key={l} href={h} style={{ color:"#4B4B4B",textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const editions = [
  { emoji:"🤖", tag:"AI & Tech",      title:"GPT-5 Is Here: What Changes for Developers?",   preview:"A deep-dive into what the latest model means for your workflow, your tools, and your job." },
  { emoji:"🌱", tag:"Personal Growth", title:"The 5-Minute Journaling Practice That Actually Sticks", preview:"Why most journaling advice fails — and what works instead, backed by research." },
  { emoji:"💼", tag:"Career",          title:"From IC to Manager: The Hardest Transition in Tech", preview:"Real stories from engineers who made the leap — and what they wish they knew beforehand." },
  { emoji:"🌐", tag:"Web Dev",         title:"Next.js 15 Server Actions: A Production Postmortem", preview:"Six months of using Server Actions in production. What worked, what didn't, what we'd do differently." },
];

export default function NewsletterPage() {
  const [email,  setEmail]  = useState("");
  const [name,   setName]   = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubscribe = async () => {
    if (!email) { setErrMsg("Please enter your email address"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrMsg("Please enter a valid email"); return; }
    setStatus("loading"); setErrMsg("");
    try {
      const res  = await fetch(`${API}/newsletter/subscribe`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.detail ?? "Something went wrong"); setStatus("error"); return; }
      setStatus("success");
    } catch { setErrMsg("Network error. Please try again."); setStatus("error"); }
  };

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#FAF8F5" }}>
      <SiteNavbar />

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)",padding:"88px 32px 80px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-80,left:-80,width:320,height:320,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none" }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(8px)",borderRadius:100,padding:"6px 16px",marginBottom:20 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#10B981",display:"inline-block" }} />
            <span style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.9)",letterSpacing:"0.06em" }}>Published every Tuesday</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,6vw,58px)",fontWeight:700,color:"white",marginBottom:16,lineHeight:1.1 }}>
            Stories Worth<br /><em style={{ fontStyle:"italic" }}>Opening Every Tuesday</em>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.75)",fontSize:17,maxWidth:500,margin:"0 auto 40px",lineHeight:1.75 }}>
            Join 12,000+ curious readers. Each week: one life story, one tech insight, one career lesson — curated by our editors.
          </p>

          {/* Subscribe form */}
          {status === "success" ? (
            <div style={{ background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",borderRadius:16,padding:"28px 40px",display:"inline-block",maxWidth:480,width:"100%" }}>
              <div style={{ fontSize:40,marginBottom:12 }}>🎉</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"white",marginBottom:8 }}>You're in!</h3>
              <p style={{ color:"rgba(255,255,255,0.8)",fontSize:14,lineHeight:1.7 }}>
                Welcome to the community. Your first issue arrives next Tuesday. Check your inbox for a confirmation.
              </p>
            </div>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.1)",backdropFilter:"blur(8px)",borderRadius:16,padding:28,maxWidth:480,margin:"0 auto",border:"1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="First name (optional)"
                  style={{ width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:14,outline:"none",fontFamily:"inherit" }} />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSubscribe()}
                  placeholder="Your email address *"
                  style={{ width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.95)",color:"#1A1A1A",fontSize:14,outline:"none",fontFamily:"inherit" }} />
                {errMsg && <p style={{ color:"#FCA5A5",fontSize:13,textAlign:"left" }}>⚠ {errMsg}</p>}
                <button onClick={handleSubscribe} disabled={status==="loading"}
                  style={{ width:"100%",padding:"14px",background:"#111827",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:15,cursor:status==="loading"?"not-allowed":"pointer",fontFamily:"inherit",transition:"all 0.2s",opacity:status==="loading"?0.7:1 }}>
                  {status==="loading" ? "Subscribing…" : "Subscribe Free →"}
                </button>
              </div>
              <div style={{ display:"flex",gap:20,justifyContent:"center",marginTop:14 }}>
                {["✅ No spam","📧 Every Tuesday","🔓 Unsubscribe anytime"].map(t=>(
                  <span key={t} style={{ color:"rgba(255,255,255,0.6)",fontSize:12 }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <main style={{ maxWidth:1100,margin:"0 auto",padding:"0 32px" }}>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:-28,marginBottom:72 }}>
          {[["12,000+","Subscribers"],["48K+","Monthly Readers"],["52","Issues Published"],["98%","Open Rate"]].map(([n,l])=>(
            <div key={l} style={{ background:"white",borderRadius:16,padding:"24px 20px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid #F0EDE8" }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,background:"linear-gradient(135deg,#4F46E5,#14B8A6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{n}</div>
              <div style={{ fontSize:12,color:"#A0A0A0",marginTop:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* What's inside */}
        <section style={{ marginBottom:72 }}>
          <div style={{ textAlign:"center",marginBottom:44 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#A0A0A0",marginBottom:8 }}>Every Issue</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"#1A1A1A" }}>What You Get Each Tuesday</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
            {[
              { icon:"📖", title:"1 Deep-Dive Article",    desc:"A long-form piece — either a life story or a technology breakdown — that actually teaches you something." },
              { icon:"⚡", title:"1 Quick Insight",        desc:"A short, punchy observation about something happening in tech or life that's worth paying attention to." },
              { icon:"🔗", title:"3 Links Worth Your Time",desc:"The best content we found across the internet that week — hand-picked, not algorithmic." },
              { icon:"💬", title:"Reader Question",         desc:"One reader asks something real. We answer it honestly, sometimes with input from the whole team." },
              { icon:"🛠️", title:"Tool or Resource",       desc:"Something practical — a tool, template, book, or resource that's actually useful in your work or life." },
              { icon:"🎯", title:"One Thing to Try",       desc:"A small, concrete action you can take this week based on what we covered. Actionable, not theoretical." },
            ].map(item=>(
              <div key={item.title} style={{ background:"white",borderRadius:16,padding:"24px 22px",border:"1px solid #F0EDE8" }}>
                <div style={{ fontSize:28,marginBottom:12 }}>{item.icon}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1A1A1A",marginBottom:6 }}>{item.title}</h3>
                <p style={{ fontSize:13,color:"#6B6B6B",lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Past editions */}
        <section style={{ marginBottom:72 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32 }}>
            <div>
              <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#A0A0A0",marginBottom:6 }}>Archive</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1A1A1A" }}>Recent Editions</h2>
            </div>
            <Link href="/blog" style={{ fontSize:13,fontWeight:700,color:"#4F46E5",textDecoration:"none",border:"1.5px solid #4F46E5",padding:"7px 16px",borderRadius:8 }}>View All Articles →</Link>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {editions.map((e,i)=>(
              <div key={i} style={{ background:"white",borderRadius:14,padding:"20px 24px",border:"1px solid #F0EDE8",display:"flex",alignItems:"center",gap:20,transition:"all 0.2s",cursor:"pointer" }}
                onMouseEnter={el=>{(el.currentTarget as HTMLElement).style.borderColor="#C7D2FE";(el.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(79,70,229,0.08)"}}
                onMouseLeave={el=>{(el.currentTarget as HTMLElement).style.borderColor="#F0EDE8";(el.currentTarget as HTMLElement).style.boxShadow="none"}}>
                <div style={{ fontSize:32,flexShrink:0 }}>{e.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#4F46E5",background:"#EEF2FF",padding:"2px 8px",borderRadius:100,display:"inline-block",marginBottom:6 }}>{e.tag}</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1A1A1A",marginBottom:4 }}>{e.title}</h3>
                  <p style={{ fontSize:13,color:"#6B6B6B",lineHeight:1.6 }}>{e.preview}</p>
                </div>
                <div style={{ fontSize:18,color:"#D1D5DB",flexShrink:0 }}>→</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ marginBottom:72 }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#A0A0A0",marginBottom:8 }}>What Readers Say</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"#1A1A1A" }}>Loved by 12,000+ Readers</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18 }}>
            {[
              { name:"Rahul M.",   role:"Software Engineer, Bangalore",   text:"The only newsletter I actually read every week. The mix of tech and life content is exactly what I needed." },
              { name:"Shreya K.", role:"Product Manager, Mumbai",          text:"I've recommended this to my entire team. The career articles alone are worth subscribing for." },
              { name:"Karan P.",  role:"Freelance Designer, Hyderabad",   text:"What I love most is the writing quality. It actually feels like someone took time to craft each piece." },
            ].map(t=>(
              <div key={t.name} style={{ background:"white",borderRadius:16,padding:"26px 24px",border:"1px solid #F0EDE8" }}>
                <div style={{ fontSize:28,color:"#4F46E5",marginBottom:14,fontFamily:"Georgia,serif",lineHeight:1 }}>"</div>
                <p style={{ fontSize:14,color:"#3D3D3D",lineHeight:1.75,marginBottom:18,fontStyle:"italic" }}>{t.text}</p>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"white",fontWeight:700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:"#1A1A1A" }}>{t.name}</div>
                    <div style={{ fontSize:11,color:"#A0A0A0" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)",borderRadius:24,padding:"56px 48px",textAlign:"center",marginBottom:0 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"white",marginBottom:10 }}>Ready to Join?</h2>
          <p style={{ color:"rgba(255,255,255,0.75)",fontSize:16,marginBottom:32,maxWidth:420,margin:"0 auto 32px" }}>
            12,000+ readers can't be wrong. Subscribe free — unsubscribe anytime.
          </p>
          {status==="success" ? (
            <div style={{ background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"16px 32px",display:"inline-block",color:"white",fontSize:16,fontWeight:600 }}>
              🎉 You're already subscribed!
            </div>
          ) : (
            <div style={{ display:"flex",gap:10,maxWidth:420,margin:"0 auto" }}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex:1,padding:"13px 18px",borderRadius:10,border:"none",outline:"none",fontSize:14,fontFamily:"inherit" }} />
              <button onClick={handleSubscribe} disabled={status==="loading"}
                style={{ padding:"13px 22px",borderRadius:10,background:"#111827",color:"white",fontWeight:700,border:"none",cursor:"pointer",fontSize:14,whiteSpace:"nowrap",fontFamily:"inherit" }}>
                {status==="loading"?"…":"Subscribe →"}
              </button>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}