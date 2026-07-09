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
			className="rounded-lg bg-[#3b82f6] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-blue-600 disabled:opacity-50"
		>
			{pending ? "Posting…" : "Post Comment"}
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

	const [savedInfo, setSavedInfo] = useState({
		name: "",
		email: "",
		website: "",
	});
	const [isAnonymous, setIsAnonymous] = useState(false);

	useEffect(() => {
		const storedName = localStorage.getItem("comment_name");
		const storedEmail = localStorage.getItem("comment_email");
		const storedWebsite = localStorage.getItem("comment_website");

		if (storedName || storedEmail || storedWebsite) {
			setSavedInfo({
				name: storedName || "",
				email: storedEmail || "",
				website: storedWebsite || "",
			});
		}
	}, []);

	useEffect(() => {
		if (state.success) {
			const saveCheckbox = formRef.current?.querySelector(
				'input[name="saveInfo"]',
			) as HTMLInputElement;

			if (saveCheckbox?.checked) {
				const formData = new FormData(formRef.current!);
				localStorage.setItem(
					"comment_name",
					formData.get("authorName") as string,
				);
				localStorage.setItem("comment_email", formData.get("email") as string);
				localStorage.setItem(
					"comment_website",
					formData.get("website") as string,
				);
			} else {
				localStorage.removeItem("comment_name");
				localStorage.removeItem("comment_email");
				localStorage.removeItem("comment_website");
			}

			formRef.current?.reset();
		}
	}, [state.success]);

	const inputClasses =
		"w-full rounded-lg border border-slate-300 dark:border-slate-500 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:light_dark]";

	return (
		<div className="mt-12 bg-transparent">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xl font-bold text-slate-900 dark:text-white">
					Leave a Reply
				</h3>

				<label className="inline-flex items-center cursor-pointer">
					<span className="mr-3 text-sm font-medium text-slate-600 dark:text-slate-300">
						Anonymous
					</span>
					<div className="relative">
						<input
							type="checkbox"
							name="isAnonymous"
							className="sr-only peer"
							checked={isAnonymous}
							onChange={(e) => setIsAnonymous(e.target.checked)}
						/>
						<div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
					</div>
				</label>
			</div>

			<p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
				Your email address will not be published. Required fields are marked{" "}
				<span className="text-red-500">*</span>
			</p>

			<form ref={formRef} action={formAction} className="space-y-6">
				<input type="hidden" name="postId" value={postId} />
				<input type="hidden" name="slug" value={slug} />

				{!isAnonymous && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div>
							<label
								htmlFor="authorName"
								className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Name <span className="text-red-500">*</span>
							</label>
							<input
								id="authorName"
								name="authorName"
								type="text"
								defaultValue={savedInfo.name}
								className={inputClasses}
								placeholder="Name"
								required
							/>
							{state.errors?.authorName && (
								<p className="mt-1 text-xs text-red-500">
									{state.errors.authorName}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="email"
								className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Email <span className="text-red-500">*</span>
							</label>
							<input
								id="email"
								name="email"
								type="email"
								defaultValue={savedInfo.email}
								className={inputClasses}
								placeholder="Email"
								required
							/>
							{state.errors?.email && (
								<p className="mt-1 text-xs text-red-500">
									{state.errors.email}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="website"
								className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
							>
								Website
							</label>
							<input
								id="website"
								name="website"
								type="url"
								defaultValue={savedInfo.website}
								className={inputClasses}
								placeholder="Website"
							/>
							{state.errors?.website && (
								<p className="mt-1 text-xs text-red-500">
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
					<label
						htmlFor="body"
						className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
					>
						Comment <span className="text-red-500">*</span>
					</label>
					<textarea
						id="body"
						name="body"
						rows={6}
						className={`${inputClasses} resize-y`}
						placeholder="Add your comment here…"
						required
					/>
					{state.errors?.body && (
						<p className="mt-1 text-xs text-red-500">{state.errors.body}</p>
					)}
				</div>

				<div className="flex items-center">
					<input
						id="saveInfo"
						name="saveInfo"
						type="checkbox"
						defaultChecked={
							!!(savedInfo.name || savedInfo.email || savedInfo.website)
						}
						className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-transparent text-blue-600 focus:ring-blue-500 [color-scheme:light_dark]"
					/>
					<label
						htmlFor="saveInfo"
						className="ml-2 text-sm text-slate-600 dark:text-slate-300"
					>
						Save my name, email and website in this browser for the next time I
						comment.
					</label>
				</div>

				{state.success && (
					<p className="text-sm text-green-600 dark:text-green-400 font-medium">
						Comment posted successfully!
					</p>
				)}

				<div>
					<SubmitButton />
				</div>
			</form>
		</div>
	);
}
