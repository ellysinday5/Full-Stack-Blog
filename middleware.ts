import { type NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Protect all /admin routes except the login page itself
	if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
		const session = request.cookies.get(ADMIN_SESSION_COOKIE);

		if (session?.value !== "authenticated") {
			const loginUrl = new URL("/admin/login", request.url);
			// Preserve the original destination so we can redirect back after login
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
