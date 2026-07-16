"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/Modal";
import { deletePost, updatePostStatus } from "../actions";

type PostRow = {
	id: string;
	title: string;
	slug: string;
	tags: string[];
	status: string;
	createdAt: string;
	categoryName: string | null;
};

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "az", label: "Title A–Z" },
	{ value: "za", label: "Title Z–A" },
];

// ── Table row 3-dot menu ───────────────────────────────────────────────
function PostRowMenu({ post }: { post: PostRow }) {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [confirmArchiveOpen, setConfirmArchiveOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	function handleArchive() {
		startTransition(async () => {
			const fd = new FormData();
			fd.set("postId", post.id);
			fd.set("status", "archived");
			const result = await updatePostStatus({}, fd);
			setConfirmArchiveOpen(false);
			if (result.error) {
				toast({ variant: "error", title: "Failed to archive", message: result.error });
			} else {
				toast({ variant: "success", title: "Post archived", message: `"${post.title}" was archived.` });
			}
		});
	}

	function handleDelete() {
		startTransition(async () => {
			const fd = new FormData();
			fd.set("postId", post.id);
			const result = await deletePost({}, fd);
			setConfirmDeleteOpen(false);
			if (result.error) {
				toast({ variant: "error", title: "Failed to delete post", message: result.error });
			} else {
				toast({ variant: "success", title: "Post deleted", message: `"${post.title}" was deleted.` });
			}
		});
	}

	return (
		<>
			<div className="relative inline-block">
				<button
					type="button"
					onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
					disabled={isPending}
					className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e8ede4] text-[#5a7a5a] hover:text-[#1a2e1a] transition-colors disabled:opacity-50"
					aria-label="Post actions"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<circle cx="10" cy="4" r="1.5" />
						<circle cx="10" cy="10" r="1.5" />
						<circle cx="10" cy="16" r="1.5" />
					</svg>
				</button>

				{open && (
					<>
						{/* backdrop */}
						<button
							type="button"
							className="fixed inset-0 z-10 cursor-default w-full h-full"
							onClick={() => setOpen(false)}
							aria-label="Close menu"
						/>
						<div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-[#1a2e1a]/20 bg-white shadow-lg overflow-hidden">
							<Link
								href={`/admin/posts/edit/${post.id}`}
								onClick={() => setOpen(false)}
								className="flex items-center gap-2 px-3 py-2 text-sm text-[#1a2e1a] hover:bg-[#f0f3ef] transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								View
							</Link>
							{post.status !== "archived" && (
								<button
									type="button"
									onClick={() => { setOpen(false); setConfirmArchiveOpen(true); }}
									className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#5a7a5a] hover:bg-[#f0f3ef] transition-colors"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
									</svg>
									Archive
								</button>
							)}
							<div className="border-t border-[#1a2e1a]/10" />
							<button
								type="button"
								onClick={() => { setOpen(false); setConfirmDeleteOpen(true); }}
								className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
								Delete
							</button>
						</div>
					</>
				)}
			</div>

			<ConfirmModal
				open={confirmArchiveOpen}
				onClose={() => setConfirmArchiveOpen(false)}
				onConfirm={handleArchive}
				title="Archive Post?"
				message={`Are you sure you want to archive "${post.title}"?`}
				confirmLabel="Archive"
				variant="warning"
				loading={isPending}
			/>
			<ConfirmModal
				open={confirmDeleteOpen}
				onClose={() => setConfirmDeleteOpen(false)}
				onConfirm={handleDelete}
				title="Delete Post?"
				message={`This will permanently delete "${post.title}". This action cannot be undone.`}
				confirmLabel="Delete"
				variant="danger"
				loading={isPending}
			/>
		</>
	);
}

const SLUG_IMAGES: Record<string, string> = {
	"healing-power-of-waterfalls": "/images/falls.jpg",
	"why-the-banyan-tree-is-extraordinary": "/images/banyan-tree.png",
	"strange-beautiful-world-of-carnivorous-plants": "/images/tree.jpg",
	"life-in-siargao": "/images/siargao-1.jpg",
	"siargao-itinerary": "/images/siargao-2.jpg",
	"the-silent-patient-review": "/images/the-silent-patient.png",
	"13-reasons-to-stay-review": "/images/13-reasons-to-stay.jpg",
};

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=420&q=80";

// ── Post grid card (grid view) ────────────────────────────────────────────
function PostCard({ post }: { post: PostRow }) {
	const coverImage = SLUG_IMAGES[post.slug] ?? FALLBACK_IMAGE;

	const statusStyle =
		post.status === "published"
			? "bg-green-100 text-green-800 border border-green-300"
			: post.status === "archived"
				? "bg-gray-100 text-gray-500 border border-gray-300"
				: "bg-[#c8c8c8] text-[#3a3a3a] border border-[#b0b0b0]";

	const statusLabel =
		post.status === "published"
			? "Published"
			: post.status === "archived"
				? "Archived"
				: "Draft";

	return (
		<div className="rounded-xl border border-[#1a2e1a]/20 bg-white overflow-hidden flex flex-col">
			<div className="relative h-44 w-full bg-[#d4e4d4] overflow-hidden">
				<Image
					src={coverImage}
					alt={post.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			<div className="flex-1 p-3">
				<h3 className="text-sm font-bold text-[#1a2e1a] leading-snug mb-1">
					{post.title}
				</h3>
				<p className="text-xs text-[#5a7a5a] leading-relaxed line-clamp-2">
					/blog/{post.slug}
				</p>
				{post.categoryName && (
					<p className="text-[10px] text-[#7a9a7a] mt-1">{post.categoryName}</p>
				)}
			</div>
			{/* Card footer: status badge (non-clickable) + View button (admin POV) */}
			<div className="flex items-center justify-between px-3 pb-3 pt-2 border-t border-[#1a2e1a]/10">
				<span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold pointer-events-none select-none ${statusStyle}`}>
					{statusLabel}
				</span>
				<Link
					href={`/admin/posts/edit/${post.id}`}
					className="text-xs font-semibold text-[#1a2e1a] hover:text-[#3a6b3a] transition-colors"
				>
					View
				</Link>
			</div>
		</div>
	);
}

// ── Table / grid ──────────────────────────────────────────────────────────────
export function ManagePostsTable({ posts }: { posts: PostRow[] }) {
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sort, setSort] = useState("newest");
	const [sortOpen, setSortOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
	const sortRef = useRef<HTMLDivElement>(null);
	const filterRef = useRef<HTMLDivElement>(null);

	const allCategories = Array.from(
		new Set(posts.map((p) => p.categoryName).filter(Boolean) as string[]),
	);

	function closeDropdowns(e: React.MouseEvent) {
		if (sortRef.current && !sortRef.current.contains(e.target as Node))
			setSortOpen(false);
		if (filterRef.current && !filterRef.current.contains(e.target as Node))
			setFilterOpen(false);
	}

	const filtered = posts
		.filter(
			(p) => categoryFilter === "all" || p.categoryName === categoryFilter,
		)
		.filter((p) =>
			search.trim()
				? p.title.toLowerCase().includes(search.toLowerCase()) ||
					p.slug.toLowerCase().includes(search.toLowerCase())
				: true,
		)
		.sort((a, b) => {
			if (sort === "oldest")
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			if (sort === "az") return a.title.localeCompare(b.title);
			if (sort === "za") return b.title.localeCompare(a.title);
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: closes dropdowns on outside click
		// biome-ignore lint/a11y/noStaticElementInteractions: closes dropdowns on outside click
		<div onClick={closeDropdowns}>
			{/* Toolbar */}
			<div className="flex items-center gap-3 flex-wrap mb-6">
				{/* Search */}
				<div className="flex items-center gap-2 rounded-full border border-[#1a2e1a] bg-white px-4 py-2 min-w-55 focus-within:ring-2 focus-within:ring-[#1a2e1a]/20">
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
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search a post here...."
						className="flex-1 bg-transparent text-sm text-[#1a2e1a] placeholder-[#9ab09a] focus:outline-none"
						aria-label="Search posts"
					/>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
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

				{/* Filter by category */}
				<div className="relative" ref={filterRef}>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setFilterOpen((v) => !v);
							setSortOpen(false);
						}}
						className={`flex items-center gap-2 rounded-lg border border-[#1a2e1a] bg-white px-4 py-2 text-sm font-medium text-[#1a2e1a] hover:bg-[#eef8f1] hover:text-[#1a2e1a] ${categoryFilter !== "all" ? "font-semibold" : ""}`}
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
						{categoryFilter !== "all" ? categoryFilter : "Filter"}
					</button>
					{filterOpen && (
						// biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation
						// biome-ignore lint/a11y/noStaticElementInteractions: stop propagation
						<div
							className="absolute z-20 mt-2 w-44 rounded-lg border border-[#1a2e1a]/30 bg-white p-1 shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								onClick={() => {
									setCategoryFilter("all");
									setFilterOpen(false);
								}}
								className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${categoryFilter === "all" ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
							>
								All Categories
							</button>
							{allCategories.map((cat) => (
								<button
									key={cat}
									type="button"
									onClick={() => {
										setCategoryFilter(cat);
										setFilterOpen(false);
									}}
									className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${categoryFilter === cat ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
								>
									{cat}
								</button>
							))}
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
						className="flex items-center gap-2 rounded-lg border border-[#1a2e1a] bg-white px-4 py-2 text-sm font-medium text-[#1a2e1a] hover:bg-[#eef8f1] hover:text-[#1a2e1a]"
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
						// biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation
						// biome-ignore lint/a11y/noStaticElementInteractions: stop propagation
						<div
							className="absolute z-20 mt-2 w-40 rounded-lg border border-[#1a2e1a]/30 bg-white p-1 shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							{SORT_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => {
										setSort(opt.value);
										setSortOpen(false);
									}}
									className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${sort === opt.value ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					)}
				</div>

				{/* View Mode Toggle */}
				<div className="flex items-center gap-1 bg-white border border-[#1a2e1a] rounded-lg p-1 ml-auto">
					<button
						type="button"
						onClick={() => setViewMode("grid")}
						className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#e8ede4] text-[#1a2e1a]" : "text-[#7a9a7a] hover:text-[#1a2e1a]"}`}
						aria-label="Grid view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<title>Grid view</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2H4V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2h-2a2-2 0 01-2-2V6z..."
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={() => setViewMode("table")}
						className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-[#e8ede4] text-[#1a2e1a]" : "text-[#7a9a7a] hover:text-[#1a2e1a]"}`}
						aria-label="Table view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<title>Table view</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Card grid or Table */}
			{filtered.length === 0 ? (
				<div className="flex items-center justify-center py-24 text-[#7a9a7a] text-sm rounded-xl border border-[#1a2e1a]/20 bg-white">
					{search ? "No posts match your search." : "No posts yet."}
				</div>
			) : viewMode === "grid" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{filtered.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			) : (
				<div className="rounded-xl border border-[#1a2e1a]/20 bg-white overflow-hidden">
					<table className="w-full text-left text-sm">
						<thead className="bg-[#f0f3ef] text-[#1a2e1a] text-xs uppercase tracking-wider">
							<tr>
								<th className="px-4 py-3 font-bold border-b border-[#1a2e1a]/15">
									Title
								</th>
								<th className="px-4 py-3 font-bold border-b border-[#1a2e1a]/15 hidden sm:table-cell">
									Category
								</th>
								<th className="px-4 py-3 font-bold border-b border-[#1a2e1a]/15">
									Status
								</th>
								<th className="px-4 py-3 font-bold border-b border-[#1a2e1a]/15 hidden md:table-cell">
									Created
								</th>
								<th className="px-4 py-3 font-bold border-b border-[#1a2e1a]/15 text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#1a2e1a]/10">
							{filtered.map((post) => (
								<tr
									key={post.id}
									className="hover:bg-[#f9faf9] transition-colors"
								>
									<td className="px-4 py-3 font-medium text-[#1a2e1a]">
										<Link
											href={`/blog/${post.slug}`}
											target="_blank"
											className="hover:underline"
										>
											{post.title}
										</Link>
									</td>
									<td className="px-4 py-3 text-[#5a7a5a] hidden sm:table-cell">
										{post.categoryName || "—"}
									</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
												post.status === "published"
													? "bg-green-100 text-green-800"
													: post.status === "archived"
														? "bg-gray-100 text-gray-500"
														: "bg-[#e8ede4] text-[#1a2e1a]"
											}`}
										>
											{post.status.charAt(0).toUpperCase() +
												post.status.slice(1)}
										</span>
									</td>
									<td className="px-4 py-3 text-[#7a9a7a] hidden md:table-cell">
										{new Date(post.createdAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-3 text-center">
										<PostRowMenu post={post} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<p className="mt-4 text-xs text-[#7a9a7a]">
				{filtered.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
			</p>
		</div>
	);
}
