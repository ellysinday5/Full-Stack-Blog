"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addComment } from "./actions";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="rounded-md bg-[--color-moss] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
		>
			{pending ? "Posting…" : "Post comment"}
		</button>
	);
}

export function CommentForm({
	postId,
	slug,
}: {
	postId: string;
	slug: string;
}) {
	const [state, formAction] = useActionState(addComment, {});
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success) {
			formRef.current?.reset();
		}
	}, [state.success]);

	return (
		<form ref={formRef} action={formAction} className="mt-8 space-y-4">
			<input type="hidden" name="postId" value={postId} />
			<input type="hidden" name="slug" value={slug} />

			<div>
				<label
					htmlFor="authorName"
					className="block text-sm font-medium text-[--color-ink]"
				>
					Name
				</label>
				<input
					id="authorName"
					name="authorName"
					type="text"
					className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
					placeholder="Your name"
				/>
				{state.errors?.authorName && (
					<p className="mt-1 text-sm text-red-600">{state.errors.authorName}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="body"
					className="block text-sm font-medium text-[--color-ink]"
				>
					Comment
				</label>
				<textarea
					id="body"
					name="body"
					rows={4}
					className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
					placeholder="Share your thoughts…"
				/>
				{state.errors?.body && (
					<p className="mt-1 text-sm text-red-600">{state.errors.body}</p>
				)}
			</div>

			{state.success && (
				<p className="text-sm text-[--color-moss]">Comment posted!</p>
			)}

			<SubmitButton />
		</form>
	);
}
