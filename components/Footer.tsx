"use client";

import { Globe, MapPin, Phone, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const RECENT_POSTS = [
	{
		title: "Tempor Nec Feugiat Nislpretium Fusce Platea Dictumst",
		image:
			"https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=80&h=80&fit=crop&q=80",
	},
	{
		title: "Egestas Egestas Fringilla Phasellus Faucibus Scelerisque",
		image:
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&q=80",
	},
	{
		title: "Enim Facilisis Gravida Neque Convallis Cras Semper Auctor",
		image:
			"https://images.unsplash.com/photo-1448375240586-882707db888b?w=80&h=80&fit=crop&q=80",
	},
	{
		title: "Fermentum Dui Faucibus Bnormare Quam Viverra Orci",
		image:
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=80&h=80&fit=crop&q=80",
	},
];

export function Footer() {
	const carouselRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (carouselRef.current) {
			const scrollAmount = 280; // Approximate width of one item + gap
			carouselRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<footer className="bg-card text-card-foreground border-t border-border mt-auto">
			{/* Trending Now Bar */}
			<div className="bg-muted py-6">
				<div className="mx-auto max-w-[1200px] px-4 flex items-center justify-between">
					<div className="flex items-center gap-6 overflow-hidden">
						<span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider shrink-0">
							Trending now
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
						<div
							ref={carouselRef}
							className="hidden lg:flex items-center gap-6 overflow-x-hidden scroll-smooth max-w-2xl"
						>
							{RECENT_POSTS.map((post) => (
								<div
									key={post.title}
									className="flex items-center gap-3 w-64 shrink-0 group cursor-pointer"
								>
									{/* biome-ignore lint/performance/noImgElement: static placeholder image */}
									<img
										src={post.image}
										alt=""
										className="w-10 h-10 rounded-full object-cover group-hover:opacity-80 transition-opacity"
									/>
									<p className="text-xs font-semibold line-clamp-2 group-hover:text-primary transition-colors">
										{post.title}
									</p>
								</div>
							))}
						</div>
					</div>
					<div className="flex items-center gap-2 shrink-0 ml-4">
						<button
							type="button"
							onClick={() => scroll("left")}
							className="p-1 rounded border border-border hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
						>
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
						<button
							type="button"
							onClick={() => scroll("right")}
							className="p-1 rounded border border-border hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
						>
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-[1200px] px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
					{/* Popular Posts Column */}
					<div>
						<h3 className="text-lg font-bold mb-6 text-foreground">
							Popular Posts
						</h3>
						<div className="space-y-6">
							{[0, 1, 2].map((i) => (
								<div
									key={RECENT_POSTS[i].title}
									className="flex gap-4 group cursor-pointer"
								>
									{/* biome-ignore lint/performance/noImgElement: static placeholder image */}
									<img
										src={RECENT_POSTS[i].image}
										alt=""
										className="w-20 h-20 object-cover rounded group-hover:opacity-80 transition-opacity"
									/>
									<div>
										<h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
											{RECENT_POSTS[i].title}
										</h4>
										<p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
											January 28, 2026
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* About Us Column */}
					<div>
						<h3 className="text-lg font-bold mb-6 text-foreground">About Us</h3>
						<ul className="space-y-3 text-sm text-muted-foreground mb-10">
							<li>
								<Link href="/" className="hover:text-primary transition-colors">
									About Organization
								</Link>
							</li>
							<li>
								<Link href="/" className="hover:text-primary transition-colors">
									Our Clients
								</Link>
							</li>
							<li>
								<Link href="/" className="hover:text-primary transition-colors">
									Our Partners
								</Link>
							</li>
						</ul>

						<h3 className="text-lg font-bold mb-6 text-foreground">
							Useful Information
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							Vim in meis verterem menandri, ea iuvaret delectus verterem qui,
							nec ad ferri corpora.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Euismod nisi porta lorem mollis. Interdum velit euismod in
							pellentesque.
						</p>
					</div>

					{/* Contact Info Column */}
					<div>
						<h3 className="text-lg font-bold mb-6 text-foreground">
							Contact Info
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed mb-8">
							Lorem ipsum dolor sit amet has ignota putent ridens aliquid
							indoctum anad movet graece vimut omnes.
						</p>

						<ul className="space-y-6">
							<li className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
									<MapPin className="h-4 w-4 text-muted-foreground" />
								</div>
								<div>
									<p className="text-sm font-semibold">Address:</p>
									<p className="text-sm text-muted-foreground">
										Street Name, NY 38954
									</p>
								</div>
							</li>
							<li className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
									<Phone className="h-4 w-4 text-muted-foreground" />
								</div>
								<div>
									<p className="text-sm font-semibold">Phone:</p>
									<p className="text-sm text-muted-foreground">578-393-4937</p>
								</div>
							</li>
							<li className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
									<Smartphone className="h-4 w-4 text-muted-foreground" />
								</div>
								<div>
									<p className="text-sm font-semibold">Mobile:</p>
									<p className="text-sm text-muted-foreground">578-393-4937</p>
								</div>
							</li>
							<li className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
									<Globe className="h-4 w-4 text-muted-foreground" />
								</div>
								<div>
									<p className="text-sm font-semibold">Website:</p>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										creativethemes.com
									</a>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Footer */}
			<div className="border-t border-border">
				<div className="mx-auto max-w-[1200px] px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						All rights ahdkhsakdha
					</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-primary transition-colors">
							Terms & Services
						</Link>
						<span>|</span>
						<Link href="/" className="hover:text-primary transition-colors">
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
