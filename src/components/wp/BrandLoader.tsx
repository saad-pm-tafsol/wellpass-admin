import { Logo } from "@/components/wp/Logo";
import { cn } from "@/lib/utils";

/**
 * Brand loading indicator: the WellPass logo with three dots below that bounce
 * in sequence. Used as the route-transition overlay (see NavigationLoader) and
 * as the Suspense/route loading fallback (app/loading.tsx).
 *
 * Pass `fullscreen` to center it over a soft, blurred backdrop covering the
 * whole viewport.
 */
export function BrandLoader({
  fullscreen = false,
  className,
}: {
  fullscreen?: boolean;
  className?: string;
}) {
  const content = (
    <div
      className={cn("flex flex-col items-center justify-center gap-7", className)}
      role="status"
      aria-live="polite"
    >
      <Logo variant="logo" imgClassName="h-24" priority />
      <div className="flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="wp-loader-dot block h-2.5 w-2.5 rounded-full bg-primary"
            style={{ animationDelay: `${i * 0.16}s` }}
            aria-hidden
          />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="wp-overlay-in fixed inset-0 z-[200] grid place-items-center bg-background/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
