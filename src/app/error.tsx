"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PublicShell } from "@/components/PublicShell";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log to error reporting service in production
		console.error(error);
	}, [error]);

	return (
		<PublicShell>
			<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)] px-6 pt-24 pb-20 text-center">
				{/* Decorative background blobs */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-100/40 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl"
				/>

				{/* Wilted leaf icon */}
				{/* Wilted leaf icon */}
				<div aria-hidden="true" className="mb-6 flex justify-center">
					<svg
						viewBox="0 0 80 80"
						className="h-20 w-20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Error occurred</title>
						{/* Drooping leaf */}
						<path
							d="M38 68 C38 68 14 58 16 30 C16 30 32 22 40 40 Z"
							fill="#c53030"
							opacity="0.5"
						/>
						<path
							d="M38 55 C32 45 20 36 16 28"
							stroke="white"
							strokeWidth="1.2"
							strokeOpacity="0.4"
							fill="none"
						/>
						<path
							d="M40 50 C40 50 56 36 58 14 C58 14 44 12 38 30 Z"
							fill="#c53030"
							opacity="0.35"
						/>
						{/* Stem drooping down */}
						<path
							d="M38 68 Q36 73 34 76"
							stroke="#7a2c2c"
							strokeWidth="2.5"
							strokeLinecap="round"
							fill="none"
						/>
						{/* Warning bang */}
						<circle
							cx="60"
							cy="18"
							r="12"
							fill="#fef2f2"
							stroke="#fca5a5"
							strokeWidth="1.5"
						/>
						<text
							x="60"
							y="23"
							textAnchor="middle"
							fontSize="14"
							fontWeight="bold"
							fill="#c53030"
						>
							!
						</text>
					</svg>
				</div>

				{/* Error badge */}
				<p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
					Something went wrong
				</p>

				<h1 className="mb-4 font-serif text-6xl font-bold leading-none text-[#0f3d2e] md:text-7xl">
					Oops!
				</h1>

				{/* Message */}
				<h2 className="mb-3 font-serif text-xl font-semibold text-[#0f3d2e] md:text-2xl">
					An unexpected error occurred
				</h2>
				<p className="mx-auto mb-3 max-w-md text-base leading-relaxed text-[#4c6f5e]">
					Something went wrong on our end. You can try refreshing, or head back
					to safety while we sort things out.
				</p>

				{/* Error digest for debugging */}
				{error.digest && (
					<p className="mb-8 text-xs font-mono text-[#7a9a7a] bg-[#eef8f1] border border-[#dcefe3] rounded px-3 py-1 inline-block">
						Error ID: {error.digest}
					</p>
				)}
				{!error.digest && <div className="mb-8" />}

				{/* Actions */}
				<div className="flex flex-wrap items-center justify-center gap-4">
					<button
						type="button"
						onClick={reset}
						className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
					>
						↺ Try Again
					</button>
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-md border border-[#b8d9c5] bg-white px-7 py-3 text-sm font-semibold text-[#1f6f4d] shadow-sm transition-all hover:bg-[#eef8f1] active:scale-95"
					>
						← Back to Home
					</Link>
				</div>
			</main>
		</PublicShell>
	);
}
