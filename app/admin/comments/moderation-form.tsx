"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { moderateComment, type ModerationState } from "../moderation-actions";

function ActionButton({
	approved,
	label,
}: {
	approved: boolean;
	label: string;
}) {
	const { pending } = useFormStatus();
	return (
		<>
			<input type="hidden" name="approved" value={String(approved)} />
			<button
				type="submit"
				disabled={pending}
				className={`rounded px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
					approved
						? "bg-green-600 text-white hover:bg-green-700"
						: "bg-red-600 text-white hover:bg-red-700"
				}`}
			>
				{pending ? "…" : label}
			</button>
		</>
	);
}

export function ModerationForm({
	commentId,
	slug,
	approved,
	password,
}: {
	commentId: string;
	slug: string;
	approved: boolean;
	password: string;
}) {
	const [state, formAction] = useActionState<ModerationState, FormData>(
		moderateComment,
		{},
	);

	return (
		<form action={formAction} className="inline-flex items-center gap-2">
			<input type="hidden" name="commentId" value={commentId} />
			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="password" value={password} />
			{approved ? (
				<ActionButton approved={false} label="Reject" />
			) : (
				<ActionButton approved={true} label="Approve" />
			)}
			{state.error && (
				<span className="text-xs text-red-500">{state.error}</span>
			)}
		</form>
	);
}
