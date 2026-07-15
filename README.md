# Full-Stack Blog

A full-stack blog built with Next.js, Drizzle ORM, and Neon PostgreSQL.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Neon PostgreSQL (serverless)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Styling:** Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=your_neon_postgres_connection_string
```

You can find your connection string in the [Neon Console](https://console.neon.tech) under your project's **Connection Details**.

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Seed the database

Populate the database with initial blog posts and sample comments:

```bash
pnpm db:seed
```

This inserts **7 blog posts** and **4 sample comments** into the live Neon PostgreSQL database. The seed script is idempotent-safe to re-run on a fresh database, but running it against an already-seeded database will insert duplicate rows — reset the tables first if needed.

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Database Scripts

| Command | Description |
|---|---|
| `pnpm db:generate` | Generate a new Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations to the database |
| `pnpm db:seed` | Seed the database with initial blog posts and comments |
| `pnpm db:studio` | Open Drizzle Studio to browse the database visually |

---

## Seed Data

The seed script (`lib/db/seed.ts`) inserts the following content:

**Posts (7 total):**
- Building My First Full-Stack Blog with Next.js and Drizzle
- Why I Only Trust a Moka Pot Before 9 AM
- The Case for Reheated Pizza Over Fresh
- My Slow Descent into Matcha Obsession
- Three Months of Learning Spanish and What Actually Stuck
- Why My Houseplants Keep Surviving Despite My Neglect
- The Snack I Judge People For Not Liking

**Sample comments** are also seeded against several posts for development and UI testing purposes.

To re-seed a fresh database:

```bash
pnpm db:migrate  # ensure schema is up to date
pnpm db:seed
```

---

## Project Structure

```
app/
  blog/
    page.tsx           # Blog listing page
    [slug]/
      page.tsx         # Individual post page
      actions.ts       # addComment Server Action
      comment-form.tsx # Comment form (Client Component)
components/
  Header.tsx
  Footer.tsx
lib/
  db/
    index.ts           # Drizzle client
    schema.ts          # posts + comments tables
    seed.ts            # Seed script
drizzle/               # Migration files
```

---

## Database Migrations & Rollbacks

Drizzle ORM does not have a direct "down" or rollback command for migrations. To revert a migration, follow this workflow:

1. **Update the Schema**: Remove or clear the changes that need to be reverted from `lib/db/schema.ts`. For example, if a migration created a table, remove that table from the schema.
2. **Generate a New Migration**: Run `pnpm db:generate`. Drizzle Kit will detect the removed table and generate a new SQL migration file containing the corresponding `DROP TABLE` command.
3. **Apply the Migration**: Run `pnpm db:migrate` to apply the newly generated migration to your database, effectively rolling back the changes.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon Documentation](https://neon.tech/docs)
