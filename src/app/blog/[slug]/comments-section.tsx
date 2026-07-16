"use client";

import { useState } from "react";
import { CommentForm } from "./comment-form";

type Comment = {
	id: string;
	authorName: string;
	isAnonymous: boolean;
	body: string;
	createdAt: string;
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
		<section className="border-t border-[#dcefe3] pt-12 pb-20">
			{/* Header row */}
			<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
				<h2 className="text-2xl font-bold text-[#0f3d2e] font-serif">
					Comments
					{comments.length > 0 && (
						<span className="ml-2 text-sm font-normal text-[#4c6f5e]">
							({comments.length})
						</span>
					)}
				</h2>

				{/* Sort controls */}
				{comments.length > 1 && (
					<div className="flex items-center gap-1 rounded-lg border border-[#dcefe3] bg-white p-1 shadow-sm">
						{(["newest", "oldest"] as SortKey[]).map((key) => (
							<button
								key={key}
								type="button"
								onClick={() => handleSort(key)}
								className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-300 ${
									sort === key
										? "bg-[#1f6f4d] text-white shadow-sm"
										: "text-[#4c6f5e] hover:text-[#0f3d2e] hover:bg-[#f4f9f5]"
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
				<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1f6f4d]/20 bg-white/50 px-6 py-12 text-center mb-10 shadow-sm">
					<div className="mb-4 text-3xl">💬</div>
					<p className="text-sm font-medium text-[#4c6f5e]">
						No comments yet. Be the first to share your thoughts.
					</p>
				</div>
			) : (
				<>
					<ul className="space-y-5 mb-8">
						{paginated.map((comment) => (
							<li
								key={comment.id}
								className="rounded-2xl border border-[#dcefe3] bg-white p-6 shadow-sm transition-all hover:shadow-md"
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef8f1] text-[#1f6f4d] font-bold text-sm">
											{comment.isAnonymous
												? "A"
												: comment.authorName.charAt(0).toUpperCase()}
										</div>
										<span className="font-bold text-sm text-[#0f3d2e]">
											{comment.isAnonymous ? "Anonymous" : comment.authorName}
										</span>
									</div>
									<time
										dateTime={comment.createdAt}
										className="text-xs font-medium text-[#8ca89a]"
									>
										{new Date(comment.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</time>
								</div>
								<p className="text-sm leading-relaxed text-[#1a2e1a] pl-11">
									{comment.body}
								</p>
							</li>
						))}
					</ul>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center gap-2 mb-12">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dcefe3] bg-white text-[#4c6f5e] transition-all hover:bg-[#f4f9f5] hover:text-[#0f3d2e] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
								aria-label="Previous page"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
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
									className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
										page === p
											? "bg-[#1f6f4d] text-white border border-[#1f6f4d]"
											: "border border-[#dcefe3] bg-white text-[#4c6f5e] hover:bg-[#f4f9f5] hover:text-[#0f3d2e]"
									}`}
								>
									{p}
								</button>
							))}

							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dcefe3] bg-white text-[#4c6f5e] transition-all hover:bg-[#f4f9f5] hover:text-[#0f3d2e] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
								aria-label="Next page"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
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

							<span className="text-xs font-semibold text-[#8ca89a] ml-3">
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
