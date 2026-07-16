"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const QUICK_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/contact" },
];

const TOPICS = ["Nature", "Travel", "Book"];

export function Footer() {
	const [year, setYear] = useState<number | null>(null);
	useEffect(() => {
		setYear(new Date().getFullYear());
	}, []);

	return (
		<footer className="border-t border-[#061a12] bg-[#0a291f] text-[#dff7e9]">
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
					{/* Brand Column */}
					<div className="lg:col-span-1 flex flex-col items-start">
						{/* <Link
							href="/"
							className="mb-6 inline-block select-none transition-transform duration-300 hover:scale-105"
						>
							<Image
								src="/images/logo.png"
								alt="Blog Logo"
								width={220}
								height={100}
								className="h-auto w-auto sm:h-28 grayscale-[0.2] brightness-200 contrast-125 hover:grayscale-0 transition-all duration-500"
							/>
						</Link> */}
						<p className="text-sm leading-relaxed text-[#8ca89a] font-medium">
							A personal blog celebrating the beauty of nature, the joy of
							travel, and the wisdom in books.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#dff7e9]">
							Quick Links
						</h3>
						<ul className="space-y-4">
							{QUICK_LINKS.map(({ label, href }) => (
								<li key={href}>
									<Link
										href={href}
										className="group flex items-center text-sm font-medium text-[#8ca89a] transition-colors hover:text-white"
									>
										<span className="mr-2 h-px w-0 bg-[#dff7e9] transition-all duration-300 group-hover:w-4" />
										{label}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/admin/sign-in"
									className="group flex items-center text-sm font-medium text-[#8ca89a] transition-colors hover:text-white"
								>
									<span className="mr-2 h-px w-0 bg-[#dff7e9] transition-all duration-300 group-hover:w-4" />
									Write a Post
								</Link>
							</li>
						</ul>
					</div>

					{/* Topics */}
					<div>
						<h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#dff7e9]">
							Topics
						</h3>
						<ul className="space-y-4">
							{TOPICS.map((topic) => (
								<li key={topic}>
									<Link
										href={`/blog?tag=${encodeURIComponent(topic.toLowerCase())}`}
										className="group flex items-center text-sm font-medium text-[#8ca89a] transition-colors hover:text-white"
									>
										<span className="mr-2 h-px w-0 bg-[#dff7e9] transition-all duration-300 group-hover:w-4" />
										{topic}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#dff7e9]">
							Get in Touch
						</h3>
						<ul className="space-y-5">
							<li className="flex items-start gap-4">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#133d2e]">
									<MapPin className="h-4 w-4 text-[#7bc79d]" />
								</div>
								<span className="text-sm font-medium leading-relaxed text-[#8ca89a]">
									306 Dr. Sixto Antonio, Caniogan,
									<br />
									Pasig City
								</span>
							</li>
							<li className="flex items-center gap-4">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#133d2e]">
									<Phone className="h-4 w-4 text-[#7bc79d]" />
								</div>
								<a
									href="tel:09910163610"
									className="text-sm font-medium text-[#8ca89a] transition-colors hover:text-white"
								>
									0991 016 3610
								</a>
							</li>
							<li className="flex items-center gap-4">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#133d2e]">
									<Mail className="h-4 w-4 text-[#7bc79d]" />
								</div>
								<a
									href="mailto:ellysinday5@gmail.com"
									className="break-all text-sm font-medium text-[#8ca89a] transition-colors hover:text-white"
								>
									ellysinday5@gmail.com
								</a>
							</li>
							<li className="flex items-center gap-4">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#133d2e]">
									<Globe className="h-4 w-4 text-[#7bc79d]" />
								</div>
								<a
									href="https://ellysinday-portfolio-website-git-d-d3cfdf-ellysinday5s-projects.vercel.app/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-medium text-[#8ca89a] transition-colors hover:text-white"
								>
									Portfolio Website
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-t border-[#133d2e] bg-[#082117]">
				<div className="relative mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
					<p className="text-center text-xs font-semibold uppercase tracking-wider text-[#4c6f5e]">
						© {year ?? ""} Elly's Blog. All rights reserved.
					</p>
					<button
						type="button"
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="absolute right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#133d2e] text-[#7bc79d] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1f6f4d] hover:text-white hover:shadow-lg hover:shadow-[#1f6f4d]/20"
						aria-label="Scroll to top"
						suppressHydrationWarning
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
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
