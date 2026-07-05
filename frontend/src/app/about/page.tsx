"use client";
import Link from "next/link";

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
            <Link key={l} href={h} style={{ padding:"7px 14px",fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:l==="About"?"#4F46E5":"#3D3D3D",borderRadius:8,textDecoration:"none" }}>{l}</Link>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <Link href="/auth/login" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,border:"1.5px solid #E8E4DE",borderRadius:8,color:"#3D3D3D",textDecoration:"none" }}>Sign In</Link>
          <Link href="/#newsletter" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none" }}>Subscribe</Link>
        </div>
      </div>
    </nav>
  );
}

function SiteFooter() {
  const cols = [
    { title:"Life", links:[["Personal Growth","/blog?category=personal-growth"],["Career","/blog?category=career"],["Lifestyle","/blog?category=lifestyle"],["Productivity","/blog?category=productivity"],["Travel","/blog?category=travel"],["Motivation","/blog?category=motivation"]] },
    { title:"Technology", links:[["AI & ML","/blog?category=ai"],["Programming","/blog?category=programming"],["Web Development","/blog?category=web-dev"],["Digital Marketing","/blog?category=marketing"],["Cloud Computing","/blog?category=cloud"],["Data Science","/blog?category=data-science"]] },
    { title:"Company", links:[["About Us","/about"],["Write for Us","/write"],["Newsletter","/#newsletter"],["Contact","/contact"],["Privacy Policy","/privacy"]] },
  ];
  return (
    <footer style={{ background:"#1A1A1A",marginTop:80 }}>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"64px 32px 0" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1.8fr 1fr 1fr 1fr",gap:48,paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:22,color:"white",marginBottom:14 }}>Life <span style={{ color:"#818CF8" }}>&</span> Tech Journal</div>
            <p style={{ fontSize:14,color:"#5D5D5D",lineHeight:1.8,maxWidth:260,marginBottom:24 }}>Stories That Inspire. Technology That Empowers. Published weekly for curious minds.</p>
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

const team = [
  { name:"Aryan Joshi",  role:"Founder & Editor-in-Chief",  bio:"Former software engineer turned writer. Built this platform to merge real stories with real technology.", emoji:"👨‍💻" },
  { name:"Priya Mehta",  role:"Life & Wellness Editor",      bio:"Certified life coach. Writes about personal growth, relationships, and the art of living intentionally.", emoji:"🌱" },
  { name:"Vikram Singh", role:"Career & Startup Writer",     bio:"Ex-startup founder with two exits. Writes about entrepreneurship, leadership, and building from scratch.", emoji:"🚀" },
  { name:"Neha Sharma",  role:"Marketing & SEO Editor",      bio:"10+ years in digital marketing. Helps brands find their voice and grow organically online.", emoji:"📣" },
];

const values = [
  { icon:"🎯", title:"Depth Over Clickbait",       desc:"Long-form, well-researched content that actually teaches you something. No listicles, no filler." },
  { icon:"🤝", title:"Honesty First",              desc:"Our writers share real experiences — failures included. We don't polish reality to make it look more inspiring than it is." },
  { icon:"🌍", title:"Inclusive Perspective",      desc:"We actively seek writers from diverse backgrounds. Great ideas come from everywhere." },
  { icon:"⚡", title:"Practical Over Theoretical", desc:"Every article should leave you with something actionable — a shift in thinking, a tool to try, or a decision to make." },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#FAF8F5" }}>
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
          {[["48K+","Monthly Readers"],["320+","Articles Published"],["12K+","Newsletter Subscribers"],["4+","Expert Writers"]].map(([n,l])=>(
            <div key={l} style={{ background:"white",borderRadius:16,padding:"28px 20px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid #F0EDE8" }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,background:"linear-gradient(135deg,#4F46E5,#14B8A6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{n}</div>
              <div style={{ fontSize:12,color:"#A0A0A0",marginTop:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <section style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:72 }}>
          <div style={{ background:"white",borderRadius:20,padding:40,border:"1px solid #F0EDE8" }}>
            <div style={{ fontSize:36,marginBottom:14 }}>🎯</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#1A1A1A",marginBottom:12 }}>Our Mission</h2>
            <p style={{ fontSize:15,color:"#6B6B6B",lineHeight:1.8 }}>To empower readers with stories that inspire action and knowledge that drives growth — at the intersection of human experience and technological possibility.</p>
            <p style={{ fontSize:15,color:"#6B6B6B",lineHeight:1.8,marginTop:12 }}>We believe the best writing happens when honesty meets expertise. That's the standard we hold ourselves to with every article we publish.</p>
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
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#A0A0A0",marginBottom:8 }}>What We Stand For</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"#1A1A1A" }}>Our Values</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18 }}>
            {values.map(v=>(
              <div key={v.title} style={{ background:"white",borderRadius:16,padding:"26px 28px",border:"1px solid #F0EDE8",display:"flex",gap:18 }}>
                <div style={{ fontSize:30,flexShrink:0 }}>{v.icon}</div>
                <div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1A1A1A",marginBottom:6 }}>{v.title}</h3>
                  <p style={{ fontSize:13,color:"#6B6B6B",lineHeight:1.75 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team" style={{ marginBottom:72 }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#A0A0A0",marginBottom:8 }}>The People</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:"#1A1A1A" }}>Meet the Team</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18 }}>
            {team.map(m=>(
              <div key={m.name} style={{ background:"white",borderRadius:18,padding:26,border:"1px solid #F0EDE8",textAlign:"center" }}>
                <div style={{ width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px" }}>{m.emoji}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1A1A1A",marginBottom:3 }}>{m.name}</h3>
                <p style={{ fontSize:11,fontWeight:700,color:"#4F46E5",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10 }}>{m.role}</p>
                <p style={{ fontSize:13,color:"#6B6B6B",lineHeight:1.65 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)",borderRadius:24,padding:"52px 48px",textAlign:"center",marginBottom:0 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:"white",marginBottom:10 }}>Want to Write for Us?</h2>
          <p style={{ color:"rgba(255,255,255,0.75)",fontSize:15,marginBottom:26,maxWidth:400,margin:"0 auto 26px" }}>We're always looking for thoughtful writers with something real to say.</p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <Link href="/contact" style={{ background:"white",color:"#4F46E5",padding:"11px 26px",borderRadius:10,fontWeight:700,fontSize:14,textDecoration:"none" }}>Get in Touch →</Link>
            <Link href="/blog" style={{ background:"rgba(255,255,255,0.15)",color:"white",padding:"11px 26px",borderRadius:10,fontWeight:700,fontSize:14,textDecoration:"none",border:"1.5px solid rgba(255,255,255,0.3)" }}>Read Our Articles</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}