"use client";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

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
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />
      <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",padding:"64px 32px",textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:"white",marginBottom:10 }}>Privacy Policy</h1>
        <p style={{ color:"rgba(255,255,255,0.6)",fontSize:14 }}>Last updated: January 1, 2025</p>
      </div>
      <main style={{ maxWidth:780,margin:"0 auto",padding:"60px 32px 80px" }}>
        <div style={{ background:"var(--primary-light)",borderRadius:14,padding:"18px 24px",marginBottom:36,border:"1px solid var(--primary-border)" }}>
          <p style={{ fontSize:14,color:"var(--primary-text)",lineHeight:1.7 }}><strong>Summary:</strong> We collect minimal data, never sell your information, and respect your privacy.</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
          {sections.map((s,i)=>(
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
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>Questions about your privacy?</h3>
          <p style={{ fontSize:14,color:"var(--ink-muted)",marginBottom:16 }}>We're happy to help.</p>
          <Link href="/contact" style={{ background:"#4F46E5",color:"white",padding:"10px 24px",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none" }}>Contact Us →</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}