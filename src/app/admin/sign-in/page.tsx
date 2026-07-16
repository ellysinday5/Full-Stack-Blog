import Link from "next/link";
import { connection } from "next/server";
import { LoginForm } from "./signin-form";

export const metadata = {
	title: "Admin Login | Elly's Blog",
	// Tell browsers never to cache this page
	other: {
		pragma: "no-cache",
	},
};

export default async function AdminLoginPage({
	searchParams,
}: {
	searchParams: Promise<{ from?: string; reason?: string }>;
}) {
	await connection();
	const { from = "/admin", reason } = await searchParams;
	const isLoggedOut = reason === "logout";
	const isTimeout = reason === "timeout";
	const showNotice = isLoggedOut || isTimeout;

	return (
		<main
			className="relative flex-1 flex flex-col items-center justify-center px-4 w-full min-h-screen overflow-hidden"
			style={{ background: "#080f0a" }}
		>
			{/* Animated grid */}
			<div
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
					backgroundSize: "48px 48px",
				}}
			/>

			{/* Glowing orb — top left */}
			<div
				className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
				style={{
					width: "520px",
					height: "520px",
					top: "-180px",
					left: "-180px",
					background:
						"radial-gradient(circle, #16a34a 0%, #052e16 60%, transparent 100%)",
					animation: "orbPulse 8s ease-in-out infinite",
				}}
			/>

			{/* Glowing orb — bottom right */}
			<div
				className="absolute rounded-full blur-3xl opacity-15 pointer-events-none"
				style={{
					width: "600px",
					height: "600px",
					bottom: "-220px",
					right: "-200px",
					background:
						"radial-gradient(circle, #15803d 0%, #052e16 60%, transparent 100%)",
					animation: "orbPulse 10s ease-in-out 2s infinite",
				}}
			/>

			{/* Glowing orb — center accent */}
			<div
				className="absolute rounded-full blur-2xl opacity-10 pointer-events-none"
				style={{
					width: "300px",
					height: "300px",
					top: "40%",
					left: "60%",
					transform: "translate(-50%, -50%)",
					background: "radial-gradient(circle, #86efac 0%, transparent 70%)",
					animation: "orbPulse 6s ease-in-out 1s infinite alternate",
				}}
			/>

			{/* Floating particles */}
			{[...Array(12)].map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: decorative
					key={i}
					className="absolute rounded-full pointer-events-none"
					style={{
						width: `${3 + (i % 4)}px`,
						height: `${3 + (i % 4)}px`,
						left: `${8 + i * 7.5}%`,
						top: `${15 + ((i * 37) % 70)}%`,
						background:
							i % 3 === 0 ? "#4ade80" : i % 3 === 1 ? "#86efac" : "#16a34a",
						opacity: 0.25 + (i % 4) * 0.1,
						animation: `float ${5 + (i % 5)}s ease-in-out ${i * 0.6}s infinite alternate`,
					}}
				/>
			))}

			{/* CSS keyframes injected inline */}
			<style>{`
				@keyframes orbPulse {
					0%, 100% { transform: scale(1); opacity: 0.15; }
					50% { transform: scale(1.12); opacity: 0.25; }
				}
				@keyframes float {
					0% { transform: translateY(0px); }
					100% { transform: translateY(-24px); }
				}
			`}</style>

			{/* Card */}
			<div className="relative z-10 w-full max-w-sm">
				{/* Logged-out / timeout notice */}
				{showNotice && (
					<div
						className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/30 px-4 py-3 text-sm"
						style={{ background: "rgba(120,85,20,0.30)" }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 mt-0.5 shrink-0 text-amber-400"
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
						<p className="text-amber-300">
							{isTimeout
								? "Your session has expired due to inactivity. Please log in again."
								: "You have been logged out. Please enter your password to access the admin panel again."}
						</p>
					</div>
				)}

				<div
					className="rounded-2xl border border-white/10 px-8 py-8 shadow-2xl backdrop-blur-sm"
					style={{
						background:
							"linear-gradient(135deg, rgba(26,61,36,0.85) 0%, rgba(15,45,26,0.90) 100%)",
						boxShadow:
							"0 0 60px rgba(22,163,74,0.15), 0 25px 50px rgba(0,0,0,0.5)",
					}}
				>
					<div className="mb-6 text-center">
						{/* Lock icon */}
						<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-green-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.8}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-white mb-1.5">
							Admin Access
						</h1>
						<p className="text-sm text-white/50">
							Enter your password to continue
						</p>
					</div>

					<LoginForm from={from} />
				</div>

				{/* Back link */}
				<div className="mt-6 flex justify-center">
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
			</div>
		</main>
	);
}
