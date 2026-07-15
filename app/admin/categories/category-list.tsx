"use client";

import { useActionState, useRef, useState } from "react";
import { ConfirmModal } from "@/components/Modal";
import { deleteCategory } from "../actions";

type CategoryRow = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	postCount: number;
	createdAt: string;
};

function TrashIcon() {
	return (
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
	);
}

function TagIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4 text-[#5a7a5a]"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
			/>
		</svg>
	);
}

function DeleteButton({ id }: { id: string }) {
	const [state, action, isPending] = useActionState(deleteCategory, {});
	const [confirmOpen, setConfirmOpen] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<>
			<form ref={formRef} action={action}>
				<input type="hidden" name="id" value={id} />
				<button
					type="button"
					title="Delete category"
					className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400
					           hover:bg-red-50 hover:text-red-600 transition-colors"
					onClick={() => setConfirmOpen(true)}
				>
					<TrashIcon />
				</button>
				{state.error && (
					<p className="text-xs text-red-500 mt-1">{state.error}</p>
				)}
			</form>
			<ConfirmModal
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={() => {
					setConfirmOpen(false);
					formRef.current?.requestSubmit();
				}}
				title="Delete Category"
				message="Delete this category? Posts will be uncategorised."
				confirmLabel="Delete"
				loading={isPending}
			/>
		</>
	);
}

export function CategoryList({ categories }: { categories: CategoryRow[] }) {
	if (categories.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-[#c4d4c4] bg-[#f4f8f4] flex items-center justify-center py-16">
				<p className="text-sm text-[#7a9a7a]">
					No categories yet. Create your first one.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-[#c4d4c4] overflow-hidden bg-white">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-[#c4d4c4] bg-[#f4f8f4]">
						<th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#5a7a5a]">
							Name
						</th>
						<th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#5a7a5a] hidden sm:table-cell">
							Slug
						</th>
						<th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#5a7a5a] hidden md:table-cell">
							Description
						</th>
						<th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#5a7a5a]">
							Posts
						</th>
						<th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#5a7a5a]">
							Delete
						</th>
					</tr>
				</thead>
				<tbody>
					{categories.map((cat) => (
						<tr
							key={cat.id}
							className="border-b border-[#e8f0e8] hover:bg-[#f4f8f4] transition-colors last:border-0"
						>
							<td className="px-5 py-3.5 align-middle">
								<div className="flex items-center gap-2">
									<TagIcon />
									<span className="font-semibold text-[#1a2e1a]">
										{cat.name}
									</span>
								</div>
							</td>
							<td className="px-5 py-3.5 align-middle text-[#5a7a5a] font-mono text-xs hidden sm:table-cell">
								{cat.slug}
							</td>
							<td className="px-5 py-3.5 align-middle text-[#7a9a7a] hidden md:table-cell max-w-xs">
								<p className="truncate">{cat.description ?? "—"}</p>
							</td>
							<td className="px-5 py-3.5 align-middle text-center">
								<span className="inline-flex items-center justify-center rounded-full bg-[#e8f0e8] px-2.5 py-0.5 text-xs font-bold text-[#3a6b3a]">
									{cat.postCount}
								</span>
							</td>
							<td className="px-5 py-3.5 align-middle flex justify-center">
								<DeleteButton id={cat.id} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
