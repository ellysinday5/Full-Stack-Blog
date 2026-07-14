"use client";

import { useActionState, useEffect, useRef } from "react";
import { type CategoryState, createCategory } from "../actions";

function PlusIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2.5}
			aria-hidden="true"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
		</svg>
	);
}

const fieldCls =
	"w-full rounded-lg border border-[#b8ccb8] bg-white px-4 py-2.5 text-sm text-[#1a2e1a] " +
	"placeholder-[#7a9a7a] focus:border-[#3a6b3a] focus:ring-2 focus:ring-[#3a6b3a]/15 focus:outline-none transition-colors";

const fieldErrCls =
	"w-full rounded-lg border border-red-400 bg-white px-4 py-2.5 text-sm text-[#1a2e1a] " +
	"placeholder-[#7a9a7a] focus:border-red-500 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-colors";

const labelCls = "block text-sm font-bold text-[#1a2e1a] mb-1.5";
const errCls = "mt-1.5 text-sm font-semibold text-red-600";

const initial: CategoryState = {};

export function CategoryForm() {
	const [state, action] = useActionState<CategoryState, FormData>(
		createCategory,
		initial,
	);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success) {
			formRef.current?.reset();
		}
	}, [state.success]);

	return (
		<div className="rounded-xl border border-[#c4d4c4] bg-white p-6">
			<h2 className="text-base font-bold text-[#1a2e1a] mb-4">Add Category</h2>

			<form action={action} ref={formRef} className="space-y-4">
				{/* Name */}
				<div>
					<label htmlFor="cat-name" className={labelCls}>
						Name <span className="text-red-600">*</span>
					</label>
					<input
						id="cat-name"
						name="name"
						type="text"
						className={state.errors?.name ? fieldErrCls : fieldCls}
						placeholder="e.g. Botany"
					/>
					{state.errors?.name && <p className={errCls}>{state.errors.name}</p>}
				</div>

				{/* Slug */}
				<div>
					<label htmlFor="cat-slug" className={labelCls}>
						Slug <span className="text-red-600">*</span>
					</label>
					<input
						id="cat-slug"
						name="slug"
						type="text"
						className={state.errors?.slug ? fieldErrCls : fieldCls}
						placeholder="e.g. botany"
					/>
					<p className="mt-1.5 text-xs text-[#5a7a5a]">
						Lowercase, hyphens only.
					</p>
					{state.errors?.slug && <p className={errCls}>{state.errors.slug}</p>}
				</div>

				{/* Description */}
				<div>
					<label htmlFor="cat-desc" className={labelCls}>
						Description
					</label>
					<textarea
						id="cat-desc"
						name="description"
						rows={3}
						className={`${fieldCls} resize-none`}
						placeholder="Optional short description…"
					/>
				</div>

				{state.success && (
					<p className="text-sm font-semibold text-green-700">
						Category created successfully!
					</p>
				)}

				<button
					type="submit"
					className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold
					           text-white bg-[#3a6b3a] hover:bg-[#2d552d] transition-colors active:scale-[0.98]"
				>
					<PlusIcon />
					Add Category
				</button>
			</form>
		</div>
	);
}
