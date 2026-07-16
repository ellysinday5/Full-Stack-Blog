import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
	title: "404 – Page Not Found | Elly's Blog",
	description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
	return (
		<PublicShell>
			<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)] px-6 pt-24 pb-20 text-center">
				{/* Decorative background circles */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl"
				/>

				{/* Botanical leaf icon */}
				<div aria-hidden="true" className="mb-6 flex justify-center">
					<svg
						viewBox="0 0 80 80"
						className="h-20 w-20 text-emerald-500 opacity-80"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Page not found</title>
						<path
							d="M40 70 C40 70 12 55 10 25 C10 25 28 18 40 35 Z"
							fill="currentColor"
							opacity="0.9"
						/>
						<path
							d="M40 58 C34 48 18 36 12 22"
							stroke="white"
							strokeWidth="1.2"
							strokeOpacity="0.5"
							fill="none"
						/>
						<path
							d="M40 52 C40 52 58 38 62 15 C62 15 46 12 40 30 Z"
							fill="currentColor"
							opacity="0.6"
						/>
						<line
							x1="40"
							y1="70"
							x2="40"
							y2="76"
							stroke="#14553a"
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
					</svg>
				</div>

				{/* 404 */}
				<p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#175a3d]">
					Error 404
				</p>
				<h1 className="mb-4 font-serif text-8xl font-bold leading-none text-[#0f3d2e] md:text-9xl">
					404
				</h1>

				{/* Message */}
				<h2 className="mb-3 font-serif text-2xl font-semibold text-[#0f3d2e] md:text-3xl">
					Page not found
				</h2>
				<p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-[#4c6f5e]">
					The page you're looking for has wandered off into the wilderness.
					Let's get you back to familiar ground.
				</p>

				{/* CTA buttons */}
				<div className="flex flex-wrap items-center justify-center gap-4">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
					>
						← Back to Home
					</Link>
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 rounded-md border border-[#b8d9c5] bg-white px-7 py-3 text-sm font-semibold text-[#1f6f4d] shadow-sm transition-all hover:bg-[#eef8f1] active:scale-95"
					>
						Browse the Blog
					</Link>
				</div>
			</main>
		</PublicShell>
	);
}
