export default function Loading() {
	const skeletonIds = ["s1", "s2", "s3", "s4", "s5", "s6"];

	return (
		<main className="mx-auto max-w-5xl px-6 py-16">
			<header className="mb-12 border-b border-neutral-200 pb-6">
				<div className="h-9 w-32 animate-pulse rounded bg-neutral-200" />
				<div className="mt-3 h-5 w-64 animate-pulse rounded bg-neutral-100" />
			</header>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{skeletonIds.map((id) => (
					<div
						key={id}
						className="flex flex-col rounded-lg border border-neutral-200 p-6"
					>
						{/* date placeholder */}
						<div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />

						{/* title placeholder — two lines to mimic wrapping titles */}
						<div className="mt-2 space-y-2">
							<div className="h-6 w-full animate-pulse rounded bg-neutral-200" />
							<div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200" />
						</div>

						{/* "Read post" link placeholder */}
						<div className="mt-auto pt-4">
							<div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
