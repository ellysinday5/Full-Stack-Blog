"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const QUICK_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Blog", href: "/blog" },
	// { label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

const TOPICS = ["Nature", "Travel", "Book"];

export function Footer() {
	return (
		<footer className="border-t border-emerald-950/20 bg-[#0f3d2e] text-[#f4fff7]">
			<div className="mx-auto max-w-300 px-6 py-16">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
					{/* Brand Column */}
					<div className="lg:col-span-1">
						<Link
							href="/"
							className="mb-5 inline-flex items-center select-none"
						>
							<Image
								src="/images/logo.png"
								alt="Blog Logo"
								width={220}
								height={100}
								className="mr-3 h-auto w-auto sm:h-28"
							/>
							{/*<span*/}
							{/*	className="font-serif text-lg font-bold leading-none tracking-wide text-white"*/}
							{/*	style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}*/}
							{/*>*/}
							{/*	Elly's Blog*/}
							{/*</span>*/}
						</Link>
						{/* <p className="mt-4 text-sm leading-relaxed text-emerald-50/80">
							A personal blog celebrating the beauty of nature, the joy of
							travel, and the wisdom in books — one story at a time.
						</p> */}
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-white">
							Quick Links
						</h3>
						<ul className="space-y-3">
							{QUICK_LINKS.map(({ label, href }) => (
								<li key={href}>
									<Link
										href={href}
										className="text-sm text-emerald-50/80 transition-colors hover:text-white"
									>
										{label}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/admin/login?from=/admin"
									className="text-sm text-emerald-50/80 transition-colors hover:text-white"
								>
									Write a Post
								</Link>
							</li>
						</ul>
					</div>

					{/* Topics */}
					<div>
						<h3 className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-white">
							Topics
						</h3>
						<ul className="space-y-3">
							{TOPICS.map((topic) => (
								<li key={topic}>
									<Link
										href={`/blog?tag=${encodeURIComponent(topic.toLowerCase())}`}
										className="text-sm text-emerald-50/80 transition-colors hover:text-white"
									>
										{topic}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-white">
							Get in Touch
						</h3>
						<ul className="space-y-4">
							<li className="flex items-start gap-3">
								<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
								<span className="text-sm leading-snug text-emerald-50/80">
									306 Dr. Sixto Antonio, Caniogan,
									<br />
									Pasig City
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-4 w-4 shrink-0 text-emerald-300" />
								<a
									href="tel:09910163610"
									className="text-sm text-emerald-50/80 transition-colors hover:text-white"
								>
									0991 016 3610
								</a>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-4 w-4 shrink-0 text-emerald-300" />
								<a
									href="mailto:ellysinday5@gmail.com"
									className="break-all text-sm text-emerald-50/80 transition-colors hover:text-white"
								>
									ellysinday5@gmail.com
								</a>
							</li>
							<li className="flex items-center gap-3">
								<Globe className="h-4 w-4 shrink-0 text-emerald-300" />
								<a
									href="https://ellysinday-portfolio-website-git-d-d3cfdf-ellysinday5s-projects.vercel.app/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-emerald-50/80 transition-colors hover:text-white"
								>
									Portfolio Website
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-t border-white/10">
				<div className="relative mx-auto flex max-w-300 items-center justify-center px-6 py-5">
					<p className="text-center text-xs text-emerald-100/70">
						© 2026 The Minimalist. All rights reserved.
					</p>
					<button
						type="button"
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="absolute right-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-emerald-50 transition-all hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-white"
						aria-label="Scroll to top"
						suppressHydrationWarning
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3.5 w-3.5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</footer>
	);
}
