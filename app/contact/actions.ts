"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

export const contactSchema = z.object({
	name: z.string().min(1, "First & Last Name is required"),
	email: z
		.string()
		.min(1, "Email is required")
		.regex(
			/^[a-zA-Z0-9._%+-]+@gmail\.com$/,
			"Email must be a @gmail.com address",
		),
	subject: z.string().optional(),
	message: z.string().optional(),
});

export type ContactFormState = {
	success?: boolean;
	data?: {
		name?: string;
		email?: string;
		subject?: string;
		message?: string;
	};
	errors?: {
		name?: string;
		email?: string;
		subject?: string;
		message?: string;
	};
};

export async function submitContactForm(
	_prevState: ContactFormState,
	formData: FormData,
): Promise<ContactFormState> {
	const name = formData.get("name")?.toString() || "";
	const email = formData.get("email")?.toString() || "";
	const subject = formData.get("subject")?.toString() || "";
	const message = formData.get("message")?.toString() || "";

	const parsed = contactSchema.safeParse({
		name,
		email,
		subject: subject || undefined,
		message: message || undefined,
	});

	if (!parsed.success) {
		const fieldErrors = parsed.error.flatten().fieldErrors;
		return {
			success: false,
			data: { name, email, subject, message },
			errors: {
				name: fieldErrors.name?.[0],
				email: fieldErrors.email?.[0],
				subject: fieldErrors.subject?.[0],
				message: fieldErrors.message?.[0],
			},
		};
	}

	// Since there is no contact messages table, we just mock the success response.
	revalidatePath("/contact");

	return {
		success: true,
	};
}
