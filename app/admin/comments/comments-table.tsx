"use client";

import { useRef, useState } from "react";
import { CommentActionsMenu } from "./comment-actions-menu";

type CommentRow = {
	id: string;
	authorName: string;
	email: string;
	body: string;
	approved: boolean;
	createdAt: string;
	isAnonymous: boolean;
	postTitle: string;
	postSlug: string;
	categoryName: string | null;
};

const ROW_OPTIONS = [5, 10, 20, 50] as const;

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "az", label: "Author A–Z" },
	{ value: "za", label: "Author Z–A" },
];

export function CommentsTable({ comments }: { comments: CommentRow[] }) {
	const [search, setSearch] = useState("");
	const [topicFilter, setTopicFilter] = useState("all");
	const [sort, setSort] = useState("newest");
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [page, setPage] = useState(1);
	const [filterOpen, setFilterOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);

	const filterRef = useRef<HTMLDivElement>(null);
	const sortRef = useRef<HTMLDivElement>(null);

	// Derive unique topics from comments
	const allTopics = Array.from(
		new Set(
			comments
				.map((c) => c.categoryName)
				.filter((n): n is string => n !== null),
		),
	).sort();

	function closeDropdowns(e: React.MouseEvent) {
		if (filterRef.current && !filterRef.current.contains(e.target as Node))
			setFilterOpen(false);
		if (sortRef.current && !sortRef.current.contains(e.target as Node))
			setSortOpen(false);
	}

	const filtered = comments
		.filter((c) => topicFilter === "all" || c.categoryName === topicFilter)
		.filter((c) => {
			if (!search.trim()) return true;
			const q = search.toLowerCase();
			const name = c.isAnonymous ? "anonymous" : c.authorName.toLowerCase();
			return (
				name.includes(q) ||
				c.body.toLowerCase().includes(q) ||
				c.postTitle.toLowerCase().includes(q)
			);
		})
		.sort((a, b) => {
			if (sort === "oldest")
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			if (sort === "az")
				return (a.isAnonymous ? "anonymous" : a.authorName).localeCompare(
					b.isAnonymous ? "anonymous" : b.authorName,
				);
			if (sort === "za")
				return (b.isAnonymous ? "anonymous" : b.authorName).localeCompare(
					a.isAnonymous ? "anonymous" : a.authorName,
				);
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});

	const totalRows = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
	const safePage = Math.min(page, totalPages);
	const paginated = filtered.slice(
		(safePage - 1) * rowsPerPage,
		safePage * rowsPerPage,
	);

	const handleRowsChange = (n: number) => {
		setRowsPerPage(n);
		setPage(1);
	};
	const handleSearch = (v: string) => {
		setSearch(v);
		setPage(1);
	};
	const handleTopicFilter = (t: string) => {
		setTopicFilter(t);
		setPage(1);
		setFilterOpen(false);
	};
	const handleSort = (s: string) => {
		setSort(s);
		setSortOpen(false);
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: closes dropdowns on outside click
		<div onClick={closeDropdowns}>
			{/* Toolbar */}
			<div className="flex items-center gap-3 flex-wrap mb-5">
				{/* Search */}
				<div className="flex items-center gap-2 rounded-full border border-[#1a2e1a] bg-white px-4 py-2 min-w-60 focus-within:ring-2 focus-within:ring-[#1a2e1a]/20">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 text-[#7a9a7a] shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="search"
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Search a comment here...."
						className="flex-1 bg-transparent text-sm text-[#1a2e1a] placeholder-[#9ab09a] focus:outline-none"
						aria-label="Search comments"
					/>
					{search && (
						<button
							type="button"
							onClick={() => handleSearch("")}
							className="text-[#9ab09a] hover:text-[#1a2e1a]"
							aria-label="Clear search"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>

				{/* Filter by topic */}
				<div className="relative" ref={filterRef}>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setFilterOpen((v) => !v);
							setSortOpen(false);
						}}
						className={`flex items-center gap-2 rounded-full border border-[#1a2e1a] bg-white px-4 py-2 text-sm font-medium text-[#1a2e1a] hover:bg-[#1a2e1a]/5 ${topicFilter !== "all" ? "bg-[#1a2e1a]/8 font-semibold" : ""}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
							/>
						</svg>
						{topicFilter !== "all" ? topicFilter : "Filter"}
					</button>
					{filterOpen && (
						<div
							className="absolute z-20 mt-2 w-44 rounded-lg border border-[#1a2e1a]/30 bg-white p-1 shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								onClick={() => handleTopicFilter("all")}
								className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${topicFilter === "all" ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
							>
								All Topics
							</button>
							{allTopics.map((t) => (
								<button
									key={t}
									type="button"
									onClick={() => handleTopicFilter(t)}
									className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${topicFilter === t ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
								>
									{t}
								</button>
							))}
							{allTopics.length === 0 && (
								<p className="px-3 py-2 text-xs text-[#7a9a7a]">
									No topics yet
								</p>
							)}
						</div>
					)}
				</div>

				{/* Sort */}
				<div className="relative" ref={sortRef}>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setSortOpen((v) => !v);
							setFilterOpen(false);
						}}
						className="flex items-center gap-2 rounded-full border border-[#1a2e1a] bg-white px-4 py-2 text-sm font-medium text-[#1a2e1a] hover:bg-[#1a2e1a]/5"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6h16M4 10h10M4 14h6"
							/>
						</svg>
						Sort
					</button>
					{sortOpen && (
						<div
							className="absolute z-20 mt-2 w-40 rounded-lg border border-[#1a2e1a]/30 bg-white p-1 shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							{SORT_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => handleSort(opt.value)}
									className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${sort === opt.value ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Table */}
			{totalRows === 0 ? (
				<div className="flex items-center justify-center py-20 text-[#7a9a7a] text-sm rounded-xl border border-[#1a2e1a]/20 bg-white">
					{search || topicFilter !== "all"
						? "No comments match your filters."
						: "No comments yet."}
				</div>
			) : (
				<div className="rounded-xl overflow-hidden border border-[#1a2e1a]/20 bg-white">
					<table className="w-full text-sm">
						<thead>
							<tr style={{ background: "#1a2e1a" }}>
								<th className="px-5 py-3.5 text-left text-xs font-bold text-white">
									No.
								</th>
								<th className="px-5 py-3.5 text-left text-xs font-bold text-white">
									Name
								</th>
								<th className="px-5 py-3.5 text-left text-xs font-bold text-white">
									Comment
								</th>
								<th className="px-5 py-3.5 text-left text-xs font-bold text-white">
									Status
								</th>
								<th className="px-5 py-3.5 text-left text-xs font-bold text-white">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{paginated.map((comment, idx) => {
								const rowNum = (safePage - 1) * rowsPerPage + idx + 1;
								const isEven = idx % 2 === 1;
								return (
									<tr
										key={comment.id}
										className={`border-b border-[#e8ede8] last:border-0 hover:bg-[#f4f8f4] ${isEven ? "bg-[#f4f8f4]" : "bg-white"}`}
									>
										<td className="px-5 py-4 text-sm text-[#1a2e1a] font-medium whitespace-nowrap">
											{rowNum}
										</td>
										<td className="px-5 py-4 align-middle whitespace-nowrap">
											<span className="text-sm font-medium text-[#1a2e1a]">
												{comment.isAnonymous ? "Anonymous" : comment.authorName}
											</span>
										</td>
										<td className="px-5 py-4 align-middle max-w-xs">
											<p className="text-sm text-[#3a3a3a] line-clamp-2 leading-relaxed">
												{comment.body}
											</p>
										</td>
										<td className="px-5 py-4 align-middle">
											<span
												className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
													comment.approved
														? "bg-green-100 text-green-800 border-green-300"
														: "bg-[#d4a843] text-[#3a2800] border-[#c49a30]"
												}`}
											>
												{comment.approved ? "Posted" : "Pending"}
											</span>
										</td>
										<td className="px-5 py-4 align-middle">
											<CommentActionsMenu
												commentId={comment.id}
												postSlug={comment.postSlug}
												postTitle={comment.postTitle}
												commentBody={comment.body}
												authorName={
													comment.isAnonymous ? "Anonymous" : comment.authorName
												}
												approved={comment.approved}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					{/* Pagination footer */}
					<div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-[#e8ede8] bg-[#f4f8f4] text-xs text-[#5a7a5a]">
						<div className="flex items-center gap-1.5">
							<span>Row</span>
							<div className="relative">
								<select
									value={rowsPerPage}
									onChange={(e) => handleRowsChange(Number(e.target.value))}
									className="appearance-none bg-white border border-[#1a2e1a]/30 rounded px-2 py-0.5 pr-5 text-xs text-[#1a2e1a] focus:outline-none cursor-pointer"
								>
									{ROW_OPTIONS.map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</select>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-[#1a2e1a] pointer-events-none"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>
						<span>
							Page {safePage} - {totalPages}
						</span>
						<div className="flex items-center gap-1.5">
							<span className="text-[#9ab09a]">Prev</span>
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={safePage === 1}
								className="flex h-5 w-5 items-center justify-center rounded text-[#5a7a5a] hover:text-[#1a2e1a] disabled:opacity-30 disabled:cursor-not-allowed"
								aria-label="Previous page"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3 w-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={safePage === totalPages}
								className="flex h-5 w-5 items-center justify-center rounded text-[#5a7a5a] hover:text-[#1a2e1a] disabled:opacity-30 disabled:cursor-not-allowed"
								aria-label="Next page"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3 w-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
							<span className="text-[#9ab09a]">Next</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
