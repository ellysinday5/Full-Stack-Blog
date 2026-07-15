"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

// ── Base Modal ────────────────────────────────────────────────────────────────
interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	maxWidth?: string;
}

export function Modal({
	open,
	onClose,
	title,
	children,
	maxWidth = "max-w-md",
}: ModalProps) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<button
				type="button"
				className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
				onClick={onClose}
				aria-label="Close modal"
			/>
			{/* Panel */}
			<div
				className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-[#c4d4c4] bg-white shadow-2xl`}
				role="dialog"
				aria-modal="true"
			>
				{title && (
					<div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#e8ede8]">
						<h3 className="text-base font-bold text-[#1a2e1a]">{title}</h3>
						<button
							type="button"
							onClick={onClose}
							className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#c4d4c4] text-[#7a9a7a] hover:bg-[#e8ede8] hover:text-[#1a2e1a] transition-colors"
							aria-label="Close"
						>
							<X size={14} />
						</button>
					</div>
				)}
				{children}
			</div>
		</div>
	);
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
type ConfirmVariant = "danger" | "success" | "warning";

interface ConfirmModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: ConfirmVariant;
	loading?: boolean;
}

const VARIANT_STYLES: Record<
	ConfirmVariant,
	{ icon: string; confirm: string; iconColor: string }
> = {
	danger: {
		icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
		iconColor: "text-red-500",
		confirm:
			"bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700",
	},
	success: {
		icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
		iconColor: "text-green-600",
		confirm:
			"bg-[#1a2e1a] border-[#1a2e1a] text-white hover:bg-[#253e25] hover:border-[#253e25]",
	},
	warning: {
		icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
		iconColor: "text-amber-500",
		confirm:
			"bg-amber-500 border-amber-500 text-white hover:bg-amber-600 hover:border-amber-600",
	},
};

export function ConfirmModal({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "danger",
	loading = false,
}: ConfirmModalProps) {
	const styles = VARIANT_STYLES[variant];

	return (
		<Modal open={open} onClose={onClose}>
			<div className="px-6 py-6 text-center">
				{/* Icon */}
				<div
					className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variant === "danger" ? "bg-red-50" : variant === "success" ? "bg-green-50" : "bg-amber-50"}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-6 w-6 ${styles.iconColor}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d={styles.icon}
						/>
					</svg>
				</div>

				{/* Text */}
				<h3 className="text-base font-bold text-[#1a2e1a] mb-2">{title}</h3>
				<p className="text-sm text-[#5a7a5a] leading-relaxed mb-6">{message}</p>

				{/* Buttons */}
				<div className="flex items-center justify-center gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="rounded-lg border border-[#1a2e1a]/30 bg-white px-5 py-2 text-sm font-semibold text-[#1a2e1a] hover:bg-[#f4f8f4] disabled:opacity-50 transition-colors"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={loading}
						className={`rounded-lg border px-5 py-2 text-sm font-semibold disabled:opacity-50 transition-colors ${styles.confirm}`}
					>
						{loading ? "Processing…" : confirmLabel}
					</button>
				</div>
			</div>
		</Modal>
	);
}
