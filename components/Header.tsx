"use client";

import { Monitor, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	</svg>
);
const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
	</svg>
);
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
	</svg>
);
const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
		<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
	</svg>
);

export function Header() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<header className="flex flex-col border-b border-border bg-card text-card-foreground">
			{/* Top Bar */}
			<div className="bg-header-top text-header-top-text px-4 py-2 text-xs font-semibold">
				<div className="mx-auto flex max-w-[1200px] items-center justify-between">
					<nav className="flex items-center gap-6">
						<Link
							href="/"
							className="hover:text-white transition-colors uppercase"
						>
							Partners
						</Link>
						<Link
							href="/"
							className="hover:text-white transition-colors uppercase"
						>
							Press
						</Link>
						<Link
							href="/"
							className="hover:text-white transition-colors uppercase"
						>
							About
						</Link>
						<Link
							href="/"
							className="hover:text-white transition-colors uppercase"
						>
							Useful
						</Link>
					</nav>
					<div className="flex items-center gap-4">
						<a
							href="/"
							aria-label="Facebook"
							className="hover:text-white transition-colors"
						>
							<Facebook className="h-4 w-4" />
						</a>
						<a
							href="/"
							aria-label="Twitter"
							className="hover:text-white transition-colors"
						>
							<Twitter className="h-4 w-4" />
						</a>
						<a
							href="/"
							aria-label="Instagram"
							className="hover:text-white transition-colors"
						>
							<Instagram className="h-4 w-4" />
						</a>
						<a
							href="/"
							aria-label="YouTube"
							className="hover:text-white transition-colors"
						>
							<Youtube className="h-4 w-4" />
						</a>
						<button
							type="button"
							aria-label="Search"
							className="hover:text-white transition-colors"
						>
							<Search className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			{/* Main Header */}
			<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-6">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<span className="text-2xl font-black uppercase tracking-tight text-foreground">
						Elly's
					</span>
					<span className="text-2xl font-black uppercase tracking-tight text-primary">
						Blog
					</span>
				</Link>

				{/* Primary Navigation & Actions */}
				<div className="flex items-center gap-8">
					<nav className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
						<div className="relative group">
							<button type="button" className="hover:text-primary transition-colors flex items-center gap-1 py-4">
								Gutenberg Blocks
								<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</button>
							<div className="absolute left-0 top-full hidden w-48 flex-col rounded border border-border bg-card py-1 shadow-lg group-hover:flex z-50">
								<Link href="/" className="px-4 py-2 text-sm font-semibold capitalize text-foreground hover:bg-muted hover:text-primary transition-colors">Block Option 1</Link>
								<Link href="/" className="px-4 py-2 text-sm font-semibold capitalize text-foreground hover:bg-muted hover:text-primary transition-colors">Block Option 2</Link>
							</div>
						</div>
						
						<div className="relative group">
							<button type="button" className="hover:text-primary transition-colors flex items-center gap-1 py-4">
								Pages
								<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</button>
							<div className="absolute left-0 top-full hidden w-48 flex-col rounded border border-border bg-card py-1 shadow-lg group-hover:flex z-50">
								<Link href="/" className="px-4 py-2 text-sm font-semibold capitalize text-foreground hover:bg-muted hover:text-primary transition-colors">Page Option A</Link>
								<Link href="/" className="px-4 py-2 text-sm font-semibold capitalize text-foreground hover:bg-muted hover:text-primary transition-colors">Page Option B</Link>
							</div>
						</div>
						<Link href="/" className="hover:text-primary transition-colors">
							About Us
						</Link>
						<Link href="/" className="hover:text-primary transition-colors">
							Contact
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{/* Theme Toggle */}
						{mounted && (
							<div className="flex items-center gap-1 rounded-md border border-border bg-muted p-1">
								<button
									type="button"
									onClick={() => setTheme("light")}
									className={`rounded p-1.5 transition-colors ${
										theme === "light"
											? "bg-card text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
									aria-label="Light mode"
								>
									<Sun className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={() => setTheme("system")}
									className={`rounded p-1.5 transition-colors ${
										theme === "system"
											? "bg-card text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
									aria-label="System mode"
								>
									<Monitor className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={() => setTheme("dark")}
									className={`rounded p-1.5 transition-colors ${
										theme === "dark"
											? "bg-card text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground"
									}`}
									aria-label="Dark mode"
								>
									<Moon className="h-4 w-4" />
								</button>
							</div>
						)}

						<button
							type="button"
							onClick={() => alert("Contribute clicked!")}
							className="rounded bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Contribute
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
