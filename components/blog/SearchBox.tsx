"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function SearchBox() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [query, setQuery] = useState(searchParams.get("q")?.toString() || "");
	const [, startTransition] = useTransition();

	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams);
			if (query) {
				params.set("q", query);
			} else {
				params.delete("q");
			}
			startTransition(() => {
				replace(`${pathname}?${params.toString()}`);
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [query, pathname, replace, searchParams]);

	return (
		<div className="relative max-w-md">
			<label htmlFor="blog-search" className="sr-only">
				Search
			</label>
			<div className="relative flex gap-2">
				<div className="relative flex-1">
					<input
						type="text"
						id="blog-search"
						placeholder="Search posts..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full h-11 rounded-full border border-[#dcefe3] bg-white px-5 py-2.5 pr-11 text-sm text-[#0f3d2e] placeholder-[#8ca89a] shadow-sm focus:border-[#1f6f4d] focus:outline-none focus:ring-2 focus:ring-[#1f6f4d]/20 transition-all duration-300"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ca89a] pointer-events-none"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						className="h-11 px-5 rounded-full border border-[#dcefe3] bg-white text-sm font-semibold text-[#4c6f5e] hover:border-[#1f6f4d] hover:text-[#1f6f4d] hover:shadow-sm transition-all duration-300"
					>
						Clear
					</button>
				)}
			</div>
		</div>
	);
}
