import { NextResponse } from "next/server";

import { readContent, writeContent } from "@/lib/server/content-store";

// Local stand-in for the future content backend. GET returns the full content
// state; PUT merges a partial patch ({ faqs?, loyaltyRules?, planValidity? }).
// See src/lib/server/content-store.ts for the storage details.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const patch = await request.json().catch(() => ({}));
  const next = await writeContent(patch && typeof patch === "object" ? patch : {});
  return NextResponse.json(next, { headers: { "Cache-Control": "no-store" } });
}
