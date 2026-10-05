"use client";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const team = [
  { name:"Tamanna Garg", role:"Founder & Editor-in-Chief", bio:"Started Life & Tech Journal to bring real stories and real technology together in one place. Sets the editorial direction and edits every piece.", emoji:"👩‍💻" },
  { name:"Shailav Garg", role:"Life & Wellness Editor",    bio:"Writes and edits our pieces on personal growth, relationships, and the art of living intentionally.", emoji:"🌱" },
  { name:"Manish Garg",  role:"Tech Writer",               bio:"Covers AI, programming, and the technology trends shaping how we work and live, with a focus on practical takeaways.", emoji:"⚙️" },
];

const values = [
  { icon:"🎯", title:"Depth Over Clickbait",       desc:"Long-form, well-researched content that actually teaches you something. No listicles, no filler." },
  { icon:"🤝", title:"Honesty First",              desc:"Our writers share real experiences — failures included. We don't polish reality to make it look more inspiring than it is." },
  { icon:"🌍", title:"Inclusive Perspective",      desc:"We actively seek writers from diverse backgrounds. Great ideas come from everywhere." },
  { icon:"⚡", title:"Practical Over Theoretical", desc:"Every article should leave you with something actionable — a shift in thinking, a tool to try, or a decision to make." },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 60%,#14B8A6 100%)",padding:"80px 32px",textAlign:"center" }}>
        <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:14 }}>Our Story</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:50,fontWeight:700,color:"white",marginBottom:16,lineHeight:1.1 }}>
          Built for Readers Who<br /><em style={{ fontStyle:"italic" }}>Want Both Depth & Soul</em>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.72)",fontSize:17,maxWidth:560,margin:"0 auto",lineHeight:1.75 }}>
          Life & Tech Journal was born from a simple frustration: most tech blogs felt cold and impersonal, while personal blogs lacked substance. We wanted both.
        </p>
      </div>

      <main style={{ maxWidth:1200,margin:"0 auto",padding:"0 32px" }}>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:-28,marginBottom:72 }}>
          {[["48K+","Monthly Readers"],["320+","Articles Published"],["12K+","Newsletter Subscribers"],["3","Expert Writers"]].map(([n,l])=>(
            <div key={l} style={{ background:"var(--card)",borderRadius:16,padding:"28px 20px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid var(--border-light)" }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,background:"linear-gradient(135deg,#4F46E5,#14B8A6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{n}</div>
              <div style={{ fontSize:12,color:"var(--ink-light)",marginTop:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <section style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:72 }}>
          <div style={{ background:"var(--card)",borderRadius:20,padding:40,border:"1px solid var(--border-light)" }}>
            <div style={{ fontSize:36,marginBottom:14 }}>🎯</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"var(--ink)",marginBottom:12 }}>Our Mission</h2>
            <p style={{ fontSize:15,color:"var(--ink-muted)",lineHeight:1.8 }}>To empower readers with stories that inspire action and knowledge that drives growth — at the intersection of human experience and technological possibility.</p>
            <p style={{ fontSize:15,color:"var(--ink-muted)",lineHeight:1.8,marginTop:12 }}>We believe the best writing happens when honesty meets expertise. That's the standard we hold ourselves to with every article we publish.</p>
          </div>
          <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",borderRadius:20,padding:40 }}>
            <div style={{ fontSize:36,marginBottom:14 }}>👁️</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"white",marginBottom:12 }}>Our Vision</h2>
            <p style={{ fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.8 }}>To become the most trusted independent platform for life and technology storytelling — where a developer in Bangalore and a designer in Berlin both find something that changes how they think.</p>
          </div>
        </section>

        {/* Values */}
        <section style={{ marginBottom:72 }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:8 }}>What We Stand For</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"var(--ink)" }}>Our Values</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18 }}>
            {values.map(v=>(
              <div key={v.title} style={{ background:"var(--card)",borderRadius:16,padding:"26px 28px",border:"1px solid var(--border-light)",display:"flex",gap:18 }}>
                <div style={{ fontSize:30,flexShrink:0 }}>{v.icon}</div>
                <div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"var(--ink)",marginBottom:6 }}>{v.title}</h3>
                  <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.75 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team" style={{ marginBottom:72 }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:8 }}>The People</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"var(--ink)" }}>Meet the Team</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,maxWidth:900,margin:"0 auto" }}>
            {team.map(m=>(
              <div key={m.name} style={{ background:"var(--card)",borderRadius:18,padding:26,border:"1px solid var(--border-light)",textAlign:"center" }}>
                <div style={{ width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px" }}>{m.emoji}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:3 }}>{m.name}</h3>
                <p style={{ fontSize:11,fontWeight:700,color:"var(--primary-text)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10 }}>{m.role}</p>
                <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.65 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)",borderRadius:24,padding:"52px 48px",textAlign:"center",marginBottom:0 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:"white",marginBottom:10 }}>Want to Write for Us?</h2>
          <p style={{ color:"rgba(255,255,255,0.75)",fontSize:15,marginBottom:26,maxWidth:400,margin:"0 auto 26px" }}>We're always looking for thoughtful writers with something real to say.</p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <Link href="/contact" style={{ background:"var(--card)",color:"var(--primary-text)",padding:"11px 26px",borderRadius:10,fontWeight:700,fontSize:14,textDecoration:"none" }}>Get in Touch →</Link>
            <Link href="/blog" style={{ background:"rgba(255,255,255,0.15)",color:"white",padding:"11px 26px",borderRadius:10,fontWeight:700,fontSize:14,textDecoration:"none",border:"1.5px solid rgba(255,255,255,0.3)" }}>Read Our Articles</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}