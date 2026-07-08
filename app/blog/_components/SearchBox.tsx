"use client";

import Link from "next/link";
import { useState } from "react";

type SerializedPost = {
	id: string;
	title: string;
	slug: string;
	createdAt: string;
};

interface SearchBoxProps {
	posts: SerializedPost[];
}

export default function SearchBox({ posts }: SearchBoxProps) {
	const [query, setQuery] = useState("");

	const filtered =
		query.trim().length > 0
			? posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
			: [];

	return (
		<div className="relative">
			<div className="relative">
				<input
					type="text"
					id="blog-search"
					placeholder="Search..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full rounded border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
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

			{filtered.length > 0 && (
				<ul className="absolute left-0 right-0 top-full z-20 mt-1 divide-y divide-gray-100 rounded border border-gray-200 bg-white shadow-md">
					{filtered.map((post) => (
						<li key={post.id}>
							<Link
								href={`/blog/${post.slug}`}
								className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
							>
								{post.title}
							</Link>
						</li>
					))}
				</ul>
			)}

			{query.trim().length > 0 && filtered.length === 0 && (
				<p className="mt-2 text-xs text-gray-400">
					No posts found for &quot;{query}&quot;
				</p>
			)}
		</div>
	);
}
