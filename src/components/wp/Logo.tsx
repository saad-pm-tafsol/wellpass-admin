import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official WellPass logo (the provided artwork), served from /public.
 *  - "full" — WP mark + "WellPass" wordmark + tagline
 *  - "logo" — WP mark + "WellPass" wordmark (compact, for nav bars)
 *  - "mark" — WP monogram only
 *
 * The artwork uses dark teal type on a transparent background, so on dark
 * surfaces set `onDark` to place it on a white card and keep it legible.
 */
const ASSETS = {
  full: { src: "/wellpass-full.png", w: 1689, h: 1664 },
  logo: { src: "/wellpass-logo.png", w: 1444, h: 1006 },
  mark: { src: "/wellpass-mark.png", w: 1009, h: 616 },
} as const;

export function Logo({
  variant = "logo",
  onDark = false,
  priority = false,
  className,
  imgClassName,
}: {
  variant?: keyof typeof ASSETS;
  onDark?: boolean;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const a = ASSETS[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        onDark && "rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      <Image
        src={a.src}
        width={a.w}
        height={a.h}
        alt="WellPass — Your Pass to Premium Wellness"
        priority={priority}
        className={cn("w-auto select-none", imgClassName ?? "h-10")}
      />
    </span>
  );
}
