"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      sessionStorage.setItem("access_token", token);
      window.location.href = "/";
    } else {
      window.location.href = "/auth/login?error=google_failed";
    }
  }, [searchParams]);

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"Lato,sans-serif", flexDirection:"column", gap:16 }}>
      <div style={{ width:40, height:40, border:"3px solid var(--border)", borderTopColor:"#4F46E5", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <p style={{ color:"var(--ink-muted)", fontSize:15 }}>Signing you in…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function CallbackPage() {
  return <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>Loading…</div>}><CallbackContent /></Suspense>;
}