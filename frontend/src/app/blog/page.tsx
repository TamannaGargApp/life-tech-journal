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
  default:"linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};
const CAT_EMOJI: Record<string,string> = {
  ai:"🤖","web-dev":"🌐",programming:"⌨️",career:"🚀",
  "personal-growth":"🌱",lifestyle:"☀️",travel:"✈️",
  marketing:"📣",cybersecurity:"🛡️","data-science":"📊",default:"✍️",
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
  return (
    <div style={{ background:"var(--card)",borderRadius:14,overflow:"hidden",display:"flex",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",border:"1px solid var(--border-light)",transition:"all 0.22s" }}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 6px 24px rgba(79,70,229,0.1)";el.style.transform="translateX(4px)";el.style.borderColor="var(--primary-border)"}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";el.style.transform="translateX(0)";el.style.borderColor="var(--border-light)"}}>
      <Link href={`/blog/${article.slug}`} style={{ textDecoration:"none",flexShrink:0 }}>
        <div style={{ width:155,minHeight:130,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30 }}>
          {article.featured_image?<img src={article.featured_image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:emoji}
        </div>
      </Link>
      <div style={{ padding:"14px 18px",flex:1 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
          <Link href={`/blog?category=${cat}`} style={{ textDecoration:"none" }}>
            <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--primary-text)",background:"var(--primary-light)",padding:"2px 8px",borderRadius:100 }}>
              {catMeta?.icon} {article.category_id??"General"}
            </span>
          </Link>
          <span style={{ fontSize:11,color:"var(--ink-light)" }}>⏱ {article.read_time??1} min</span>
        </div>
        <Link href={`/blog/${article.slug}`} style={{ textDecoration:"none" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--ink)",lineHeight:1.4,marginBottom:4 }}>{article.title}</h3>
          <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{article.excerpt}</p>
        </Link>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--ink-light)" }}>
            <div style={{ width:18,height:18,borderRadius:"50%",background:grad }} />
            <span style={{ fontWeight:600,color:"var(--ink-muted)" }}>{article.author_name ?? article.author_id?.slice(0,10) ?? "Author"}</span>
            <span>·</span>
            <span>{article.published_at?new Date(article.published_at).toLocaleDateString("en-IN",{month:"short",day:"numeric",year:"numeric"}):"Draft"}</span>
          </div>
          <StarRating articleId={article.id} />
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ background:"var(--card)",borderRadius:14,overflow:"hidden",display:"flex",height:130,border:"1px solid var(--border-light)" }}>
      <div style={{ width:155,background:"var(--border-light)",animation:"shimmer 1.5s infinite" }} />
      <div style={{ flex:1,padding:16,display:"flex",flexDirection:"column",gap:10 }}>
        <div style={{ height:11,width:80,background:"var(--border-light)",borderRadius:6 }} />
        <div style={{ height:16,width:"60%",background:"var(--border-light)",borderRadius:6 }} />
        <div style={{ height:11,width:"85%",background:"var(--border-light)",borderRadius:6 }} />
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

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get("category")??"";
    setCategory(cat);
  }, [searchParams]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page:String(page), size:"8", sort });
    if (category) qs.set("category", category);
    if (search)   qs.set("search", search);
    try {
      const res  = await fetch(`${API}/articles?${qs}`);
      const data = await res.json();
      const items = data.items??[];
      const merged = page===1 ? withAiArticle(items, { category, search }) : items;
      setArticles(merged);
      setTotal((data.total??0) + (merged.length - items.length));
    } catch {
      const fallback = page===1 ? withAiArticle([], { category, search }) : [];
      setArticles(fallback); setTotal(fallback.length);
    }
    setLoading(false);
  }, [page, sort, category, search]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const handleSearch = () => { setSearch(searchInput); setPage(1); };
  const handleCat = (val: string) => {
    setCategory(val); setPage(1);
    router.replace(val?`/blog?category=${val}`:"/blog", { scroll:false });
  };

  const totalPages = Math.ceil(total/8);
  const activeCat  = ALL_CATS.find(c=>c.value===category);

  return (
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"var(--cream)" }}>
      <SiteNavbar />

      {/* ── Filter bar: search + sort ── */}
      <div style={{ background:"var(--card)",borderBottom:"1px solid var(--border)",position:"sticky",top:69,zIndex:90 }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap" }}>
          {/* Search */}
          <form onSubmit={e=>{e.preventDefault();handleSearch();}}
            style={{ flex:"1 1 320px",maxWidth:560,display:"flex",alignItems:"center",background:"var(--cream)",border:"1.5px solid var(--border)",borderRadius:12,height:46,padding:"0 6px 0 16px",gap:10,transition:"border-color 0.15s" }}
            onFocus={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5"}}
            onBlur={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)"}}>
            <span style={{ color:"var(--ink-light)",fontSize:15 }}>🔍</span>
            <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
              placeholder="Search articles by title or topic…"
              aria-label="Search articles"
              style={{ flex:1,border:"none",outline:"none",background:"none",fontSize:14,color:"var(--ink)",fontFamily:"inherit",minWidth:0 }} />
            {searchInput && (
              <button type="button" onClick={()=>{setSearchInput("");setSearch("");setPage(1);}} aria-label="Clear search"
                style={{ border:"none",background:"none",color:"var(--ink-light)",fontSize:16,cursor:"pointer",padding:"0 4px",fontFamily:"inherit" }}>✕</button>
            )}
            <button type="submit"
              style={{ height:34,padding:"0 18px",background:"#4F46E5",color:"white",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0,fontFamily:"inherit" }}>
              Search
            </button>
          </form>

          {/* Sort */}
          <label style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ink-light)",flexShrink:0 }}>
            Sort by
            <select value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}
              style={{ height:46,padding:"0 14px",borderRadius:12,border:"1.5px solid var(--border)",fontSize:14,fontWeight:600,letterSpacing:"normal",textTransform:"none",color:"var(--ink-mid)",background:"var(--card)",cursor:"pointer",outline:"none",fontFamily:"inherit",minWidth:170 }}>
              {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <main style={{ maxWidth:1200,margin:"0 auto",padding:"40px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          {category && (
            <button onClick={()=>handleCat("")}
              style={{ fontSize:13,color:"var(--ink-light)",background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:8,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit" }}>
              ← All Articles
            </button>
          )}
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between" }}>
            <div>
              <p style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--ink-light)",marginBottom:4 }}>Articles</p>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:"var(--ink)" }}>
                {search?`"${search}"`:activeCat?.value?`${activeCat.icon} ${activeCat.label}`:"All Articles"}
              </h1>
            </div>
            {!loading&&<span style={{ fontSize:13,color:"var(--ink-light)" }}>{total} article{total!==1?"s":""}</span>}
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 268px",gap:28,alignItems:"start" }}>
          {/* List */}
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {loading
              ?[1,2,3,4].map(i=><Skeleton key={i} />)
              :articles.length>0
                ?articles.map((a,i)=><ArticleRow key={a.id??i} article={a} />)
                :(
                  <div style={{ background:"var(--card)",borderRadius:18,padding:52,textAlign:"center",border:"1px solid var(--border-light)" }}>
                    <div style={{ fontSize:44,marginBottom:14 }}>✍️</div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--ink)",marginBottom:8 }}>
                      {search?"No results found":"No articles yet"}
                    </h3>
                    <p style={{ color:"var(--ink-light)",fontSize:14,marginBottom:20 }}>
                      {search?"Try a different term.":"Create your first article via the API."}
                    </p>
                    {search
                      ?<button onClick={()=>{setSearch("");setSearchInput("");}} style={{ background:"#4F46E5",color:"white",padding:"10px 22px",borderRadius:8,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit" }}>Clear Search</button>
                      :<a href="http://localhost:8080/api/docs" target="_blank" rel="noreferrer" style={{ background:"#4F46E5",color:"white",padding:"10px 22px",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none" }}>Open API Docs →</a>
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
          <aside style={{ display:"flex",flexDirection:"column",gap:16,position:"sticky",top:150 }}>
            <div style={{ background:"var(--card)",borderRadius:14,padding:18,border:"1px solid var(--border-light)" }}>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--ink-light)",marginBottom:10,paddingBottom:8,borderBottom:"1px solid var(--border-light)" }}>Life & Personal</div>
              {LIFE_CATS.map(c=>(
                <button key={c.value} onClick={()=>handleCat(c.value)}
                  style={{ width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:8,border:"none",background:category===c.value?"var(--primary-light)":"transparent",color:category===c.value?"#4F46E5":"var(--ink-muted)",fontSize:13,fontWeight:category===c.value?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",transition:"all 0.13s" }}
                  onMouseEnter={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="var(--cream)"}}
                  onMouseLeave={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="transparent"}}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <div style={{ background:"var(--card)",borderRadius:14,padding:18,border:"1px solid var(--border-light)" }}>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--ink-light)",marginBottom:10,paddingBottom:8,borderBottom:"1px solid var(--border-light)" }}>Technology</div>
              {TECH_CATS.map(c=>(
                <button key={c.value} onClick={()=>handleCat(c.value)}
                  style={{ width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:8,border:"none",background:category===c.value?"var(--primary-light)":"transparent",color:category===c.value?"#4F46E5":"var(--ink-muted)",fontSize:13,fontWeight:category===c.value?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",transition:"all 0.13s" }}
                  onMouseEnter={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="var(--cream)"}}
                  onMouseLeave={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="transparent"}}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <div style={{ background:"linear-gradient(135deg,#1e1b4b,#4F46E5)",borderRadius:14,padding:18 }}>
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