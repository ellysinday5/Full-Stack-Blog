export default function Loading() {
	return (
		<main className="mx-auto max-w-2xl px-6 py-16">
			<article>
				{/* Date Skeleton */}
				<div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
				
				{/* Title Skeleton */}
				<div className="mt-3 h-10 w-full animate-pulse rounded bg-neutral-200 sm:w-3/4" />
				<div className="mt-2 h-10 w-2/3 animate-pulse rounded bg-neutral-200 sm:hidden" />

				{/* Body Skeleton */}
				<div className="mt-10 space-y-4">
					<div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-[90%] animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-[95%] animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-[85%] animate-pulse rounded bg-neutral-100" />
					<br />
					<div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
					<div className="h-5 w-[80%] animate-pulse rounded bg-neutral-100" />
				</div>
			</article>

			{/* Comments Section Skeleton */}
			<section className="mt-16 border-t border-neutral-200 pt-10">
				<div className="h-7 w-32 animate-pulse rounded bg-neutral-200" />

				<ul className="mt-6 space-y-6">
					{[1, 2].map((i) => (
						<li key={i} className="rounded-lg border border-neutral-200 p-4">
							<div className="flex items-center justify-between">
								<div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
								<div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
							</div>
							<div className="mt-3 space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
								<div className="h-4 w-[90%] animate-pulse rounded bg-neutral-100" />
							</div>
						</li>
					))}
				</ul>

				{/* Comment Form Skeleton */}
				<div className="mt-10 space-y-4">
					<div className="h-10 w-full animate-pulse rounded-md bg-neutral-100" />
					<div className="h-24 w-full animate-pulse rounded-md bg-neutral-100" />
					<div className="h-10 w-32 animate-pulse rounded-md bg-neutral-200" />
				</div>
			</section>
		</main>
	);
}
