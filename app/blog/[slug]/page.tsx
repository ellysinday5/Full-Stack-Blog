import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
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
		"bg-[#1f6f4d]/10 text-[#1f6f4d] border border-[#1f6f4d]/20",
		"bg-[#0f3d2e]/10 text-[#0f3d2e] border border-[#0f3d2e]/20",
		"bg-[#4c6f5e]/10 text-[#4c6f5e] border border-[#4c6f5e]/20",
		"bg-[#7bc79d]/10 text-[#7bc79d] border border-[#7bc79d]/20",
		"bg-[#133d2e]/10 text-[#133d2e] border border-[#133d2e]/20",
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
		<PublicShell>
			<main className="min-h-screen bg-[linear-gradient(135deg,#f4f9f5_0%,#eef8f1_100%)] pb-24 pt-24 sm:pt-28">
				{/* Hero image container */}
				<div className="w-full mb-12">
					<div className="relative h-[40vh] min-h-[300px] sm:h-[50vh] sm:min-h-[400px] w-full overflow-hidden shadow-lg">
						{/* biome-ignore lint/performance/noImgElement: hero cover */}
						<img
							src={coverImage}
							alt={post.title}
							className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#0f3d2e]/60 via-[#0f3d2e]/10 to-transparent" />
						
						{/* Title inside hero (optional, or outside) - let's keep it outside for editorial feel, but we can put tags here */}
					</div>
				</div>

				{/* Article */}
				<div className="mx-auto max-w-3xl px-4 sm:px-6 relative z-10">
					{/* Tags */}
					{post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-6 justify-center">
							{post.tags.map((t) => (
								<Link
									key={t}
									href={`/blog?tag=${encodeURIComponent(t)}`}
									className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-sm ${getTagStyle(t)}`}
								>
									{t}
								</Link>
							))}
						</div>
					)}

					{/* Title */}
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f3d2e] font-serif leading-[1.1] mb-6 text-center">
						{post.title}
					</h1>

					{/* Meta */}
					<div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#4c6f5e] uppercase tracking-widest mb-12 pb-8 border-b border-[#dcefe3]">
						<time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
						<span className="text-[#dcefe3]">•</span>
						<span>
							{post.comments.length}{" "}
							{post.comments.length === 1 ? "comment" : "comments"}
						</span>
					</div>

					{/* Body */}
					<article className="space-y-6 mb-20 font-serif">
						{paragraphs.map((para, i) => (
							<p
								// biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs
								key={i}
								className="text-lg md:text-xl leading-[1.8] text-[#1a2e1a]"
							>
								{para}
							</p>
						))}
					</article>

					{/* Back to blog */}
					<div className="mb-16 border-t border-[#dcefe3] pt-8">
						<Link
							href="/blog"
							className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1f6f4d] hover:text-[#0f3d2e] transition-colors"
						>
							<span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Back to all stories
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
		</PublicShell>
	);
}
