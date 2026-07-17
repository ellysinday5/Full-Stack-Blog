import { db } from './src/lib/db/index.ts';
import { categories, posts } from './src/lib/db/schema.ts';
import { desc, eq, isNull } from 'drizzle-orm';

async function main() {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        tags: posts.tags,
        status: posts.status,
        createdAt: posts.createdAt,
        categoryName: categories.name,
      })
      .from(posts)
      .where(isNull(posts.deletedAt))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .orderBy(desc(posts.createdAt));
    console.log('success', allPosts.length);
    console.log(JSON.stringify(allPosts[0], null, 2));
  } catch (err) {
    console.error('caught error');
    console.error(err);
    if (err instanceof Error && (err as any).cause) {
      console.error('cause', (err as any).cause);
    }
    process.exit(1);
  }
}

main();
