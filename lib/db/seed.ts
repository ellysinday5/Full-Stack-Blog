import { db } from "./index";
import { comments, posts } from "./schema";

async function seed() {
	console.log("Seeding database...");

	const insertedPosts = await db
		.insert(posts)
		.values([
			{
				title: "Building My First Full-Stack Blog with Next.js and Drizzle",
				slug: "building-my-first-fullstack-blog",
				body: "This week I built a full-stack blog from scratch using Next.js 16, Drizzle ORM, and Neon Postgres. The trickiest part wasn't the UI, it was getting the database right. I started with simple serial IDs for my posts and comments tables, but partway through I had to migrate everything over to UUIDs to match the project spec. That meant dropping my tables, regenerating the migration, and reseeding my data. It was a good reminder that schema changes are never as small as they look on paper. The best part was wiring up the comment system: a Server Action validates each comment with Zod, saves it straight to Postgres, and revalidates the page so new comments show up instantly without a full reload. Small feature, but it made the whole app feel alive.",
			},
			{
				title: "Why I Only Trust a Moka Pot Before 9 AM",
				slug: "why-i-only-trust-a-moka-pot",
				body: "There's a lot of hype around pour-over coffee, and honestly, I get it. It's precise, it's fun to watch, and it makes your kitchen smell like a café. But before 9 AM, none of that matters to me. I want something fast, strong, and forgiving of my half-awake pouring technique. That's where the moka pot wins every time. You fill the bottom chamber with water, pack the basket with coffee, put it on the stove, and walk away for a few minutes. No timers, no gooseneck kettle, no measuring to the gram. Just a rich, slightly bitter shot of coffee that's strong enough to fix whatever mistakes I made getting out of bed. Pour-over is for the weekend. Moka pot is for survival.",
			},
			{
				title: "The Case for Reheated Pizza Over Fresh",
				slug: "the-case-for-reheated-pizza",
				body: "I know this is controversial, but I'll die on this hill: pizza is better the next day, reheated in a pan. Fresh out of the box, the cheese is molten and the crust is soft in a way that's exciting for about two bites and then just messy. Reheat it in a dry pan over medium heat for a few minutes, though, and something changes. The bottom crisps back up, the cheese sets just enough to hold its shape, and the flavors that were competing for attention the night before finally settle into each other. Microwaved pizza is a crime, don't get me wrong. But a pan-reheated slice the morning after? That's not leftovers, that's a glow-up.",
			},
			{
				title: "My Slow Descent into Matcha Obsession",
				slug: "my-descent-into-matcha-obsession",
				body: "I used to think matcha was just green tea with extra steps and a much higher price tag. Then I actually bought a whisk instead of stirring it with a spoon like an animal, and everything changed. There's something almost meditative about sifting the powder, pouring the water at the right temperature, and whisking in that fast zigzag motion until it foams up. It forces you to slow down for two minutes before your day starts. I've landed on a ceremonial-grade matcha with oat milk, barely any sweetener, as my go-to now. It's grassy, a little bitter, and somehow calmer than coffee even though it still has caffeine. I don't think I'll ever go back to the powder-in-a-shaker version again.",
			},
			{
				title: "Three Months of Learning Spanish and What Actually Stuck",
				slug: "three-months-learning-spanish",
				body: "I started learning Spanish three months ago expecting the apps and flashcards to do most of the work. They didn't. What actually moved the needle was embarrassingly simple: talking to real people, badly, on purpose. I joined a language exchange call once a week and spent the first few sessions just stumbling through sentences about my day. The vocabulary apps taught me words, but conversation taught me rhythm, the way native speakers actually string thoughts together instead of the textbook version. I still mix up my subjunctive tense constantly, but I can now hold a real conversation instead of just reciting memorized phrases. Turns out the fastest way to learn a language is to be bad at it in front of someone patient.",
			},
			{
				title: "Why My Houseplants Keep Surviving Despite My Neglect",
				slug: "why-my-houseplants-keep-surviving",
				body: "I am, by every reasonable definition, a forgetful plant parent. I miss watering schedules, I move pots around on a whim, and I've definitely sunburned a few leaves by placing something in direct light it couldn't handle. And yet, somehow, my small collection of pothos and snake plants keeps thriving. The secret, I've realized, isn't discipline, it's picking plants that are built for people like me. Pothos forgives almost anything. Snake plants practically want to be ignored. Once I stopped trying to be the plant parent Pinterest wanted me to be and started working with my actual habits instead of against them, everything got easier. Low-maintenance isn't a compromise, it's a strategy.",
			},
			{
				title: "The Snack I Judge People For Not Liking",
				slug: "the-snack-i-judge-people-for",
				body: "There is a very short list of foods I will defend to the death, and salted caramel popcorn is at the top of it. I don't understand the resistance. It's sweet, it's salty, it has crunch, and it somehow works equally well as a midnight snack and a dessert substitute. Whenever I bring a bag to a gathering, there's always one person who says it 'sounds weird' before trying it, and there's always the same look of quiet betrayal on their face once they realize how good it actually is. I've stopped trying to convince skeptics with words. Now I just hand over a bag and wait. Nobody has ever finished the bag and disagreed with me.",
			},
		])
		.returning();

	await db.insert(comments).values([
		{
			postId: insertedPosts[0].id,
			authorName: "Jane Doe",
			body: "The UUID migration story is so relatable, schema changes always seem simple until you're mid-migration.",
		},
		{
			postId: insertedPosts[1].id,
			authorName: "Mark Rivera",
			body: "Moka pot supremacy, no notes. Pour-over is a weekend hobby, not a weekday necessity.",
		},
		{
			postId: insertedPosts[3].id,
			authorName: "Lea Santos",
			body: "The whisking really is weirdly calming, glad someone else feels it too.",
		},
		{
			postId: insertedPosts[4].id,
			authorName: "Carlos Diaz",
			body: "Talking to real people is genuinely the only thing that worked for me too, apps only get you so far.",
		},
	]);

	console.log("Seeding complete!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
