import { db } from "./index";
import { categories, comments, posts } from "./schema";

async function seed() {
	console.log("Seeding database…");

	// Clear old data
	await db.delete(comments);
	await db.delete(posts);
	await db.delete(categories);

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
				title: "The Secret Life of Mosses",
				slug: "secret-life-of-mosses",
				tags: ["Plants", "Forest"],
				categoryId: natureCatId,
				status: "published" as const,
				body: `Mosses are among the most ancient plants on Earth, having colonised land long before the first trees. They lack true roots — instead they absorb water and nutrients directly through their leaves, making them exquisitely sensitive to air quality.

Walk through an old-growth forest after rain and you will find every rock and log draped in vivid green. This carpet of moss does far more than look beautiful. It acts as a sponge, absorbing rainfall and slowly releasing it into the soil, reducing erosion and regulating stream flow for entire watersheds.

There are roughly 12,000 known species of moss, each adapted to a different niche — from the bright Sphagnum bogs of Siberia that store vast quantities of carbon, to the delicate hair-cap mosses that colonise bare rock in the high Arctic. In Japan, the art of cultivating moss gardens — koke niwa — is centuries old, a practice that celebrates patience and the quiet beauty of small, slow-growing things.

Next time rain traps you indoors, step outside anyway. Crouch down and look at the nearest patch of moss with fresh eyes. Under a hand lens, the individual stems look like miniature palm trees — a whole forest in the palm of your hand.`,
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
				title: "A Weekend in Kyoto",
				slug: "weekend-in-kyoto",
				tags: ["Japan", "Culture"],
				categoryId: travelCatId,
				status: "published" as const,
				body: `Kyoto is a city where the past and present exist in the same breath. A block from a Starbucks you will find a 400-year-old temple gate draped in wisteria. This layering of time is what makes Kyoto endlessly surprising.

Arrive by shinkansen in the early morning and walk from Kyoto Station up the quiet backstreets of Higashiyama before the tour groups arrive. The wooden machiya townhouses here have barely changed in a century. A few still function as craft workshops — potters, lacquerware makers, textile dyers — their sliding doors open to the street, work visible from the pavement.

The Arashiyama bamboo grove at dawn is genuinely magical: a narrow path between culms so tall they block the sky, the whole grove sighing and clicking in the breeze. Go on a weekday, go early, and for a few minutes you might have it to yourself.

In the evening, sit at the counter of a small izakaya in Pontocho alley. Order the grilled skewers, the cold tofu with ginger, and a carafe of hot sake. Through the narrow window you will see the Kamogawa river reflecting the city lights, and everything will feel exactly right.`,
			},
			{
				title: "Backpacking Through the Swiss Alps",
				slug: "backpacking-alps",
				tags: ["Mountains", "Hiking"],
				categoryId: travelCatId,
				status: "published" as const,
				body: `There is a particular quality to Alpine light in late summer — sharp and golden, casting long shadows across the meadows by mid-afternoon. I had been walking for six days on the Haute Route from Chamonix to Zermatt, and every morning the mountains still managed to surprise me.

The route crosses seven passes above 2,500 metres and demands a certain respect. The weather can change in an hour. One afternoon above Arolla a thunderstorm rolled in from the Italian border with almost no warning — I spent forty minutes crouched behind a boulder, lightning cracking across the ridge above, the smell of ozone sharp in the rain.

But then the storm passed and the sky turned the deepest blue I have ever seen, and the Matterhorn appeared through the clouds like something out of a dream, and everything before it felt entirely worth it.

Pack lighter than you think you need to. Carry more food than you think you need to. Talk to the people at the mountain huts — the guardian at Cab de Bertol made the best rösti I have ever eaten and told me stories about the mountain for two hours over schnapps.

The Alps will outlast us all. Walking through them for a week is a useful reminder of scale.`,
			},
			{
				title: "Lisbon on Foot: The City That Rewards the Slow",
				slug: "lisbon-on-foot",
				tags: ["Portugal", "City"],
				categoryId: travelCatId,
				status: "published" as const,
				body: `Lisbon is a city that punishes impatience. Its seven hills mean that every shortcut on the map involves a climb, and every taxi driver will suggest a route that is faster but shows you nothing worth seeing. The only correct way to travel here is on foot, uphill, slowly.

Start in Alfama, the oldest neighbourhood, where the streets are too narrow for cars and the tiled facades of the houses shimmer in the morning light. Fado drifts from the open doors of small restaurants even at eleven in the morning — a mournful, gorgeous sound that seems to belong entirely to this city.

Take the No. 28 tram not for efficiency but for the experience of watching the conductor lean theatrically around tight corners while passengers press themselves against the windows. Buy a pastel de nata at the original Pastéis de Belém, still made to the same secret recipe since 1837, and eat it standing at the marble counter with a dusting of cinnamon and a small espresso.

At sunset, walk up to the Miradouro da Graça. The whole city spreads below you in the orange light, the Tagus glittering in the distance. Someone will inevitably be playing guitar nearby. This is Lisbon at its most itself.`,
			},

			// ── Book ────────────────────────────────────────────────────────────
			{
				title: "Why Dune Is Still a Masterpiece",
				slug: "dune-masterpiece-review",
				tags: ["Sci-Fi", "Review"],
				categoryId: bookCatId,
				status: "published" as const,
				body: `Frank Herbert began writing Dune in 1959, researching for six years before publication in 1965. The novel that emerged was unlike anything science fiction had produced: a dense, layered work of political philosophy, ecological thinking, and mythological architecture dressed up as an adventure story.

The surface plot is familiar — a young nobleman inherits a dangerous world and must survive it. But everything beneath the surface is extraordinary. Herbert's Arrakis is the most fully realised alien ecology in literature: a desert planet whose every organism, from the sandworm to the date palm analogue, is locked into a single interdependent system, all of it turning on the production of spice, the most valuable substance in the universe.

What makes Dune worth rereading is that it never tells you what to think. Paul Atreides is simultaneously a hero, a messiah, and the architect of a galactic genocide. Herbert wanted readers to be suspicious of charismatic leaders, of prophecy, of the very narrative of the chosen one that the novel seems to be enacting. It is a book about the seductiveness of power and the cost of following someone who promises to save you.

Six decades on, its concerns — resource scarcity, imperial overreach, ecological collapse, the manufacture of religious myth — feel more urgent than ever.`,
			},
			{
				title: "The Overstory: A Novel That Changes How You See Trees",
				slug: "the-overstory-review",
				tags: ["Literary Fiction", "Review"],
				categoryId: bookCatId,
				status: "published" as const,
				body: `Richard Powers's Pulitzer Prize-winning novel The Overstory is structured like a tree. The first section, Roots, introduces nine separate human stories. In the second, Trunk, those stories begin to converge around a single cause: the fight to save old-growth forests in the American Pacific Northwest. The final sections branch outward into the consequences of that fight.

It is an ambitious structure and Powers earns it. Each of the nine characters is vivid and distinct, but Powers is equally skilled at making the trees themselves feel like characters — the chestnut, the mulberry, the sentinel Douglas fir that has stood for three hundred years while human generations rise and fall around it.

The novel's central argument, drawn directly from the science of plant communication and forest ecology, is that trees are not passive background scenery but active, communicating, problem-solving organisms whose timescale is simply too slow for most humans to notice. This idea, radical to some readers, becomes entirely convincing within the novel's world.

It is a long, demanding, occasionally overwhelming book. It is also one of the most important novels of the past decade — a work that will permanently alter the way you walk through a forest.`,
			},
			{
				title: "Top 5 Non-Fiction Books That Changed My Thinking",
				slug: "top-5-non-fiction",
				tags: ["Recommendations", "Non-Fiction"],
				categoryId: bookCatId,
				status: "published" as const,
				body: `The best non-fiction does not just inform you — it reorganises the way you see. Here are five books that did exactly that for me.

The Body by Bill Bryson is an affectionate, awe-struck tour of human anatomy that makes you feel genuinely lucky to be alive. Bryson has a gift for making the extraordinary feel approachable, and the sheer strangeness of what happens inside you every second of every day is staggering.

Entangled Life by Merlin Sheldrake examines the fungal kingdom and the mycorrhizal networks that connect plants underground. It is genuinely paradigm-shifting — after reading it you cannot look at a forest floor the same way again.

Educated by Tara Westover is technically a memoir, but its exploration of how we construct identity and knowledge from whatever materials we are given feels universal. It is also simply one of the best pieces of writing published this century.

Thinking, Fast and Slow by Daniel Kahneman remains the definitive account of the two cognitive systems that govern human decision-making. Dense in places, but endlessly useful.

The Dawn of Everything by David Graeber and David Wengrow upends almost every assumption about prehistoric human societies. It is long, argumentative, sometimes maddening, and absolutely essential.`,
			},
		])
		.returning();

	// ── Comments ──────────────────────────────────────────────────────────────
	await db.insert(comments).values([
		{
			postId: insertedPosts[0].id,
			authorName: "Alice",
			approved: true,
			body: "I visited an old-growth forest last autumn and the moss was absolutely incredible. This brought it all back.",
		},
		{
			postId: insertedPosts[0].id,
			authorName: "Tomás",
			approved: true,
			body: "The point about moss as a carbon store is so underappreciated. Peatlands store more carbon than all the world's forests combined.",
		},
		{
			postId: insertedPosts[3].id,
			authorName: "Yuki",
			approved: true,
			body: "The Higashiyama tip is perfect — I did exactly that on my last visit and it was completely different to the afternoon rush.",
		},
		{
			postId: insertedPosts[4].id,
			authorName: "Marco",
			approved: true,
			body: "The Haute Route is on my list. How fit do you need to be? Did you do it solo?",
		},
		{
			postId: insertedPosts[6].id,
			authorName: "Priya",
			approved: true,
			body: "Dune is one of those books I revisit every few years and find something completely different in it each time.",
		},
		{
			postId: insertedPosts[7].id,
			authorName: "Charlie",
			approved: true,
			body: "The Overstory wrecked me. I cried twice. Haven't been the same in a forest since.",
		},
	]);

	console.log(`Seeded ${insertedPosts.length} posts across 3 categories.`);
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
