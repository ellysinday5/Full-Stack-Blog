"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addComment } from "./actions";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white
			           transition-colors hover:bg-green-600 disabled:opacity-50"
		>
			{pending ? "Posting…" : "Post Comment"}
		</button>
	);
}

const inputClasses =
	"w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white " +
	"placeholder-white/25 focus:border-green-500/50 focus:outline-none focus:ring-1 focus:ring-green-500/30 transition-colors";

const labelClasses =
	"mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40";

export function CommentForm({
	postId,
	slug,
}: {
	postId: string;
	slug: string;
}) {
	const [state, formAction] = useActionState(addComment, {});
	const formRef = useRef<HTMLFormElement>(null);

	const [savedInfo, setSavedInfo] = useState({
		name: "",
		email: "",
		website: "",
	});
	const [isAnonymous, setIsAnonymous] = useState(false);

	useEffect(() => {
		setSavedInfo({
			name: localStorage.getItem("comment_name") ?? "",
			email: localStorage.getItem("comment_email") ?? "",
			website: localStorage.getItem("comment_website") ?? "",
		});
	}, []);

	useEffect(() => {
		if (state.success) {
			const saveCheckbox = formRef.current?.querySelector(
				'input[name="saveInfo"]',
			) as HTMLInputElement;
			if (saveCheckbox?.checked && formRef.current) {
				const fd = new FormData(formRef.current);
				localStorage.setItem("comment_name", fd.get("authorName") as string);
				localStorage.setItem("comment_email", fd.get("email") as string);
				localStorage.setItem("comment_website", fd.get("website") as string);
			} else {
				localStorage.removeItem("comment_name");
				localStorage.removeItem("comment_email");
				localStorage.removeItem("comment_website");
			}
			formRef.current?.reset();
		}
	}, [state.success]);

	return (
		<div className="mt-12">
			{/* Header row */}
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xl font-bold text-white">Leave a Reply</h3>

				{/* Anonymous toggle */}
				<label className="inline-flex items-center cursor-pointer gap-3">
					<span className="text-sm font-medium text-white/50">Anonymous</span>
					<div className="relative">
						<input
							type="checkbox"
							name="isAnonymous"
							className="sr-only peer"
							checked={isAnonymous}
							onChange={(e) => setIsAnonymous(e.target.checked)}
						/>
						<div
							className="w-11 h-6 bg-white/10 rounded-full peer
						                peer-checked:bg-green-700
						                after:content-[''] after:absolute after:top-0.5 after:left-0.5
						                after:bg-white after:border after:border-white/30 after:rounded-full
						                after:h-5 after:w-5 after:transition-all
						                peer-checked:after:translate-x-full"
						/>
					</div>
				</label>
			</div>

			<p className="text-sm text-white/35 mb-6">
				Your email address will not be published. Required fields are marked{" "}
				<span className="text-red-400">*</span>
			</p>

			<form ref={formRef} action={formAction} className="space-y-6">
				<input type="hidden" name="postId" value={postId} />
				<input type="hidden" name="slug" value={slug} />

				{!isAnonymous && (
					<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
						<div>
							<label htmlFor="authorName" className={labelClasses}>
								Name <span className="text-red-400">*</span>
							</label>
							<input
								id="authorName"
								name="authorName"
								type="text"
								defaultValue={savedInfo.name}
								className={inputClasses}
								placeholder="Your name"
								required
							/>
							{state.errors?.authorName && (
								<p className="mt-1 text-xs text-red-400">
									{state.errors.authorName}
								</p>
							)}
						</div>

						<div>
							<label htmlFor="email" className={labelClasses}>
								Email <span className="text-red-400">*</span>
							</label>
							<input
								id="email"
								name="email"
								type="email"
								defaultValue={savedInfo.email}
								className={inputClasses}
								placeholder="you@example.com"
								required
							/>
							{state.errors?.email && (
								<p className="mt-1 text-xs text-red-400">
									{state.errors.email}
								</p>
							)}
						</div>

						<div>
							<label htmlFor="website" className={labelClasses}>
								Website
							</label>
							<input
								id="website"
								name="website"
								type="url"
								defaultValue={savedInfo.website}
								className={inputClasses}
								placeholder="https://yoursite.com"
							/>
							{state.errors?.website && (
								<p className="mt-1 text-xs text-red-400">
									{state.errors.website}
								</p>
							)}
						</div>
					</div>
				)}

				{isAnonymous && (
					<>
						<input type="hidden" name="authorName" value="Anonymous" />
						<input type="hidden" name="email" value="anonymous@example.com" />
					</>
				)}

				<div>
					<label htmlFor="body" className={labelClasses}>
						Comment <span className="text-red-400">*</span>
					</label>
					<textarea
						id="body"
						name="body"
						rows={6}
						className={`${inputClasses} resize-y`}
						placeholder="Share your thoughts…"
						required
					/>
					{state.errors?.body && (
						<p className="mt-1 text-xs text-red-400">{state.errors.body}</p>
					)}
				</div>

				<div className="flex items-center gap-2.5">
					<input
						id="saveInfo"
						name="saveInfo"
						type="checkbox"
						defaultChecked={
							!!(savedInfo.name || savedInfo.email || savedInfo.website)
						}
						className="w-4 h-4 rounded border-white/20 bg-white/5 accent-green-600"
					/>
					<label htmlFor="saveInfo" className="text-sm text-white/40">
						Save my name, email and website for next time.
					</label>
				</div>

				{state.success && (
					<p className="text-sm text-green-400 font-medium">
						✓ Comment posted — it will appear once approved.
					</p>
				)}

				<SubmitButton />
			</form>
		</div>
	);
}
