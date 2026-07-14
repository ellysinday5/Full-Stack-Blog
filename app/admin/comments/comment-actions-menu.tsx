"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ConfirmModal, Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/Toast";
import { deleteComment, moderateComment } from "../moderation-actions";

interface Props {
	commentId: string;
	postSlug: string;
	postTitle: string;
	commentBody: string;
	authorName: string;
	approved: boolean;
}

export function CommentActionsMenu({
	commentId,
	postSlug,
	postTitle,
	commentBody,
	authorName,
	approved,
}: Props) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [menuOpen, setMenuOpen] = useState(false);
	const [viewOpen, setViewOpen] = useState(false);
	const [confirmPostOpen, setConfirmPostOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setMenuOpen(false);
		}
		if (menuOpen) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [menuOpen]);

	function handlePost() {
		startTransition(async () => {
			const fd = new FormData();
			fd.set("commentId", commentId);
			fd.set("slug", postSlug);
			fd.set("approved", "true");
			const result = await moderateComment({}, fd);
			setConfirmPostOpen(false);
			setViewOpen(false);
			setMenuOpen(false);
			if (result.error) {
				toast({
					variant: "error",
					title: "Failed to post comment",
					message: result.error,
				});
			} else {
				toast({
					variant: "success",
					title: "Comment posted",
					message: "The comment is now visible on the blog.",
				});
			}
		});
	}

	function handleDelete() {
		startTransition(async () => {
			const fd = new FormData();
			fd.set("commentId", commentId);
			fd.set("slug", postSlug);
			const result = await deleteComment({}, fd);
			setConfirmDeleteOpen(false);
			setViewOpen(false);
			setMenuOpen(false);
			if (result.error) {
				toast({
					variant: "error",
					title: "Failed to delete comment",
					message: result.error,
				});
			} else {
				toast({
					variant: "success",
					title: "Comment deleted",
					message: "The comment has been permanently removed.",
				});
			}
		});
	}

	return (
		<>
			{/* ••• trigger */}
			<div className="relative inline-block" ref={menuRef}>
				<button
					type="button"
					onClick={() => setMenuOpen((v) => !v)}
					className="flex items-center justify-center w-8 h-8 rounded border border-[#1a2e1a]/30 text-[#1a2e1a] hover:bg-[#e8ede8] transition-colors"
					aria-label="Comment actions"
					aria-expanded={menuOpen}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="currentColor"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<circle cx="4" cy="10" r="1.5" />
						<circle cx="10" cy="10" r="1.5" />
						<circle cx="16" cy="10" r="1.5" />
					</svg>
				</button>

				{menuOpen && (
					<div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl border border-[#c4d4c4] bg-white shadow-lg overflow-hidden">
						{/* View */}
						<button
							type="button"
							onClick={() => {
								setViewOpen(true);
								setMenuOpen(false);
							}}
							className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#1a2e1a] hover:bg-[#f4f8f4] transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 text-[#3a3a3a]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							View
						</button>

						<div className="border-t border-[#e8ede8]" />

						{/* Post (only when pending) */}
						{!approved && (
							<>
								<button
									type="button"
									onClick={() => {
										setConfirmPostOpen(true);
										setMenuOpen(false);
									}}
									className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
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
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Post
								</button>
								<div className="border-t border-[#e8ede8]" />
							</>
						)}

						{/* Delete */}
						<button
							type="button"
							onClick={() => {
								setConfirmDeleteOpen(true);
								setMenuOpen(false);
							}}
							className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							Delete
						</button>
					</div>
				)}
			</div>

			{/* ── View / Review modal ── */}
			<Modal
				open={viewOpen}
				onClose={() => setViewOpen(false)}
				title="Review Comment"
			>
				<div className="px-6 py-5 space-y-4">
					<div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#7a9a7a]">
						<span>
							<span className="font-semibold text-[#1a2e1a]">Author:</span>{" "}
							{authorName}
						</span>
						<span>
							<span className="font-semibold text-[#1a2e1a]">Post:</span>{" "}
							{postTitle}
						</span>
					</div>
					<div className="rounded-lg border border-[#c4d4c4] bg-[#f4f8f4] p-4">
						<p className="text-sm text-[#3a3a3a] leading-relaxed whitespace-pre-wrap">
							{commentBody}
						</p>
					</div>
					<p className="text-xs text-[#7a9a7a] leading-relaxed">
						Review this comment against community guidelines before deciding to
						post or remove it.
					</p>
				</div>

				<div className="flex items-center justify-between gap-3 px-6 pb-6">
					{/* Delete from modal */}
					<button
						type="button"
						onClick={() => {
							setViewOpen(false);
							setConfirmDeleteOpen(true);
						}}
						className="flex items-center gap-1.5 rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
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
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Delete
					</button>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setViewOpen(false)}
							className="rounded-lg border border-[#1a2e1a]/30 bg-white px-4 py-2 text-sm font-semibold text-[#1a2e1a] hover:bg-[#f4f8f4] transition-colors"
						>
							Cancel
						</button>

						{approved ? (
							<span className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
								Already Posted
							</span>
						) : (
							<button
								type="button"
								onClick={() => {
									setViewOpen(false);
									setConfirmPostOpen(true);
								}}
								className="rounded-lg border border-[#1a2e1a] bg-[#1a2e1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#253e25] transition-colors"
							>
								Post Comment
							</button>
						)}
					</div>
				</div>
			</Modal>

			{/* ── Confirm: Post comment ── */}
			<ConfirmModal
				open={confirmPostOpen}
				onClose={() => setConfirmPostOpen(false)}
				onConfirm={handlePost}
				title="Post this comment?"
				message={`This will make the comment by "${authorName}" visible on the blog post.`}
				confirmLabel="Post Comment"
				variant="success"
				loading={isPending}
			/>

			{/* ── Confirm: Delete comment ── */}
			<ConfirmModal
				open={confirmDeleteOpen}
				onClose={() => setConfirmDeleteOpen(false)}
				onConfirm={handleDelete}
				title="Delete comment?"
				message={`This will permanently remove the comment by "${authorName}". This action cannot be undone.`}
				confirmLabel="Delete"
				variant="danger"
				loading={isPending}
			/>
		</>
	);
}
