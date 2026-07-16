"use client";

import Image from "next/image";
import Link from "next/link";

type PostRow = {
	id: string;
	title: string;
	slug: string;
	status: string;
	body: string;
	createdAt: string;
};

const SLUG_IMAGES: Record<string, string> = {
	"healing-power-of-waterfalls": "/images/falls.jpg",
	"why-the-banyan-tree-is-extraordinary": "/images/tree.jpg",
	"strange-beautiful-world-of-carnivorous-plants": "/images/tree.jpg",
	"life-in-siargao": "/images/siargao-1.jpg",
	"siargao-itinerary": "/images/siargao-2.jpg",
	"the-silent-patient-review": "/images/the-silent-patient.png",
	"13-reasons-to-stay-review": "/images/13-reasons-to-stay.jpg",
};

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=420&q=80";

// ── Single post card ──────────────────────────────────────────────────────────
function PostCard({ post }: { post: PostRow }) {
	const excerpt =
		post.body.slice(0, 100).trim() + (post.body.length > 100 ? "…" : "");

	const statusStyle =
		post.status === "published"
			? "bg-green-100 text-green-800 border border-green-300"
			: post.status === "archived"
				? "bg-gray-100 text-gray-500 border border-gray-300"
				: "bg-[#c8c8c8] text-[#3a3a3a] border border-[#b0b0b0]";

	const statusLabel =
		post.status === "published"
			? "Published"
			: post.status === "archived"
				? "Archived"
				: "Draft";

	const coverImage = SLUG_IMAGES[post.slug] ?? FALLBACK_IMAGE;

	return (
		<div className="rounded-xl border border-[#c4d4c4] bg-white overflow-hidden flex flex-col">
			{/* Cover image placeholder */}
			<div className="relative h-40 w-full bg-[#d4e4d4] overflow-hidden">
				<Image
					src={coverImage}
					alt={post.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>

			{/* Body */}
			<div className="flex-1 p-3">
				<h3 className="text-sm font-bold text-[#1a2e1a] leading-snug mb-1">
					{post.title}
				</h3>
				<p className="text-xs text-[#5a7a5a] leading-relaxed line-clamp-3">
					{excerpt}
				</p>
			</div>

			{/* Footer: status + view */}
			<div className="flex items-center justify-between px-3 pb-3">
				<span
					className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyle}`}
				>
					{statusLabel}
				</span>
				<Link
					href={`/blog/${post.slug}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs font-semibold text-[#1a2e1a] hover:text-[#3a6b3a] transition-colors"
				>
					View
				</Link>
			</div>
		</div>
	);
}

// ── Recent Activity Grid (used on dashboard) ──────────────────────────────────
export function RecentActivityGrid({ posts }: { posts: PostRow[] }) {
	const recent = posts.slice(0, 3);

	if (recent.length === 0) {
		return (
			<div className="flex items-center justify-center h-40 text-[#7a9a7a] text-sm">
				No posts yet. Write your first one!
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{recent.map((p) => (
				<PostCard key={p.id} post={p} />
			))}
		</div>
	);
}
