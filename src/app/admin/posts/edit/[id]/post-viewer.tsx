"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostForm } from "../../post-form";

type Category = { id: string; name: string };

type Post = {
	id: string;
	title: string;
	slug: string;
	body: string;
	tags: string[];
	categoryId: string | null;
	status: string;
	coverImage: string | null;
	createdAt: Date;
};

// ── Shared label style ────────────────────────────────────────────────────────
const labelCls =
	"block text-xs font-bold uppercase tracking-widest text-[#1a2e1a]/50 mb-1";

const statusStyle = (status: string) => {
	if (status === "published")
		return "bg-green-100 text-green-800 border border-green-300";
	if (status === "archived")
		return "bg-gray-100 text-gray-500 border border-gray-300";
	return "bg-[#c8c8c8] text-[#3a3a3a] border border-[#b0b0b0]";
};

const statusLabel = (status: string) => {
	if (status === "published") return "Published";
	if (status === "archived") return "Archived";
	return "Draft";
};

interface PostViewerProps {
	post: Post;
	categories: Category[];
}

export function PostViewer({ post, categories }: PostViewerProps) {
	const router = useRouter();
	const [editMode, setEditMode] = useState(false);

	const categoryName =
		categories.find((c) => c.id === post.categoryId)?.name ?? "—";

	if (editMode) {
		return (
			<div className="w-full">
				{/* Back / header row */}
				<div className="flex items-center gap-3 mb-6">
					<button
						type="button"
						onClick={() => setEditMode(false)}
						className="flex items-center gap-1.5 text-sm font-semibold text-[#1a2e1a]/60 hover:text-[#1a2e1a] transition-colors"
						aria-label="Cancel edit"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to view
					</button>
				</div>
				<PostForm categories={categories} post={post} />
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* ── Header row: back + title + edit button ── */}
			<div className="flex items-center justify-between gap-4 mb-6">
				<div className="flex items-center gap-3 min-w-0">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex items-center gap-1.5 shrink-0 text-sm font-semibold text-[#1a2e1a]/60 hover:text-[#1a2e1a] transition-colors"
						aria-label="Go back"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back
					</button>
					<span className="text-[#1a2e1a]/20 select-none">|</span>
					<h1 className="text-xl font-bold text-[#1a2e1a] truncate">
						{post.title}
					</h1>
				</div>

				<button
					type="button"
					onClick={() => setEditMode(true)}
					className="shrink-0 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white bg-[#1a2e1a] hover:bg-[#253e25] transition-colors"
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
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Edit Post
				</button>
			</div>

			{/* ── View card ── */}
			<div className="rounded-xl border border-[#1a2e1a]/20 bg-[#f0f3ef] p-6 space-y-6">
				{/* Status badge */}
				<div className="flex items-center gap-3">
					<span
						className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(post.status)}`}
					>
						{statusLabel(post.status)}
					</span>
					<span className="text-xs text-[#7a9a7a]">
						Created{" "}
						{new Date(post.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</div>

				{/* Title + Slug */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<p className={labelCls}>Title</p>
						<p className="text-sm font-semibold text-[#1a2e1a]">{post.title}</p>
					</div>
					<div>
						<p className={labelCls}>Slug</p>
						<p className="text-sm text-[#1a2e1a] font-mono bg-white border border-[#1a2e1a]/15 rounded-lg px-3 py-2">
							{post.slug}
						</p>
					</div>
				</div>

				{/* Cover image */}
				{post.coverImage && (
					<div>
						<p className={labelCls}>Cover Photo</p>
						{/* biome-ignore lint/performance/noImgElement: plain img is fine here */}
						<img
							src={post.coverImage}
							alt="Cover"
							className="h-48 w-full object-cover rounded-lg border border-[#1a2e1a]/10"
						/>
					</div>
				)}

				{/* Category */}
				<div>
					<p className={labelCls}>Category</p>
					<p className="text-sm text-[#1a2e1a]">{categoryName}</p>
				</div>

				{/* Content */}
				<div>
					<p className={labelCls}>Content</p>
					<div className="rounded-lg border border-[#1a2e1a]/15 bg-white px-4 py-3 text-sm text-[#1a2e1a] whitespace-pre-wrap leading-relaxed min-h-32">
						{post.body}
					</div>
				</div>
			</div>
		</div>
	);
}
