import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";
import { ModerationForm } from "./moderation-form";

export const metadata = {
	title: "Admin | Comment Moderation",
};

export default async function AdminCommentsPage({
	searchParams,
}: {
	searchParams: Promise<{ password?: string }>;
}) {
	const { password = "" } = await searchParams;

	const allComments = await db
		.select({
			id: comments.id,
			authorName: comments.authorName,
			body: comments.body,
			approved: comments.approved,
			createdAt: comments.createdAt,
			isAnonymous: comments.isAnonymous,
			postTitle: posts.title,
			postSlug: posts.slug,
		})
		.from(comments)
		.innerJoin(posts, eq(posts.id, comments.postId))
		.orderBy(asc(comments.createdAt));

	const pending = allComments.filter((c) => !c.approved);
	const approved = allComments.filter((c) => c.approved);

	return (
		<main className="min-h-screen bg-muted py-12">
			<div className="mx-auto max-w-4xl px-6">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground">
						Comment Moderation
					</h1>
					<Link
						href="/admin"
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						← Back to Admin
					</Link>
				</div>

				{/* Password notice */}
				{!password && (
					<div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
						Append{" "}
						<code className="font-mono">?password=YOUR_ADMIN_PASSWORD</code> to
						the URL to enable approve/reject actions.
					</div>
				)}

				{/* Pending */}
				<section className="mb-10">
					<h2 className="mb-4 text-lg font-semibold text-foreground">
						Pending ({pending.length})
					</h2>
					{pending.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No comments awaiting approval.
						</p>
					) : (
						<ul className="space-y-4">
							{pending.map((comment) => (
								<CommentCard
									key={comment.id}
									comment={comment}
									password={password}
								/>
							))}
						</ul>
					)}
				</section>

				{/* Approved */}
				<section>
					<h2 className="mb-4 text-lg font-semibold text-foreground">
						Approved ({approved.length})
					</h2>
					{approved.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No approved comments yet.
						</p>
					) : (
						<ul className="space-y-4">
							{approved.map((comment) => (
								<CommentCard
									key={comment.id}
									comment={comment}
									password={password}
								/>
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}

type CommentRow = {
	id: string;
	authorName: string;
	body: string;
	approved: boolean;
	createdAt: Date;
	isAnonymous: boolean;
	postTitle: string;
	postSlug: string;
};

function CommentCard({
	comment,
	password,
}: {
	comment: CommentRow;
	password: string;
}) {
	return (
		<li className="rounded-lg border border-border bg-card p-4 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-medium text-card-foreground">
							{comment.isAnonymous ? "Anonymous" : comment.authorName}
						</span>
						<span
							className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
								comment.approved
									? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
									: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
							}`}
						>
							{comment.approved ? "Approved" : "Pending"}
						</span>
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						On{" "}
						<Link
							href={`/blog/${comment.postSlug}`}
							className="underline hover:text-foreground"
						>
							{comment.postTitle}
						</Link>{" "}
						·{" "}
						{comment.createdAt.toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</p>
					<p className="mt-2 text-sm text-card-foreground">{comment.body}</p>
				</div>
				<div className="shrink-0">
					<ModerationForm
						commentId={comment.id}
						slug={comment.postSlug}
						approved={comment.approved}
						password={password}
					/>
				</div>
			</div>
		</li>
	);
}
