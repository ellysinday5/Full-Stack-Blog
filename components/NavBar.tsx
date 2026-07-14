"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Blog", href: "/blog" },
	// { label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-950/20 bg-[#0f3d2e]/95 backdrop-blur-sm">
			<div className="mx-auto flex max-w-300 items-center justify-between px-6 py-2">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center select-none"
					style={{ textDecoration: "none" }}
				>
					<Image
						src="/images/logo.png"
						alt="Blog Logo"
						width={220}
						height={100}
						className="mr-3 h-auto w-auto sm:h-28"
					/>
				</Link>

				{/* Nav — right side */}
				<nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 md:flex">
					{NAV_LINKS.map(({ label, href }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								style={{ textDecoration: "none" }}
								className={`transition-colors ${
									isActive
										? "border-b-2 border-emerald-300 pb-0.5 text-emerald-200"
										: "text-white/90 hover:text-emerald-100"
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
