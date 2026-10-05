"use client";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const terms = [
  { title:"Acceptance of Terms",    content:"By accessing Life & Tech Journal, you accept these Terms of Use. If you do not agree, please do not use our website." },
  { title:"Content Ownership",       content:"All content is the intellectual property of Life & Tech Journal or its authors. You may not reproduce or distribute content without explicit written permission." },
  { title:"User Conduct",            content:"When interacting on our platform, you agree not to post harmful or illegal content, impersonate others, or violate applicable laws. We may remove content and ban users who violate these rules." },
  { title:"Newsletter",              content:"By subscribing you consent to receive weekly emails. You can unsubscribe at any time. We may modify the newsletter's frequency and content." },
  { title:"Disclaimer",              content:"Content is for informational purposes only. Articles represent individual authors' opinions. We make no warranties about accuracy or completeness." },
  { title:"Limitation of Liability", content:"Life & Tech Journal shall not be liable for any indirect or consequential damages arising from use of our website." },
  { title:"External Links",           content:"We are not responsible for third-party websites we link to. Please review their privacy policies independently." },
  { title:"Modifications",            content:"We may modify these terms at any time. Continued use after changes constitutes acceptance of the updated terms." },
];

export default function TermsPage() {
  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />
      <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",padding:"64px 32px",textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:"white",marginBottom:10 }}>Terms of Use</h1>
        <p style={{ color:"rgba(255,255,255,0.6)",fontSize:14 }}>Last updated: January 1, 2025</p>
      </div>
      <main style={{ maxWidth:780,margin:"0 auto",padding:"60px 32px 80px" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
          {terms.map((s,i)=>(
            <div key={s.title}>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,color:"var(--ink)",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ width:26,height:26,borderRadius:"50%",background:"var(--primary-light)",color:"var(--primary-text)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:"Lato,sans-serif",flexShrink:0 }}>{i+1}</span>
                {s.title}
              </h2>
              <p style={{ fontSize:15,color:"var(--ink-muted)",lineHeight:1.8,paddingLeft:38 }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:44,padding:"26px 28px",background:"var(--card)",borderRadius:16,border:"1px solid var(--border-light)",textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>Questions about our terms?</h3>
          <Link href="/contact" style={{ background:"#4F46E5",color:"white",padding:"10px 24px",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none" }}>Contact Us →</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}