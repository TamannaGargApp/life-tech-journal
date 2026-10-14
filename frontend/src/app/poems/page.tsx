"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
const PAGE_SIZE = 9;

const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

export default function PoemsPage() {
  const [poems,   setPoems]   = useState<any[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/articles?category=poems&sort=latest&size=${PAGE_SIZE}&page=${page}`)
      .then(r => r.json())
      .then(d => { setPoems(p => page === 1 ? (d.items ?? []) : [...p, ...(d.items ?? [])]); setTotal(d.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div style={{ fontFamily: "Lato, sans-serif", minHeight: "100vh", background: "var(--cream)" }}>
      <SiteNavbar />

      <header className="poems-hero">
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "88px 32px 80px", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🪶</div>
          <p className="hp-kicker" style={{ color: "#F9A8D4" }}>Poems</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px,5vw,60px)", fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: 18 }}>
            Verses from the <em style={{ fontStyle: "italic", color: "#F9A8D4" }}>heart</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            Small poems about big feelings: hope, people, change and the quiet moments in between.
          </p>
          {total > 0 && <p style={{ marginTop: 22, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{total} poem{total !== 1 ? "s" : ""}</p>}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px 80px" }}>
        {loading && page === 1 ? (
          <div className="poems-grid">{[1, 2, 3].map(i => <div key={i} className="poem-card" style={{ height: 260, animation: "shimmer 1.5s infinite" }} />)}</div>
        ) : poems.length > 0 ? (
          <>
            <div className="poems-grid">
              {poems.map(p => (
                <Link key={p.id ?? p.slug} href={`/blog/${p.slug}`} className="poem-card">
                  <span className="poem-mark" aria-hidden>“</span>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, marginBottom: 14 }}>{p.title}</h2>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.8, color: "var(--ink-muted)", whiteSpace: "pre-line", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</p>
                  <div style={{ marginTop: "auto", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "var(--ink-light)" }}>
                    <span><strong style={{ color: "var(--ink-mid)" }}>{p.author_name ?? "Life & Tech Team"}</strong> · {fmtDate(p.published_at)}</span>
                    <span className="poem-read">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
            {poems.length < total && (
              <div style={{ textAlign: "center", marginTop: 36 }}>
                <button className="btn-ghost" style={{ height: 46, padding: "0 26px" }} disabled={loading} onClick={() => setPage(p => p + 1)}>
                  {loading ? "Loading…" : "Load more poems"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "64px 24px", borderRadius: 24, border: "1px dashed var(--border)", background: "var(--card)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🪶</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "var(--ink)", marginBottom: 8 }}>The first poems are on their way</h2>
            <p style={{ color: "var(--ink-muted)", marginBottom: 22 }}>Publish an article in the <strong>Poems</strong> category from the Admin Panel and it will appear here.</p>
            <Link href="/blog?category=musings" className="btn-primary">Read musings meanwhile →</Link>
          </div>
        )}
      </main>

      <SiteFooter />
      <style>{`@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
