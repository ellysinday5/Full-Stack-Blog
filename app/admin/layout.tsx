"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { ToastProvider, useToast } from "@/components/admin/Toast";

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
			// Clean up the param without navigation
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

// ── Logo ──────────────────────────────────────────────────────────────────────
function VerdantLogo() {
	return (
		<div className="flex flex-col items-center select-none">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 64 40"
				className="h-10 w-auto mb-1"
				aria-hidden="true"
			>
				<path d="M32 36 C32 36 10 28 8 10 C8 10 22 8 32 20 Z" fill="#6abf4b" />
				<path
					d="M32 36 C26 28 14 20 10 12"
					fill="none"
					stroke="#fff"
					strokeWidth="1"
					strokeOpacity="0.4"
				/>
				<path d="M32 28 C32 28 44 18 50 8 C50 8 40 6 34 16 Z" fill="#8ed45f" />
				<path
					d="M32 28 C36 22 44 14 48 10"
					fill="none"
					stroke="#fff"
					strokeWidth="0.8"
					strokeOpacity="0.3"
				/>
				<line
					x1="32"
					y1="36"
					x2="32"
					y2="40"
					stroke="#4a7c35"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
			<span
				className="text-base font-black uppercase tracking-wider text-white leading-none"
				style={{
					fontFamily: "Georgia, 'Times New Roman', serif",
					letterSpacing: "0.1em",
				}}
			>
				VERDANT
			</span>
			<span className="text-[8px] font-semibold uppercase tracking-[0.4em] text-green-400 mt-0.5">
				NATURE
			</span>
		</div>
	);
}

// ── Inner layout (needs usePathname, inside provider) ─────────────────────────
function AdminShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Login page renders standalone — no sidebar/navbar
	if (pathname === "/admin/login") {
		return <Suspense fallback={null}>{children}</Suspense>;
	}

	const isActive = (href: string, exact: boolean) =>
		exact ? pathname === href : pathname.startsWith(href);

	return (
		<div className="flex min-h-screen relative" style={{ background: "#f4fbf6" }}>
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
				className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 md:static md:w-[220px] md:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				style={{ background: "#0f3d2e", minHeight: "100vh" }}
			>
				<div className="flex items-center justify-between py-7 px-4 border-b border-white/10 md:justify-center">
					<Link href="/" aria-label="Go home">
						<VerdantLogo />
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

				<div className="border-t border-white/10 mt-auto">
					<Link
						href="/"
						className="flex items-center gap-2 px-5 py-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
						Back to Home
					</Link>
				</div>
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

					<div className="flex items-center gap-3">
						<span className="text-sm font-semibold text-white">Admin</span>
						<div className="w-9 h-9 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center text-white/80">
							<UserCircleIcon />
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
					<Suspense fallback={<div className="p-4 text-[#7a9a7a]">Loading…</div>}>
						{children}
					</Suspense>
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
			<AdminShell>{children}</AdminShell>
		</ToastProvider>
	);
}
