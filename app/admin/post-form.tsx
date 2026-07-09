"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost, type CreatePostState } from "./actions";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-blue-700 disabled:opacity-50"
		>
			{pending ? "Publishing…" : "Publish Post"}
		</button>
	);
}

const inputClasses =
	"w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

const initialState: CreatePostState = {};

export function PostForm() {
	const [state, formAction] = useActionState(createPost, initialState);

	return (
		<form action={formAction} className="space-y-6">
			{/* Title */}
			<div>
				<label
					htmlFor="title"
					className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Title <span className="text-red-500">*</span>
				</label>
				<input
					id="title"
					name="title"
					type="text"
					className={inputClasses}
					placeholder="My awesome blog post"
					required
				/>
				{state.errors?.title && (
					<p className="mt-1 text-xs text-red-500">{state.errors.title}</p>
				)}
			</div>

			{/* Slug */}
			<div>
				<label
					htmlFor="slug"
					className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Slug <span className="text-red-500">*</span>
				</label>
				<input
					id="slug"
					name="slug"
					type="text"
					className={inputClasses}
					placeholder="my-awesome-blog-post"
					required
				/>
				<p className="mt-1 text-xs text-slate-400">
					Lowercase letters, numbers, and hyphens only. Used in the URL:
					/blog/your-slug
				</p>
				{state.errors?.slug && (
					<p className="mt-1 text-xs text-red-500">{state.errors.slug}</p>
				)}
			</div>

			{/* Body */}
			<div>
				<label
					htmlFor="body"
					className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Body <span className="text-red-500">*</span>
				</label>
				<textarea
					id="body"
					name="body"
					rows={12}
					className={`${inputClasses} resize-y`}
					placeholder="Write your post content here…"
					required
				/>
				{state.errors?.body && (
					<p className="mt-1 text-xs text-red-500">{state.errors.body}</p>
				)}
			</div>

			{/* Tags */}
			<div>
				<label
					htmlFor="tags"
					className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Tags
				</label>
				<input
					id="tags"
					name="tags"
					type="text"
					className={inputClasses}
					placeholder="tech, nextjs, drizzle"
				/>
				<p className="mt-1 text-xs text-slate-400">
					Comma-separated. Used for filtering on the blog page.
				</p>
				{state.errors?.tags && (
					<p className="mt-1 text-xs text-red-500">{state.errors.tags}</p>
				)}
			</div>

			{/* Admin Password */}
			<div>
				<label
					htmlFor="password"
					className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
				>
					Admin Password <span className="text-red-500">*</span>
				</label>
				<input
					id="password"
					name="password"
					type="password"
					className={inputClasses}
					placeholder="Enter admin password"
					required
				/>
				{state.errors?.password && (
					<p className="mt-1 text-xs text-red-500">{state.errors.password}</p>
				)}
			</div>

			<SubmitButton />
		</form>
	);
}
