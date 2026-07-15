"use client";

import { Paperclip, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { type CreatePostState, createPost } from "./actions";

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

// ── Submit buttons ────────────────────────────────────────────────────────────
function PublishButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			name="status"
			value="published"
			disabled={pending}
			className="rounded-lg px-6 py-2.5 text-sm font-bold text-white
			           bg-[#1a2e1a] border border-[#1a2e1a] hover:bg-[#253e25]
			           disabled:opacity-50 transition-colors"
		>
			{pending ? "Saving…" : "Publish Post"}
		</button>
	);
}

function DraftButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			name="status"
			value="draft"
			disabled={pending}
			className="rounded-lg border-2 border-[#1a2e1a] px-6 py-2.5 text-sm font-bold
			           text-[#1a2e1a] hover:bg-[#1a2e1a]/10 disabled:opacity-50 transition-colors"
		>
			{pending ? "Saving…" : "Save as Draft"}
		</button>
	);
}

// ── File picker display ───────────────────────────────────────────────────────
function FilePicker({
	id,
	name,
	label,
	required,
	error,
}: {
	id: string;
	name: string;
	label: string;
	required?: boolean;
	error?: string;
}) {
	const [fileName, setFileName] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

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
			{/* biome-ignore lint/a11y/noLabelWithoutControl: label wraps a visually hidden input */}
			<label
				htmlFor={id}
				className={`flex items-center justify-between rounded-lg border bg-white px-4 py-2.5 cursor-pointer transition-colors ${
					error
						? "border-red-400 hover:border-red-500"
						: "border-[#1a2e1a]/30 hover:border-[#1a2e1a]"
				}`}
			>
				<span
					className={`text-sm truncate ${fileName ? "text-[#1a2e1a]" : "text-[#9ab09a]"}`}
				>
					{fileName ?? "Attach a file here…"}
				</span>
				<Paperclip
					size={16}
					className="shrink-0 text-[#7a9a7a] ml-2"
					aria-hidden="true"
				/>
			</label>
			<input
				ref={inputRef}
				id={id}
				name={name}
				type="file"
				accept="image/*"
				className="sr-only"
				onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
			/>
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
	onClose?: () => void;
}

export function PostForm({ categories, onClose }: PostFormProps) {
	const [state, formAction] = useActionState(createPost, initialState);

	// Client-side touched state for real-time validation feedback
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [values, setValues] = useState({
		title: "",
		slug: "",
		body: "",
		tags: "",
	});

	function touch(field: string) {
		setTouched((t) => ({ ...t, [field]: true }));
	}

	function handleChange(field: keyof typeof values, val: string) {
		setValues((v) => ({ ...v, [field]: val }));
	}

	// Derive slug from title automatically if slug is empty
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

	// Server errors take precedence when they exist
	const titleErr = state.errors?.title ?? clientErrors.title;
	const slugErr = state.errors?.slug ?? clientErrors.slug;
	const bodyErr = state.errors?.body ?? clientErrors.body;

	return (
		<div className="rounded-xl border border-[#1a2e1a]/20 bg-[#f0f3ef] p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold text-[#1a2e1a]">Write a post</h2>
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						className="flex items-center justify-center w-8 h-8 rounded-lg
						           text-[#1a2e1a]/50 hover:bg-[#1a2e1a]/10 hover:text-[#1a2e1a] transition-colors"
						aria-label="Close form"
					>
						<X size={18} />
					</button>
				)}
			</div>

			<form action={formAction} noValidate className="space-y-5">
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

				{/* Cover Photo + Content Photo */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<FilePicker
						id="cover-photo"
						name="coverPhoto"
						label="Cover Photo"
						required
					/>
					<FilePicker
						id="content-photo"
						name="contentPhoto"
						label="Content Photo"
					/>
				</div>

				{/* Category */}
				{categories.length > 0 && (
					<div>
						<label htmlFor="post-category" className={labelCls}>
							Category
						</label>
						<select
							id="post-category"
							name="categoryId"
							className={`${inputCls} cursor-pointer`}
						>
							<option value="">— No category —</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</div>
				)}

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

				{/* Tags */}
				<div>
					<label htmlFor="post-tags" className={labelCls}>
						Tags
					</label>
					<input
						id="post-tags"
						name="tags"
						type="text"
						value={values.tags}
						onChange={(e) => handleChange("tags", e.target.value)}
						className={state.errors?.tags ? inputErrCls : inputCls}
						placeholder="Plants, Botany, Forest"
						aria-describedby="tags-hint"
					/>
					{!state.errors?.tags && (
						<p id="tags-hint" className={hintCls}>
							Comma-separated. Used for filtering on the blog page.
						</p>
					)}
					{state.errors?.tags && <FieldError msg={state.errors.tags} />}
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3 pt-2">
					<DraftButton />
					<PublishButton />
				</div>
			</form>
		</div>
	);
}
