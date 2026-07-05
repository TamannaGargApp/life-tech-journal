/**
 * useAuth — global token refresh hook
 * Import and call this in your root layout or any top-level component.
 * It silently refreshes the access token every 14 minutes using the
 * httpOnly refresh_token cookie set by the backend on login.
 */
"use client";
import { useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
const REFRESH_INTERVAL_MS = 14 * 60 * 1000; // 14 min (token expires at 15)

export function useAuth() {
  const refresh = useCallback(async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return; // not logged in, nothing to refresh

    try {
      const res  = await fetch(`${API}/auth/refresh`, {
        method:      "POST",
        credentials: "include", // sends the httpOnly refresh_token cookie
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("access_token", data.access_token);
        console.debug("[auth] token refreshed");
      } else if (res.status === 401) {
        // Refresh token also expired — clear session, redirect to login
        sessionStorage.removeItem("access_token");
        window.location.href = `/auth/login?from=${encodeURIComponent(window.location.pathname)}`;
      }
    } catch {
      // Network error — don't log out, just retry next interval
      console.warn("[auth] token refresh failed (network error)");
    }
  }, []);

  useEffect(() => {
    // Refresh immediately on mount (catches tabs that were open overnight)
    refresh();

    // Then refresh every 14 minutes
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);
}