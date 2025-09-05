import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
	const { pathname, search } = request.nextUrl

	// Allow home page and Next static/asset paths
	if (
		pathname === "/" ||
		pathname.startsWith("/api/auth") ||
		pathname.startsWith("/api/debug") ||
		pathname.startsWith("/api/admin") ||
		pathname.startsWith("/api/giveaways") ||
		pathname.startsWith("/api/scripts") ||
		pathname.startsWith("/api/ads") ||
		pathname.startsWith("/api/upload") ||
		pathname.startsWith("/api/test") ||
		pathname.startsWith("/_next/") ||
		pathname === "/favicon.ico" ||
		/\.[^/]+$/.test(pathname)
	) {
		return NextResponse.next()
	}

	// Check NextAuth session cookies
	const hasSession =
		request.cookies.has("next-auth.session-token") ||
		request.cookies.has("__Secure-next-auth.session-token")

	if (!hasSession) {
		const signInUrl = new URL("/api/auth/signin", request.url)
		signInUrl.searchParams.set("callbackUrl", pathname + search)
		return NextResponse.redirect(signInUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!api/auth|api/debug|api/admin|_next/static|_next/image|favicon.ico|.*\\..*|$).*)"],
}


