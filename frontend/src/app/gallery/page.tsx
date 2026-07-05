"use client";
import { useState } from "react";
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
          {[["Home","/"],["Blog","/blog"],["About","/about"],["Contact","/contact"]].map(([l,h])=>(
            <Link key={l} href={h} style={{ padding:"7px 14px",fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:l==="Gallery"?"#4F46E5":"#3D3D3D",borderRadius:8,textDecoration:"none" }}>{l}</Link>
          ))}
        </div>
        <Link href="/newsletter" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none" }}>Subscribe</Link>
      </div>
    </nav>
  );
}

const PHOTOS = [
  { id:1,  cat:"tech",    emoji:"💻", title:"Coding Sessions",        desc:"Behind the scenes of building Life & Tech Journal",    color:"linear-gradient(135deg,#1e1b4b,#4F46E5)" },
  { id:2,  cat:"life",    emoji:"🌅", title:"Morning Rituals",        desc:"How our writers start their day with intention",         color:"linear-gradient(135deg,#450A0A,#F87171)" },
  { id:3,  cat:"events",  emoji:"🎤", title:"Tech Meetup Bangalore",  desc:"Connecting with the local dev community",               color:"linear-gradient(135deg,#022C22,#10B981)" },
  { id:4,  cat:"tech",    emoji:"🤖", title:"AI Experiments",         desc:"Testing the latest models and tools firsthand",         color:"linear-gradient(135deg,#1e1b4b,#14B8A6)" },
  { id:5,  cat:"travel",  emoji:"✈️", title:"Remote Work from Goa",   desc:"Writing from paradise — our team retreat",             color:"linear-gradient(135deg,#1E1B4B,#818CF8)" },
  { id:6,  cat:"life",    emoji:"📚", title:"Reading Corner",         desc:"The books that shaped our thinking this year",          color:"linear-gradient(135deg,#451A03,#F59E0B)" },
  { id:7,  cat:"events",  emoji:"🚀", title:"Product Launch Night",   desc:"Celebrating 10,000 newsletter subscribers",            color:"linear-gradient(135deg,#500724,#F472B6)" },
  { id:8,  cat:"tech",    emoji:"☕", title:"Hackathon Weekend",       desc:"48 hours, one idea, zero sleep",                       color:"linear-gradient(135deg,#134E4A,#14B8A6)" },
  { id:9,  cat:"life",    emoji:"🌿", title:"Workspace Tour",         desc:"Our home offices — where the writing happens",          color:"linear-gradient(135deg,#022C22,#065F46)" },
  { id:10, cat:"events",  emoji:"🎉", title:"Anniversary Celebration", desc:"One year of stories that inspire",                    color:"linear-gradient(135deg,#2D1B69,#7C3AED)" },
  { id:11, cat:"travel",  emoji:"🏔️", title:"Team Offsite Himachal",  desc:"Strategy sessions with mountain views",                color:"linear-gradient(135deg,#1E3A5F,#60A5FA)" },
  { id:12, cat:"tech",    emoji:"📊", title:"Analytics Deep-dive",    desc:"Understanding what our readers love most",             color:"linear-gradient(135deg,#0F172A,#475569)" },
];

const CATS = [
  { value:"",       label:"All Photos" },
  { value:"tech",   label:"Tech & Work" },
  { value:"life",   label:"Life & People" },
  { value:"events", label:"Events" },
  { value:"travel", label:"Travel" },
];

export default function GalleryPage() {
  const [filter,   setFilter]   = useState("");
  const [selected, setSelected] = useState<typeof PHOTOS[0] | null>(null);

  const filtered = filter ? PHOTOS.filter(p => p.cat === filter) : PHOTOS;

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#FAF8F5" }}>
      <SiteNavbar />

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 60%,#14B8A6 100%)",padding:"64px 32px",textAlign:"center" }}>
        <p style={{ fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:14 }}>Gallery</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:700,color:"white",marginBottom:12,lineHeight:1.1 }}>
          Behind the<br /><em style={{ fontStyle:"italic" }}>Journal</em>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.72)",fontSize:16,maxWidth:460,margin:"0 auto",lineHeight:1.75 }}>
          A glimpse into the people, places, and moments that make Life & Tech Journal what it is.
        </p>
      </div>

      <main style={{ maxWidth:1200,margin:"0 auto",padding:"48px 32px" }}>

        {/* Filter tabs */}
        <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:44,flexWrap:"wrap" }}>
          {CATS.map(c=>(
            <button key={c.value} onClick={()=>setFilter(c.value)}
              style={{ padding:"8px 20px",borderRadius:100,fontSize:13,fontWeight:600,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s",
                borderColor:filter===c.value?"#4F46E5":"#E8E4DE",
                background: filter===c.value?"#4F46E5":"white",
                color:      filter===c.value?"white":"#6B6B6B" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div style={{ columns:"3 320px",gap:16 }}>
          {filtered.map((photo,i)=>(
            <div key={photo.id}
              onClick={()=>setSelected(photo)}
              style={{ breakInside:"avoid",marginBottom:16,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all 0.22s",boxShadow:"0 1px 4px rgba(0,0,0,0.07)" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.02)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(79,70,229,0.15)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";(e.currentTarget as HTMLElement).style.boxShadow="0 1px 4px rgba(0,0,0,0.07)"}}>
              <div style={{ background:photo.color, height:i%3===0?260:200, display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,position:"relative" }}>
                <span>{photo.emoji}</span>
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.15)",opacity:0,transition:"opacity 0.2s" }} />
              </div>
              <div style={{ background:"white",padding:"16px 18px" }}>
                <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#4F46E5",marginBottom:5 }}>{photo.cat}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#1A1A1A",marginBottom:4 }}>{photo.title}</h3>
                <p style={{ fontSize:12,color:"#6B6B6B",lineHeight:1.6 }}>{photo.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube CTA */}
        <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2D2D2D)",borderRadius:20,padding:"40px 48px",marginTop:60,display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:32,marginBottom:12 }}>▶️</div>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"white",marginBottom:6 }}>Watch on YouTube</h3>
            <p style={{ fontSize:14,color:"#6B7280",lineHeight:1.7,maxWidth:400 }}>Video essays, interviews, and behind-the-scenes content on our YouTube channel.</p>
          </div>
          <a href="https://www.youtube.com/@LifeTechJournal" target="_blank" rel="noreferrer"
            style={{ background:"#FF0000",color:"white",padding:"13px 28px",borderRadius:12,fontWeight:700,fontSize:15,textDecoration:"none",display:"flex",alignItems:"center",gap:10,flexShrink:0,transition:"all 0.15s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#CC0000";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#FF0000";(e.currentTarget as HTMLElement).style.transform="translateY(0)"}}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="white"><path d="M19.6 2.2C19.4 1.4 18.7.7 17.9.5 16.4.1 10 .1 10 .1S3.6.1 2.1.5C1.3.7.6 1.4.4 2.2 0 3.7 0 7 0 7s0 3.3.4 4.8c.2.8.9 1.5 1.7 1.7C3.6 14 10 14 10 14s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7C20 10.3 20 7 20 7s0-3.3-.4-4.8zM8 10V4l5.2 3L8 10z"/></svg>
            Subscribe on YouTube
          </a>
        </div>
      </main>

      {/* Lightbox */}
      {selected && (
        <div onClick={()=>setSelected(null)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,cursor:"pointer" }}>
          <div onClick={e=>e.stopPropagation()}
            style={{ background:"white",borderRadius:20,overflow:"hidden",maxWidth:600,width:"100%",cursor:"default" }}>
            <div style={{ height:320,background:selected.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:72,position:"relative" }}>
              <span>{selected.emoji}</span>
              <button onClick={()=>setSelected(null)}
                style={{ position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",color:"white",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>
                ✕
              </button>
            </div>
            <div style={{ padding:"24px 28px 28px" }}>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#4F46E5",background:"#EEF2FF",padding:"3px 10px",borderRadius:100,display:"inline-block",marginBottom:10 }}>{selected.cat}</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1A1A1A",marginBottom:8 }}>{selected.title}</h2>
              <p style={{ fontSize:15,color:"#6B6B6B",lineHeight:1.7 }}>{selected.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}