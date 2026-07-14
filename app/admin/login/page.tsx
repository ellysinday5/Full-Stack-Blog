import { LoginForm } from "./login-form";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Admin Login | Elly's Blog",
};

export default async function AdminLoginPage({
	searchParams,
}: {
	searchParams: Promise<{ from?: string }>;
}) {
	const { from = "/admin" } = await searchParams;

	return (
		<main
			className="relative min-h-screen flex flex-col items-center justify-center px-4"
			style={{ background: "#0f2d1a" }}
		>
			{/* Logo */}
			<Link href="/" className="mb-8 select-none" aria-label="Back to home">
				<Image
					src="/images/logo.png"
					alt="Elly's Blog"
					width={180}
					height={80}
					className="h-auto w-auto"
					priority
				/>
			</Link>

			{/* Card */}
			<div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a3d24] px-8 py-8 shadow-2xl">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-white mb-1.5">Admin Access</h1>
					<p className="text-sm text-white/50">
						Enter your password to continue
					</p>
				</div>

				<LoginForm from={from} />
			</div>

			{/* Back link */}
			<div className="mt-6">
				<Link
					href="/blog"
					className="flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
				>
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
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to Blog
				</Link>
			</div>
		</main>
	);
}
