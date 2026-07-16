import { asc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { SearchBox } from "@/components/blog/SearchBox";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

// export const dynamic = "force-dynamic";

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

const SLUG_IMAGES: Record<string, string> = {
	"healing-power-of-waterfalls": "/images/falls.jpg",
	"why-the-banyan-tree-is-extraordinary": "/images/banyan-tree.png",
	"strange-beautiful-world-of-carnivorous-plants": "/images/tree.jpg",
	"life-in-siargao": "/images/siargao-1.jpg",
	"siargao-itinerary": "/images/siargao-2.jpg",
	"the-silent-patient-review": "/images/the-silent-patient.png",
	"13-reasons-to-stay-review": "/images/13-reasons-to-stay.jpg",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function getExcerpt(body: string, maxLen = 120): string {
	if (body.length <= maxLen) return body;
	return `${body.slice(0, maxLen).replace(/\s+\S*$/, "")}…`;
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

	const allPosts = await db.query.posts
		.findMany({
			orderBy: (p, { desc }) => [desc(p.createdAt)],
			with: {
				category: true,
			},
		})
		.catch(() => [] as PostRow[]);

	// Filter by selected category
	let filteredPosts = allPosts;
	if (activeTags.length > 0) {
		filteredPosts = filteredPosts.filter((p) =>
			activeTags.some(
				(tagValue) => p.category?.name.toLowerCase() === tagValue.toLowerCase(),
			),
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
			<main className="min-h-screen bg-[linear-gradient(135deg,#f4f9f5_0%,#eef8f1_100%)] pb-24 pt-32 sm:pt-40">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{/* Page Header */}
					<div className="mb-12">
						<h1 className="text-4xl sm:text-5xl font-bold text-[#0f3d2e] font-serif leading-tight mb-8">
							{pageTitle}
						</h1>

						<div className="mb-4">
							{/* <h2 className="text-xl font-bold text-[#0f3d2e] mb-4">
								All Stories
							</h2> */}

							{/* Category pills — from DB */}
							<div className="mb-6 flex flex-wrap items-center gap-3">
								<span className="font-semibold text-[#0f3d2e]">Topics</span>
								{categoryNames.length === 0 ? (
									<span className="text-sm text-[#4c6f5e] italic">
										No categories yet
									</span>
								) : (
									<>
										<Link
											href="/blog"
											prefetch={true}
											className={`rounded-full px-5 py-2 text-sm font-semibold border transition-all duration-300 ${
												activeTags.length === 0
													? "bg-[#1f6f4d] text-white border-[#1f6f4d] shadow-md shadow-[#1f6f4d]/20"
													: "bg-white text-[#4c6f5e] border-[#dcefe3] hover:border-[#1f6f4d] hover:text-[#1f6f4d] hover:shadow-sm"
											}`}
										>
											All
										</Link>
										{categoryNames.map((category) => {
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
													prefetch={true}
													className={`rounded-full px-5 py-2 text-sm font-semibold border transition-all duration-300 ${
														isActive
															? "bg-[#1f6f4d] text-white border-[#1f6f4d] shadow-md shadow-[#1f6f4d]/20"
															: "bg-white text-[#4c6f5e] border-[#dcefe3] hover:border-[#1f6f4d] hover:text-[#1f6f4d] hover:shadow-sm"
													}`}
												>
													{category}
												</Link>
											);
										})}
									</>
								)}
							</div>
						</div>

						{/* Search + Clear */}
						<Suspense
							fallback={
								<div className="mb-8 h-10 w-full max-w-md rounded-lg border border-[#0f3d2e]/20 bg-white" />
							}
						>
							<SearchBox />
						</Suspense>
					</div>

					{/* Main Content */}
					<section>
						{sortedPosts.length === 0 ? (
							<EmptyState tag={activeTags[0]} />
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{sortedPosts.map((post, i) => (
									<PostCard
										key={post.id}
										post={post}
										index={i}
										activeTag={activeTags[0]}
									/>
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
	category?: {
		id: string;
		name: string;
		slug: string;
	} | null;
};

function PostCard({
	post,
	index,
	activeTag,
}: {
	post: PostRow;
	index: number;
	activeTag?: string;
}) {
	const coverImage =
		SLUG_IMAGES[post.slug] ?? COVER_IMAGES[index % COVER_IMAGES.length];
	const excerpt = getExcerpt(post.body, 100);
	const postUrl = `/blog/${post.slug}${activeTag ? `?tag=${encodeURIComponent(activeTag)}` : ""}`;

	return (
		<article
			className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[#dcefe3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#1f6f4d]/30"
			id={`post-card-${post.id}`}
		>
			{/* Cover image */}
			<div className="relative h-56 w-full overflow-hidden bg-[#eef8f1]">
				{/* biome-ignore lint/performance/noImgElement: placeholder */}
				<img
					src={coverImage}
					alt={post.title}
					loading={index < 3 ? "eager" : "lazy"}
					className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			</div>

			<div className="flex flex-1 flex-col p-6 sm:p-8">
				<h2 className="font-serif text-2xl font-bold leading-tight text-[#0f3d2e] mb-4 transition-colors group-hover:text-[#1f6f4d]">
					<Link
						href={postUrl}
						id={`read-post-${post.id}`}
						className="focus:outline-none"
					>
						<span className="absolute inset-0" aria-hidden="true" />
						{post.title}
					</Link>
				</h2>
				<p className="mb-6 flex-1 text-sm leading-relaxed text-[#4c6f5e]">
					{excerpt}
				</p>
				<div className="mt-auto inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#1f6f4d] transition-colors group-hover:text-[#175a3d]">
					Read Story{" "}
					<span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
						→
					</span>
				</div>
			</div>
		</article>
	);
}

function EmptyState({ tag }: { tag?: string }) {
	return (
		<div
			className="mx-auto max-w-lg flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#1f6f4d]/20 bg-white/50 px-8 py-24 text-center shadow-sm backdrop-blur-sm"
			id="empty-state"
		>
			<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#eef8f1] text-4xl shadow-inner">
				📝
			</div>
			<p className="text-2xl font-bold text-[#0f3d2e] font-serif">
				{tag ? `No posts tagged "${tag}"` : "No stories yet"}
			</p>
			<p className="mt-4 text-base leading-relaxed text-[#4c6f5e]">
				{tag ? (
					<>
						We couldn't find any stories for this topic.{" "}
						<Link
							href="/blog"
							className="font-semibold text-[#1f6f4d] hover:text-[#175a3d] hover:underline underline-offset-4 transition-all"
						>
							View all posts
						</Link>
					</>
				) : (
					"Check back soon for our first entry."
				)}
			</p>
		</div>
	);
}
