import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export default function Home() {
	return (
		<PublicShell>
			<main className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)] text-center">
				{/* Content */}
				<div className="relative z-10 max-w-2xl px-6 py-24">
					{/* Eyebrow */}
					<p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#175a3d]">
						Elly's Blog
					</p>

					{/* Headline */}
					<h1 className="mb-5 text-5xl font-bold leading-tight text-[#0f3d2e] md:text-6xl tracking-tight font-serif">
						Stories Worth
						<br />
						Sharing
					</h1>

					{/* Tagline */}
					<p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-[#4c6f5e]">
						Thoughts, notes, and things worth writing down — a little bit of
						everything, one post at a time.
					</p>

					{/* CTA Buttons */}
					<div className="flex items-center justify-center gap-4 flex-wrap">
						{/* Primary — green filled */}
						<Link
							href="/blog"
							className="inline-flex items-center gap-2.5 rounded-md bg-emerald-500 px-8 py-3.5
						           text-sm font-semibold text-white shadow-sm
						           transition-all hover:bg-emerald-600 active:scale-95"
						>
							Read the Blog
							<ArrowRight className="h-4 w-4" />
						</Link>

						{/* Secondary — dark outlined */}
						{/*<Link
							href="/admin"
							className="inline-flex items-center gap-2.5 rounded-md border border-slate-300
						           bg-white px-8 py-3.5 text-sm font-semibold text-slate-700
						           transition-all hover:border-slate-400 hover:bg-slate-50
						           active:scale-95 shadow-sm"
						>
							<PenLine className="h-4 w-4" />
							Write a Post
						</Link>*/}
					</div>
				</div>
			</main>
		</PublicShell>
	);
}
