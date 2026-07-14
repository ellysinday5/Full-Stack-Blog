"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { ConfirmModal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/Toast";
import { type PostStatus, deletePost, updatePostStatus } from "../actions";

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

// ── Card actions ──────────────────────────────────────────────────────────────
function CardActions({ post }: { post: PostRow }) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const nextStatus = (cur: string): PostStatus =>
		cur === "published"
			? "archived"
			: cur === "archived"
				? "draft"
				: "published";
	const next = nextStatus(post.status);
	const nextLabel =
		next === "published" ? "Publish" : next === "draft" ? "Draft" : "Archive";

	function handleStatusChange() {
		startTransition(async () => {
			const fd = new FormData();
			fd.set("postId", post.id);
			fd.set("status", next);
			const result = await updatePostStatus({}, fd);
			setConfirmStatusOpen(false);
			if (result.error) {
				toast({
					variant: "error",
					title: "Failed to update status",
					message: result.error,
				});
			} else {
				toast({
					variant: "success",
					title: `Post ${nextLabel.toLowerCase()}d`,
					message: `"${post.title}" has been ${nextLabel.toLowerCase()}d.`,
				});
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
				toast({
					variant: "error",
					title: "Failed to delete post",
					message: result.error,
				});
			} else {
				toast({
					variant: "success",
					title: "Post deleted",
					message: `"${post.title}" was deleted.`,
				});
			}
		});
	}

	return (
		<>
			<div className="flex items-center justify-between px-3 py-2 border-t border-[#1a2e1a]/15">
				<button
					type="button"
					onClick={() => setConfirmStatusOpen(true)}
					disabled={isPending}
					className="rounded-full px-3 py-1 text-[11px] font-bold border border-[#1a2e1a]/40 bg-[#e8ede4] text-[#1a2e1a] hover:bg-[#1a2e1a] hover:text-white hover:border-[#1a2e1a] disabled:opacity-50 transition-colors"
				>
					{nextLabel}
				</button>
				<Link
					href={`/blog/${post.slug}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs font-semibold text-[#1a2e1a] hover:text-[#3a6b3a]"
				>
					View
				</Link>
				<button
					type="button"
					onClick={() => setConfirmDeleteOpen(true)}
					disabled={isPending}
					className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
				>
					Delete
				</button>
			</div>

			{/* Status change confirm */}
			<ConfirmModal
				open={confirmStatusOpen}
				onClose={() => setConfirmStatusOpen(false)}
				onConfirm={handleStatusChange}
				title={`${nextLabel} Post?`}
				message={`Are you sure you want to ${nextLabel.toLowerCase()} "${post.title}"?`}
				confirmLabel={nextLabel}
				variant="warning"
				loading={isPending}
			/>

			{/* Delete confirm */}
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

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: PostRow }) {
	return (
		<div className="rounded-xl border border-[#1a2e1a]/20 bg-white overflow-hidden flex flex-col">
			<div className="relative h-44 w-full bg-[#d4e4d4] overflow-hidden">
				<Image
					src="/images/background-picture.png"
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
			<CardActions post={post} />
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
						className={`flex items-center gap-2 rounded-full border border-[#1a2e1a] bg-white px-4 py-2 text-sm font-medium text-[#1a2e1a] hover:bg-[#1a2e1a]/5 ${categoryFilter !== "all" ? "font-semibold" : ""}`}
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
			</div>

			{/* Card grid */}
			{filtered.length === 0 ? (
				<div className="flex items-center justify-center py-24 text-[#7a9a7a] text-sm rounded-xl border border-[#1a2e1a]/20 bg-white">
					{search ? "No posts match your search." : "No posts yet."}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{filtered.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			)}

			<p className="mt-4 text-xs text-[#7a9a7a]">
				{filtered.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
			</p>
		</div>
	);
}
