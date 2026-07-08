export default function Loading() {
	return (
		<main className="min-h-screen bg-[#f5f6f7]">
			<div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
				<div className="flex gap-8">
					{/* ─── Main skeleton ─────────────────────────────────────────── */}
					<section className="min-w-0 flex-1">
						{/* Featured 2-col */}
						<div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
							{(["f1", "f2"] as const).map((id) => (
								<div key={id} className="bg-white shadow-sm">
									<div className="px-4 pt-4">
										<div className="h-4 w-16 animate-pulse rounded-sm bg-blue-200" />
										<div className="mt-2 space-y-1.5">
											<div className="h-5 w-full animate-pulse rounded bg-gray-200" />
											<div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
										</div>
									</div>
									<div className="mt-3 h-52 w-full animate-pulse bg-gray-200" />
									<div className="px-4 pb-4 pt-3">
										<div className="space-y-2">
											<div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
											<div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
											<div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
										</div>
										<div className="mt-3 flex items-center gap-2">
											<div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
											<div className="h-3 w-2 rounded bg-gray-200" />
											<div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Regular 3-col */}
						<div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{(["r1", "r2", "r3"] as const).map((id) => (
								<div key={id} className="bg-white shadow-sm">
									<div className="px-4 pt-4">
										<div className="h-4 w-14 animate-pulse rounded-sm bg-blue-200" />
										<div className="mt-2 space-y-1.5">
											<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
											<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
										</div>
									</div>
									<div className="mt-3 h-44 w-full animate-pulse bg-gray-200" />
									<div className="px-4 pb-4 pt-3">
										<div className="space-y-2">
											<div className="h-3 w-full animate-pulse rounded bg-gray-100" />
											<div className="h-3 w-full animate-pulse rounded bg-gray-100" />
											<div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
										</div>
										<div className="mt-3 flex items-center gap-2">
											<div className="h-2.5 w-12 animate-pulse rounded bg-gray-200" />
											<div className="h-2.5 w-2 rounded bg-gray-200" />
											<div className="h-2.5 w-20 animate-pulse rounded bg-gray-200" />
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						<div className="flex items-center gap-1">
							<div className="h-9 w-9 animate-pulse rounded bg-blue-200" />
							<div className="h-9 w-9 animate-pulse rounded bg-gray-200" />
							<div className="h-9 w-20 animate-pulse rounded bg-gray-200" />
						</div>
					</section>

					{/* ─── Sidebar skeleton ──────────────────────────────────────── */}
					<aside className="hidden w-[280px] shrink-0 space-y-8 lg:block">
						{/* Search */}
						<div>
							<div className="mb-4 h-4 w-24 animate-pulse rounded bg-gray-300" />
							<div className="h-10 w-full animate-pulse rounded border border-gray-200 bg-gray-100" />
						</div>

						{/* Posts */}
						<div>
							<div className="mb-4 h-4 w-12 animate-pulse rounded bg-gray-300" />
							<div className="space-y-4">
								{(["p1", "p2", "p3", "p4", "p5"] as const).map((id) => (
									<div key={id} className="flex gap-3">
										<div className="h-16 w-16 shrink-0 animate-pulse rounded bg-gray-200" />
										<div className="flex-1 space-y-2 py-1">
											<div className="h-3.5 w-full animate-pulse rounded bg-gray-200" />
											<div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-200" />
											<div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Categories */}
						<div>
							<div className="mb-4 h-4 w-24 animate-pulse rounded bg-gray-300" />
							<div className="space-y-2.5">
								{([68, 52, 76, 60, 44] as const).map((w) => (
									<div
										key={w}
										className="h-4 animate-pulse rounded bg-gray-100"
										style={{ width: `${w}%` }}
									/>
								))}
							</div>
						</div>

						{/* Quote block */}
						<div className="animate-pulse rounded bg-blue-100 px-6 py-8">
							<div className="mb-3 h-8 w-8 rounded bg-blue-200" />
							<div className="space-y-2">
								<div className="h-3.5 w-full rounded bg-blue-200" />
								<div className="h-3.5 w-full rounded bg-blue-200" />
								<div className="h-3.5 w-3/4 rounded bg-blue-200" />
								<div className="h-3.5 w-4/5 rounded bg-blue-200" />
							</div>
							<div className="mt-4 h-3 w-1/3 rounded bg-blue-200" />
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
