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
				title: "Welcome back, Admin!",
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
	const pathname = usePathname();

	useEffect(() => {
		// Check client-side active session cookie on routing.
		// If it's missing (e.g. after logout), perform a hard redirect to clean Next.js SPA/client router cache.
		if (pathname !== "/admin/sign-in" && pathname !== "/admin/login") {
			const hasActiveSession = document.cookie
				.split("; ")
				.some((row) => row.startsWith("admin_active="));

			if (!hasActiveSession) {
				window.location.replace("/admin/sign-in?reason=logout");
				return;
			}
		}

		function handlePageShow(e: PageTransitionEvent) {
			if (!e.persisted) return;
			// Page was restored from bfcache — force a fresh server check.
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
	}, [pathname]);

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

// ── Loading skeletons — one per route, all match the real UI ─────────────────
const SHIMMER: React.CSSProperties = {
	background: "linear-gradient(90deg, #d4e9da 25%, #eaf5ec 50%, #d4e9da 75%)",
	backgroundSize: "600px 100%",
	animation: "sk-shimmer 1.4s infinite",
	borderRadius: 6,
};

const S = (overrides: React.CSSProperties = {}) => ({ ...SHIMMER, ...overrides });

// Shared toolbar skeleton: search pill + two buttons + optional right button
function ToolbarSkeleton({ rightBtn = false }: { rightBtn?: boolean }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
			<div style={S({ height: 36, width: 220, borderRadius: 999 })} />
			<div style={S({ height: 36, width: 88, borderRadius: 8 })} />
			<div style={S({ height: 36, width: 72, borderRadius: 8 })} />
			{rightBtn && (
				<div style={{ marginLeft: "auto" }}>
					<div style={S({ height: 36, width: 100, borderRadius: 8 })} />
				</div>
			)}
		</div>
	);
}

// ── Blog Post (dashboard) skeleton ───────────────────────────────────────────
// Matches: h1 "Write a post" + toolbar + Recent Activity card grid (3 cols)
function DashboardSkeleton() {
	const cards = [0, 1, 2] as const;
	return (
		<div className="w-full">
			{/* h1 */}
			<div style={S({ height: 28, width: 160, marginBottom: 20 })} />
			{/* Toolbar */}
			<ToolbarSkeleton rightBtn />
			{/* Recent Activity container */}
			<div className="rounded-xl border-2 border-[#1a2e1a]/20 bg-[#f0f3ef] p-5">
				{/* "Recent Activity" label */}
				<div style={S({ height: 14, width: 120, marginBottom: 16 })} />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{cards.map((i) => (
						<div key={i} className="rounded-xl border border-[#c4d4c4] bg-white overflow-hidden">
							{/* Cover image */}
							<div style={S({ height: 160, borderRadius: 0 })} />
							{/* Body */}
							<div className="p-3 space-y-2">
								<div style={S({ height: 14, width: "80%" })} />
								<div style={S({ height: 11, width: "100%", opacity: 0.7 })} />
								<div style={S({ height: 11, width: "70%", opacity: 0.5 })} />
							</div>
							{/* Footer */}
							<div className="flex items-center justify-between px-3 pb-3 pt-2 border-t border-[#1a2e1a]/10">
								<div style={S({ height: 18, width: 60, borderRadius: 999 })} />
								<div style={S({ height: 13, width: 30 })} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ── Manage Posts skeleton ────────────────────────────────────────────────────
// Matches: h1 "Manage Post" + toolbar (search + filter + sort + grid/table toggle) + card grid
function ManagePostsSkeleton() {
	const cards = [0, 1, 2, 3, 4, 5] as const;
	return (
		<div className="w-full">
			<div style={S({ height: 28, width: 140, marginBottom: 24 })} />
			{/* Toolbar: search + filter + sort + view-toggle */}
			<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
				<div style={S({ height: 36, width: 220, borderRadius: 999 })} />
				<div style={S({ height: 36, width: 88, borderRadius: 8 })} />
				<div style={S({ height: 36, width: 72, borderRadius: 8 })} />
				<div style={{ marginLeft: "auto" }}>
					<div style={S({ height: 36, width: 72, borderRadius: 8 })} />
				</div>
			</div>
			{/* 3-col card grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{cards.map((i) => (
					<div key={i} className="rounded-xl border border-[#1a2e1a]/20 bg-white overflow-hidden">
						<div style={S({ height: 176, borderRadius: 0 })} />
						<div className="p-3 space-y-2">
							<div style={S({ height: 14, width: "75%" })} />
							<div style={S({ height: 11, width: "60%", opacity: 0.6 })} />
							<div style={S({ height: 10, width: "40%", opacity: 0.4 })} />
						</div>
						<div className="flex items-center justify-between px-3 pb-3 pt-2 border-t border-[#1a2e1a]/10">
							<div style={S({ height: 18, width: 64, borderRadius: 999 })} />
							<div style={S({ height: 13, width: 30 })} />
						</div>
					</div>
				))}
			</div>
			<div style={S({ height: 11, width: 80, marginTop: 16, opacity: 0.5 })} />
		</div>
	);
}

// ── Manage Comments skeleton ──────────────────────────────────────────────────
// Matches: h1 + AutoApproveToggle on the right + CommentsTable (rows)
function CommentsSkeleton() {
	const rows = [0, 1, 2, 3, 4, 5] as const;
	return (
		<div className="w-full">
			{/* Header row: h1 + toggle */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
				<div style={S({ height: 28, width: 180 })} />
				{/* AutoApproveToggle pill */}
				<div style={S({ height: 48, width: 260, borderRadius: 12 })} />
			</div>
			{/* Table */}
			<div className="rounded-xl border border-[#1a2e1a]/20 bg-white overflow-hidden">
				{/* Table header */}
				<div className="bg-[#f0f3ef] px-4 py-3 grid grid-cols-5 gap-4 border-b border-[#1a2e1a]/15">
					{[80, 100, 120, 80, 60].map((w, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
						<div key={i} style={S({ height: 11, width: w })} />
					))}
				</div>
				{/* Rows */}
				{rows.map((i) => (
					<div key={i} className="px-4 py-3.5 grid grid-cols-5 gap-4 border-b border-[#1a2e1a]/8 last:border-0">
						<div style={S({ height: 13, width: "85%" })} />
						<div style={S({ height: 13, width: "70%", opacity: 0.7 })} />
						<div style={S({ height: 13, width: "80%", opacity: 0.7 })} />
						<div style={S({ height: 20, width: 60, borderRadius: 999, opacity: 0.6 })} />
						<div style={S({ height: 28, width: 28, borderRadius: 6, opacity: 0.5 })} />
					</div>
				))}
			</div>
		</div>
	);
}

// ── Categories skeleton ───────────────────────────────────────────────────────
// Matches: h1 + subtitle + side-by-side layout (form left, table right)
function CategoriesSkeleton() {
	const tableRows = [0, 1, 2, 3] as const;
	return (
		<div className="w-full">
			{/* h1 + subtitle */}
			<div style={{ marginBottom: 24 }}>
				<div style={S({ height: 28, width: 120, marginBottom: 6 })} />
				<div style={S({ height: 13, width: 280, opacity: 0.6 })} />
			</div>
			<div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
				{/* Form (left, w-80) */}
				<div style={{ width: 320, flexShrink: 0 }}>
					<div className="rounded-xl border border-[#c4d4c4] bg-white p-5 space-y-4">
						<div style={S({ height: 16, width: 140 })} />
						<div>
							<div style={S({ height: 11, width: 60, marginBottom: 6 })} />
							<div style={S({ height: 36, width: "100%", borderRadius: 8 })} />
						</div>
						<div>
							<div style={S({ height: 11, width: 40, marginBottom: 6 })} />
							<div style={S({ height: 36, width: "100%", borderRadius: 8 })} />
						</div>
						<div>
							<div style={S({ height: 11, width: 80, marginBottom: 6 })} />
							<div style={S({ height: 60, width: "100%", borderRadius: 8 })} />
						</div>
						<div style={S({ height: 36, width: "100%", borderRadius: 8 })} />
					</div>
				</div>
				{/* Table (right, flex-1) */}
				<div style={{ flex: 1, minWidth: 0 }}>
					<div className="rounded-xl border border-[#c4d4c4] overflow-hidden bg-white">
						{/* Table header */}
						<div className="bg-[#f4f8f4] px-5 py-3 grid grid-cols-4 gap-4 border-b border-[#c4d4c4]">
							{[70, 90, 120, 40].map((w, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
								<div key={i} style={S({ height: 11, width: w })} />
							))}
						</div>
						{tableRows.map((i) => (
							<div key={i} className="px-5 py-3.5 grid grid-cols-4 gap-4 border-b border-[#e8f0e8] last:border-0">
								<div style={S({ height: 14, width: "80%" })} />
								<div style={S({ height: 13, width: "70%", opacity: 0.6 })} />
								<div style={S({ height: 13, width: "90%", opacity: 0.5 })} />
								<div style={{ display: "flex", justifyContent: "center" }}>
									<div style={S({ height: 28, width: 28, borderRadius: 8, opacity: 0.5 })} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

// ── View Post skeleton ────────────────────────────────────────────────────────
// Matches: back button + title + Edit Post button + view card
function ViewPostSkeleton() {
	return (
		<div className="w-full">
			{/* Header row */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<div style={S({ height: 20, width: 60 })} />
					<div style={S({ height: 28, width: 200 })} />
				</div>
				<div style={S({ height: 36, width: 100, borderRadius: 8 })} />
			</div>
			{/* View card */}
			<div className="rounded-xl border border-[#1a2e1a]/20 bg-[#f0f3ef] p-6 space-y-6">
				{/* Status + date */}
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<div style={S({ height: 22, width: 80, borderRadius: 999 })} />
					<div style={S({ height: 13, width: 140, opacity: 0.5 })} />
				</div>
				{/* Title + Slug grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<div style={S({ height: 11, width: 40, marginBottom: 6 })} />
						<div style={S({ height: 20, width: "90%" })} />
					</div>
					<div>
						<div style={S({ height: 11, width: 35, marginBottom: 6 })} />
						<div style={S({ height: 36, width: "100%", borderRadius: 8 })} />
					</div>
				</div>
				{/* Cover image */}
				<div>
					<div style={S({ height: 11, width: 80, marginBottom: 6 })} />
					<div style={S({ height: 192, width: "100%", borderRadius: 8 })} />
				</div>
				{/* Category */}
				<div>
					<div style={S({ height: 11, width: 65, marginBottom: 6 })} />
					<div style={S({ height: 16, width: 100 })} />
				</div>
				{/* Content */}
				<div>
					<div style={S({ height: 11, width: 60, marginBottom: 6 })} />
					<div style={S({ height: 200, width: "100%", borderRadius: 8 })} />
				</div>
			</div>
		</div>
	);
}

// ── Route-aware loading page ──────────────────────────────────────────────────
function AdminLoadingPage() {
	const pathname = usePathname();

	let skeleton: React.ReactNode;
	if (pathname.startsWith("/admin/posts/edit")) {
		skeleton = <ViewPostSkeleton />;
	} else if (pathname.startsWith("/admin/posts")) {
		skeleton = <ManagePostsSkeleton />;
	} else if (pathname.startsWith("/admin/comments")) {
		skeleton = <CommentsSkeleton />;
	} else if (pathname.startsWith("/admin/categories")) {
		skeleton = <CategoriesSkeleton />;
	} else {
		// /admin (dashboard)
		skeleton = <DashboardSkeleton />;
	}

	return (
		<>
			<style>{`@keyframes sk-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
			<div className="w-full select-none">{skeleton}</div>
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
			{/* AdminShell itself uses usePathname so it needs Suspense;
			    use null fallback here — the inner Suspense handles page skeletons */}
			<Suspense fallback={null}>
				<AdminShell>{children}</AdminShell>
			</Suspense>
		</ToastProvider>
	);
}
