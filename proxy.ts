// Auth-free proxy — no Clerk required.
// All routes are publicly accessible. Add auth here when ready.
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
