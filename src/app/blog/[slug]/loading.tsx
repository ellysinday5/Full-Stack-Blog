import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";

export default async function Loading() {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(posts)
		.where(and(eq(posts.status, "published"), isNull(posts.deletedAt)));

	const hasPosts = Number(result[0]?.count) > 0;

	if (!hasPosts) {
		return (
			<main className="min-h-screen bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)] pb-16 pt-32 sm:pt-36">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-8">
						<div className="mb-6 h-10 w-48 rounded-lg bg-[#0f3d2e]/10" />
						<div className="mb-4 h-6 w-32 rounded bg-[#0f3d2e]/10" />
						<div className="mb-8 h-10 w-full max-w-md rounded-lg border border-[#0f3d2e]/20 bg-white" />
					</div>
					<div className="rounded-2xl border-2 border-[#0f3d2e]/20 bg-white p-16">
						<div className="mx-auto h-16 w-16 rounded-full bg-[#0f3d2e]/8" />
						<div className="mx-auto mt-6 h-6 w-48 rounded bg-[#0f3d2e]/10" />
						<div className="mx-auto mt-3 h-4 w-64 rounded bg-[#0f3d2e]/8" />
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)] pb-16 pt-32 sm:pt-36">
			<div className="mx-auto max-w-7xl px-6">
				<div className="mb-8">
					<div className="mb-6 h-10 w-48 rounded-lg bg-[#0f3d2e]/10" />
					<div className="mb-4 h-6 w-32 rounded bg-[#0f3d2e]/10" />
					<div className="mb-6 flex flex-wrap gap-3">
						{(["t1", "t2", "t3"] as const).map((id) => (
							<div key={id} className="h-9 w-20 rounded-full border border-[#0f3d2e]/20 bg-[#0f3d2e]/8" />
						))}
					</div>
					<div className="mb-8 h-10 w-full max-w-md rounded-lg border border-[#0f3d2e]/20 bg-white" />
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{(["c1", "c2", "c3", "c4", "c5", "c6"] as const).map((id) => (
						<div key={id} className="overflow-hidden rounded-2xl border-2 border-[#0f3d2e]/20 bg-white">
							<div className="h-48 w-full bg-[#0f3d2e]/8" />
							<div className="p-6 space-y-3">
								<div className="h-5 w-3/4 rounded bg-[#0f3d2e]/10" />
								<div className="space-y-2">
									<div className="h-3.5 w-full rounded bg-[#0f3d2e]/8" />
									<div className="h-3.5 w-5/6 rounded bg-[#0f3d2e]/8" />
									<div className="h-3.5 w-2/3 rounded bg-[#0f3d2e]/8" />
								</div>
								<div className="h-4 w-14 rounded bg-[#0f3d2e]/10" />
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}