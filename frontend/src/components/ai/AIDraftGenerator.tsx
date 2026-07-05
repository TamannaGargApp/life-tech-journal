"use client";
import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

const CATS = [
    "personal-growth", "career", "lifestyle", "relationships", "productivity",
    "travel", "motivation", "ai", "programming", "web-dev", "marketing",
    "cybersecurity", "cloud", "data-science",
];

interface Props {
    onApply: (draft: string) => void;
}

export default function AIDraftGenerator({ onApply }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        category: "ai",
        tone: "professional",
        length: "medium",
        keywords: "",
    });
    const draftRef = useRef<HTMLTextAreaElement>(null);

    const generate = async () => {
        if (!form.title.trim()) { setError("Enter a title first"); return; }
        setLoading(true); setDraft(""); setError("");
        try {
            const res = await fetch(`${API}/ai/draft`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
                }),
            });
            if (!res.ok) { setError("AI unavailable"); setLoading(false); return; }
            if (!res.body) { setError("No response body"); setLoading(false); return; }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
                setDraft(accumulated);
                if (draftRef.current) {
                    draftRef.current.scrollTop = draftRef.current.scrollHeight;
                }
            }
        } catch { setError("Cannot reach AI. Is Ollama running?"); }
        setLoading(false);
    };

    const inp: React.CSSProperties = {
        width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #E8E4DE",
        outline: "none", fontSize: 13, fontFamily: "inherit", color: "#1A1A1A",
    };

    return (
        <>
            <button onClick={() => setOpen(true)}
                style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
                    background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "white",
                    border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
                }}>
                🤖 AI Draft Generator
            </button>

            {open && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 24
                }}
                    onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <div style={{
                        background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 680,
                        maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
                    }}>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: "linear-gradient(135deg,#7C3AED,#4F46E5)",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                                }}>🤖</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1A1A" }}>AI Draft Generator</div>
                                    <div style={{ fontSize: 11, color: "#A0A0A0" }}>Powered by Ollama Mistral</div>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)}
                                style={{
                                    background: "#F0EDE8", border: "none", borderRadius: "50%", width: 30, height: 30,
                                    cursor: "pointer", fontSize: 14
                                }}>✕</button>
                        </div>

                        {/* Form */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                            <div style={{ gridColumn: "1/-1" }}>
                                <label style={{
                                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                                    letterSpacing: "0.07em", color: "#6B6B6B", display: "block", marginBottom: 5
                                }}>Article Title *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. 10 Productivity Habits of Top Engineers"
                                    style={{ ...inp, fontSize: 14, padding: "11px 14px" }} />
                            </div>
                            <div>
                                <label style={{
                                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                                    letterSpacing: "0.07em", color: "#6B6B6B", display: "block", marginBottom: 5
                                }}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    style={{ ...inp, cursor: "pointer" }}>
                                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{
                                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                                    letterSpacing: "0.07em", color: "#6B6B6B", display: "block", marginBottom: 5
                                }}>Tone</label>
                                <select value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
                                    style={{ ...inp, cursor: "pointer" }}>
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual & Friendly</option>
                                    <option value="inspirational">Inspirational</option>
                                    <option value="educational">Educational</option>
                                </select>
                            </div>
                            <div>
                                <label style={{
                                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                                    letterSpacing: "0.07em", color: "#6B6B6B", display: "block", marginBottom: 5
                                }}>Length</label>
                                <select value={form.length} onChange={e => setForm(f => ({ ...f, length: e.target.value }))}
                                    style={{ ...inp, cursor: "pointer" }}>
                                    <option value="short">Short (~500 words)</option>
                                    <option value="medium">Medium (~1000 words)</option>
                                    <option value="long">Long (~1500+ words)</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: "1/-1" }}>
                                <label style={{
                                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                                    letterSpacing: "0.07em", color: "#6B6B6B", display: "block", marginBottom: 5
                                }}>Focus Keywords (optional)</label>
                                <input value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))}
                                    placeholder="productivity, morning routine, deep work" style={inp} />
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                background: "#FEF2F2", borderRadius: 8, padding: "10px 14px",
                                fontSize: 13, color: "#EF4444", marginBottom: 12
                            }}>⚠ {error}</div>
                        )}

                        <button onClick={generate} disabled={loading}
                            style={{
                                width: "100%", padding: "12px", background: "linear-gradient(135deg,#7C3AED,#4F46E5)",
                                color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
                                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 16,
                                boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
                            }}>
                            {loading ? "✍️ Writing your article…" : "🚀 Generate Draft"}
                        </button>

                        {/* Live streaming output */}
                        {(draft || loading) && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <label style={{
                                        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                                        letterSpacing: "0.07em", color: "#6B6B6B"
                                    }}>
                                        Generated Draft {loading && <span style={{ color: "#4F46E5" }}>● Live</span>}
                                    </label>
                                    <span style={{ fontSize: 11, color: "#A0A0A0" }}>
                                        ~{Math.ceil(draft.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length)} words
                                    </span>
                                </div>
                                <textarea ref={draftRef} value={draft} readOnly rows={14}
                                    style={{
                                        ...inp, resize: "vertical", lineHeight: 1.7,
                                        fontFamily: "'Courier New',monospace", fontSize: 12, background: "#F8FAFC"
                                    }} />

                                {/* Preview */}
                                {draft && !loading && (
                                    <details style={{ marginTop: 10 }}>
                                        <summary style={{ fontSize: 12, color: "#4F46E5", cursor: "pointer", fontWeight: 600 }}>
                                            👁 Preview rendered HTML
                                        </summary>
                                        <div style={{
                                            marginTop: 10, padding: 16, background: "#FAF8F5", borderRadius: 10,
                                            border: "1px solid #E8E4DE", fontSize: 14, lineHeight: 1.8, color: "#374151",
                                            maxHeight: 300, overflow: "auto"
                                        }}
                                            dangerouslySetInnerHTML={{ __html: draft }} />
                                    </details>
                                )}

                                {!loading && draft && (
                                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                        <button onClick={() => {
                                            // Strip markdown fences before applying
                                            let clean = draft
                                                .replace(/^```html?\s*/i, "")
                                                .replace(/```\s*$/g, "")
                                                .replace(/^```\s*/i, "")
                                                .trim();
                                            onApply(clean);
                                            setOpen(false);
                                        }}
                                            style={{
                                                flex: 1, padding: "11px", background: "#4F46E5", color: "white",
                                                border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
                                                cursor: "pointer", fontFamily: "inherit"
                                            }}>
                                            ✅ Use This Draft
                                        </button>
                                        <button onClick={generate}
                                            style={{
                                                padding: "11px 18px", background: "#F8FAFC", color: "#374151",
                                                border: "1.5px solid #E8E4DE", borderRadius: 10, fontWeight: 600,
                                                fontSize: 13, cursor: "pointer", fontFamily: "inherit"
                                            }}>
                                            🔄 Regenerate
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}