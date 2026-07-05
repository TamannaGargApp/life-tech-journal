/**
 * AuthProvider — wraps the app and runs token auto-refresh globally.
 * Place this in frontend/src/components/AuthProvider.tsx
 * Then use it in frontend/src/app/layout.tsx
 */
"use client";
import { useAuth } from "./use-auth";
import dynamic from "next/dynamic";

// Load chat widget client-side only — fine here since AuthProvider is already "use client"
const AIChatWidget = dynamic(() => import("./ai/AIChatWidget"), { ssr: false });

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth(); // runs refresh loop silently in background
  return (
    <>
      {children}
      <AIChatWidget />
    </>
  );
}