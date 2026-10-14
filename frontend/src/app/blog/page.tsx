"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { withAiArticle } from "@/data/aiArticle";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

const SORT_OPTIONS = [
  { value:"latest",   label:"Latest First" },
  { value:"oldest",   label:"Oldest First" },
  { value:"trending", label:"Trending" },
  { value:"popular",  label:"Most Popular" },
];

const LIFE_CATS = [
  { value:"personal-growth", label:"Personal Growth", icon:"🌱" },
  { value:"career",          label:"Career",          icon:"💼" },
  { value:"lifestyle",       label:"Lifestyle",       icon:"☀️" },
  { value:"relationships",   label:"Relationships",   icon:"❤️" },
  { value:"productivity",    label:"Productivity",    icon:"⚡" },
  { value:"travel",          label:"Travel",          icon:"✈️" },
  { value:"motivation",      label:"Motivation",      icon:"🔥" },
  { value:"musings",     label:"Musings",     icon:"💭" },
  { value:"poems",       label:"Poems",       icon:"🪶" },
];

const TECH_CATS = [
  { value:"ai",            label:"AI & ML",       icon:"🤖" },
  { value:"programming",   label:"Programming",   icon:"⌨️" },
  { value:"web-dev",       label:"Web Dev",       icon:"🌐" },
  { value:"marketing",     label:"Marketing",     icon:"📣" },
  { value:"cybersecurity", label:"Cybersecurity", icon:"🛡️" },
  { value:"cloud",         label:"Cloud",         icon:"☁️" },
  { value:"data-science",  label:"Data Science",  icon:"📊" },
];

const ALL_CATS = [{ value:"", label:"All", icon:"📚" }, ...LIFE_CATS, ...TECH_CATS];

const CAT_GRAD: Record<string,string> = {
  ai:"linear-gradient(135deg,#1e1b4b,#312e81,#14B8A6)",
  "web-dev":"linear-gradient(135deg,#134E4A,#0F766E,#14B8A6)",
  programming:"linear-gradient(135deg,#451A03,#92400E,#F59E0B)",
  career:"linear-gradient(135deg,#500724,#9D174D,#F472B6)",
  "personal-growth":"linear-gradient(135deg,#022C22,#065F46,#10B981)",
  lifestyle:"linear-gradient(135deg,#450A0A,#991B1B,#F87171)",
  travel:"linear-gradient(135deg,#1E1B4B,#3730A3,#818CF8)",
  marketing:"linear-gradient(135deg,#2D1B69,#7C3AED,#C4B5FD)",
  cybersecurity:"linear-gradient(135deg,#0F172A,#1E293B,#475569)",
  "data-science":"linear-gradient(135deg,#1E3A5F,#1D4ED8,#60A5FA)",
  "musings":"linear-gradient(135deg,#4A044E,#A21CAF,#F0ABFC)",
  poems:"linear-gradient(135deg,#3B0764,#BE185D,#FDA4AF)",
  default:"linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};
const CAT_EMOJI: Record<string,string> = {
  ai:"🤖","web-dev":"🌐",programming:"⌨️",career:"🚀",
  "personal-growth":"🌱",lifestyle:"☀️",travel:"✈️",
  marketing:"📣",cybersecurity:"🛡️","data-science":"📊","musings":"💭",poems:"🪶",default:"✍️",
};

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ articleId }: { articleId: string }) {
  const key = `rating_${articleId}`;
  const [rating, setRating] = useState(0);
  const [hover,  setHover]  = useState(0);
  const [done,   setDone]   = useState(false);
  useEffect(() => {
    const s = localStorage.getItem(key);
    if (s) { setRating(Number(s)); setDone(true); }
  }, [key]);
  const submit = (v: number) => {
    if (done) return;
    setRating(v); setDone(true);
    localStorage.setItem(key, String(v));
  };
  return (
    <div style={{ display:"flex",alignItems:"center",gap:2 }}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} onClick={()=>submit(s)}
          onMouseEnter={()=>!done&&setHover(s)}
          onMouseLeave={()=>!done&&setHover(0)}
          style={{ fontSize:15,cursor:done?"default":"pointer",color:s<=(hover||rating)?"#F59E0B":"#D1D5DB",transition:"color 0.1s" }}>★</span>
      ))}
      <span style={{ fontSize:11,color:"var(--ink-light)",marginLeft:3 }}>{done?`${rating}/5`:"Rate"}</span>
    </div>
  );
}

// ── Article Row ───────────────────────────────────────────────────────────────
function ArticleRow({ article }: { article: any }) {
  const cat   = (article.category_id??"default").toLowerCase().replace(/\s+/g,"-");
  const grad  = CAT_GRAD[cat]  ??CAT_GRAD.default;
  const emoji = CAT_EMOJI[cat] ??CAT_EMOJI.default;
  const catMeta = ALL_CATS.find(c=>c.value===cat);
  const author  = article.author_name ?? article.author_id?.slice(0,10) ?? "Author";
  const date    = article.published_at?new Date(article.published_at).toLocaleDateString("en-IN",{month:"short",day:"numeric",year:"numeric"}):"Draft";
  return (
    <article className="post-card">
      <Link href={`/blog/${article.slug}`} className="post-thumb" style={{ background:grad,fontSize:44,textDecoration:"none" }} aria-label={article.title}>
        {article.featured_image?<img src={article.featured_image} alt="" />:<span aria-hidden style={{ filter:"drop-shadow(0 6px 14px rgba(0,0,0,0.3))" }}>{emoji}</span>}
      </Link>
      <div style={{ padding:"22px 26px",display:"flex",flexDirection:"column",minWidth:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
          <Link href={`/blog?category=${cat}`} style={{ textDecoration:"none" }}>
            <span style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--primary-text)",background:"var(--primary-light)",padding:"4px 10px",borderRadius:100 }}>
              {catMeta?.icon} {catMeta?.label ?? article.category_id ?? "General"}
            </span>
          </Link>
          <span style={{ fontSize:12,color:"var(--ink-light)" }}>{article.read_time??1} min read</span>
        </div>
        <Link href={`/blog/${article.slug}`} style={{ textDecoration:"none" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,color:"var(--ink)",lineHeight:1.3,marginBottom:8 }}>{article.title}</h2>
          <p style={{ fontSize:14.5,color:"var(--ink-muted)",lineHeight:1.65,marginBottom:16,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{article.excerpt}</p>
        </Link>
        <div style={{ marginTop:"auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,paddingTop:14,borderTop:"1px solid var(--border-light)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:13,color:"var(--ink-light)",minWidth:0 }}>
            <div style={{ width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#4F46E5,#14B8A6)",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {String(author).split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div style={{ lineHeight:1.3 }}>
              <div style={{ fontWeight:700,color:"var(--ink-mid)" }}>{author}</div>
              <div style={{ fontSize:12 }}>{date}</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <StarRating articleId={article.id} />
            <Link href={`/blog/${article.slug}`} style={{ fontSize:13,fontWeight:700,color:"var(--primary-text)",textDecoration:"none",whiteSpace:"nowrap" }}>
              Read <span className="post-arrow" style={{ display:"inline-block" }}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="post-card" style={{ height:200 }}>
      <div style={{ background:"var(--border-light)",animation:"shimmer 1.5s infinite" }} />
      <div style={{ padding:24,display:"flex",flexDirection:"column",gap:12 }}>
        <div style={{ height:18,width:110,background:"var(--border-light)",borderRadius:100 }} />
        <div style={{ height:22,width:"70%",background:"var(--border-light)",borderRadius:6 }} />
        <div style={{ height:13,width:"90%",background:"var(--border-light)",borderRadius:6 }} />
        <div style={{ height:13,width:"60%",background:"var(--border-light)",borderRadius:6 }} />
      </div>
    </div>
  );
}

// ── Blog Content ──────────────────────────────────────────────────────────────
function BlogContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [articles, setArticles]     = useState<any[]>([]);
  const [total,    setTotal]        = useState(0);
  const [page,     setPage]         = useState(1);
  const [loading,  setLoading]      = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get("q")??"");
  const [search,   setSearch]       = useState(searchParams.get("q")??"");
  const [sort,     setSort]         = useState("latest");
  const [category, setCategory]     = useState(searchParams.get("category")??"");
  const [group,    setGroup]        = useState(searchParams.get("group")??"");

  // Sync category / group (Life, Technology) from URL
  useEffect(() => {
    setCategory(searchParams.get("category")??"");
    setGroup(searchParams.get("group")??"");
    setPage(1);
  }, [searchParams]);

  // Categories to filter by: one category, or every category in the chosen group.
  const catFilter = category
    ? category
    : group==="life" ? LIFE_CATS.map(c=>c.value).join(",")
    : group==="tech" ? TECH_CATS.map(c=>c.value).join(",")
    : "";

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page:String(page), size:"8", sort });
    if (catFilter) qs.set("category", catFilter);
    if (search)   qs.set("search", search);
    try {
      const res  = await fetch(`${API}/articles?${qs}`);
      const data = await res.json();
      const items = data.items??[];
      const merged = page===1 ? withAiArticle(items, { category: catFilter, search }) : items;
      setArticles(merged);
      setTotal((data.total??0) + (merged.length - items.length));
    } catch {
      const fallback = page===1 ? withAiArticle([], { category: catFilter, search }) : [];
      setArticles(fallback); setTotal(fallback.length);
    }
    setLoading(false);
  }, [page, sort, catFilter, search]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const handleCat = (val: string) => {
    setCategory(val); setGroup(""); setPage(1);
    router.replace(val?`/blog?category=${val}`:"/blog", { scroll:false });
  };

  const totalPages = Math.ceil(total/8);
  const activeCat  = ALL_CATS.find(c=>c.value===category);

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />

      {/* ── Page header: title + search + sort ── */}
      <header className="blog-hero">
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"48px 32px 36px" }}>
          {(category || group || search) && (
            <button onClick={()=>{ setSearch(""); setSearchInput(""); handleCat(""); }}
              style={{ fontSize:13,fontWeight:600,color:"var(--ink-muted)",background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:14,fontFamily:"inherit" }}>
              ← All articles
            </button>
          )}
          <p style={{ fontSize:12,fontWeight:800,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--primary-text)",marginBottom:10 }}>
            The Journal
          </p>
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:16,flexWrap:"wrap",marginBottom:28 }}>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:44,lineHeight:1.1,fontWeight:700,color:"var(--ink)",marginBottom:10 }}>
                {search?`Results for "${search}"`:activeCat?.value?`${activeCat.icon} ${activeCat.label}`:group==="life"?"🌿 Life":group==="tech"?"💻 Technology":"All Articles"}
              </h1>
              <p style={{ fontSize:16,color:"var(--ink-muted)",maxWidth:560,lineHeight:1.6 }}>
                {group==="life"?"Personal growth, careers, relationships and the small truths of everyday life."
                  :group==="tech"?"AI, programming and the technology shaping how we live and work."
                  :"Stories that inspire and technology that empowers, written for curious minds."}
              </p>
            </div>
            {!loading&&(
              <span style={{ fontSize:13,fontWeight:700,color:"var(--ink-muted)",background:"var(--card)",border:"1px solid var(--border)",padding:"6px 14px",borderRadius:999 }}>
                {total} article{total!==1?"s":""}
              </span>
            )}
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
            <form className="blog-search" onSubmit={e=>{e.preventDefault();handleSearch();}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color:"var(--ink-light)",flexShrink:0 }} aria-hidden><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                placeholder="Search articles by title or topic…" aria-label="Search articles" style={{ minWidth:0 }} />
              {searchInput && (
                <button type="button" onClick={()=>{setSearchInput("");setSearch("");setPage(1);}} aria-label="Clear search"
                  style={{ border:"none",background:"var(--surface-3)",color:"var(--ink-muted)",width:26,height:26,borderRadius:999,fontSize:12,cursor:"pointer",flexShrink:0 }}>✕</button>
              )}
              <button type="submit" className="btn-primary" style={{ height:40,padding:"0 22px" }}>Search</button>
            </form>
            <select className="blog-sort" aria-label="Sort articles" value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}>
              {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:1200,margin:"0 auto",padding:"36px 32px 64px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 280px",gap:32,alignItems:"start" }}>
          {/* List */}
          <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
            {loading
              ?[1,2,3,4].map(i=><Skeleton key={i} />)
              :articles.length>0
                ?articles.map((a,i)=><ArticleRow key={a.id??i} article={a} />)
                :(
                  <div className="side-card" style={{ padding:56,textAlign:"center" }}>
                    <div style={{ fontSize:44,marginBottom:14 }}>✍️</div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>
                      {search?"No results found":"No articles yet"}
                    </h3>
                    <p style={{ color:"var(--ink-light)",fontSize:14,marginBottom:20 }}>
                      {search?"Try a different term.":"Write the first one from the Admin Panel."}
                    </p>
                    {search
                      ?<button onClick={()=>{setSearch("");setSearchInput("");}} style={{ background:"#4F46E5",color:"white",padding:"10px 22px",borderRadius:8,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit" }}>Clear Search</button>
                      :<a href="/admin" style={{ background:"#4F46E5",color:"white",padding:"10px 22px",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none" }}>Open Admin Panel →</a>
                    }
                  </div>
                )
            }
            {totalPages>1&&(
              <div style={{ display:"flex",gap:6,justifyContent:"center",paddingTop:12 }}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ padding:"7px 14px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--card)",cursor:page===1?"not-allowed":"pointer",color:page===1?"#D1D5DB":"var(--ink-mid)",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                  ← Prev
                </button>
                {Array.from({length:Math.min(5,totalPages)},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)}
                    style={{ width:36,height:36,borderRadius:8,border:"1.5px solid",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit",
                      borderColor:page===p?"#4F46E5":"var(--border)",
                      background: page===p?"#4F46E5":"var(--card)",
                      color:      page===p?"white":"var(--ink-mid)" }}>
                    {p}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ padding:"7px 14px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--card)",cursor:page===totalPages?"not-allowed":"pointer",color:page===totalPages?"#D1D5DB":"var(--ink-mid)",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display:"flex",flexDirection:"column",gap:16,position:"sticky",top:96 }}>
            <div className="side-card">
              <div className="side-title">Life & Personal</div>
              {LIFE_CATS.map(c=>(
                <button key={c.value} onClick={()=>handleCat(c.value)} className={`side-item${category===c.value?" is-active":""}`}>
                  <span className="si-icon" aria-hidden>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
            <div className="side-card">
              <div className="side-title">Technology</div>
              {TECH_CATS.map(c=>(
                <button key={c.value} onClick={()=>handleCat(c.value)} className={`side-item${category===c.value?" is-active":""}`}>
                  <span className="si-icon" aria-hidden>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
            <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5 70%,#14B8A6 150%)",borderRadius:18,padding:22,boxShadow:"0 14px 34px -16px rgba(79,70,229,0.7)" }}>
              <div style={{ fontSize:14,fontFamily:"'Playfair Display',serif",fontWeight:700,color:"white",marginBottom:6 }}>📬 Newsletter</div>
              <p style={{ fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.6,marginBottom:12 }}>Best articles every Tuesday.</p>
              <input type="email" placeholder="your@email.com" style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"none",outline:"none",fontSize:13,marginBottom:8,fontFamily:"inherit" }} />
              <button style={{ width:"100%",padding:"8px",background:"rgba(255,255,255,0.15)",color:"white",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>Subscribe →</button>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.5}} *{box-sizing:border-box} ::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--ink-light)"}}>Loading…</div>}>
      <BlogContent />
    </Suspense>
  );
}