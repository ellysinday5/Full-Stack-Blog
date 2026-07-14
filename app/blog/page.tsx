import { asc, desc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/blog/SearchBar";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Blog | Elly's Blog",
	description: "Stories about nature, travel, books, and life.",
};

// ── Cover images ───────────────────────────────────────────────────────────

const COVER_IMAGES = [
	"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1530968033775-2c92736b131e?auto=format&fit=crop&w=800&h=420&q=80",
	"https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=800&h=420&q=80",
];

// ── Helpers ────────────────────────────────────────────────────────────────

function getExcerpt(body: string, maxLen = 120): string {
	if (body.length <= maxLen) return body;
	return `${body.slice(0, maxLen).replace(/\s+\S*$/, "")}…`;
}

function postHasCategory(postTags: string[], category: string): boolean {
	return postTags.some((t) => t.toLowerCase() === category.toLowerCase());
}

// ── Page ───────────────────────────────────────────────────────────────────

type BlogPageProps = {
	searchParams: Promise<{ tag?: string; q?: string; sort?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
	const { tag, q, sort } = await searchParams;
	const activeTags = tag ? tag.split(",").filter(Boolean) : [];

	// Fetch categories from DB
	const allCategories = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.orderBy(asc(categories.name))
		.catch(() => [] as { id: string; name: string }[]);

	const categoryNames = allCategories.map((c) => c.name);

	// Page title reflects the selected category
	const pageTitle =
		activeTags.length === 1
			? (categoryNames.find(
					(c) => c.toLowerCase() === activeTags[0].toLowerCase(),
				) ?? activeTags[0])
			: "All Stories";

	const allPosts = await db
		.select()
		.from(posts)
		.orderBy(desc(posts.createdAt))
		.catch(() => [] as (typeof posts.$inferSelect)[]);

	// Filter by selected category
	let filteredPosts = allPosts;
	if (activeTags.length > 0) {
		filteredPosts = filteredPosts.filter((p) =>
			activeTags.some((tagValue) => postHasCategory(p.tags, tagValue)),
		);
	}

	// Filter by search query
	if (q) {
		const query = q.toLowerCase();
		filteredPosts = filteredPosts.filter(
			(p) =>
				p.title.toLowerCase().includes(query) ||
				p.body.toLowerCase().includes(query),
		);
	}

	// Sort
	const sortedPosts = [...filteredPosts].sort((a, b) => {
		switch (sort) {
			case "oldest":
				return a.createdAt.getTime() - b.createdAt.getTime();
			case "az":
				return a.title.localeCompare(b.title);
			case "za":
				return b.title.localeCompare(a.title);
			default:
				return b.createdAt.getTime() - a.createdAt.getTime();
		}
	});

	return (
		<PublicShell>
			<main className="min-h-screen bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)] pb-16 pt-32 sm:pt-36">
				<div className="mx-auto max-w-7xl px-6">
					{/* Page Header */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-[#0f3d2e] font-serif leading-tight mb-6">
							{pageTitle}
						</h1>

						<div className="mb-4">
							<h2 className="text-xl font-bold text-[#0f3d2e] mb-4">
								All Stories
							</h2>

							{/* Category pills — from DB */}
							<div className="mb-6 flex flex-wrap items-center gap-3">
								<span className="font-semibold text-[#0f3d2e]">Topics</span>
								{categoryNames.length === 0 ? (
									<span className="text-sm text-[#4c6f5e] italic">
										No categories yet
									</span>
								) : (
									categoryNames.map((category) => {
										const isActive =
											activeTags.length === 1 &&
											activeTags[0].toLowerCase() === category.toLowerCase();
										return (
											<Link
												key={category}
												href={
													isActive
														? "/blog"
														: `/blog?tag=${encodeURIComponent(category)}`
												}
												className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
													isActive
														? "bg-[#0f3d2e] text-white border-[#0f3d2e]"
														: "bg-white text-[#0f3d2e] border-[#0f3d2e] hover:bg-[#0f3d2e] hover:text-white"
												}`}
											>
												{category}
											</Link>
										);
									})
								)}
							</div>
						</div>

						{/* Search + Clear */}
						<Suspense fallback={<div className="mb-8 h-9" />}>
							<SearchBar />
						</Suspense>
					</div>

					{/* Main Content */}
					<section>
						{sortedPosts.length === 0 ? (
							<EmptyState tag={activeTags[0]} />
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{sortedPosts.map((post, i) => (
									<PostCard key={post.id} post={post} index={i} />
								))}
							</div>
						)}
					</section>
				</div>
			</main>
		</PublicShell>
	);
}

// ── Sub-components ─────────────────────────────────────────────────────────

type PostRow = {
	id: string;
	title: string;
	slug: string;
	body: string;
	tags: string[];
	createdAt: Date;
};

function PostCard({ post, index }: { post: PostRow; index: number }) {
	const coverImage = COVER_IMAGES[index % COVER_IMAGES.length];
	const excerpt = getExcerpt(post.body, 100);

	return (
		<article
			className="group relative overflow-hidden rounded-2xl border-2 border-[#0f3d2e] bg-white transition-shadow hover:shadow-lg"
			id={`post-card-${post.id}`}
		>
			{/* Cover image */}
			<Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
				{/* biome-ignore lint/performance/noImgElement: placeholder */}
				<img
					src={coverImage}
					alt={post.title}
					loading={index < 3 ? "eager" : "lazy"}
					className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
				/>
			</Link>

			<div className="p-6">
				<h2 className="font-bold text-lg leading-snug text-[#0f3d2e] mb-3">
					<Link href={`/blog/${post.slug}`} id={`read-post-${post.id}`}>
						{post.title}
					</Link>
				</h2>
				<p className="text-sm leading-relaxed text-[#4c6f5e] mb-4">{excerpt}</p>
				<Link
					href={`/blog/${post.slug}`}
					className="inline-block font-semibold text-[#0f3d2e] hover:text-[#175a3d]"
				>
					View →
				</Link>
			</div>
		</article>
	);
}

function EmptyState({ tag }: { tag?: string }) {
	return (
		<div
			className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#0f3d2e]/30 bg-white px-6 py-24 text-center"
			id="empty-state"
		>
			<div className="mb-4 text-4xl">📝</div>
			<p className="text-lg font-semibold text-[#0f3d2e]">
				{tag ? `No posts tagged "${tag}"` : "No stories yet"}
			</p>
			<p className="mt-2 text-sm text-[#4c6f5e]">
				{tag ? (
					<Link
						href="/blog"
						className="text-[#0f3d2e] underline underline-offset-2"
					>
						View all posts
					</Link>
				) : (
					"Check back soon for our first entry."
				)}
			</p>
		</div>
	);
}
