import { redirect } from "next/navigation";

// Legacy redirect — /admin/login was the old login path.
// Permanently redirect to the current sign-in page, preserving query params.
export default async function AdminLoginLegacyPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) {
	const params = await searchParams;
	const qs = new URLSearchParams(params).toString();
	const destination = qs ? `/admin/sign-in?${qs}` : "/admin/sign-in";
	redirect(destination);
}
