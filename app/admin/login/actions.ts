"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
	error?: string;
};

export async function adminLogin(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const password = formData.get("password") as string;
	const from = (formData.get("from") as string) || "/admin";

	if (!password) {
		return { error: "Password is required." };
	}

	if (password !== process.env.ADMIN_PASSWORD) {
		return { error: "Incorrect password. Try again." };
	}

	// Set a secure HttpOnly session cookie — 8 hour expiry
	const cookieStore = await cookies();
	cookieStore.set("admin_session", "authenticated", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 8,
	});

	// Append welcome flag so the admin layout can show a toast
	const destination = from.includes("?")
		? `${from}&welcome=1`
		: `${from}?welcome=1`;

	redirect(destination);
}

export async function adminLogout(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete("admin_session");
	redirect("/admin/login");
}
