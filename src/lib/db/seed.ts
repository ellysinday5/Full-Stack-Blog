import { db } from "./index";
import { categories, comments, posts, settings } from "./schema";

async function seed() {
	console.log("Seeding database…");

	// Clear old data
	await db.delete(comments);
	await db.delete(posts);
	await db.delete(categories);
	await db.delete(settings);

	// ── Categories ────────────────────────────────────────────────────────────
	const insertedCategories = await db
		.insert(categories)
		.values([
			{
				name: "Nature",
				slug: "nature",
				description: "All things about the outdoors and the natural world.",
			},
			{
				name: "Travel",
				slug: "travel",
				description: "Journeys, adventures, and exploring the world.",
			},
			{
				name: "Book",
				slug: "book",
				description: "Reviews, recommendations, and literary discussions.",
			},
		])
		.returning();

	const natureCatId = insertedCategories.find((c) => c.slug === "nature")?.id;
	const travelCatId = insertedCategories.find((c) => c.slug === "travel")?.id;
	const bookCatId = insertedCategories.find((c) => c.slug === "book")?.id;

	// ── Posts ─────────────────────────────────────────────────────────────────
	const insertedPosts = await db
		.insert(posts)
		.values([
			// ── Nature ──────────────────────────────────────────────────────────
			{
				title: "The Healing Power of Waterfalls",
				slug: "healing-power-of-waterfalls",
				tags: ["Waterfalls", "Nature"],
				categoryId: natureCatId,
				status: "published" as const,
				body: `There is a unique sensation when you stand near a waterfall: the roar of cascading water, the cool mist on your face, and an immediate sense of peace. Beyond their sheer beauty, waterfalls actually have a physiological effect on our bodies. The agitation of water molecules releases thousands of negative ions into the surrounding air, which are believed to increase oxygen flow to the brain and promote a sense of well-being.

Whether it is a hidden stream in a mossy glen or a massive cascade dropping hundreds of feet, waterfalls have drawn travelers and seekers for millennia. They represent flow, constant renewal, and the raw power of nature shaping the landscape.

Next time you feel overwhelmed by the pace of modern life, seek out a nearby waterfall. Sit on a wet rock, breathe in the mist-laden air, and let the rhythmic sound wash away your thoughts.`,
			},
			{
				title: "Why the Banyan Tree Is Extraordinary",
				slug: "why-the-banyan-tree-is-extraordinary",
				tags: ["Trees", "Wildlife"],
				categoryId: natureCatId,
				status: "published" as const,
				body: `The banyan tree does not grow the way most trees do. While other species push a single trunk skyward, the banyan sends aerial roots down from its branches. When those roots touch the ground they thicken into new trunks, allowing one tree to spread across an area the size of a city block.

The Great Banyan in the Acharya Jagadish Chandra Bose Indian Botanic Garden near Kolkata is often cited as the widest tree in the world. It covers more than 18,000 square metres and has over 3,500 aerial prop roots. Incredibly, the original central trunk died long ago from fungal disease — the tree now survives entirely on its prop-root trunks, making it effectively a forest that is also a single organism.

Banyans are keystone species in tropical ecosystems. Their figs ripen year-round and feed hundreds of species of birds and mammals — an ecological anchor that keeps entire food webs intact during seasons when other fruit trees are bare.

In Hindu tradition the banyan represents eternal life, its endless branching a symbol of the cycle of creation and renewal. Walk beneath one on a still afternoon and it is easy to understand why.`,
			},
			{
				title: "The Strange, Beautiful World of Carnivorous Plants",
				slug: "strange-beautiful-world-of-carnivorous-plants",
				tags: ["Plants", "Science"],
				categoryId: natureCatId,
				status: "published" as const,
				body: `Evolution is relentlessly inventive, and nowhere is this clearer than in the carnivorous plants. Growing in soils so poor in nitrogen that most plants cannot survive, these species evolved an astonishing solution: eat insects.

The Venus flytrap is the most famous example — a plant with a spring-loaded trap that snaps shut in as little as one tenth of a second. But it is just one of more than 600 known carnivorous plant species. Sundews catch prey on sticky, glistening tentacles. Pitcher plants drown insects in pools of digestive fluid. The bladderwort, a freshwater plant with no roots, uses tiny underwater bladders that create a vacuum and suck in microscopic creatures in milliseconds — the fastest known plant movement.

What all these plants share is a nutrient-poor home: boggy heathlands, tropical cloud forests, rocky seeps. Their hunting apparatus is a direct response to that poverty. Where nitrogen is scarce in the soil, they harvest it from the air — in the bodies of the living.

Growing carnivorous plants at home is surprisingly rewarding. Place a Sarracenia pitcher plant in a bright window, water it with rainwater, and watch as wasps and crane flies tumble helplessly into its elegant, veined pitchers.`,
			},

			// ── Travel ──────────────────────────────────────────────────────────
			{
				title: "Life in Siargao: More Than Just Surfing",
				slug: "life-in-siargao",
				tags: ["Philippines", "Island Life"],
				categoryId: travelCatId,
				status: "published" as const,
				body: `Siargao is often dubbed the surfing capital of the Philippines, but the island has a soul that extends far beyond the breaks at Cloud 9. Life here moves at a different pace—dictated by the tides, the sun, and the sudden tropical downpours.

Mornings start early. Before the sun fully rises, you can see locals and long-term expats carrying their boards down to the beach, while the smell of freshly brewed local coffee and pandesal drifts from small roadside bakeries. The day isn't just about catching waves; it's about community. You'll find yourself sharing stories with strangers at a communal table in General Luna, realizing that time here is measured not in hours, but in moments of connection.

Venture beyond the tourist hubs and the island reveals its quiet magic. Endless stretches of coconut palm forests line the roads, their fronds swaying like a green ocean. Hidden tide pools, secret lagoons, and mangroves offer a sanctuary for those willing to explore.

Living in Siargao teaches you the art of slowing down. It’s a place where luxury isn't defined by resorts, but by the simplicity of a fresh coconut on the beach, the warmth of the locals, and a sunset that paints the sky in colors you didn't know existed.`,
			},
			{
				title: "The Ultimate 5-Day Siargao Itinerary",
				slug: "siargao-itinerary",
				tags: ["Itinerary", "Travel Guide"],
				categoryId: travelCatId,
				status: "published" as const,
				body: `Planning a trip to Siargao? Five days is the perfect amount of time to get a taste of the island's best surf spots, stunning lagoons, and vibrant food scene. Here is an itinerary that balances adventure with relaxation.

Day 1: Arrival & Cloud 9
Arrive at Sayak Airport and head straight to your accommodation in General Luna. Spend the afternoon walking along the famous Cloud 9 boardwalk. Even if you don't surf, watching the pros catch the sunset waves is mesmerizing. Grab dinner at Kermit for some of the best pizza on the island.

Day 2: Island Hopping (Guyam, Daku, and Naked Island)
Book a local boat for the classic three-island tour. Start at Naked Island (a bare sandbar in the middle of the ocean), feast on a boodle fight lunch at Daku Island, and end the afternoon lounging under the palm trees of Guyam Island.

Day 3: Sugba Lagoon & Magpupungko Rock Pools
Rent a motorbike and drive north. Your first stop is the turquoise waters of Sugba Lagoon—perfect for paddleboarding and diving off the wooden pontoon. Time your visit to Magpupungko Rock Pools during low tide to swim in the crystal-clear natural infinity pools.

Day 4: Surf Lesson & Pacifico Beach
Wake up early for a beginner surf lesson at Jacking Horse. In the afternoon, take a long scenic ride up to Pacifico Beach. The drive through the palm tree roads is arguably as beautiful as the destination itself. Enjoy the quieter, laid-back vibe of the north.

Day 5: Cafe Hopping & Departure
Spend your last morning café hopping. Try Shaka for a smoothie bowl or Spotted Pig for excellent coffee. Buy some local souvenirs and take one last walk along the beach before heading back to the airport, already planning your return trip.`,
			},

			// ── Book ────────────────────────────────────────────────────────────
			{
				title: "The Silent Patient: A Thriller That Truly Delivers",
				slug: "the-silent-patient-review",
				tags: ["Thriller", "Review"],
				categoryId: bookCatId,
				status: "published" as const,
				body: `Alex Michaelides’s The Silent Patient is one of those rare psychological thrillers that lives up to the immense hype. The premise is instantly captivating: Alicia Berenson, a famous painter married to an in-demand fashion photographer, shoots her husband five times in the face one evening and then never speaks another word.

Enter Theo Faber, a criminal psychotherapist who becomes obsessed with uncovering Alicia's motive. The narrative cleverly weaves between Theo’s investigation in the present and Alicia’s past, revealed through her diary entries. Michaelides uses his background in psychotherapy to give Theo’s character a grounded, authentic voice, while the setting of the secure psychiatric unit feels claustrophobic and tense.

What makes this book stand out in a crowded genre isn’t just its pacing, which is relentless, but its profound exploration of trauma, silence, and the stories we tell ourselves to survive. Without spoiling anything, the twist is executed flawlessly—it recontextualizes the entire novel in a way that makes you immediately want to read it again from the beginning to spot the clues you missed.

If you enjoy domestic suspense with a genuinely shocking conclusion, The Silent Patient is an absolute must-read.`,
			},
			{
				title: "13 Reasons to Stay: A Gentle Reminder of Hope",
				slug: "13-reasons-to-stay-review",
				tags: ["Mental Health", "Review"],
				categoryId: bookCatId,
				status: "published" as const,
				body: `While a lot of modern young adult fiction tackles heavy subjects, "13 Reasons to Stay" approaches mental health and the struggles of adolescence with a deeply necessary focus on hope and recovery. Standing in stark contrast to narratives that inadvertently romanticize tragedy, this book focuses entirely on the difficult but beautiful journey of choosing life.

The story follows a protagonist navigating the overwhelming weight of depression, but it shifts the narrative framework. Instead of dwelling purely on the pain, the book meticulously builds an emotional anchor out of the small, often overlooked reasons to keep going. From the smell of rain on hot pavement to the unconditional love of a pet, to the profound, messy beauty of human connection—the "reasons" are not grand, cinematic events, but the quiet, everyday moments that make up a life.

What makes this book so powerful is its honesty. It doesn't pretend that recovery is linear or that simply making a list magically cures clinical depression. But it offers a lifeline. It reminds readers that even in the darkest moments, there is a future version of themselves waiting to experience things they haven't even imagined yet.

It is a poignant, uplifting read that feels like a warm embrace for anyone who has ever struggled with their mental health.`,
			},
		])
		.returning();

	// ── Comments ──────────────────────────────────────────────────────────────
	await db.insert(comments).values([
		{
			postId: insertedPosts[0].id,
			authorName: "Alice",
			approved: true,
			body: "I visited a hidden waterfall last autumn and the mist was absolutely incredible. This brought it all back.",
		},
		{
			postId: insertedPosts[0].id,
			authorName: "Tomás",
			approved: true,
			body: "The point about waterfalls generating negative ions is so underappreciated. They are truly nature's natural therapy.",
		},
		{
			postId: insertedPosts[3].id,
			authorName: "Yuki",
			approved: true,
			body: "Siargao looks incredible! The vibe seems so much more relaxed than other island destinations.",
		},
		{
			postId: insertedPosts[4].id,
			authorName: "Marco",
			approved: true,
			body: "Saving this 5-day itinerary. Cloud 9 at sunset is now officially on my bucket list.",
		},
		{
			postId: insertedPosts[5].id,
			authorName: "Priya",
			approved: true,
			body: "I completely agree about The Silent Patient. That twist genuinely caught me off guard!",
		},
		{
			postId: insertedPosts[6].id,
			authorName: "Charlie",
			approved: true,
			body: "13 Reasons to Stay sounds like exactly the kind of uplifting book I need right now. Adding it to my TBR.",
		},
	]);

	// ── Settings ──────────────────────────────────────────────────────────────
	await db.insert(settings).values([
		{
			key: "auto_approve_comments",
			value: "false",
		},
	]);

	console.log(`Seeded ${insertedPosts.length} posts across 3 categories.`);
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
