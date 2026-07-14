"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [value, setValue] = useState(searchParams.get("q") ?? "");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Keep local value in sync when URL changes externally (e.g. browser back)
	useEffect(() => {
		setValue(searchParams.get("q") ?? "");
	}, [searchParams]);

	function push(q: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (q) {
			params.set("q", q);
		} else {
			params.delete("q");
		}
		const qs = params.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const next = e.target.value;
		setValue(next);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => push(next), 400);
	}

	function handleClear() {
		setValue("");
		if (debounceRef.current) clearTimeout(debounceRef.current);
		push("");
	}

	const hasQuery = value.length > 0 || Boolean(searchParams.get("q"));

	return (
		<div className="mb-8 flex items-center gap-2">
			{/* Search input */}
			<div className="relative">
				<Search
					size={15}
					className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#4c6f5e]"
					aria-hidden="true"
				/>
				<input
					type="text"
					value={value}
					onChange={handleChange}
					placeholder="Search stories…"
					aria-label="Search stories"
					className="w-64 rounded-lg border border-[#0f3d2e] bg-white py-2 pr-4 pl-9 text-sm text-[#0f3d2e] placeholder-[#4c6f5e]/60 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/40"
				/>
			</div>

			{/* Clear button — only visible when there is an active query */}
			<button
				type="button"
				onClick={handleClear}
				disabled={!hasQuery}
				className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#0f3d2e] bg-white px-4 py-2 text-sm font-semibold text-[#0f3d2e] transition-colors hover:bg-[#dff7e9] disabled:cursor-not-allowed disabled:opacity-40"
			>
				<X size={13} />
				Clear
			</button>
		</div>
	);
}
