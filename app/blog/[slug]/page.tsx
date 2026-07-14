import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";
import { CommentsSection } from "./comments-section";

type PageProps = {
	params: Promise<{ slug: string }>;
};

// Per-slug cover images — nature/plant themed
const SLUG_IMAGES: Record<string, string> = {
	"secret-life-of-mosses":
		"https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&w=1200&q=80",
	"why-the-banyan-tree-is-extraordinary":
		"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
	"growing-pothos-the-forgiving-indoor-companion":
		"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
	"amazon-rainforest-lungs-of-the-planet":
		"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
	"cherry-blossoms-japans-most-fleeting-beauty":
		"https://images.unsplash.com/photo-1530968033775-2c92736b131e?auto=format&fit=crop&w=1200&q=80",
	"small-herb-garden-on-your-windowsill":
		"https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
	"strange-beautiful-world-of-carnivorous-plants":
		"https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1200&q=80",
	"forest-bathing-japanese-art-of-trees":
		"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
};

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80";

function getTagStyle(tag: string): string {
	let hash = 0;
	for (let i = 0; i < tag.length; i++) {
		hash = (hash * 31 + tag.charCodeAt(i)) % 5;
	}
	const styles = [
		"bg-green-800/50 text-green-300 border border-green-700/40",
		"bg-emerald-800/50 text-emerald-300 border border-emerald-700/40",
		"bg-lime-800/50 text-lime-300 border border-lime-700/40",
		"bg-teal-800/50 text-teal-300 border border-teal-700/40",
		"bg-stone-700/50 text-stone-300 border border-stone-600/40",
	];
	return styles[hash];
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;

	const post = await db.query.posts.findFirst({
		where: eq(posts.slug, slug),
		with: {
			comments: {
				where: eq(comments.approved, true),
				orderBy: (c, { asc }) => [asc(c.createdAt)],
			},
		},
	});

	if (!post) notFound();

	const coverImage = SLUG_IMAGES[slug] ?? FALLBACK_IMAGE;

	const formattedDate = post.createdAt.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Split body into paragraphs for nicer rendering
	const paragraphs = post.body
		.split(/\n{2,}/)
		.map((p) => p.trim())
		.filter(Boolean);

	// Serialize comments for the client component
	const serializedComments = post.comments.map((c) => ({
		id: c.id,
		authorName: c.authorName,
		isAnonymous: c.isAnonymous,
		body: c.body,
		createdAt: c.createdAt.toISOString(),
	}));

	return (
		<main className="min-h-screen bg-[#0d1a0d] pt-20">
			{/* Hero image */}
			<div className="relative h-72 md:h-96 w-full overflow-hidden">
				{/* biome-ignore lint/performance/noImgElement: hero cover */}
				<img
					src={coverImage}
					alt={post.title}
					className="h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-[#0d1a0d]/30 via-transparent to-[#0d1a0d]" />
			</div>

			{/* Article */}
			<div className="mx-auto max-w-2xl px-6 -mt-12 relative z-10">
				{/* Tags */}
				{post.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{post.tags.map((t) => (
							<Link
								key={t}
								href={`/blog?tag=${encodeURIComponent(t)}`}
								className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-opacity hover:opacity-80 ${getTagStyle(t)}`}
							>
								{t}
							</Link>
						))}
					</div>
				)}

				{/* Title */}
				<h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
					{post.title}
				</h1>

				{/* Meta */}
				<div className="flex items-center gap-3 text-xs text-white/35 uppercase tracking-widest mb-10 pb-8 border-b border-white/10">
					<time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
					<span>·</span>
					<span>
						{post.comments.length}{" "}
						{post.comments.length === 1 ? "comment" : "comments"}
					</span>
				</div>

				{/* Body */}
				<article className="space-y-5 mb-16">
					{paragraphs.map((para, i) => (
						<p
							// biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs
							key={i}
							className="text-base leading-[1.85] text-white/75"
						>
							{para}
						</p>
					))}
				</article>

				{/* Back to blog */}
				<div className="mb-12">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
					>
						← Back to all stories
					</Link>
				</div>

				{/* Comments section */}
				<CommentsSection
					postId={post.id}
					slug={post.slug}
					comments={serializedComments}
				/>
			</div>
		</main>
	);
}
