import Link from "next/link";
import { PostForm } from "./post-form";

export const metadata = {
	title: "Admin | Create Post",
	description: "Create a new blog post",
};

export default function AdminPage() {
	return (
		<main className="min-h-screen bg-muted py-12">
			<div className="mx-auto max-w-3xl px-6">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground">Admin</h1>
					<Link
						href="/admin/comments"
						className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted transition-colors"
					>
						Moderate Comments →
					</Link>
				</div>
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<h2 className="mb-6 text-xl font-bold text-card-foreground">
						Create New Post
					</h2>
					<PostForm />
				</div>
			</div>
		</main>
	);
}
