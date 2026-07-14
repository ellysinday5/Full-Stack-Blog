"use client";

import { ChevronLeft, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const IMAGES = [
	"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1448375240586-882707db8855?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
];

export default function ContactPage() {
	const [currentImage, setCurrentImage] = useState(0);
	const [errors, setErrors] = useState({ name: false, email: false });

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % IMAGES.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const nextImage = () => setCurrentImage((prev) => (prev + 1) % IMAGES.length);
	const prevImage = () =>
		setCurrentImage((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;

		setErrors({
			name: !name,
			email: !email,
		});

		if (name && email) {
			alert("Message sent!");
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
							Contact Us
						</h1>
						<p className="text-base leading-relaxed text-[#4c6f5e]">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
							tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
						</p>
					</div>
				</section>

				{/* Info Icons Row */}
				<section className="max-w-[1000px] mx-auto px-6 py-12 mb-8">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
						{/* Icon 1: Address */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<MapPin className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Physical Address
							</h3>
							<p className="text-slate-500 text-sm leading-loose">
								304 North Cardinal St.
								<br />
								Dorchester Center, MA 02124
							</p>
						</div>
						{/* Icon 2: Email */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<Mail className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Email Address
							</h3>
							<p className="text-slate-500 text-sm leading-loose">
								info@company.com
								<br />
								contact@company.com
							</p>
						</div>
						{/* Icon 3: Phone */}
						<div className="flex flex-col items-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#cfe8da] bg-[#eef8f1] shadow-sm">
								<Phone className="h-6 w-6 text-[#175a3d]" />
							</div>
							<h3 className="mb-3 text-lg font-bold text-[#0f3d2e] font-serif">
								Phone Numbers
							</h3>
							<p className="text-slate-500 text-sm leading-loose">
								1-555-123-4567
								<br />
								1-800-123-4567
							</p>
						</div>
					</div>
				</section>

				{/* Form & Slideshow */}
				<section className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 py-12 items-start">
					{/* Slideshow */}
					<div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/5] bg-emerald-50 group shadow-lg border border-slate-200">
						{/* biome-ignore lint/performance/noImgElement: external image source */}
						<img
							src={IMAGES[currentImage]}
							alt="Nature slides"
							className="w-full h-full object-cover transition-opacity duration-500"
						/>
						<button
							type="button"
							onClick={prevImage}
							className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>
						<button
							type="button"
							onClick={nextImage}
							className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
							aria-label="Next image"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
						<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
							{IMAGES.map((img, i) => (
								<button
									type="button"
									key={img}
									onClick={() => setCurrentImage(i)}
									aria-label={`Go to slide ${i + 1}`}
									className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/50 hover:bg-white"}`}
								/>
							))}
						</div>
					</div>

					{/* Contact Form */}
					<div className="py-4 md:pl-6">
						<h2 className="mb-10 text-3xl font-bold text-[#0f3d2e] md:text-4xl font-serif">
							We'd love To Hear From You!
						</h2>
						<form className="space-y-6" onSubmit={handleSubmit} noValidate>
							<div className="space-y-2">
								<Label htmlFor="name" className="text-slate-700">
									First & Last Name <span className="text-destructive">*</span>
								</Label>
								<Input
									type="text"
									id="name"
									name="name"
									className={`bg-white text-slate-900 ${errors.name ? "border-destructive focus-visible:ring-destructive" : "border-slate-300 focus-visible:ring-emerald-500"}`}
								/>
								{errors.name && (
									<p className="text-destructive text-sm font-medium">
										This field is required.
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-slate-700">
									Email Address <span className="text-destructive">*</span>
								</Label>
								<Input
									type="email"
									id="email"
									name="email"
									className={`bg-white text-slate-900 ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-slate-300 focus-visible:ring-emerald-500"}`}
								/>
								{errors.email && (
									<p className="text-destructive text-sm font-medium">
										This field is required.
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
									className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500 resize-none"
								/>
							</div>
							<div className="pt-2">
								<Button
									type="submit"
									className="w-full rounded-lg bg-[#0f3d2e] px-8 py-6 text-base text-white hover:bg-[#14553a] sm:w-auto"
								>
									Send Message
								</Button>
							</div>
						</form>
					</div>
				</section>
			</main>
		</div>
	);
}
