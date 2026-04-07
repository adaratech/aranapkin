import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const session = request.cookies.get("aranapkin-session");
  const validToken = process.env.AUTH_SESSION_TOKEN;

  if (session?.value !== validToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api/auth|_next|favicon\\.ico).*)"],
};
