"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { withAiArticle } from "@/data/aiArticle";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// ─── Article Card ─────────────────────────────────────────────────────────────
const CAT_GRAD: Record<string, string> = {
  ai: "linear-gradient(135deg,#1e1b4b,#312e81,#14B8A6)",
  "web-dev": "linear-gradient(135deg,#134E4A,#0F766E,#14B8A6)",
  programming: "linear-gradient(135deg,#451A03,#92400E,#F59E0B)",
  career: "linear-gradient(135deg,#500724,#9D174D,#F472B6)",
  "personal-growth": "linear-gradient(135deg,#022C22,#065F46,#10B981)",
  lifestyle: "linear-gradient(135deg,#450A0A,#991B1B,#F87171)",
  travel: "linear-gradient(135deg,#1E1B4B,#3730A3,#818CF8)",
  marketing: "linear-gradient(135deg,#2D1B69,#7C3AED,#C4B5FD)",
  cybersecurity: "linear-gradient(135deg,#0F172A,#1E293B,#475569)",
  "data-science": "linear-gradient(135deg,#1E3A5F,#1D4ED8,#60A5FA)",
  "musings": "linear-gradient(135deg,#4A044E,#A21CAF,#F0ABFC)",
  poems: "linear-gradient(135deg,#3B0764,#BE185D,#FDA4AF)",
  default: "linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};
const CAT_EMOJI: Record<string, string> = {
  ai: "🤖", "web-dev": "🌐", programming: "⌨️", career: "🚀",
  "personal-growth": "🌱", lifestyle: "☀️", travel: "✈️",
  marketing: "📣", cybersecurity: "🛡️", "data-science": "📊", "musings": "💭", poems: "🪶", default: "✍️",
};

// ─── Newsletter Form ──────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"err">("idle");

  const submit = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const r = await fetch(`${API}/newsletter/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setStatus(r.ok ? "done" : "err");
    } catch { setStatus("err"); }
  };

  return (
    <section id="newsletter" style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#4F46E5 55%,#14B8A6 100%)", borderRadius: 24, padding: "64px 48px", textAlign: "center", margin: "72px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>Newsletter</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "white", marginBottom: 12, lineHeight: 1.2 }}>Stories in Your Inbox</h2>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, marginBottom: 36, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 36px" }}>
          Every Tuesday — our best articles about life, technology, and the beautiful intersection of both.
        </p>
        {status === "done" ? (
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "16px 32px", display: "inline-block", color: "white", fontSize: 16, fontWeight: 600 }}>
            🎉 Welcome aboard! Check your inbox.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto" }}>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              type="email" placeholder="your@email.com"
              style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", background: "rgba(255,255,255,0.95)" }} />
            <button onClick={submit} disabled={status === "loading"}
              style={{ padding: "14px 24px", borderRadius: 10, background: "#111827", color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14, whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.15s", opacity: status === "loading" ? 0.7 : 1 }}>
              {status === "loading" ? "…" : "Subscribe →"}
            </button>
          </div>
        )}
        {status === "err" && <p style={{ color: "#FCA5A5", marginTop: 10, fontSize: 13 }}>Something went wrong. Please try again.</p>}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 20 }}>
          {["✅ No spam", "📧 Weekly", "🔓 Unsubscribe anytime"].map(t => (
            <span key={t} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const LIFE_CATS = [
  { icon: "🌱", name: "Personal Growth", slug: "personal-growth" },
  { icon: "💼", name: "Career",           slug: "career" },
  { icon: "☀️", name: "Lifestyle",        slug: "lifestyle" },
  { icon: "❤️", name: "Relationships",    slug: "relationships" },
  { icon: "⚡", name: "Productivity",     slug: "productivity" },
  { icon: "✈️", name: "Travel",           slug: "travel" },
  { icon: "🔥", name: "Motivation",       slug: "motivation" },
  { icon: "💭", name: "Musings",          slug: "musings" },
  { icon: "🪶", name: "Poems",            slug: "poems" },
];
const TECH_CATS = [
  { icon: "🤖", name: "AI & ML",           slug: "ai" },
  { icon: "⌨️", name: "Programming",       slug: "programming" },
  { icon: "🌐", name: "Web Development",   slug: "web-dev" },
  { icon: "📣", name: "Digital Marketing", slug: "marketing" },
  { icon: "🛡️", name: "Cybersecurity",     slug: "cybersecurity" },
  { icon: "☁️", name: "Cloud Computing",   slug: "cloud" },
  { icon: "📊", name: "Data Science",      slug: "data-science" },
];
const ALL_CATS = [...LIFE_CATS, ...TECH_CATS];
const WRITING_CATS = ["musings", "poems"];
const catName = (slug?: string) => ALL_CATS.find(c => c.slug === slug)?.name ?? slug ?? "General";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
const isThisWeek = (d?: string) => !!d && Date.now() - new Date(d).getTime() < 7 * 24 * 3600 * 1000;
const compact = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n);
const initials = (name?: string) => (name ?? "LT").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const catKey = (a: any) => (a?.category_id ?? "default").toLowerCase().replace(/\s+/g, "-");

function Thumb({ article, size }: { article: any; size: number }) {
  const k = catKey(article);
  return (
    <div className="hp-thumb" style={{ background: CAT_GRAD[k] ?? CAT_GRAD.default }}>
      {article.featured_image
        ? <img src={article.featured_image} alt="" />
        : <span aria-hidden style={{ fontSize: size }}>{CAT_EMOJI[k] ?? CAT_EMOJI.default}</span>}
    </div>
  );
}

function Byline({ article }: { article: any }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-light)" }}>
      <span className="hp-avatar">{initials(article.author_name)}</span>
      <span style={{ fontWeight: 700, color: "var(--ink-mid)" }}>{article.author_name ?? "Life & Tech Team"}</span>
      <span>·</span><span>{fmtDate(article.published_at)}</span>
      <span>·</span><span>{article.read_time ?? 1} min</span>
    </div>
  );
}

function StoryCard({ article, big = false }: { article: any; big?: boolean }) {
  return (
    <Link href={`/blog/${article.slug}`} className={`hp-story${big ? " is-big" : ""}`}>
      <div className="hp-story-media"><Thumb article={article} size={big ? 64 : 42} /></div>
      <div style={{ padding: big ? "26px 28px 28px" : "18px 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span className="hp-tag">{catName(article.category_id)}</span>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: big ? 28 : 18, lineHeight: 1.25, fontWeight: 700, color: "var(--ink)" }}>{article.title}</h3>
        <p className="hp-clamp" style={{ fontSize: big ? 15.5 : 14, color: "var(--ink-muted)", lineHeight: 1.65, WebkitLineClamp: big ? 3 : 2 }}>{article.excerpt}</p>
        <div style={{ marginTop: "auto", paddingTop: 8 }}><Byline article={article} /></div>
      </div>
    </Link>
  );
}

// ─── Main Homepage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [hero,     setHero]     = useState<any | null>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [stats,    setStats]    = useState<{ articles: number; reads: number; subscribers: number; topics: number } | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [verses,   setVerses]   = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/articles?size=12&sort=latest`).then(r => r.json()).catch(() => ({ items: [], total: 0 })),
      fetch(`${API}/articles/featured`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/articles/stats`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/articles?size=4&sort=latest&category=${WRITING_CATS.join(",")}`).then(r => r.json()).catch(() => ({ items: [] })),
    ]).then(([list, feat, st, writing]) => {
      setVerses(withAiArticle(writing.items ?? [], { category: WRITING_CATS.join(",") }).slice(0, 4));
      const raw    = list.items ?? [];
      const latest = withAiArticle(raw);
      // Newest article first, so the page always reflects the latest post
      latest.sort((a: any, b: any) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());
      setArticles(latest);
      setHero(feat?.featured?.[0] ?? latest[0] ?? null);
      setTrending((feat?.trending ?? []).filter((a: any) => (a.views ?? 0) > 0));
      const extra = latest.length - raw.length;
      setStats(st
        ? { ...st, articles: st.articles + extra }
        : { articles: (list.total ?? 0) + extra, reads: 0, subscribers: 0, topics: new Set(latest.map(catKey)).size });
      setLoading(false);
    });
  }, []);

  const statItems = stats ? [
    { n: stats.articles,    l: stats.articles === 1 ? "Article" : "Articles" },
    { n: stats.topics,      l: stats.topics === 1 ? "Topic" : "Topics" },
    { n: stats.reads,       l: "Reads" },
    { n: stats.subscribers, l: "Subscribers" },
  ].filter(s => s.n > 0) : [];

  // Only a short selection on the landing page; musings and poems get their own section below.
  const rest = articles.filter(a => a.slug !== hero?.slug && !WRITING_CATS.includes(catKey(a))).slice(0, 3);

  return (
    <>
      <SiteNavbar />

      {/* ── Hero ── */}
      <section className="hp-hero">
        <div className="hp-blob hp-blob-a" /><div className="hp-blob hp-blob-b" />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "84px 32px 96px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center", position: "relative" }} className="hp-hero-grid">
          <div>
            <span className="hp-eyebrow"><span className="hp-dot" /> Fresh stories every week</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px,5.4vw,66px)", fontWeight: 700, lineHeight: 1.05, color: "var(--ink)", margin: "22px 0 22px", letterSpacing: "-0.01em" }}>
              Stories that <em className="hp-grad-text">inspire.</em><br />
              Technology that <em className="hp-grad-text">empowers.</em>
            </h1>
            <p style={{ fontSize: 18, color: "var(--ink-muted)", lineHeight: 1.7, marginBottom: 34, maxWidth: 520 }}>
              Life lessons, career journeys, personal growth, AI and the tech shaping tomorrow, written for curious minds.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/blog" className="btn-primary" style={{ height: 52, padding: "0 28px", fontSize: 15 }}>Start reading →</Link>
              <Link href="/blog?group=life" className="btn-ghost" style={{ height: 52, padding: "0 24px", fontSize: 15 }}>🌿 Life</Link>
              <Link href="/blog?group=tech" className="btn-ghost" style={{ height: 52, padding: "0 24px", fontSize: 15 }}>💻 Technology</Link>
            </div>
            {statItems.length > 0 && (
              <div className="hp-stats">
                {statItems.map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "var(--ink)" }}>{compact(s.n)}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero card: the featured article, or the newest one */}
          <div style={{ position: "relative" }}>
            {loading || !hero ? (
              <div className="hp-hero-card" style={{ height: 470, animation: "shimmer 1.5s infinite" }} />
            ) : (
              <>
                <Link href={`/blog/${hero.slug}`} className="hp-hero-card">
                  <div style={{ height: 250 }}><Thumb article={hero} size={78} /></div>
                  <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <span className="hp-tag">{catName(hero.category_id)}</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, lineHeight: 1.28, color: "var(--ink)" }}>{hero.title}</h2>
                    <p className="hp-clamp" style={{ fontSize: 14.5, color: "var(--ink-muted)", lineHeight: 1.65, WebkitLineClamp: 2 }}>{hero.excerpt}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 6 }}>
                      <Byline article={hero} />
                    </div>
                  </div>
                </Link>
                <div className="hp-float" style={{ top: -18, right: -18 }}>
                  <span style={{ fontSize: 18 }}>{(hero.views ?? 0) > 0 ? "📈" : hero.editors_pick ? "⭐" : "📰"}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)" }}>{hero.featured ? "Featured" : "Latest story"}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-light)" }}>
                      {(hero.views ?? 0) > 0 ? `${compact(hero.views)} reads` : hero.editors_pick ? "Editor's pick" : `${hero.read_time ?? 1} min read`}
                    </div>
                  </div>
                </div>
                <div className="hp-float" style={{ bottom: -18, left: -18, color: "var(--primary-text)", fontWeight: 700, fontSize: 13 }}>
                  {isThisWeek(hero.published_at)
                    ? <><span className="hp-dot" /> New this week</>
                    : <>📅 {fmtDate(hero.published_at)}</>}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Topic marquee ── */}
      <div className="hp-marquee" aria-label="Topics">
        <div className="hp-marquee-track">
          {[...ALL_CATS, ...ALL_CATS].map((c, i) => (
            <Link key={i} href={`/blog?category=${c.slug}`} className="hp-marquee-chip" tabIndex={i >= ALL_CATS.length ? -1 : 0}>
              <span aria-hidden>{c.icon}</span>{c.name}
            </Link>
          ))}
        </div>
      </div>

      <main style={{ fontFamily: "Lato, sans-serif", maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Latest ── */}
        <section style={{ padding: "80px 0 24px" }}>
          <div className="hp-section-head">
            <div>
              <p className="hp-kicker">Latest</p>
              <h2 className="hp-h2">Fresh off the press</h2>
            </div>
            <Link href="/blog" className="btn-ghost">View all articles →</Link>
          </div>
          {loading ? (
            <div className="hp-bento">{[1, 2, 3].map(i => <div key={i} className="hp-story" style={{ height: 320, animation: "shimmer 1.5s infinite" }} />)}</div>
          ) : rest.length > 0 ? (
            <div className={`hp-bento n${rest.length}`}>
              {rest.map((a, i) => <StoryCard key={a.id ?? a.slug} article={a} big={i === 0 && rest.length > 2} />)}
            </div>
          ) : (
            <div className="hp-empty">
              <div style={{ fontSize: 40 }}>✍️</div>
              <p style={{ color: "var(--ink-muted)" }}>More stories are on the way. New articles appear here as soon as they are published.</p>
            </div>
          )}
        </section>

        {/* ── Most read (real view counts) ── */}
        {trending.length > 0 && (
          <section style={{ padding: "56px 0 24px" }}>
            <div className="hp-section-head">
              <div>
                <p className="hp-kicker">Trending</p>
                <h2 className="hp-h2">Most read right now</h2>
              </div>
            </div>
            <div className="hp-trending">
              {trending.slice(0, 5).map((a, i) => (
                <Link key={a.id ?? a.slug} href={`/blog/${a.slug}`} className="hp-trend-item">
                  <span className="hp-trend-num">{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="hp-tag" style={{ marginBottom: 8 }}>{catName(a.category_id)}</span>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: "var(--ink)", margin: "8px 0 6px" }}>{a.title}</h4>
                    <span style={{ fontSize: 12, color: "var(--ink-light)" }}>{compact(a.views)} reads</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Musings & Poems ── */}
        <section style={{ padding: "56px 0 24px" }}>
          <div className="hp-verse">
            <div className="hp-verse-intro">
              <p className="hp-kicker" style={{ color: "#F9A8D4" }}>Musings & Poems</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, lineHeight: 1.15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
                Words for the <em style={{ fontStyle: "italic", color: "#F9A8D4" }}>quieter</em> moments
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15.5, lineHeight: 1.7, marginBottom: 26 }}>
                Wry observations on people and life, and poems written from the heart. Slow down and stay a while.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/poems" className="hp-world-cta">🪶 Read poems</Link>
                <Link href="/blog?category=musings" className="hp-verse-ghost">💭 Read musings</Link>
              </div>
            </div>
            <div className="hp-verse-list">
              {verses.length > 0 ? verses.map(v => (
                <Link key={v.id ?? v.slug} href={`/blog/${v.slug}`} className="hp-verse-card">
                  <span className="hp-verse-type">{catKey(v) === "poems" ? "🪶 Poem" : "💭 Musing"}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: 1.3, margin: "10px 0 8px" }}>{v.title}</h3>
                  <p className="hp-clamp" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, WebkitLineClamp: 2 }}>“{v.excerpt}”</p>
                  <span style={{ display: "block", marginTop: 12, fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>{v.author_name ?? "Life & Tech Team"} · {fmtDate(v.published_at)}</span>
                </Link>
              )) : (
                <div className="hp-verse-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 34, marginBottom: 10 }}>🪶</div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.85)" }}>The first verses are on their way.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Two worlds ── */}
        <section style={{ padding: "56px 0 24px" }}>
          <div className="hp-section-head">
            <div>
              <p className="hp-kicker">Explore</p>
              <h2 className="hp-h2">Two worlds, one journal</h2>
            </div>
          </div>
          <div className="hp-worlds">
            {[
              { key: "life", title: "Life & Personal", icon: "🌿", blurb: "Growth, careers, relationships, travel and the small truths of everyday life.", cats: LIFE_CATS, cls: "is-life" },
              { key: "tech", title: "Technology & Innovation", icon: "💻", blurb: "AI, code, the web, security and data, explained for people, not just engineers.", cats: TECH_CATS, cls: "is-tech" },
            ].map(w => (
              <div key={w.key} className={`hp-world ${w.cls}`}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{w.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{w.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15.5, lineHeight: 1.65, marginBottom: 22, maxWidth: 420 }}>{w.blurb}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
                  {w.cats.map(c => (
                    <Link key={c.slug} href={`/blog?category=${c.slug}`} className="hp-world-chip">{c.icon} {c.name}</Link>
                  ))}
                </div>
                <Link href={`/blog?group=${w.key}`} className="hp-world-cta">Browse all →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <NewsletterForm />
      </main>
      <SiteFooter />

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </>
  );
}
