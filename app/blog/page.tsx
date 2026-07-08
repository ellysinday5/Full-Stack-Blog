import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";


export default async function BlogPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 border-b border-neutral-200 pb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[--color-ink]">
          Blog
        </h1>
        <p className="mt-2 text-neutral-500">
          Notes on building things, one post at a time.
        </p>
      </header>

      {allPosts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 px-6 py-16 text-center">
          <p className="text-lg font-medium text-[--color-ink]">
            Nothing here yet
          </p>
          <p className="mt-2 text-neutral-500">
            The first post hasn't been published. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-lg border border-neutral-200 p-6 transition-colors hover:border-[--color-moss]"
            >
              <time
                dateTime={post.createdAt.toISOString()}
                className="text-sm text-neutral-400"
              >
                {post.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-2 text-xl font-semibold text-[--color-ink] group-hover:text-[--color-moss]">
                {post.title}
              </h2>
              <span className="mt-auto pt-4 text-sm font-medium text-[--color-moss] opacity-0 transition-opacity group-hover:opacity-100">
                Read post →
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}