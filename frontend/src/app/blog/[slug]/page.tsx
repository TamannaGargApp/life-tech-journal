"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { AI_ARTICLE, AI_ARTICLE_SLUG } from "@/data/aiArticle";

const AISummarizer = dynamic(() => import("@/components/ai/AISummarizer"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

const CAT_GRAD: Record<string,string> = {
  ai:               "linear-gradient(135deg,#1e1b4b,#312e81,#14B8A6)",
  "web-dev":        "linear-gradient(135deg,#134E4A,#0F766E,#14B8A6)",
  programming:      "linear-gradient(135deg,#451A03,#92400E,#F59E0B)",
  career:           "linear-gradient(135deg,#500724,#9D174D,#F472B6)",
  "personal-growth":"linear-gradient(135deg,#022C22,#065F46,#10B981)",
  lifestyle:        "linear-gradient(135deg,#450A0A,#991B1B,#F87171)",
  travel:           "linear-gradient(135deg,#1E1B4B,#3730A3,#818CF8)",
  marketing:        "linear-gradient(135deg,#2D1B69,#7C3AED,#C4B5FD)",
  cybersecurity:    "linear-gradient(135deg,#0F172A,#1E293B,#475569)",
  "data-science":   "linear-gradient(135deg,#1E3A5F,#1D4ED8,#60A5FA)",
  motivation:       "linear-gradient(135deg,#451A03,#B45309,#FCD34D)",
  productivity:     "linear-gradient(135deg,#1E3A5F,#0369A1,#38BDF8)",
  relationships:    "linear-gradient(135deg,#500724,#BE123C,#FDA4AF)",
  cloud:            "linear-gradient(135deg,#0C4A6E,#0369A1,#7DD3FC)",
  default:          "linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};

const CAT_EMOJI: Record<string,string> = {
  ai:"🤖","web-dev":"🌐",programming:"⌨️",career:"🚀",
  "personal-growth":"🌱",lifestyle:"☀️",travel:"✈️",
  marketing:"📣",cybersecurity:"🛡️","data-science":"📊",
  motivation:"🔥",productivity:"⚡",relationships:"❤️",cloud:"☁️",default:"✍️",
};

const CAT_LABELS: Record<string,string> = {
  ai:"AI & ML","web-dev":"Web Development",programming:"Programming",
  career:"Career","personal-growth":"Personal Growth",lifestyle:"Lifestyle",
  travel:"Travel",marketing:"Digital Marketing",cybersecurity:"Cybersecurity",
  "data-science":"Data Science",motivation:"Motivation",productivity:"Productivity",
  relationships:"Relationships",cloud:"Cloud Computing",default:"General",
};

// Reading progress bar
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el  = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const h   = el.scrollHeight - el.clientHeight;
      setProgress(h > 0 ? (top/h)*100 : 0);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,height:3,zIndex:999,background:"rgba(0,0,0,0.05)" }}>
      <div style={{ height:"100%",background:"linear-gradient(90deg,#4F46E5,#14B8A6)",width:`${progress}%`,transition:"width 0.1s" }} />
    </div>
  );
}

// Share buttons
function ShareButtons({ title, slug }: { title:string; slug:string }) {
  const url = typeof window !== "undefined" ? window.location.href : `https://lifetechjournal.com/blog/${slug}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareItems = [
    { icon:"𝕏", label:"Twitter", href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { icon:"in", label:"LinkedIn", href:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
      <span style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ink-light)",marginRight:4 }}>Share</span>
      {shareItems.map(s=>(
        <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
          style={{ width:34,height:34,borderRadius:8,border:"1.5px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ink-muted)",fontSize:12,textDecoration:"none",transition:"all 0.15s",fontWeight:700 }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5";(e.currentTarget as HTMLElement).style.color="var(--primary-text)"}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.color="var(--ink-muted)"}}>
          {s.icon}
        </a>
      ))}
      <button onClick={copy}
        style={{ height:34,padding:"0 14px",borderRadius:8,border:"1.5px solid var(--border)",background:copied?"#D1FAE5":"var(--card)",color:copied?"#065F46":"var(--ink-muted)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s" }}>
        {copied?"✓ Copied":"Copy Link"}
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const params  = useParams();
  const slug    = params?.slug as string;
  const [article, setArticle]   = useState<any>(null);
  const [related, setRelated]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [liked,   setLiked]     = useState(false);
  const [likes,   setLikes]     = useState(0);
  const [saved,   setSaved]     = useState(false);
  const [notFound,setNotFound]  = useState(false);

  useEffect(() => {
    if (!slug) return;
    // Built-in copy of the featured AI article, used when the API doesn't have it yet
    const useBuiltIn = () => {
      if (slug !== AI_ARTICLE_SLUG) return false;
      setArticle(AI_ARTICLE); setLoading(false); return true;
    };
    fetch(`${API}/articles/${slug}`)
      .then(r => { if (!r.ok) { if (!useBuiltIn()) { setNotFound(true); setLoading(false); } return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        setArticle(data);
        setLikes(data.likes ?? 0);
        setLoading(false);
        // Fetch related
        if (data.id) {
          fetch(`${API}/articles/${data.id}/related`)
            .then(r => r.json())
            .then(r => setRelated(Array.isArray(r) ? r.slice(0,3) : []))
            .catch(()=>{});
        }
      })
      .catch(() => { if (!useBuiltIn()) { setNotFound(true); setLoading(false); } });
  }, [slug]);

  const handleLike = async () => {
    if (!article?.id) return;
    const token = sessionStorage.getItem("access_token") || "";
    if (!token) { alert("Sign in to like articles"); return; }
    try {
      const res  = await fetch(`${API}/articles/${article.id}/like`, { method:"POST", headers:{"Authorization":`Bearer ${token}`} });
      const data = await res.json();
      setLikes(data.likes ?? likes);
      setLiked(data.action === "liked");
    } catch {}
  };

  const handleSave = async () => {
    if (!article?.id) return;
    const token = sessionStorage.getItem("access_token") || "";
    if (!token) { alert("Sign in to save articles"); return; }
    try {
      await fetch(`${API}/articles/${article.id}/bookmark`, { method:"POST", headers:{"Authorization":`Bearer ${token}`} });
      setSaved(s => !s);
    } catch {}
  };

  const cat   = article ? (article.category_id || "default").toLowerCase().replace(/\s+/g,"-") : "default";
  const grad  = CAT_GRAD[cat]  ?? CAT_GRAD.default;
  const emoji = CAT_EMOJI[cat] ?? CAT_EMOJI.default;
  const label = CAT_LABELS[cat] ?? "General";

  // Loading skeleton
  if (loading) return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />
      <div style={{ maxWidth:740,margin:"0 auto",padding:"60px 32px" }}>
        <div style={{ height:24,width:80,background:"var(--border-light)",borderRadius:6,marginBottom:20,animation:"shimmer 1.5s infinite" }} />
        <div style={{ height:44,width:"85%",background:"var(--border-light)",borderRadius:8,marginBottom:12,animation:"shimmer 1.5s infinite" }} />
        <div style={{ height:44,width:"60%",background:"var(--border-light)",borderRadius:8,marginBottom:32,animation:"shimmer 1.5s infinite" }} />
        <div style={{ height:360,background:"var(--border-light)",borderRadius:16,marginBottom:40,animation:"shimmer 1.5s infinite" }} />
        {[1,2,3,4,5].map(i=><div key={i} style={{ height:18,background:"var(--border-light)",borderRadius:6,marginBottom:12,width:`${70+i*5}%`,animation:"shimmer 1.5s infinite" }} />)}
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );

  // 404
  if (notFound) return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />
      <div style={{ maxWidth:600,margin:"0 auto",padding:"100px 32px",textAlign:"center" }}>
        <div style={{ fontSize:64,marginBottom:24 }}>📭</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:"var(--ink)",marginBottom:12 }}>Article Not Found</h1>
        <p style={{ color:"var(--ink-muted)",fontSize:16,marginBottom:32,lineHeight:1.7 }}>The article you're looking for doesn't exist or may have been moved.</p>
        <Link href="/blog" style={{ background:"#4F46E5",color:"white",padding:"12px 28px",borderRadius:10,fontWeight:700,fontSize:15,textDecoration:"none" }}>Browse All Articles →</Link>
      </div>
    </div>
  );

  const publishDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})
    : new Date(article.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <ReadingProgress />
      <SiteNavbar />

      {/* ── Hero Image / Banner ── */}
      <div style={{ position:"relative",overflow:"hidden" }}>
        {article.featured_image ? (
          <div style={{ height:480,position:"relative" }}>
            <img src={article.featured_image} alt={article.title}
              style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.55) 100%)" }} />
            <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"40px 0",textAlign:"center" }}>
              <div style={{ maxWidth:800,margin:"0 auto",padding:"0 32px" }}>
                <Link href={`/blog?category=${cat}`} style={{ textDecoration:"none" }}>
                  <span style={{ display:"inline-block",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",color:"white",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",padding:"5px 14px",borderRadius:100,marginBottom:16,border:"1px solid rgba(255,255,255,0.3)" }}>
                    {emoji} {label}
                  </span>
                </Link>
                <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:700,color:"white",lineHeight:1.15,textShadow:"0 2px 20px rgba(0,0,0,0.3)" }}>
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          /* Default gradient hero when no image */
          <div style={{ height:420,background:grad,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",textAlign:"center",position:"relative",overflow:"hidden" }}>
            {/* Decorative circles */}
            <div style={{ position:"absolute",top:-80,right:-80,width:320,height:320,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none" }} />
            <div style={{ position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none" }} />
            <div style={{ position:"relative",zIndex:1,maxWidth:720 }}>
              <Link href={`/blog?category=${cat}`} style={{ textDecoration:"none" }}>
                <span style={{ display:"inline-block",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",color:"white",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",padding:"5px 14px",borderRadius:100,marginBottom:20,border:"1px solid rgba(255,255,255,0.25)" }}>
                  {emoji} {label}
                </span>
              </Link>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,5vw,50px)",fontWeight:700,color:"white",lineHeight:1.15,marginBottom:16,textShadow:"0 2px 20px rgba(0,0,0,0.2)" }}>
                {article.title}
              </h1>
              <p style={{ fontSize:17,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:580,margin:"0 auto" }}>
                {article.excerpt}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Meta bar ── */}
      <div style={{ background:"var(--card)",borderBottom:"1px solid var(--border)",position:"sticky",top:69,zIndex:100 }}>
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 32px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:16,fontSize:13,color:"var(--ink-muted)" }}>
            {/* Author avatar */}
            <div style={{ width:30,height:30,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"white",fontWeight:700,flexShrink:0 }}>
              {(article.author_name || article.author_id || "A")[0].toUpperCase()}
            </div>
            <span style={{ fontWeight:600,color:"var(--ink-mid)" }}>{article.author_name || "Life & Tech Team"}</span>
            <span style={{ color:"#D1D5DB" }}>·</span>
            <span>{publishDate}</span>
            <span style={{ color:"#D1D5DB" }}>·</span>
            <span>⏱ {article.read_time ?? 1} min read</span>
            <span style={{ color:"#D1D5DB" }}>·</span>
            <span>👁 {article.views ?? 0} views</span>
          </div>
          <ShareButtons title={article.title} slug={slug} />
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"52px 32px 0",display:"grid",gridTemplateColumns:"1fr 260px",gap:56,alignItems:"start" }}>

        {/* ── Article body ── */}
        <article>
          {/* Excerpt pull quote if has image */}
          {article.featured_image && article.excerpt && (
            <p style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontStyle:"italic",color:"var(--primary-text)",lineHeight:1.7,marginBottom:36,paddingLeft:20,borderLeft:"3px solid #4F46E5" }}>
              {article.excerpt}
            </p>
          )}

          {/* Article content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available.</p>" }}
            style={{ fontSize:17,lineHeight:1.85,color:"var(--ink-mid)" }}
          />

          {/* Tags / keywords */}
          {article.seo?.keywords?.length > 0 && (
            <div style={{ marginTop:40,paddingTop:28,borderTop:"1px solid var(--border)",display:"flex",flexWrap:"wrap",gap:8,alignItems:"center" }}>
              <span style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ink-light)",marginRight:4 }}>Tags</span>
              {article.seo.keywords.map((k:string) => (
                <span key={k} style={{ fontSize:12,padding:"4px 12px",borderRadius:100,border:"1.5px solid var(--border)",color:"var(--ink-muted)",background:"var(--card)" }}>#{k}</span>
              ))}
            </div>
          )}

          {/* Like / Save / Share */}
          <div style={{ marginTop:40,padding:"24px 28px",background:"var(--card)",borderRadius:16,border:"1px solid var(--border-light)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
            <div style={{ display:"flex",gap:12 }}>
              <button onClick={handleLike}
                style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:10,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,transition:"all 0.2s",
                  background:liked?"#FEF2F2":"var(--card)",
                  borderColor:liked?"#F43F5E":"var(--border)",
                  color:liked?"#F43F5E":"var(--ink-muted)" }}>
                {liked?"❤️":"🤍"} {likes} {likes===1?"Like":"Likes"}
              </button>
              <button onClick={handleSave}
                style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:10,border:"1.5px solid",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,transition:"all 0.2s",
                  background:saved?"var(--primary-light)":"var(--card)",
                  borderColor:saved?"#4F46E5":"var(--border)",
                  color:saved?"#4F46E5":"var(--ink-muted)" }}>
                {saved?"🔖":"📌"} {saved?"Saved":"Save"}
              </button>
            </div>
            <ShareButtons title={article.title} slug={slug} />
          </div>

          {/* Author card */}
          <div style={{ marginTop:32,padding:"28px",background:"var(--card)",borderRadius:16,border:"1px solid var(--border-light)",display:"flex",gap:18 }}>
            <div style={{ width:56,height:56,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ink-light)",marginBottom:4 }}>Written by</div>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--ink)",marginBottom:6 }}>{article.author_name || "Life & Tech Team"}</div>
              <p style={{ fontSize:14,color:"var(--ink-muted)",lineHeight:1.6 }}>Contributing writer at Life & Tech Journal. Covering stories that inspire and technology that empowers.</p>
              <Link href="/blog" style={{ display:"inline-block",marginTop:10,fontSize:13,fontWeight:700,color:"var(--primary-text)",textDecoration:"none" }}>More articles →</Link>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div style={{ marginTop:48 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"var(--ink)",marginBottom:20 }}>You Might Also Like</h3>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16 }}>
                {related.map((r:any) => {
                  const rc   = (r.category_id||"default").toLowerCase().replace(/\s+/g,"-");
                  const rg   = CAT_GRAD[rc]??CAT_GRAD.default;
                  const re   = CAT_EMOJI[rc]??CAT_EMOJI.default;
                  return (
                    <Link key={r.id||r.slug} href={`/blog/${r.slug}`} style={{ textDecoration:"none" }}>
                      <div style={{ background:"var(--card)",borderRadius:14,overflow:"hidden",border:"1px solid var(--border-light)",transition:"all 0.2s" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 6px 20px rgba(79,70,229,0.1)";(e.currentTarget as HTMLElement).style.transform="translateY(-3px)"}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";(e.currentTarget as HTMLElement).style.transform="translateY(0)"}}>
                        <div style={{ height:100,background:rg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>{re}</div>
                        <div style={{ padding:"12px 14px" }}>
                          <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",color:"var(--primary-text)",marginBottom:5 }}>{CAT_LABELS[rc]}</div>
                          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"var(--ink)",lineHeight:1.4 }}>{r.title}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        {/* ── Sidebar ── */}
        <aside style={{ position:"sticky",top:128,display:"flex",flexDirection:"column",gap:20 }}>
          {/* Article info */}
          <div style={{ background:"var(--card)",borderRadius:16,padding:22,border:"1px solid var(--border-light)" }}>
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--ink-light)",marginBottom:14,paddingBottom:10,borderBottom:"1px solid var(--border-light)" }}>Article Info</div>
            {[
              ["📂","Category",  label],
              ["📅","Published", publishDate],
              ["⏱","Read Time", `${article.read_time ?? 1} min`],
              ["👁","Views",     (article.views??0).toLocaleString()],
              ["❤️","Likes",     (article.likes??0).toLocaleString()],
              ["🔖","Saves",     (article.bookmarks??0).toLocaleString()],
            ].map(([icon,key,val])=>(
              <div key={key} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,marginBottom:10 }}>
                <span style={{ color:"var(--ink-muted)" }}>{icon} {key}</span>
                <span style={{ fontWeight:700,color:"var(--ink)",fontSize:12 }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Category nav */}
          <div style={{ background:"var(--card)",borderRadius:16,padding:22,border:"1px solid var(--border-light)" }}>
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--ink-light)",marginBottom:14,paddingBottom:10,borderBottom:"1px solid var(--border-light)" }}>Browse Category</div>
            <Link href={`/blog?category=${cat}`}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,background:grad,textDecoration:"none",marginBottom:12 }}>
              <span style={{ fontSize:20 }}>{emoji}</span>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:"white" }}>{label}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.7)" }}>More articles →</div>
              </div>
            </Link>
            <Link href="/blog" style={{ display:"block",textAlign:"center",fontSize:13,fontWeight:600,color:"var(--primary-text)",textDecoration:"none",padding:"8px",borderRadius:8,border:"1.5px solid var(--primary-border)",background:"var(--primary-light)" }}>
              All Articles
            </Link>
          </div>

          {/* Newsletter */}
          <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",borderRadius:16,padding:22 }}>
            <div style={{ fontSize:22,marginBottom:8 }}>📬</div>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"white",marginBottom:6 }}>Enjoyed this article?</h3>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.6,marginBottom:14 }}>Get the best stories delivered to your inbox every Tuesday.</p>
            <Link href="/newsletter" style={{ display:"block",textAlign:"center",padding:"10px",background:"rgba(255,255,255,0.15)",color:"white",borderRadius:10,fontWeight:700,fontSize:13,textDecoration:"none",border:"1.5px solid rgba(255,255,255,0.25)",transition:"all 0.15s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.25)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.15)"}}>
              Subscribe Free →
            </Link>
          </div>
        </aside>
      </div>

      {/* ── Newsletter CTA ── */}
      <div style={{ maxWidth:1100,margin:"60px auto 0",padding:"0 32px" }}>
        <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)",borderRadius:20,padding:"48px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap" }}>
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"white",marginBottom:6 }}>Want more articles like this?</h3>
            <p style={{ color:"rgba(255,255,255,0.72)",fontSize:15 }}>Join 12,000+ readers. New stories every Tuesday.</p>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <input type="email" placeholder="your@email.com"
              style={{ padding:"11px 16px",borderRadius:10,border:"none",outline:"none",fontSize:14,fontFamily:"inherit",width:210 }} />
            <button style={{ padding:"11px 22px",background:"#111827",color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>
              Subscribe →
            </button>
          </div>
        </div>
      </div>

      <SiteFooter />

      {/* Article content styles */}
      <style>{`
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:.5}}
        * { box-sizing: border-box; }

        .article-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 700; color: var(--ink);
          line-height: 1.2; margin: 2rem 0 1rem;
        }
        .article-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem; font-weight: 700; color: var(--ink);
          line-height: 1.25; margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem; border-bottom: 2px solid var(--border-light);
        }
        .article-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; font-weight: 700; color: var(--ink);
          margin: 2rem 0 0.75rem;
        }
        .article-content p {
          margin-bottom: 1.5rem; color: var(--ink-mid); line-height: 1.85;
        }
        .article-content a {
          color: var(--primary-text); text-decoration: underline; text-underline-offset: 3px;
          font-weight: 600;
        }
        .article-content a:hover { color: #3730A3; }
        .article-content strong { color: var(--ink); font-weight: 700; }
        .article-content em { font-style: italic; color: var(--ink-mid); }
        .article-content ul, .article-content ol {
          margin: 1.25rem 0 1.5rem 1.5rem; padding: 0;
        }
        .article-content li {
          margin-bottom: 0.6rem; line-height: 1.7; color: var(--ink-mid);
        }
        .article-content blockquote {
          margin: 2rem 0; padding: 20px 24px;
          border-left: 4px solid #4F46E5;
          background: var(--primary-light); border-radius: 0 12px 12px 0;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-style: italic; color: var(--primary-text);
          line-height: 1.7;
        }
        .article-content code {
          background: var(--surface-3); color: #E11D48;
          padding: 2px 7px; border-radius: 5px;
          font-family: 'Courier New', monospace; font-size: 0.88em;
        }
        .article-content pre {
          background: #0f172a; color: #E8E4DE;
          padding: 20px 24px; border-radius: 12px;
          overflow-x: auto; margin: 1.5rem 0;
          font-family: 'Courier New', monospace; font-size: 0.9rem;
          line-height: 1.7;
        }
        .article-content pre code {
          background: none; color: inherit;
          padding: 0; border-radius: 0; font-size: inherit;
        }
        .article-content img {
          width: 100%; border-radius: 14px;
          margin: 1.5rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .article-content hr {
          border: none; border-top: 2px solid var(--border-light);
          margin: 2.5rem 0;
        }
        .article-content table {
          width: 100%; border-collapse: collapse; margin: 1.5rem 0;
          border-radius: 10px; overflow: hidden;
        }
        .article-content th {
          background: #4F46E5; color: white;
          padding: 10px 14px; text-align: left; font-size: 13px;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .article-content td {
          padding: 10px 14px; border-bottom: 1px solid var(--border-light);
          font-size: 14px; color: var(--ink-mid);
        }
        .article-content tr:last-child td { border-bottom: none; }
        .article-content tr:nth-child(even) td { background: var(--surface-2); }
      `}</style>
    </div>
  );
}