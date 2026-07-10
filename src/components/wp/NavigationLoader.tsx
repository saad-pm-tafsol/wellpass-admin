"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLoader } from "@/components/wp/BrandLoader";

// Keep the animation on screen at least this long so instant client pages still
// show a visible transition instead of a jarring flash.
const MIN_VISIBLE_MS = 550;
// Absolute backstop so the overlay can never get permanently stuck.
const SAFETY_MS = 8000;

/**
 * Shows the brand loading overlay during every client-side navigation.
 *
 * App Router doesn't emit router events, so navigation START is detected three
 * ways — internal <a>/<Link> clicks, programmatic router.push/replace (via the
 * patched history methods), and browser back/forward (popstate). Navigation END
 * is the committed pathname changing. Only cross-page navigations trigger it;
 * same-path query updates (filters, tabs) are ignored.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    const begin = () => {
      setActive((cur) => {
        if (!cur) startedAt.current = Date.now();
        return true;
      });
    };

    const toUrl = (href: string) => {
      try {
        return new URL(href, window.location.href);
      } catch {
        return null;
      }
    };
    // A navigation worth showing: same origin, different pathname.
    const isPageNav = (href: string) => {
      const url = toUrl(href);
      return (
        !!url &&
        url.origin === window.location.origin &&
        url.pathname !== window.location.pathname
      );
    };

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || href.startsWith("#")) return;
      if (target && target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (isPageNav(anchor.href)) begin();
    };
    document.addEventListener("click", onClick, true);

    // Patch history so router.push/replace (login redirect, logout, etc.) also
    // trigger the overlay. Same-path updates are ignored inside isPageNav.
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    const wrap =
      (orig: History["pushState"]): History["pushState"] =>
      function (this: History, ...args) {
        const url = args[2];
        if (url != null && isPageNav(String(url))) begin();
        return orig.apply(this, args);
      };
    window.history.pushState = wrap(origPush);
    window.history.replaceState = wrap(origReplace);

    const onPop = () => begin();
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // Committed route changed → hold for the minimum visible time, then hide.
  useEffect(() => {
    if (!active) return;
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const t = window.setTimeout(() => setActive(false), wait);
    return () => window.clearTimeout(t);
    // Intentionally keyed on pathname: fires when the new page commits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Backstop against a navigation that never completes.
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setActive(false), SAFETY_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  if (!active) return null;
  return <BrandLoader fullscreen />;
}
