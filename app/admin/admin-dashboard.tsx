"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PostForm } from "./post-form";
import { RecentActivityGrid } from "./posts-panel";

type PostRow = {
	id: string;
	title: string;
	slug: string;
	status: string;
	body: string;
	createdAt: string;
};

type Category = { id: string; name: string };

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "az", label: "Title A–Z" },
	{ value: "za", label: "Title Z–A" },
];

const STATUS_OPTIONS = [
	{ value: "all", label: "All" },
	{ value: "published", label: "Published" },
	{ value: "draft", label: "Draft" },
	{ value: "archived", label: "Archived" },
];

interface AdminDashboardProps {
	posts: PostRow[];
	categories: Category[];
}

export function AdminDashboard({ posts, categories }: AdminDashboardProps) {
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sort, setSort] = useState("newest");
	const [filterOpen, setFilterOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);

	const filterRef = useRef<HTMLDivElement>(null);
	const sortRef = useRef<HTMLDivElement>(null);

	// Close dropdowns on outside click
	function handleBodyClick(e: React.MouseEvent) {
		if (filterRef.current && !filterRef.current.contains(e.target as Node))
			setFilterOpen(false);
		if (sortRef.current && !sortRef.current.contains(e.target as Node))
			setSortOpen(false);
	}

	const filteredPosts = posts
		.filter((p) => statusFilter === "all" || p.status === statusFilter)
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

	const activeStatus = STATUS_OPTIONS.find((s) => s.value === statusFilter);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: click handler only closes dropdowns
		// biome-ignore lint/a11y/noStaticElementInteractions: click handler only closes dropdowns
		<div className="w-full" onClick={handleBodyClick}>
			{/* Page heading */}
			<h1 className="text-2xl font-bold text-[#1a2e1a] mb-5">Write a post</h1>

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

				{/* Filter by status */}
				<div className="relative" ref={filterRef}>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setFilterOpen((v) => !v);
							setSortOpen(false);
						}}
						className={`flex items-center gap-2 rounded-lg border border-[#1a2e1a] bg-white px-4 py-2 text-sm font-medium text-[#1a2e1a] hover:bg-[#eef8f1] hover:text-[#1a2e1a] ${statusFilter !== "all" ? "bg-[#eef8f1] font-semibold" : ""}`}
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
						{statusFilter !== "all" ? activeStatus?.label : "Filter"}
					</button>
					{filterOpen && (
						// biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation
						// biome-ignore lint/a11y/noStaticElementInteractions: stop propagation
						<div
							className="absolute z-20 mt-2 w-40 rounded-lg border border-[#1a2e1a]/30 bg-white p-1 shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							{STATUS_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => {
										setStatusFilter(opt.value);
										setFilterOpen(false);
									}}
									className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm ${statusFilter === opt.value ? "bg-[#1a2e1a] text-white font-semibold" : "text-[#1a2e1a] hover:bg-[#1a2e1a]/10"}`}
								>
									{opt.label}
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

				{/* Add Post */}
				<button
					type="button"
					onClick={() => setShowForm((v) => !v)}
					className="ml-auto flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white border border-[#1a2e1a] hover:opacity-90"
					style={{ background: "#1a2e1a" }}
				>
					{showForm ? "Cancel" : "Add Post"}
					<span className="text-lg leading-none">{showForm ? "×" : "+"}</span>
				</button>
			</div>

			{/* Post form */}
			{showForm && (
				<div className="mb-6">
					<PostForm
						categories={categories}
						onClose={() => setShowForm(false)}
					/>
				</div>
			)}

			{/* Recent Activity */}
			<div className="rounded-xl border-2 border-[#1a2e1a]/30 bg-[#f0f3ef] p-5">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-sm font-bold text-[#1a2e1a]">Recent Activity</h2>
					<Link
						href="/admin/posts"
						className="rounded-lg border border-[#1a2e1a] bg-white px-4 py-1.5 text-xs font-bold text-[#1a2e1a] hover:bg-[#1a2e1a]/5"
					>
						Manage Posts
					</Link>
				</div>
				<RecentActivityGrid posts={filteredPosts} />
			</div>
		</div>
	);
}
