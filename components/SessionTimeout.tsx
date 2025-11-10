"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const TIMEOUT_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds (increased from 30)

export function SessionTimeout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (status !== "authenticated") return;

    // Disable timeout for MATRIX and platforms - users should stay logged in
    if (pathname?.startsWith("/matrix") || pathname?.startsWith("/platforms")) {
      return;
    }

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        console.log("Session timeout - logging out");
        await signOut({ 
          redirect: false 
        });
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }, TIMEOUT_DURATION);
    };

    // Activity events to track
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    // Reset timer on any activity
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [status, router, pathname]);

  return null; // This component doesn't render anything
}

