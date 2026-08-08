"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const startLoading = () => setIsLoading(true);

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor?.href) return;
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const currentUrl = `${window.location.pathname}${window.location.search}`;
      const nextUrl = `${url.pathname}${url.search}`;

      if (nextUrl !== currentUrl) {
        startLoading();
      }
    };

    const wrapHistoryMethod = (method: "pushState" | "replaceState") => {
      const original = history[method];

      history[method] = function (...args) {
        const nextUrl = typeof args[2] === "string" ? args[2] : null;
        const currentUrl = `${window.location.pathname}${window.location.search}`;

        if (nextUrl && nextUrl !== currentUrl) {
          startLoading();
        }

        return original.apply(this, args);
      };

      return original;
    };

    const originalPushState = wrapHistoryMethod("pushState");
    const originalReplaceState = wrapHistoryMethod("replaceState");

    window.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", startLoading);
    window.addEventListener("couup:navigation-start", startLoading);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", startLoading);
      window.removeEventListener("couup:navigation-start", startLoading);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#F97316]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F97316] animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-[#F97316]">Loading...</p>
      </div>
    </div>
  );
}

export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderInner />
    </Suspense>
  );
}
