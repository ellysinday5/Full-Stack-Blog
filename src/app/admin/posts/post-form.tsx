"use client";

import { Paperclip } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { type CreatePostState, createPost, updatePost } from "../actions";

type Category = { id: string; name: string };

// ── Shared field styles ───────────────────────────────────────────────────────
const inputBase =
	"w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1a2e1a] " +
	"placeholder-[#9ab09a] focus:outline-none focus:ring-2 transition-colors";
const inputCls = `${inputBase} border-[#1a2e1a]/30 focus:border-[#1a2e1a] focus:ring-[#1a2e1a]/15`;
const inputErrCls = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-400/20`;

const labelCls =
	"block text-xs font-bold uppercase tracking-widest text-[#1a2e1a] mb-1.5";
const errCls =
	"mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1";
const hintCls = "mt-1 text-xs text-[#7a9a7a]";

const initialState: CreatePostState = {};

// ── Confirmation modal ────────────────────────────────────────────────────────
function ConfirmModal({
	open,
	action,
	onCancel,
	onConfirm,
}: {
	open: boolean;
	action: "draft" | "published" | null;
	onCancel: () => void;
	onConfirm: () => void;
}) {
	if (!open || !action) return null;

	const isDraft = action === "draft";
	const title = isDraft ? "Save as Draft?" : "Publish Post?";
	const message = isDraft
		? "This post will be saved as a draft and won't be visible to readers."
		: "This post will be published and visible to all readers immediately.";
	const confirmLabel = isDraft ? "Save as Draft" : "Publish Post";

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-80 bg-black/60 backdrop-blur-sm cursor-default w-full h-full"
				onClick={onCancel}
				aria-label="Close dialog"
			/>
			{/* Dialog */}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				className="fixed inset-0 z-90 flex items-center justify-center p-4 pointer-events-none"
			>
				<div
					className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 p-7 shadow-2xl"
					style={{
						background: "linear-gradient(135deg, #0f2d1e 0%, #0a1f15 100%)",
						boxShadow:
							"0 0 60px rgba(22,163,74,0.10), 0 25px 50px rgba(0,0,0,0.7)",
					}}
				>
					{/* Icon */}
					<div
						className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
							isDraft
								? "border border-yellow-500/20 bg-yellow-500/10"
								: "border border-green-500/20 bg-green-500/10"
						}`}
					>
						{isDraft ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-yellow-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.8}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-green-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.8}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
					</div>

					<h2
						id="confirm-dialog-title"
						className="mb-1.5 text-center text-lg font-bold text-white"
					>
						{title}
					</h2>
					<p className="mb-6 text-center text-sm text-white/50">{message}</p>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={onCancel}
							className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/8 hover:text-white"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors ${
								isDraft
									? "bg-yellow-600 hover:bg-yellow-700"
									: "bg-[#1a2e1a] hover:bg-[#253e25]"
							}`}
						>
							{confirmLabel}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

// ── File picker — supports showing an existing image + remove/replace ─────────
function FilePicker({
	id,
	name,
	label,
	required,
	error,
	existingUrl,
}: {
	id: string;
	name: string;
	label: string;
	required?: boolean;
	error?: string;
	existingUrl?: string | null;
}) {
	const [newFile, setNewFile] = useState<File | null>(null);
	const [cleared, setCleared] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const showExisting = existingUrl && !cleared && !newFile;

	return (
		<div>
			<label htmlFor={id} className={labelCls}>
				{label}{" "}
				{required ? (
					<span className="text-red-500">*</span>
				) : (
					<span className="font-normal normal-case tracking-normal text-xs text-[#7a9a7a]">
						(Optional)
					</span>
				)}
			</label>

			{/* Existing image preview with X to remove */}
			{showExisting && (
				<div className="relative rounded-lg overflow-hidden border border-[#1a2e1a]/20 h-28">
					{/* biome-ignore lint/performance/noImgElement: cover photo preview */}
					<img
						src={existingUrl}
						alt="Current cover"
						className="w-full h-full object-cover"
					/>
					{/* X button overlay */}
					<button
						type="button"
						onClick={() => {
							setCleared(true);
							if (inputRef.current) inputRef.current.value = "";
						}}
						className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
						aria-label="Remove cover photo"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			)}

			{/* File input — shown when no existing image or after clearing */}
			{!showExisting && (
				<label
					htmlFor={id}
					className={`flex items-center justify-between rounded-lg border bg-white px-4 py-2.5 cursor-pointer transition-colors ${
						error
							? "border-red-400 hover:border-red-500"
							: "border-[#1a2e1a]/30 hover:border-[#1a2e1a]"
					}`}
				>
					<span className={`text-sm truncate ${newFile ? "text-[#1a2e1a]" : "text-[#9ab09a]"}`}>
						{newFile ? newFile.name : cleared ? "Choose a new photo…" : "Attach a file here…"}
					</span>
					<Paperclip size={16} className="shrink-0 text-[#7a9a7a] ml-2" aria-hidden="true" />
				</label>
			)}

			<input
				ref={inputRef}
				id={id}
				name={name}
				type="file"
				accept="image/*"
				className="sr-only"
				onChange={(e) => {
					const file = e.target.files?.[0] ?? null;
					setNewFile(file);
					if (file) setCleared(false);
				}}
			/>

			{cleared && !newFile && (
				<input type="hidden" name="clearCoverPhoto" value="true" />
			)}

			{error && (
				<p className={errCls}>
					<span aria-hidden="true">⚠</span> {error}
				</p>
			)}
		</div>
	);
}

// ── Validation error pill ─────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
	if (!msg) return null;
	return (
		<p className={errCls}>
			<span aria-hidden="true">⚠</span> {msg}
		</p>
	);
}

// ── Main form ─────────────────────────────────────────────────────────────────
interface PostFormProps {
	categories: Category[];
	post?: {
		id: string;
		title: string;
		slug: string;
		body: string;
		tags: string[];
		categoryId: string | null;
		status: string;
		coverImage?: string | null;
	};
}

export function PostForm({ categories, post }: PostFormProps) {
	const [state, formAction] = useActionState(
		post ? updatePost : createPost,
		initialState,
	);

	// Confirmation modal state — stores which action is pending confirmation
	const [pendingAction, setPendingAction] = useState<
		"draft" | "published" | null
	>(null);

	// Hidden submit buttons — one per status value, triggered programmatically
	const draftBtnRef = useRef<HTMLButtonElement>(null);
	const publishBtnRef = useRef<HTMLButtonElement>(null);

	// Client-side touched state for real-time validation feedback
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [values, setValues] = useState({
		title: post?.title || "",
		slug: post?.slug || "",
		body: post?.body || "",
		categoryId: post?.categoryId || "",
	});

	function touch(field: string) {
		setTouched((t) => ({ ...t, [field]: true }));
	}

	function handleChange(field: keyof typeof values, val: string) {
		setValues((v) => ({ ...v, [field]: val }));
	}

	// Derive slug from title automatically if slug hasn't been manually touched
	function handleTitleChange(val: string) {
		handleChange("title", val);
		if (!touched.slug) {
			const auto = val
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.trim()
				.replace(/\s+/g, "-");
			handleChange("slug", auto);
		}
	}

	// Client-side errors (only shown after blur)
	const clientErrors: Record<string, string> = {};
	if (touched.title && !values.title.trim())
		clientErrors.title = "Title is required.";
	if (touched.slug) {
		if (!values.slug.trim()) clientErrors.slug = "Slug is required.";
		else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug))
			clientErrors.slug = "Lowercase letters, numbers, and hyphens only.";
	}
	if (touched.body && !values.body.trim())
		clientErrors.body = "Content is required.";
	if (touched.categoryId && !values.categoryId)
		clientErrors.categoryId = "Category is required.";

	// Server errors take precedence when they exist
	const titleErr = state.errors?.title ?? clientErrors.title;
	const slugErr = state.errors?.slug ?? clientErrors.slug;
	const bodyErr = state.errors?.body ?? clientErrors.body;
	const categoryErr = state.errors?.categoryId ?? clientErrors.categoryId;

	// Touch all required fields and open modal only if valid
	function handleActionClick(action: "draft" | "published") {
		setTouched({ title: true, slug: true, body: true, categoryId: true });
		if (
			!values.title.trim() ||
			!values.slug.trim() ||
			!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug) ||
			!values.body.trim() ||
			!values.categoryId
		)
			return;
		setPendingAction(action);
	}

	// Confirmed — click the appropriate hidden submit button
	function handleConfirm() {
		if (!pendingAction) return;
		setPendingAction(null);
		if (pendingAction === "draft") {
			draftBtnRef.current?.click();
		} else {
			publishBtnRef.current?.click();
		}
	}

	return (
		<>
			<ConfirmModal
				open={pendingAction !== null}
				action={pendingAction}
				onCancel={() => setPendingAction(null)}
				onConfirm={handleConfirm}
			/>

			<div className="rounded-xl border border-[#1a2e1a]/20 bg-[#f0f3ef] p-6">
				{/* Header */}
				<div className="mb-6">
					<h2 className="text-xl font-bold text-[#1a2e1a]">
						{post ? "Edit post" : "Write a post"}
					</h2>
				</div>

				<form action={formAction} noValidate className="space-y-5">
					{post && <input type="hidden" name="postId" value={post.id} />}

					{/* Hidden submit buttons — triggered programmatically after confirmation */}
					<button
						ref={draftBtnRef}
						type="submit"
						name="status"
						value="draft"
						className="sr-only"
						aria-hidden="true"
						tabIndex={-1}
					/>
					<button
						ref={publishBtnRef}
						type="submit"
						name="status"
						value="published"
						className="sr-only"
						aria-hidden="true"
						tabIndex={-1}
					/>

					{/* Title + Slug */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label htmlFor="post-title" className={labelCls}>
								Title <span className="text-red-500">*</span>
							</label>
							<input
								id="post-title"
								name="title"
								type="text"
								required
								value={values.title}
								onChange={(e) => handleTitleChange(e.target.value)}
								onBlur={() => touch("title")}
								className={titleErr ? inputErrCls : inputCls}
								placeholder="My Awesome Post"
								aria-describedby={titleErr ? "title-err" : undefined}
							/>
							{titleErr && <FieldError msg={titleErr} />}
						</div>

						<div>
							<label htmlFor="post-slug" className={labelCls}>
								Slug <span className="text-red-500">*</span>
							</label>
							<input
								id="post-slug"
								name="slug"
								type="text"
								required
								value={values.slug}
								onChange={(e) => {
									handleChange("slug", e.target.value);
									touch("slug");
								}}
								onBlur={() => touch("slug")}
								className={slugErr ? inputErrCls : inputCls}
								placeholder="my-awesome-post"
								aria-describedby={slugErr ? "slug-err" : "slug-hint"}
							/>
							{!slugErr && (
								<p id="slug-hint" className={hintCls}>
									Lowercase letters, numbers, and hyphens only.
								</p>
							)}
							{slugErr && <FieldError msg={slugErr} />}
						</div>
					</div>

					{/* Cover Photo + Category — side by side */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
						<FilePicker
							id="cover-photo"
							name="coverPhoto"
							label="Cover Photo"
							required
							existingUrl={post?.coverImage}
						/>

						{/* Category — required */}
						<div>
							<label htmlFor="post-category" className={labelCls}>
								Category <span className="text-red-500">*</span>
							</label>
							<select
								id="post-category"
								name="categoryId"
								required
								value={values.categoryId}
								onChange={(e) => {
									handleChange("categoryId", e.target.value);
									touch("categoryId");
								}}
								onBlur={() => touch("categoryId")}
								className={`${categoryErr ? inputErrCls : inputCls} cursor-pointer`}
								aria-describedby={categoryErr ? "category-err" : undefined}
							>
								<option value="">— Select a category —</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
							{categoryErr && <FieldError msg={categoryErr} />}
						</div>
					</div>

					{/* Content */}
					<div>
						<label htmlFor="post-body" className={labelCls}>
							Content <span className="text-red-500">*</span>
						</label>
						<textarea
							id="post-body"
							name="body"
							rows={10}
							required
							value={values.body}
							onChange={(e) => handleChange("body", e.target.value)}
							onBlur={() => touch("body")}
							className={`${bodyErr ? inputErrCls : inputCls} resize-y`}
							placeholder="Write your post content here…"
							aria-describedby={bodyErr ? "body-err" : undefined}
						/>
						{bodyErr && <FieldError msg={bodyErr} />}
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={() => handleActionClick("draft")}
							className="rounded-lg border-2 border-[#1a2e1a] px-6 py-2.5 text-sm font-bold
							           text-[#1a2e1a] hover:bg-[#1a2e1a]/10 transition-colors"
						>
							Save as Draft
						</button>
						<button
							type="button"
							onClick={() => handleActionClick("published")}
							className="rounded-lg px-6 py-2.5 text-sm font-bold text-white
							           bg-[#1a2e1a] border border-[#1a2e1a] hover:bg-[#253e25]
							           transition-colors"
						>
							Publish Post
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
