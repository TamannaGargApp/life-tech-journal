"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

const SORT_OPTIONS = [
  { value:"latest",   label:"Latest First" },
  { value:"oldest",   label:"Oldest First" },
  { value:"popular",  label:"Most Popular" },
  { value:"trending", label:"Trending" },
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

// ── Navbar ────────────────────────────────────────────────────────────────────
function SiteNavbar() {
  return (
    <nav style={{ position:"sticky",top:0,zIndex:200,background:"rgba(250,248,245,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid #E8E4DE",boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",height:64,gap:24 }}>
        <Link href="/" style={{ textDecoration:"none",flexShrink:0 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1A1A1A",lineHeight:1 }}>
            Life <span style={{ color:"#4F46E5" }}>&</span> Tech
            <div style={{ fontSize:9,fontFamily:"Lato,sans-serif",fontWeight:300,letterSpacing:"0.22em",textTransform:"uppercase",color:"#A0A0A0",marginTop:2 }}>Journal</div>
          </div>
        </Link>
        <div style={{ flex:1,display:"flex",gap:2,justifyContent:"center" }}>
          {[["Home","/"],["Life","/blog?group=life"],["Technology","/blog?group=tech"],["About","/about"],["Contact","/contact"]].map(([l,h])=>(
            <Link key={l} href={h}
              style={{ padding:"7px 14px",fontSize:13,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:"#3D3D3D",borderRadius:8,textDecoration:"none",whiteSpace:"nowrap" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#4F46E5"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#3D3D3D"}}>
              {l}
            </Link>
          ))}
        </div>
        <div style={{ display:"flex",gap:8,flexShrink:0 }}>
          <Link href="/auth/login" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,border:"1.5px solid #E8E4DE",borderRadius:8,color:"#3D3D3D",textDecoration:"none",transition:"all 0.15s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#4F46E5";(e.currentTarget as HTMLElement).style.color="#4F46E5"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#E8E4DE";(e.currentTarget as HTMLElement).style.color="#3D3D3D"}}>
            Sign In
          </Link>
          <Link href="/#newsletter" style={{ padding:"7px 16px",fontSize:13,fontWeight:700,background:"#4F46E5",color:"white",borderRadius:8,textDecoration:"none",transition:"background 0.15s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#3730A3"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#4F46E5"}}>
            Subscribe
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
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
                <span key={icon} style={{ width:36,height:36,borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#6B7280",fontSize:13,cursor:"pointer",transition:"all 0.15s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#818CF8";(e.currentTarget as HTMLElement).style.color="#818CF8"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.1)";(e.currentTarget as HTMLElement).style.color="#6B7280"}}>
                  {icon}
                </span>
              ))}
            </div>
          </div>
          {cols.map(col=>(
            <div key={col.title}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.3)",marginBottom:20 }}>{col.title}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {col.links.map(([label,href])=>(
                  <Link key={label} href={href} style={{ fontSize:14,color:"#5D5D5D",textDecoration:"none",transition:"color 0.15s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="white"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#5D5D5D"}}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"28px 0",borderBottom:"1px solid rgba(255,255,255,0.07)",gap:20,flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"white",marginBottom:4 }}>Get stories in your inbox</div>
            <div style={{ fontSize:13,color:"#5D5D5D" }}>Every Tuesday — curated articles about life & tech.</div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <input type="email" placeholder="your@email.com" style={{ padding:"9px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:13,outline:"none",fontFamily:"inherit",width:210 }} />
            <button style={{ padding:"9px 18px",background:"#4F46E5",color:"white",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"background 0.15s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#3730A3"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#4F46E5"}}>
              Subscribe →
            </button>
          </div>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",fontSize:13,color:"#4B4B4B",flexWrap:"wrap",gap:12 }}>
          <span>© 2025 Life & Tech Journal. All rights reserved.</span>
          <div style={{ display:"flex",gap:24 }}>
            {[["Privacy Policy","/privacy"],["Terms of Use","/terms"],["Sitemap","/sitemap.xml"]].map(([l,h])=>(
              <Link key={l} href={h} style={{ color:"#4B4B4B",textDecoration:"none",transition:"color 0.15s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#9CA3AF"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#4B4B4B"}}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      <span style={{ fontSize:11,color:"#A0A0A0",marginLeft:3 }}>{done?`${rating}/5`:"Rate"}</span>
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
    <div style={{ background:"white",borderRadius:14,overflow:"hidden",display:"flex",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",border:"1px solid #F0EDE8",transition:"all 0.22s" }}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 6px 24px rgba(79,70,229,0.1)";el.style.transform="translateX(4px)";el.style.borderColor="#C7D2FE"}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";el.style.transform="translateX(0)";el.style.borderColor="#F0EDE8"}}>
      <Link href={`/blog/${article.slug}`} style={{ textDecoration:"none",flexShrink:0 }}>
        <div style={{ width:155,minHeight:130,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30 }}>
          {article.featured_image?<img src={article.featured_image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:emoji}
        </div>
      </Link>
      <div style={{ padding:"14px 18px",flex:1 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
          <Link href={`/blog?category=${cat}`} style={{ textDecoration:"none" }}>
            <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:"#4F46E5",background:"#EEF2FF",padding:"2px 8px",borderRadius:100 }}>
              {catMeta?.icon} {article.category_id??"General"}
            </span>
          </Link>
          <span style={{ fontSize:11,color:"#A0A0A0" }}>⏱ {article.read_time??1} min</span>
        </div>
        <Link href={`/blog/${article.slug}`} style={{ textDecoration:"none" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1A1A1A",lineHeight:1.4,marginBottom:4 }}>{article.title}</h3>
          <p style={{ fontSize:13,color:"#6B6B6B",lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{article.excerpt}</p>
        </Link>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#A0A0A0" }}>
            <div style={{ width:18,height:18,borderRadius:"50%",background:grad }} />
            <span style={{ fontWeight:600,color:"#6B6B6B" }}>{article.author_id?.slice(0,10)??"Author"}</span>
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
    <div style={{ background:"white",borderRadius:14,overflow:"hidden",display:"flex",height:130,border:"1px solid #F0EDE8" }}>
      <div style={{ width:155,background:"#F0EDE8",animation:"shimmer 1.5s infinite" }} />
      <div style={{ flex:1,padding:16,display:"flex",flexDirection:"column",gap:10 }}>
        <div style={{ height:11,width:80,background:"#F0EDE8",borderRadius:6 }} />
        <div style={{ height:16,width:"60%",background:"#F0EDE8",borderRadius:6 }} />
        <div style={{ height:11,width:"85%",background:"#F0EDE8",borderRadius:6 }} />
      </div>
    </div>
  );
}

// ── Blog Content ──────────────────────────────────────────────────────────────
function BlogContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const chipRowRef   = useRef<HTMLDivElement>(null);  // ref for scroll-to-selected

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

  // ── Scroll selected chip into view ──────────────────────────────────────────
  useEffect(() => {
    if (!chipRowRef.current) return;
    const row = chipRowRef.current;
    // Find the active button by data-cat attribute
    const activeBtn = row.querySelector<HTMLButtonElement>(`[data-cat="${category}"]`);
    if (activeBtn) {
      // Smooth scroll so the button is visible near the left of the row
      const rowLeft   = row.getBoundingClientRect().left;
      const btnLeft   = activeBtn.getBoundingClientRect().left;
      const offset    = btnLeft - rowLeft - 12;  // 12px breathing room
      row.scrollBy({ left: offset, behavior: "smooth" });
    } else {
      // No active chip (e.g. "All") — scroll back to start
      row.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [category]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page:String(page), size:"8", sort });
    if (category) qs.set("category", category);
    if (search)   qs.set("search", search);
    try {
      const res  = await fetch(`${API}/articles?${qs}`);
      const data = await res.json();
      setArticles(data.items??[]);
      setTotal(data.total??0);
    } catch { setArticles([]); }
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
    <div style={{ fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#FAF8F5" }}>
      <SiteNavbar />

      {/* ── Filter bar ── */}
      <div style={{ background:"white",borderBottom:"1px solid #E8E4DE",position:"sticky",top:64,zIndex:90 }}>
        <div style={{
          maxWidth:1200, margin:"0 auto", padding:"0 32px",
          height:56, display:"flex", alignItems:"center", gap:10,
        }}>
          {/* Search */}
          <div style={{ display:"flex",alignItems:"center",background:"#FAF8F5",border:"1.5px solid #E8E4DE",borderRadius:8,height:36,padding:"0 12px",gap:6,width:170,flexShrink:0 }}>
            <span style={{ color:"#A0A0A0",fontSize:12 }}>🔍</span>
            <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSearch()}
              placeholder="Search…"
              style={{ border:"none",outline:"none",background:"none",fontSize:13,width:"100%",color:"#1A1A1A",fontFamily:"inherit" }} />
          </div>

          <button onClick={handleSearch}
            style={{ height:36,padding:"0 14px",background:"#4F46E5",color:"white",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0,fontFamily:"inherit" }}>
            Search
          </button>

          <div style={{ width:1,height:24,background:"#E8E4DE",flexShrink:0 }} />

          {/*
            Chip row:
            - flex-1 takes remaining space
            - overflow-x scroll, NO wrap
            - padding-right 8px so last chip never hugs the divider
          */}
          <div
            ref={chipRowRef}
            style={{
              flex:1, display:"flex", flexWrap:"nowrap", gap:6,
              overflowX:"auto", overflowY:"hidden",
              scrollbarWidth:"none", alignItems:"center",
              minWidth:0, paddingRight:8,
            }}>
            {ALL_CATS.map(f=>(
              <button
                key={f.value}
                data-cat={f.value}          /* used for scroll-to */
                onClick={()=>handleCat(f.value)}
                style={{
                  height:30, padding:"0 11px", borderRadius:100,
                  fontSize:12, fontWeight:600, border:"1.5px solid",
                  cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                  fontFamily:"inherit", transition:"all 0.15s",
                  borderColor: category===f.value?"#4F46E5":"#E8E4DE",
                  background:  category===f.value?"#4F46E5":"white",
                  color:       category===f.value?"white":"#6B6B6B",
                }}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          <div style={{ width:1,height:24,background:"#E8E4DE",flexShrink:0 }} />

          <select value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}
            style={{ height:36,padding:"0 10px",borderRadius:8,border:"1.5px solid #E8E4DE",fontSize:13,color:"#3D3D3D",background:"white",cursor:"pointer",outline:"none",fontFamily:"inherit",flexShrink:0 }}>
            {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <main style={{ maxWidth:1200,margin:"0 auto",padding:"40px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          {category && (
            <button onClick={()=>handleCat("")}
              style={{ fontSize:13,color:"#A0A0A0",background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:8,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit" }}>
              ← All Articles
            </button>
          )}
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between" }}>
            <div>
              <p style={{ fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#A0A0A0",marginBottom:4 }}>Articles</p>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:"#1A1A1A" }}>
                {search?`"${search}"`:activeCat?.value?`${activeCat.icon} ${activeCat.label}`:"All Articles"}
              </h1>
            </div>
            {!loading&&<span style={{ fontSize:13,color:"#A0A0A0" }}>{total} article{total!==1?"s":""}</span>}
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
                  <div style={{ background:"white",borderRadius:18,padding:52,textAlign:"center",border:"1px solid #F0EDE8" }}>
                    <div style={{ fontSize:44,marginBottom:14 }}>✍️</div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A",marginBottom:8 }}>
                      {search?"No results found":"No articles yet"}
                    </h3>
                    <p style={{ color:"#A0A0A0",fontSize:14,marginBottom:20 }}>
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
                  style={{ padding:"7px 14px",borderRadius:8,border:"1.5px solid #E8E4DE",background:"white",cursor:page===1?"not-allowed":"pointer",color:page===1?"#D1D5DB":"#3D3D3D",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                  ← Prev
                </button>
                {Array.from({length:Math.min(5,totalPages)},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)}
                    style={{ width:36,height:36,borderRadius:8,border:"1.5px solid",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit",
                      borderColor:page===p?"#4F46E5":"#E8E4DE",
                      background: page===p?"#4F46E5":"white",
                      color:      page===p?"white":"#3D3D3D" }}>
                    {p}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ padding:"7px 14px",borderRadius:8,border:"1.5px solid #E8E4DE",background:"white",cursor:page===totalPages?"not-allowed":"pointer",color:page===totalPages?"#D1D5DB":"#3D3D3D",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display:"flex",flexDirection:"column",gap:16,position:"sticky",top:132 }}>
            <div style={{ background:"white",borderRadius:14,padding:18,border:"1px solid #F0EDE8" }}>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#A0A0A0",marginBottom:10,paddingBottom:8,borderBottom:"1px solid #F0EDE8" }}>Life & Personal</div>
              {LIFE_CATS.map(c=>(
                <button key={c.value} onClick={()=>handleCat(c.value)}
                  style={{ width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:8,border:"none",background:category===c.value?"#EEF2FF":"transparent",color:category===c.value?"#4F46E5":"#6B6B6B",fontSize:13,fontWeight:category===c.value?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",transition:"all 0.13s" }}
                  onMouseEnter={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="#FAF8F5"}}
                  onMouseLeave={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="transparent"}}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <div style={{ background:"white",borderRadius:14,padding:18,border:"1px solid #F0EDE8" }}>
              <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#A0A0A0",marginBottom:10,paddingBottom:8,borderBottom:"1px solid #F0EDE8" }}>Technology</div>
              {TECH_CATS.map(c=>(
                <button key={c.value} onClick={()=>handleCat(c.value)}
                  style={{ width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:8,border:"none",background:category===c.value?"#EEF2FF":"transparent",color:category===c.value?"#4F46E5":"#6B6B6B",fontSize:13,fontWeight:category===c.value?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",transition:"all 0.13s" }}
                  onMouseEnter={e=>{if(category!==c.value)(e.currentTarget as HTMLElement).style.background="#FAF8F5"}}
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
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"#A0A0A0"}}>Loading…</div>}>
      <BlogContent />
    </Suspense>
  );
}