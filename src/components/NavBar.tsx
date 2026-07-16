"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/contact" },
];

export function Header() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	// Close mobile menu on route change
	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to close the menu when the route changes
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-[#061a12] bg-[#0a291f]/90 backdrop-blur-md transition-all duration-300">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center select-none group"
					style={{ textDecoration: "none" }}
				>
					<Image
						src="/images/logo.png"
						alt="Blog Logo"
						width={220}
						height={100}
						className="mr-3 h-16 w-auto sm:h-24 grayscale-[0.2] brightness-200 contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
					/>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] md:flex">
					{NAV_LINKS.map(({ label, href }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								style={{ textDecoration: "none" }}
								className={`group relative py-2 transition-colors hover:text-white ${
									isActive ? "text-[#dff7e9]" : "text-[#8ca89a]"
								}`}
							>
								{label}
								<span
									className={`absolute bottom-0 left-0 h-0.5 bg-[#dff7e9] transition-all duration-300 ease-out ${
										isActive ? "w-full" : "w-0 group-hover:w-full"
									}`}
								/>
							</Link>
						);
					})}
				</nav>

				{/* Mobile hamburger button */}
				<button
					type="button"
					onClick={() => setMobileOpen((v) => !v)}
					className="flex h-10 w-10 items-center justify-center rounded-lg text-[#8ca89a] transition-colors hover:text-white md:hidden"
					aria-label={mobileOpen ? "Close menu" : "Open menu"}
				>
					{mobileOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					)}
				</button>
			</div>

			{/* Mobile nav panel */}
			<div
				className={`overflow-hidden border-t border-[#133d2e] bg-[#0a291f] transition-all duration-300 ease-in-out md:hidden ${
					mobileOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
					{NAV_LINKS.map(({ label, href }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								style={{ textDecoration: "none" }}
								className={`rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
									isActive
										? "bg-[#133d2e] text-[#dff7e9]"
										: "text-[#8ca89a] hover:bg-[#133d2e]/50 hover:text-white"
								}`}
							>
								{label}
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
