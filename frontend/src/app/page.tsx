"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { withAiArticle } from "@/data/aiArticle";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

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
  default: "linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)",
};
const CAT_EMOJI: Record<string, string> = {
  ai: "🤖", "web-dev": "🌐", programming: "⌨️", career: "🚀",
  "personal-growth": "🌱", lifestyle: "☀️", travel: "✈️",
  marketing: "📣", cybersecurity: "🛡️", "data-science": "📊", "musings": "💭", default: "✍️",
};

function ArticleCard({ article, featured = false }: { article: any; featured?: boolean }) {
  const cat   = (article.category_id ?? "default").toLowerCase().replace(/\s+/g, "-");
  const grad  = CAT_GRAD[cat]  ?? CAT_GRAD.default;
  const emoji = CAT_EMOJI[cat] ?? CAT_EMOJI.default;

  return (
    <Link href={`/blog/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        style={{ background: "var(--card)", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid var(--border-light)", transition: "all 0.25s", height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 28px rgba(79,70,229,0.12)"; el.style.transform = "translateY(-4px)"; el.style.borderColor = "var(--primary-border)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; el.style.transform = "translateY(0)"; el.style.borderColor = "var(--border-light)"; }}>
        <div style={{ height: featured ? 240 : 170, background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: featured ? 48 : 36, flexShrink: 0, position: "relative", overflow: "hidden" }}>
          {article.featured_image
            ? <img src={article.featured_image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            : <span style={{ zIndex: 1 }}>{emoji}</span>}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", background: "rgba(255,255,255,0.92)", color: "var(--primary-text)", padding: "3px 9px", borderRadius: 100 }}>
              {article.category_id ?? "General"}
            </span>
          </div>
        </div>
        <div style={{ padding: featured ? "22px 24px" : "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: featured ? 20 : 16, fontWeight: 700, color: "var(--ink)", lineHeight: 1.35, marginBottom: 8, flex: 1 }}>
            {article.title}
          </h3>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.65, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {article.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-light)", borderTop: "1px solid var(--border-light)", paddingTop: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: grad, flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: "var(--ink-muted)" }}>{article.author_name ?? article.author_id?.slice(0, 10) ?? "Author"}</span>
            <span>·</span>
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}</span>
            <span style={{ marginLeft: "auto", background: "var(--border-light)", padding: "1px 7px", borderRadius: 100 }}>⏱ {article.read_time ?? 1}m</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

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
  { icon: "🌱", name: "Personal Growth", slug: "personal-growth", desc: "Habits, mindset & clarity" },
  { icon: "💼", name: "Career",           slug: "career",          desc: "Work, growth & leadership" },
  { icon: "☀️", name: "Lifestyle",        slug: "lifestyle",       desc: "Everyday living, elevated" },
  { icon: "❤️", name: "Relationships",    slug: "relationships",   desc: "Love, friendship & family" },
  { icon: "⚡", name: "Productivity",     slug: "productivity",    desc: "Do more, stress less" },
  { icon: "✈️", name: "Travel",           slug: "travel",          desc: "Adventures near & far" },
  { icon: "🔥", name: "Motivation",       slug: "motivation",      desc: "Stories that move you" },
  { icon: "💭", name: "Musings",      slug: "musings",     desc: "Wry observations on people & life" },
];
const TECH_CATS = [
  { icon: "🤖", name: "AI & ML",          slug: "ai",              desc: "The intelligence revolution" },
  { icon: "⌨️", name: "Programming",      slug: "programming",     desc: "Code that matters" },
  { icon: "🌐", name: "Web Development",  slug: "web-dev",         desc: "Building the modern web" },
  { icon: "📣", name: "Digital Marketing",slug: "marketing",       desc: "Reach, engage, grow" },
  { icon: "🛡️", name: "Cybersecurity",    slug: "cybersecurity",   desc: "Stay safe out there" },
  { icon: "☁️", name: "Cloud Computing",  slug: "cloud",           desc: "Scale without limits" },
  { icon: "📊", name: "Data Science",     slug: "data-science",    desc: "Numbers tell stories" },
];

// ─── Main Homepage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/articles?size=6&status=published`).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${API}/articles/featured`).then(r => r.json()).catch(() => ({})),
    ]).then(([list, feat]) => {
      setArticles(withAiArticle(list.items ?? []).slice(0, 6));
      setTrending(feat?.trending ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SiteNavbar />
      <main style={{ fontFamily: "Lato, sans-serif", maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Hero ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 64, alignItems: "center", padding: "80px 0 64px" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-light)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "#4F46E5" }} />
              New Articles Every Week
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,5vw,58px)", fontWeight: 700, lineHeight: 1.1, color: "var(--ink)", marginBottom: 22 }}>
              Stories That{" "}
              <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#4F46E5,#14B8A6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Inspire.</em>
              <br />
              Technology That{" "}
              <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#4F46E5,#14B8A6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Empowers.</em>
            </h1>
            <p style={{ fontSize: 17, color: "var(--ink-muted)", lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
              Life lessons, career journeys, personal growth stories, AI innovations, technology trends, and practical insights — in one place.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/blog"
                style={{ background: "#4F46E5", color: "white", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(79,70,229,0.35)", transition: "all 0.18s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#3730A3"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                Start Reading →
              </Link>
              <Link href="/blog?group=tech"
                style={{ background: "transparent", color: "var(--ink-mid)", padding: "13px 24px", borderRadius: 10, fontWeight: 600, fontSize: 15, border: "1.5px solid var(--border)", textDecoration: "none", transition: "all 0.18s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#4F46E5"; (e.currentTarget as HTMLElement).style.color = "var(--primary-text)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--ink-mid)"; }}>
                Explore Tech ⚙
              </Link>
            </div>
            <div style={{ display: "flex", gap: 40, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border-light)" }}>
              {[["48K+", "Monthly Readers"], ["320+", "Articles"], ["12K+", "Subscribers"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--ink)" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div style={{ position: "relative" }}>
            <Link href="/blog/how-ai-is-reshaping-the-world-and-peoples-lives" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ background: "var(--card)", borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.12)", border: "1px solid var(--border-light)", transition: "all 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 56px rgba(79,70,229,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 48px rgba(0,0,0,0.12)"; }}>
              <div style={{ height: 210, background: "linear-gradient(135deg,#1e1b4b,#4F46E5,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>🤖</div>
              <div style={{ padding: 22 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--primary-text)", background: "var(--primary-light)", padding: "3px 10px", borderRadius: 100 }}>Artificial Intelligence</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "var(--ink)", marginTop: 10, marginBottom: 8, lineHeight: 1.35 }}>How AI is reshaping the world and people's lives</h3>
                <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6 }}>From work and healthcare to everyday life, a clear look at what is changing and how to thrive.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12, color: "var(--ink-light)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#4F46E5,#14B8A6)" }} />
                  <span>Tamanna Garg · 7 min read</span>
                  <span style={{ marginLeft: "auto" }}>🔥 Editor's Pick</span>
                </div>
              </div>
            </div>
            </Link>
            <div style={{ position: "absolute", top: -16, right: -16, background: "var(--card)", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span>📈</span><div><div style={{ fontWeight: 700, fontSize: 12, color: "var(--ink)" }}>Trending</div><div style={{ fontSize: 11, color: "var(--ink-light)" }}>42 readers today</div></div>
            </div>
            <div style={{ position: "absolute", bottom: -16, left: -16, background: "var(--card)", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 600, color: "var(--primary-text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} /> New this week
            </div>
          </div>
        </section>

        {/* ── Trending ── */}
        {trending.length > 0 && (
          <section style={{ marginBottom: 72 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>Trending This Week</h2>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
              {trending.slice(0, 5).map((a: any, i: number) => (
                <Link key={a.id ?? i} href={`/blog/${a.slug}`} style={{ textDecoration: "none", flexShrink: 0, width: 240 }}>
                  <div style={{ background: "var(--card)", borderRadius: 14, padding: 20, border: "1.5px solid var(--border-light)", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#4F46E5"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(79,70,229,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "var(--border)", lineHeight: 1, marginBottom: 10 }}>0{i + 1}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--primary-text)", background: "var(--primary-light)", padding: "2px 8px", borderRadius: 100, display: "inline-block", marginBottom: 8 }}>
                      {a.category_id ?? "General"}
                    </div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "var(--ink)", lineHeight: 1.4 }}>{a.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Latest Articles ── */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-light)", marginBottom: 4 }}>Latest</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)" }}>Fresh Off the Press</h2>
            </div>
            <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-text)", border: "1.5px solid #4F46E5", padding: "7px 16px", borderRadius: 8, textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--primary-text)"; }}>
              View All →
            </Link>
          </div>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ background: "var(--border-light)", borderRadius: 16, height: 290, animation: "shimmer 1.5s infinite" }} />)}
            </div>
          ) : articles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {articles.map((a: any, i: number) => <ArticleCard key={a.id ?? i} article={a} featured={i === 0} />)}
            </div>
          ) : (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 52, textAlign: "center", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✍️</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>No articles yet</h3>
              <p style={{ color: "var(--ink-light)", fontSize: 14, marginBottom: 20 }}>Create your first article via the API to see it here.</p>
              <a href="http://localhost:8080/api/docs" target="_blank" rel="noreferrer" style={{ background: "#4F46E5", color: "white", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Open API Docs →</a>
            </div>
          )}
        </section>

        {/* ── Life Categories ── */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>Life & Personal Stories</h2>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(152px,1fr))", gap: 14 }}>
            {LIFE_CATS.map(c => (
              <Link key={c.slug} href={`/blog?category=${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1.5px solid var(--border-light)", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#4F46E5"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 6px 18px rgba(79,70,229,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-light)" }}>{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Tech Categories ── */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>Technology & Innovation</h2>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(152px,1fr))", gap: 14 }}>
            {TECH_CATS.map(c => (
              <Link key={c.slug} href={`/blog?category=${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1.5px solid var(--border-light)", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#4F46E5"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 6px 18px rgba(79,70,229,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-light)" }}>{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <NewsletterForm />

        {/* ── Footer ── */}
      </main>
      <SiteFooter />

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}