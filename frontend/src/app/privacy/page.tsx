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
            <Link key={l} href={h} style={{ padding:"7px 14px",fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:"#3D3D3D",borderRadius:8,textDecoration:"none" }}>{l}</Link>
          ))}
        </div>
        <Link href="/#newsletter" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none" }}>Subscribe</Link>
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
            <p style={{ fontSize:14,color:"#5D5D5D",lineHeight:1.8,maxWidth:260 }}>Stories That Inspire. Technology That Empowers. Published weekly for curious minds.</p>
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

const sections = [
  { title:"Information We Collect", content:"We collect information you provide directly — your name and email when you subscribe or contact us. We also collect usage data automatically: IP address, browser type, pages visited, and time on page." },
  { title:"How We Use Your Information", content:"We use collected data to send our weekly newsletter (if subscribed), respond to inquiries, improve our content, and analyze reading patterns. We never sell your personal information to third parties." },
  { title:"Cookies & Tracking", content:"We use essential cookies (required for the site), analytics cookies (to understand usage), and preference cookies (to remember your settings). You can control cookies through your browser settings." },
  { title:"Newsletter & Communications", content:"Subscribers receive weekly curated articles. You can unsubscribe at any time using the link in every email. We use Resend as our email provider." },
  { title:"Data Security", content:"We use industry-standard encryption and secure servers. However, no internet transmission is 100% secure, and we cannot guarantee absolute security." },
  { title:"Your Rights", content:"You may have rights to access, correct, or delete your personal data. Contact us at privacy@lifetechjournal.com to exercise these rights." },
  { title:"Third-Party Services", content:"We use Google Analytics (usage data) and AWS CloudFront (content delivery). These services have their own privacy policies." },
  { title:"Changes to This Policy", content:"We may update this policy periodically. We'll notify newsletter subscribers of significant changes and update the date above." },
];

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#FAF8F5" }}>
      <SiteNavbar />
      <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",padding:"64px 32px",textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:"white",marginBottom:10 }}>Privacy Policy</h1>
        <p style={{ color:"rgba(255,255,255,0.6)",fontSize:14 }}>Last updated: January 1, 2025</p>
      </div>
      <main style={{ maxWidth:780,margin:"0 auto",padding:"60px 32px 80px" }}>
        <div style={{ background:"#EEF2FF",borderRadius:14,padding:"18px 24px",marginBottom:36,border:"1px solid #C7D2FE" }}>
          <p style={{ fontSize:14,color:"#4F46E5",lineHeight:1.7 }}><strong>Summary:</strong> We collect minimal data, never sell your information, and respect your privacy.</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
          {sections.map((s,i)=>(
            <div key={s.title}>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,color:"#1A1A1A",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ width:26,height:26,borderRadius:"50%",background:"#EEF2FF",color:"#4F46E5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:"Lato,sans-serif",flexShrink:0 }}>{i+1}</span>
                {s.title}
              </h2>
              <p style={{ fontSize:15,color:"#6B6B6B",lineHeight:1.8,paddingLeft:38 }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:44,padding:"26px 28px",background:"white",borderRadius:16,border:"1px solid #F0EDE8",textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#1A1A1A",marginBottom:8 }}>Questions about your privacy?</h3>
          <p style={{ fontSize:14,color:"#6B6B6B",marginBottom:16 }}>We're happy to help.</p>
          <Link href="/contact" style={{ background:"#4F46E5",color:"white",padding:"10px 24px",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none" }}>Contact Us →</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}