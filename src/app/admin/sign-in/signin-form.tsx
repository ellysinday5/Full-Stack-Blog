"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { adminLogin, type LoginState } from "./actions";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full rounded-lg bg-[#3a7d44] py-3 text-sm font-semibold text-white
			           transition-colors hover:bg-[#2e6636] disabled:opacity-50 mt-2"
		>
			{pending ? "Verifying…" : "Enter Admin"}
		</button>
	);
}

export function LoginForm({ from }: { from: string }) {
	const [state, formAction] = useActionState<LoginState, FormData>(
		adminLogin,
		{},
	);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form action={formAction} className="space-y-5" suppressHydrationWarning>
			<input type="hidden" name="from" value={from} />

			<div>
				<label
					htmlFor="password"
					className="block text-sm font-semibold text-white mb-1.5"
				>
					Password <span className="text-red-400">*</span>
				</label>
				<div className="relative" suppressHydrationWarning>
					<input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						required
						suppressHydrationWarning
						className="w-full rounded-lg border border-white/10 bg-[#d4ddd5] px-4 py-3 pr-11
						           text-sm text-[#1a2e1a] placeholder-[#6a8a6a]
						           focus:border-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-500/20
						           transition-colors"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6a4a] hover:text-[#1a2e1a] transition-colors"
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>

				{state.error && (
					<p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3.5 w-3.5 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						{state.error}
					</p>
				)}
			</div>

			<SubmitButton />
		</form>
	);
}
