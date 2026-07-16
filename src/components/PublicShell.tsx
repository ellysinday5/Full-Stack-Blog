import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/NavBar";

export function PublicShell({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense
				fallback={
					<header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[#0f3d2e]/95" />
				}
			>
				<Header />
			</Suspense>
			<div className="flex-1">{children}</div>
			<Footer />
		</>
	);
}
