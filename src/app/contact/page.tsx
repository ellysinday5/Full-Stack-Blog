"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { Header } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, submitContactForm } from "./actions";

export default function ContactPage() {
	const [state, formAction, isPending] = useActionState(submitContactForm, {});
	const [values, setValues] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [localErrors, setLocalErrors] = useState<{
		name?: string;
		email?: string;
	}>({});

	// Sync with server action response
	useEffect(() => {
		if (state.success) {
			alert("Message sent!");
			setValues({ name: "", email: "", subject: "", message: "" });
			setLocalErrors({});
		} else if (state.errors) {
			setLocalErrors(state.errors);
		}
		if (state.data) {
			setValues((prev) => ({ ...prev, ...state.data }));
		}
	}, [state]);

	const handleBlur = (fieldName: "name" | "email") => {
		const fieldSchema = contactSchema.shape[fieldName];
		const result = fieldSchema.safeParse(values[fieldName]);
		if (!result.success) {
			setLocalErrors((prev) => ({
				...prev,
				[fieldName]: result.error.issues[0].message,
			}));
		} else {
			setLocalErrors((prev) => ({ ...prev, [fieldName]: undefined }));
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const result = contactSchema.safeParse(values);
		if (!result.success) {
			e.preventDefault();
			const fieldErrors = result.error.flatten().fieldErrors;
			setLocalErrors({
				name: fieldErrors.name?.[0],
				email: fieldErrors.email?.[0],
			});
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#f7fdf9_0%,#eef8f1_100%)]">
			<Header />
			<main className="flex-grow pb-20 pt-16">
				{/* Hero */}
				<section className="relative py-32 text-center overflow-hidden">
					<div className="absolute inset-0 z-0">
						{/* biome-ignore lint/performance/noImgElement: external image source */}
						<img
							src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=1920&q=80"
							alt="Forest"
							className="w-full h-full object-cover opacity-10"
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-[#f7fdf9]/70 to-[#f7fdf9]" />
					</div>
					<div className="relative z-10 max-w-2xl mx-auto px-6">
						<h1 className="mb-6 text-5xl font-bold text-[#0f3d2e] md:text-6xl font-serif">
							Contact Me!
						</h1>
						<p className="text-base leading-relaxed text-[#4c6f5e]">
							Get in touch with me through any of the channels below.
						</p>
					</div>
				</section>

				{/* Info Icons Row */}
				<section className="max-w-[1200px] mx-auto px-6 py-12 mb-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
						{/* Icon 1: Address */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<MapPin className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Physical Address
							</h3>
							<p className="text-slate-500 text-sm leading-loose">
								306 Dr. Sixto Antonio,
								<br />
								Caniogan, Pasig City
							</p>
						</div>
						{/* Icon 2: Phone */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<Phone className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Phone Number
							</h3>
							<p className="text-slate-500 text-sm leading-loose">
								0991 016 3610
							</p>
						</div>
						{/* Icon 3: Email */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<Mail className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Email Address
							</h3>
							<p className="text-slate-500 text-sm leading-loose break-all">
								ellysinday5@gmail.com
							</p>
						</div>
						{/* Icon 4: Website */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<Globe className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Website
							</h3>
							<p className="text-slate-500 text-sm leading-loose">
								Portfolio Website
							</p>
						</div>
					</div>
				</section>

				{/* Form & Image */}
				<section className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 py-12 items-start">
					{/* Logo Image */}
					<div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/5] bg-white/50 border border-slate-200">
						<Image
							src="/images/blog logo.png"
							alt="Blog Logo"
							fill
							className="object-cover"
						/>
					</div>

					{/* Contact Form */}
					<div className="py-4 md:pl-6">
						<h2 className="mb-10 text-3xl font-bold text-[#0f3d2e] md:text-4xl font-serif">
							Send Message Here!
						</h2>
						<form
							className="space-y-6"
							onSubmit={handleSubmit}
							action={formAction}
							noValidate
						>
							<div className="space-y-2">
								<Label htmlFor="name" className="text-slate-700">
									First & Last Name <span className="text-red-500">*</span>
								</Label>
								<Input
									type="text"
									id="name"
									name="name"
									value={values.name}
									onChange={(e) =>
										setValues((prev) => ({ ...prev, name: e.target.value }))
									}
									onBlur={() => handleBlur("name")}
									className={`bg-white text-slate-900 ${localErrors.name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-emerald-500"}`}
								/>
								{localErrors.name && (
									<p className="text-red-500 text-sm font-medium">
										{localErrors.name}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-slate-700">
									Email Address <span className="text-red-500">*</span>
								</Label>
								<Input
									type="email"
									id="email"
									name="email"
									value={values.email}
									onChange={(e) =>
										setValues((prev) => ({ ...prev, email: e.target.value }))
									}
									onBlur={() => handleBlur("email")}
									className={`bg-white text-slate-900 ${localErrors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-emerald-500"}`}
								/>
								{localErrors.email && (
									<p className="text-red-500 text-sm font-medium">
										{localErrors.email}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="subject" className="text-slate-700">
									Subject
								</Label>
								<Input
									type="text"
									id="subject"
									name="subject"
									value={values.subject}
									onChange={(e) =>
										setValues((prev) => ({ ...prev, subject: e.target.value }))
									}
									className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="message" className="text-slate-700">
									Comment or Message
								</Label>
								<Textarea
									id="message"
									name="message"
									rows={4}
									value={values.message}
									onChange={(e) =>
										setValues((prev) => ({ ...prev, message: e.target.value }))
									}
									className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500 resize-none"
								/>
							</div>
							<div className="pt-2">
								<Button
									type="submit"
									disabled={isPending}
									className="w-full rounded-lg bg-[#0f3d2e] px-8 py-6 text-base text-white hover:bg-[#14553a] sm:w-auto disabled:opacity-50"
								>
									{isPending ? "Sending..." : "Send Message"}
								</Button>
							</div>
						</form>
					</div>
				</section>
			</main>
		</div>
	);
}
