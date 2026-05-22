import { NextResponse, type NextRequest } from "next/server"

// Project ref from NEXT_PUBLIC_SUPABASE_URL — used to identify the session cookie
const PROJECT_REF = "hccgwhhmpmucislxufyp"

function hasSupabaseSession(request: NextRequest): boolean {
  // @supabase/ssr splits large tokens across chunked cookies (.0, .1, …)
  // Checking for any of these is sufficient to know the user is signed in.
  const cookieNames = [
    `sb-${PROJECT_REF}-auth-token`,
    `sb-${PROJECT_REF}-auth-token.0`,
    `sb-${PROJECT_REF}-auth-token.1`,
  ]
  return cookieNames.some(name => request.cookies.has(name))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authenticated = hasSupabaseSession(request)

  // Protect all /dashboard/* routes
  if (!authenticated && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth"
    return NextResponse.redirect(url)
  }

  // Redirect signed-in users away from /auth to the dashboard
  if (authenticated && pathname === "/auth") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
