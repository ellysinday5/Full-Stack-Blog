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
			className="rounded-lg bg-[#1f6f4d] px-8 py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-[#1f6f4d]/20
			           transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#175a3d] hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
		>
			{pending ? "Posting…" : "Post Comment"}
		</button>
	);
}

const inputClasses =
	"w-full rounded-lg border border-[#dcefe3] bg-white px-4 py-3 text-sm text-[#0f3d2e] shadow-sm " +
	"placeholder-[#8ca89a] focus:border-[#1f6f4d] focus:outline-none focus:ring-2 focus:ring-[#1f6f4d]/20 transition-all duration-300";

const labelClasses =
	"mb-2 block text-xs font-bold uppercase tracking-widest text-[#4c6f5e]";

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
		<div className="mt-16 rounded-2xl sm:rounded-3xl border border-[#dcefe3] bg-white p-5 sm:p-8 md:p-12 shadow-sm">
			{/* Header row */}
			<div className="flex flex-wrap items-center justify-between gap-4 mb-2">
				<h3 className="text-xl sm:text-2xl font-bold text-[#0f3d2e] font-serif">Leave a Reply</h3>

				{/* Anonymous toggle */}
				<label className="inline-flex items-center cursor-pointer gap-3 group">
					<span className="text-sm font-semibold text-[#4c6f5e] group-hover:text-[#0f3d2e] transition-colors">Anonymous</span>
					<div className="relative">
						<input
							type="checkbox"
							name="isAnonymous"
							className="sr-only peer"
							checked={isAnonymous}
							onChange={(e) => setIsAnonymous(e.target.checked)}
						/>
						<div
							className="w-12 h-6 bg-[#dcefe3] rounded-full peer transition-colors duration-300
						                peer-checked:bg-[#1f6f4d]
						                after:content-[''] after:absolute after:top-0.5 after:left-0.5
						                after:bg-white after:border after:border-[#dcefe3] after:rounded-full
						                after:h-5 after:w-5 after:transition-all after:shadow-sm
						                peer-checked:after:translate-x-6 peer-checked:after:border-white"
						/>
					</div>
				</label>
			</div>

			<p className="text-sm text-[#8ca89a] mb-8 font-medium">
				Your email address will not be published. Required fields are marked{" "}
				<span className="text-red-500">*</span>
			</p>

			<form ref={formRef} action={formAction} className="space-y-8">
				<input type="hidden" name="postId" value={postId} />
				<input type="hidden" name="slug" value={slug} />

				{!isAnonymous && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div>
							<label htmlFor="authorName" className={labelClasses}>
								Name <span className="text-red-500">*</span>
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
								<p className="mt-2 text-xs font-semibold text-red-500">
									{state.errors.authorName}
								</p>
							)}
						</div>

						<div>
							<label htmlFor="email" className={labelClasses}>
								Email <span className="text-red-500">*</span>
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
								<p className="mt-2 text-xs font-semibold text-red-500">
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
								<p className="mt-2 text-xs font-semibold text-red-500">
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
						Comment <span className="text-red-500">*</span>
					</label>
					<textarea
						id="body"
						name="body"
						rows={5}
						className={`${inputClasses} resize-y`}
						placeholder="Share your thoughts…"
						required
					/>
					{state.errors?.body && (
						<p className="mt-2 text-xs font-semibold text-red-500">{state.errors.body}</p>
					)}
				</div>

				<div className="flex items-center gap-3">
					<input
						id="saveInfo"
						name="saveInfo"
						type="checkbox"
						defaultChecked={
							!!(savedInfo.name || savedInfo.email || savedInfo.website)
						}
						className="h-4 w-4 rounded border-[#dcefe3] text-[#1f6f4d] focus:ring-[#1f6f4d]/20 transition-colors cursor-pointer"
					/>
					<label htmlFor="saveInfo" className="text-sm font-medium text-[#4c6f5e] cursor-pointer hover:text-[#0f3d2e] transition-colors">
						Save my name, email, and website for next time.
					</label>
				</div>

				{state.success && (
					<div className="rounded-lg bg-[#eef8f1] border border-[#dcefe3] p-4 flex items-center gap-3">
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1f6f4d] text-white">
							✓
						</div>
						<p className="text-sm text-[#0f3d2e] font-semibold">
							Comment posted — it will appear once approved.
						</p>
					</div>
				)}

				<div className="pt-2">
					<SubmitButton />
				</div>
			</form>
		</div>
	);
}
