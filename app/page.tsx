import { redirect } from "next/navigation";

// Middleware normally handles "/", but keep a server-side fallback so the route
// is never a dead end.
export default function RootIndex() {
  redirect("/admin/dashboard");
}
