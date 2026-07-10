import { BrandLoader } from "@/components/wp/BrandLoader";

/* Route-level loading fallback for Suspense / server segments. */
export default function Loading() {
  return <BrandLoader fullscreen />;
}
