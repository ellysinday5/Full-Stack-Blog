import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";
import SearchBox from "./_components/SearchBox";

export const metadata = {
	title: "Blog | Full Stack Blog",
	description: "Notes on building things, one post at a time.",
};

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
	"TRENDS",
	"NATURE",
	"TRAVEL",
	"ART & DESIGN",
	"PEOPLE",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_STYLES: Record<Category, string> = {
	TRENDS: "bg-[#1d6ae5] text-white",
	NATURE: "bg-[#27a244] text-white",
	TRAVEL: "bg-[#1d6ae5] text-white",
	"ART & DESIGN": "bg-[#7c3aed] text-white",
	PEOPLE: "bg-[#ea580c] text-white",
};

/** Curated Unsplash photos — each with a unique visual theme */
const COVER_IMAGES = [
	"https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=420&fit=crop&q=80",
	"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=420&fit=crop&q=80",
	"https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=420&fit=crop&q=80",
	"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=420&fit=crop&q=80",
	"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=420&fit=crop&q=80",
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=420&fit=crop&q=80",
];

const SIDEBAR_THUMBNAILS = [
	"https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120&h=120&fit=crop&q=80",
	"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&q=80",
	"https://images.unsplash.com/photo-1448375240586-882707db888b?w=120&h=120&fit=crop&q=80",
	"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=120&h=120&fit=crop&q=80",
	"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&q=80",
];

// ── Helpers ────────────────────────────────────────────────────────────────

function getExcerpt(body: string, maxLen = 120): string {
	if (body.length <= maxLen) return body;
	return `${body.slice(0, maxLen).replace(/\s+\S*$/, "")}…`;
}

function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function BlogPage() {
	const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

	const featuredPosts = allPosts.slice(0, 2);
	const regularPosts = allPosts.slice(2);

	// Unique categories derived from post-index cycling, preserving insertion order
	const seen = new Set<string>();
	const uniqueCategories: Category[] = [];
	allPosts.forEach((_, i) => {
		const cat = CATEGORIES[i % CATEGORIES.length];
		if (!seen.has(cat)) {
			seen.add(cat);
			uniqueCategories.push(cat);
		}
	});

	// Serialize dates so they can be safely passed to the Client Component
	const serializedPosts = allPosts.map((p) => ({
		id: p.id,
		title: p.title,
		slug: p.slug,
		createdAt: p.createdAt.toISOString(),
	}));

	return (
		<main className="min-h-screen bg-muted py-8">
			<div className="mx-auto max-w-300 px-4 sm:px-6">
				<div className="flex gap-8">
					{/* ─── Main Content ──────────────────────────────────────────── */}
					<section className="min-w-0 flex-1">
						{allPosts.length === 0 ? (
							<EmptyState />
						) : (
							<>
								{/* Featured pair — 2 columns, larger cards */}
								{featuredPosts.length > 0 && (
									<div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
										{featuredPosts.map((post, i) => (
											<PostCard key={post.id} post={post} index={i} featured />
										))}
									</div>
								)}

								{/* Regular posts — 3 columns */}
								{regularPosts.length > 0 && (
									<div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
										{regularPosts.map((post, i) => (
											<PostCard key={post.id} post={post} index={i + 2} />
										))}
									</div>
								)}

								<Pagination />
							</>
						)}
					</section>

					{/* ─── Sidebar ───────────────────────────────────────────────── */}
					<aside className="hidden w-70 shrink-0 space-y-8 lg:block">
						{/* Live Search */}
						<SidebarSection title="Live Search">
							<SearchBox posts={serializedPosts} />
						</SidebarSection>

						{/* Recent Posts */}
						<SidebarSection title="Posts">
							<div className="space-y-4">
								{allPosts.slice(0, 5).map((post, i) => (
									<Link
										key={post.id}
										href={`/blog/${post.slug}`}
										className="group flex gap-3"
										id={`sidebar-post-${post.id}`}
									>
										<div className="h-16 w-16 shrink-0 overflow-hidden rounded">
											{/* biome-ignore lint/performance/noImgElement: static placeholder image */}
											<img
												src={SIDEBAR_THUMBNAILS[i % SIDEBAR_THUMBNAILS.length]}
												alt={post.title}
												loading="lazy"
												className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
											/>
										</div>
										<div className="min-w-0">
											<p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
												{post.title}
											</p>
											<p className="mt-1 text-xs text-muted-foreground">
												{formatDate(post.createdAt)}
											</p>
										</div>
									</Link>
								))}
							</div>
						</SidebarSection>

						{/* Categories */}
						<SidebarSection title="Categories">
							<ul className="space-y-2">
								{uniqueCategories.map((cat) => (
									<li key={cat}>
										<Link
											href={`/blog?category=${encodeURIComponent(cat)}`}
											id={`category-${cat.replace(/[\s&]+/g, "-").toLowerCase()}`}
											className="text-sm text-muted-foreground transition-colors hover:text-primary"
										>
											{cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
										</Link>
									</li>
								))}
							</ul>
						</SidebarSection>

						{/* Decorative quote block */}
						<div className="rounded bg-primary px-6 py-8 text-primary-foreground">
							<div className="mb-3 font-serif text-5xl leading-none opacity-40">
								&ldquo;
							</div>
							<p className="text-sm font-medium italic leading-relaxed">
								Discere veritas detraxit pri ut, sea ei dicunt theophrastus. Eum
								harum animal debitis cu
							</p>
							<p className="mt-4 text-[11px] font-bold uppercase tracking-wider opacity-75">
								— Melissa Peterson
							</p>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SidebarSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<h3 className="mb-4 border-b border-border pb-2 text-sm font-bold uppercase tracking-widest text-foreground">
				{title}
			</h3>
			{children}
		</div>
	);
}

type PostRow = {
	id: string;
	title: string;
	slug: string;
	body: string;
	createdAt: Date;
};

function PostCard({
	post,
	index,
	featured = false,
}: {
	post: PostRow;
	index: number;
	featured?: boolean;
}) {
	const category = CATEGORIES[index % CATEGORIES.length];
	const coverImage = COVER_IMAGES[index % COVER_IMAGES.length];
	const excerpt = getExcerpt(post.body, featured ? 130 : 110);

	return (
		<article
			className="group bg-card shadow-sm transition-shadow duration-200 hover:shadow-md border border-border/50 rounded overflow-hidden"
			id={`post-card-${post.id}`}
		>
			<div className="px-4 pt-4">
				<span
					className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${CATEGORY_STYLES[category]}`}
				>
					{category}
				</span>
				<h2
					className={`mt-2 font-bold leading-snug text-card-foreground transition-colors duration-150 group-hover:text-primary ${
						featured ? "text-xl" : "text-[15px]"
					}`}
				>
					<Link href={`/blog/${post.slug}`} id={`read-post-${post.id}`}>
						{post.title}
					</Link>
				</h2>
			</div>

			{/* Cover Image */}
			<div className="mt-3 overflow-hidden">
				<Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
					{/* biome-ignore lint/performance/noImgElement: static placeholder image */}
					<img
						src={coverImage}
						alt={post.title}
						loading={index < 2 ? "eager" : "lazy"}
						className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
							featured ? "h-52" : "h-44"
						}`}
					/>
				</Link>
			</div>

			{/* Excerpt + Author/Date */}
			<div className="px-4 pb-4 pt-3">
				<p className="text-sm leading-relaxed">
					<Link
						href={`/blog/${post.slug}`}
						className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
					>
						{excerpt}
					</Link>
				</p>
				<div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
					<span className="text-foreground">John Doe</span>
					<span>/</span>
					<time dateTime={post.createdAt.toISOString()}>
						{formatDate(post.createdAt)}
					</time>
					<span>/</span>
					<Suspense fallback={<span className="text-muted-foreground">Loading comments…</span>}>
						<CommentCount postId={post.id} />
					</Suspense>
				</div>
			</div>
		</article>
	);
}

async function CommentCount({ postId }: { postId: string }) {
	const [result] = await db
		.select({ count: count() })
		.from(comments)
		.where(eq(comments.postId, postId));

	const total = Number(result?.count ?? 0);

	return (
		<span className="text-muted-foreground">
			{total === 1 ? "1 comment" : `${total} comments`}
		</span>
	);
}

function Pagination() {
	return (
		<div className="mt-2 flex items-center gap-1">
			<button
				type="button"
				id="pagination-page-1"
				aria-current="page"
				className="flex h-9 w-9 items-center justify-center rounded bg-primary text-sm font-semibold text-primary-foreground"
			>
				1
			</button>
			<button
				type="button"
				id="pagination-page-2"
				className="flex h-9 w-9 items-center justify-center rounded border border-border bg-card text-sm text-card-foreground hover:bg-muted transition-colors"
			>
				2
			</button>
			<button
				type="button"
				id="pagination-next"
				className="flex h-9 items-center justify-center gap-1.5 rounded border border-border bg-card px-4 text-sm font-semibold text-card-foreground hover:bg-muted transition-colors"
			>
				NEXT
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-3.5 w-3.5"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</div>
	);
}

function EmptyState() {
	return (
		<div
			className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-24 text-center"
			id="empty-state"
		>
			<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-muted-foreground"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={1.5}
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
					/>
				</svg>
			</div>
			<p className="text-lg font-semibold text-card-foreground">
				Nothing here yet
			</p>
			<p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
				The first post hasn&apos;t been published. Check back soon.
			</p>
		</div>
	);
}
