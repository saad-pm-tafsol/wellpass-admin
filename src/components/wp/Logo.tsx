import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official WellPass logo — a single square lockup (WP mark + "Well Pass"
 * wordmark + "CLUB"), served from /public. The exact same artwork is used for
 * every placement; only the rendered size changes per `variant`:
 *  - "full" — large, for the login hero
 *  - "logo" — medium, for nav bars / the sidebar
 *  - "mark" — compact, for tight spots
 *
 * The artwork has a transparent background with dark-teal type, so on dark
 * surfaces set `onDark` to place it on a white card and keep it legible. The
 * square asset carries its own internal padding, which blends into that card.
 */
const SRC = "/wellpass-logo.png";
const NATURAL = 2048;

// Rendered box height per variant. The asset is square, so width follows via
// `w-auto`. Content occupies ~half the asset height, so these are sized up
// accordingly to keep the visible lockup legible.
const SIZES = {
  full: "h-32",
  logo: "h-16",
  mark: "h-12",
} as const;

export function Logo({
  variant = "logo",
  onDark = false,
  priority = false,
  className,
  imgClassName,
}: {
  variant?: keyof typeof SIZES;
  onDark?: boolean;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        onDark && "rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      <Image
        src={SRC}
        width={NATURAL}
        height={NATURAL}
        alt="WellPass Club — Your Pass to Premium Wellness"
        priority={priority}
        className={cn("w-auto select-none", imgClassName ?? SIZES[variant])}
      />
    </span>
  );
}
