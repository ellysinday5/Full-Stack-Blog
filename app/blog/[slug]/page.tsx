import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { CommentForm } from "./comment-form";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;

	const post = await db.query.posts.findFirst({
		where: eq(posts.slug, slug),
		with: {
			comments: {
				orderBy: (comments, { desc }) => [desc(comments.createdAt)],
			},
		},
	});

	if (!post) {
		notFound();
	}

	return (
		<main className="mx-auto max-w-2xl px-6 py-16">
			<article>
				<time
					dateTime={post.createdAt.toISOString()}
					className="text-sm text-neutral-400"
				>
					{post.createdAt.toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-[--color-ink]">
					{post.title}
				</h1>
				<div className="prose mt-8 whitespace-pre-wrap text-neutral-700">
					{post.body}
				</div>
			</article>

			<section className="mt-16 border-t border-neutral-200 pt-10">
				<h2 className="text-xl font-semibold text-[--color-ink]">
					Comments {post.comments.length > 0 && `(${post.comments.length})`}
				</h2>

				{post.comments.length === 0 ? (
					<p className="mt-4 text-neutral-500">
						No comments yet. Be the first to share your thoughts.
					</p>
				) : (
					<ul className="mt-6 space-y-6">
						{post.comments.map((comment) => (
							<li
								key={comment.id}
								className="rounded-lg border border-neutral-200 p-4"
							>
								<div className="flex items-center justify-between">
									<span className="font-medium text-[--color-ink]">
										{comment.authorName}
									</span>
									<time
										dateTime={comment.createdAt.toISOString()}
										className="text-xs text-neutral-400"
									>
										{comment.createdAt.toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</time>
								</div>
								<p className="mt-2 text-neutral-700">{comment.body}</p>
							</li>
						))}
					</ul>
				)}

				<CommentForm postId={post.id} slug={post.slug} />
			</section>
		</main>
	);
}
