"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import type { ReactNode } from "react";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { ToastProvider, useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/Modal";
import { adminLogout } from "./sign-in/actions";

// ── Welcome toast (fires once after login redirect) ───────────────────────────
function WelcomeToast() {
	const { toast } = useToast();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get("welcome") === "1") {
			toast({
				variant: "success",
				title: "Welcome back, Admin! 👋",
				message: "You have successfully accessed the admin panel.",
			});
			const url = new URL(window.location.href);
			url.searchParams.delete("welcome");
			window.history.replaceState({}, "", url.toString());
		}
	}, [searchParams, toast]);

	return null;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function UserCircleIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-8 w-8"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
	{ label: "Blog Post", href: "/admin", exact: true },
	{ label: "Manage Posts", href: "/admin/posts", exact: false },
	{ label: "Manage Comments", href: "/admin/comments", exact: false },
	{ label: "Category", href: "/admin/categories", exact: false },
];

// ── bfcache guard — runs on every authenticated admin page ───────────────────
// When the user hits Back after logout, the browser may restore a cached page
// from the back-forward cache (bfcache) without hitting the server/middleware.
// We detect that event and immediately do a hard navigation to let the
// middleware decide whether the session is still valid. If it is, the middleware
// passes through; if not, it redirects to sign-in.
function BfcacheGuard() {
	useEffect(() => {
		function handlePageShow(e: PageTransitionEvent) {
			if (!e.persisted) return;
			// Page was restored from bfcache — force a fresh server check.
			// window.location.replace does a hard navigation (no new history entry)
			// so the middleware runs and can redirect to sign-in if needed.
			window.location.replace(window.location.href);
		}

		// Registering an unload listener also prevents most browsers from
		// putting this page into the bfcache in the first place.
		function handleUnload() {
			// intentionally empty
		}

		window.addEventListener("pageshow", handlePageShow);
		window.addEventListener("unload", handleUnload);
		return () => {
			window.removeEventListener("pageshow", handlePageShow);
			window.removeEventListener("unload", handleUnload);
		};
	}, []);

	return null;
}
function Logo() {
	return (
		<div className="flex items-center justify-center select-none">
			{/* biome-ignore lint/performance/noImgElement: sidebar logo */}
			<img
				src="/images/logo.png"
				alt="Verdant Nature logo"
				className="h-28 w-auto object-contain scale-110 brightness-200 contrast-125 transition-transform duration-300 hover:scale-125"
			/>
		</div>
	);
}

// ── Loading page (Suspense fallback) ──────────────────────────────────────────
const SHIMMER: React.CSSProperties = {
	background: "linear-gradient(90deg, #d4e9da 25%, #eaf5ec 50%, #d4e9da 75%)",
	backgroundSize: "600px 100%",
	animation: "sk-shimmer 1.4s infinite",
	borderRadius: 6,
};

function AdminLoadingPage() {
	const cards = ["a", "b", "c", "d", "e", "f"] as const;
	return (
		<>
			<style>{`@keyframes sk-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
			<div className="min-h-[80vh] select-none" style={{ background: "#f4fbf6" }}>
				<div className="mb-6">
					<div style={{ ...SHIMMER, height: 32, width: 176, marginBottom: 8 }} />
					<div style={{ ...SHIMMER, height: 16, width: 112, opacity: 0.6 }} />
				</div>
				<div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
					<div style={{ ...SHIMMER, height: 36, width: 224, borderRadius: 999 }} />
					<div style={{ ...SHIMMER, height: 36, width: 80, borderRadius: 999 }} />
					<div style={{ ...SHIMMER, height: 36, width: 80, borderRadius: 999 }} />
				</div>
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{cards.map((id) => (
						<div key={id} className="overflow-hidden rounded-xl border border-[#c4d4c4] bg-white">
							<div style={{ ...SHIMMER, height: 160, borderRadius: 0 }} />
							<div className="p-4 space-y-2">
								<div style={{ ...SHIMMER, height: 16, width: "75%" }} />
								<div style={{ ...SHIMMER, height: 12, width: "100%", opacity: 0.7 }} />
								<div style={{ ...SHIMMER, height: 12, width: "83%", opacity: 0.7 }} />
								<div style={{ ...SHIMMER, height: 12, width: "66%", opacity: 0.5 }} />
							</div>
							<div className="flex items-center justify-between px-4 pb-4">
								<div style={{ ...SHIMMER, height: 20, width: 64, borderRadius: 999 }} />
								<div style={{ ...SHIMMER, height: 16, width: 40 }} />
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

// ── Inner layout ──────────────────────────────────────────────────────────────
function AdminShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleLogout = () => {
		startTransition(async () => {
			await adminLogout();
		});
	};

	// ── Idle session timeout — 30 minutes ──────────────────────────────────────
	const IDLE_MS = 30 * 60 * 1000;
	const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (pathname === "/admin/sign-in") return;

		function resetTimer() {
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
			idleTimerRef.current = setTimeout(() => {
				startTransition(async () => {
					await adminLogout("timeout");
				});
			}, IDLE_MS);
		}

		const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;
		for (const evt of events) window.addEventListener(evt, resetTimer, { passive: true });
		resetTimer();

		return () => {
			if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
			for (const evt of events) window.removeEventListener(evt, resetTimer);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	if (pathname === "/admin/sign-in") {
		return <Suspense fallback={null}>{children}</Suspense>;
	}

	const isActive = (href: string, exact: boolean) =>
		exact ? pathname === href : pathname.startsWith(href);

	return (
		<div className="flex min-h-screen relative" style={{ background: "#f4fbf6" }}>
			{/* Prevent bfcache bypass after logout */}
			<BfcacheGuard />

			{/* Logout confirmation modal */}
			<ConfirmModal
				open={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleLogout}
				title="Sign out of Admin?"
				message="You will need to enter your password to access the admin panel again."
				confirmLabel={isPending ? "Signing out…" : "Sign out"}
				cancelLabel="Cancel"
				variant="danger"
				loading={isPending}
				showIcon={false}
			/>

			{/* Mobile Overlay */}
			{sidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-black/50 md:hidden w-full h-full cursor-default"
					onClick={() => setSidebarOpen(false)}
					onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
					aria-label="Close sidebar"
				/>
			)}

			{/* ── Sidebar ── */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 md:static md:w-55 md:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				style={{ background: "#0f3d2e", minHeight: "100vh" }}
			>
				<div className="flex items-center justify-between py-7 px-4 border-b border-white/10 md:justify-center">
					<Link href="/" aria-label="Go home">
						<Logo />
					</Link>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						className="md:hidden text-white/70 hover:text-white"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<nav className="flex-1 py-3 overflow-y-auto">
					{NAV.map(({ label, href, exact }) => {
						const active = isActive(href, exact);
						return (
							<Link
								key={href}
								href={href}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center justify-center text-center py-4 px-4 text-sm font-semibold transition-colors ${
									active
										? "bg-[#3a6b3a] text-white"
										: "text-white hover:bg-white/8 hover:text-white"
								}`}
							>
								{label}
							</Link>
						);
					})}
				</nav>

				<div className="border-t border-white/10 mt-auto py-2" />
			</aside>

			{/* ── Main ── */}
			<div className="flex-1 flex flex-col min-w-0">
				<div
					className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 md:justify-end gap-3"
					style={{ background: "#0f3d2e" }}
				>
					{/* Mobile Hamburger */}
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						className="md:hidden text-white/70 hover:text-white"
						aria-label="Open sidebar"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>

					<div className="flex items-center">
						{/* Profile dropdown */}
						<div className="relative">
							<button
								type="button"
								id="profile-menu-btn"
								onClick={() => setProfileOpen((v) => !v)}
								aria-label="Open profile menu"
								className="w-9 h-9 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:border-white/50 transition-colors"
							>
								<UserCircleIcon />
							</button>

							{profileOpen && (
								<>
									<button
										type="button"
										className="fixed inset-0 z-60 cursor-default w-full h-full"
										onClick={() => setProfileOpen(false)}
										aria-label="Close menu"
									/>
									<div
										className="absolute right-0 top-11 z-70 w-40 rounded-xl border border-white/10 shadow-xl overflow-hidden"
										style={{ background: "linear-gradient(135deg, #0f2d1e 0%, #0a1f15 100%)" }}
									>
										<button
											type="button"
											id="profile-logout-btn"
											onClick={() => {
												setProfileOpen(false);
												setShowLogoutModal(true);
											}}
											className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
												<path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
											</svg>
											Sign Out
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
					<Suspense fallback={<AdminLoadingPage />}>{children}</Suspense>
				</div>
			</div>
		</div>
	);
}

// ── Root layout export ────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<ToastProvider>
			<Suspense fallback={null}>
				<WelcomeToast />
			</Suspense>
			<Suspense fallback={<AdminLoadingPage />}>
				<AdminShell>{children}</AdminShell>
			</Suspense>
		</ToastProvider>
	);
}
