"use client";

import { useState } from "react";
import { CommentForm } from "./comment-form";

type Comment = {
	id: string;
	authorName: string;
	isAnonymous: boolean;
	body: string;
	createdAt: string; // ISO string — serialized from server
};

const COMMENTS_PER_PAGE = 5;

type SortKey = "newest" | "oldest";

export function CommentsSection({
	postId,
	slug,
	comments,
}: {
	postId: string;
	slug: string;
	comments: Comment[];
}) {
	const [sort, setSort] = useState<SortKey>("newest");
	const [page, setPage] = useState(1);

	const sorted = [...comments].sort((a, b) => {
		const diff =
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		return sort === "newest" ? -diff : diff;
	});

	const totalPages = Math.ceil(sorted.length / COMMENTS_PER_PAGE);
	const paginated = sorted.slice(
		(page - 1) * COMMENTS_PER_PAGE,
		page * COMMENTS_PER_PAGE,
	);

	const handleSort = (key: SortKey) => {
		setSort(key);
		setPage(1);
	};

	return (
		<section className="border-t border-white/10 pt-10 pb-20">
			{/* Header row */}
			<div className="flex items-center justify-between mb-6 flex-wrap gap-3">
				<h2 className="text-xl font-bold text-white">
					Comments
					{comments.length > 0 && (
						<span className="ml-2 text-sm font-normal text-white/35">
							({comments.length})
						</span>
					)}
				</h2>

				{/* Sort controls */}
				{comments.length > 1 && (
					<div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
						{(["newest", "oldest"] as SortKey[]).map((key) => (
							<button
								key={key}
								type="button"
								onClick={() => handleSort(key)}
								className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
									sort === key
										? "bg-green-700 text-white"
										: "text-white/40 hover:text-white"
								}`}
							>
								{key}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Comment list */}
			{comments.length === 0 ? (
				<p className="text-sm text-white/35 mb-10">
					No comments yet. Be the first to share your thoughts.
				</p>
			) : (
				<>
					<ul className="space-y-4 mb-6">
						{paginated.map((comment) => (
							<li
								key={comment.id}
								className="rounded-xl border border-white/10 bg-white/5 p-5"
							>
								<div className="flex items-center justify-between mb-2">
									<span className="font-semibold text-sm text-white/80">
										{comment.isAnonymous ? "Anonymous" : comment.authorName}
									</span>
									<time
										dateTime={comment.createdAt}
										className="text-xs text-white/30"
									>
										{new Date(comment.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</time>
								</div>
								<p className="text-sm leading-relaxed text-white/60">
									{comment.body}
								</p>
							</li>
						))}
					</ul>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center gap-2 mb-10">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
								aria-label="Previous page"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</button>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
								<button
									key={p}
									type="button"
									onClick={() => setPage(p)}
									className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
										page === p
											? "bg-green-700 text-white"
											: "border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
									}`}
								>
									{p}
								</button>
							))}

							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
								aria-label="Next page"
							>
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

							<span className="text-xs text-white/25 ml-1">
								{page} / {totalPages}
							</span>
						</div>
					)}
				</>
			)}

			<CommentForm postId={postId} slug={slug} />
		</section>
	);
}
