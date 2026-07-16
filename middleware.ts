import { type NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";
const LOGGED_OUT_COOKIE = "admin_logged_out";
const SIGN_IN_PATH = "/admin/sign-in";

// Headers that prevent the browser from caching and restoring admin pages
// after logout — stops the back-button bypass.
const NO_CACHE_HEADERS: Record<string, string> = {
	"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
	Pragma: "no-cache",
	Expires: "0",
	// Prevent framing (extra hardening)
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	// Explicitly opt out of bfcache (non-standard but respected by some browsers)
	"Surrogate-Control": "no-store",
};

function applyNoCacheHeaders(response: NextResponse): NextResponse {
	for (const [key, value] of Object.entries(NO_CACHE_HEADERS)) {
		response.headers.set(key, value);
	}
	return response;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow the sign-in page itself through unconditionally
	if (pathname === SIGN_IN_PATH) {
		// Even the login page should not be cached so the browser doesn't
		// restore a stale "already logged in" version on back-nav.
		return applyNoCacheHeaders(NextResponse.next());
	}

	// Protect all other /admin routes
	if (pathname.startsWith("/admin")) {
		const session = request.cookies.get(ADMIN_SESSION_COOKIE);
		const loggedOut = request.cookies.get(LOGGED_OUT_COOKIE);

		// No valid session or explicitly logged out → redirect to sign-in
		if (loggedOut?.value === "1" || session?.value !== "authenticated") {
			const loginUrl = new URL(SIGN_IN_PATH, request.url);
			loginUrl.searchParams.set("from", pathname);

			const response = NextResponse.redirect(loginUrl);
			// Kill the stale session cookie on the way out
			response.cookies.delete(ADMIN_SESSION_COOKIE);
			// No-cache on the redirect response itself
			applyNoCacheHeaders(response);
			return response;
		}

		// Authenticated — serve with strict no-cache so browsers never restore
		// a stale admin page after the session ends.
		return applyNoCacheHeaders(NextResponse.next());
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
