"use client";

import { useEffect } from "react";

// ── Backdrop + shell shared by all modals ─────────────────────────────────────
function ModalShell({
	open,
	onClose,
	children,
	labelId,
}: {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	labelId?: string;
}) {
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
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-80 bg-black/60 backdrop-blur-sm cursor-default w-full h-full"
				onClick={onClose}
				aria-label="Close dialog"
			/>
			{/* Dialog wrapper */}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={labelId}
				className="fixed inset-0 z-90 flex items-center justify-center p-4 pointer-events-none"
			>
				<div
					className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl"
					style={{
						background: "linear-gradient(135deg, #0f2d1e 0%, #0a1f15 100%)",
						boxShadow:
							"0 0 60px rgba(22,163,74,0.10), 0 25px 50px rgba(0,0,0,0.7)",
					}}
				>
					{children}
				</div>
			</div>
		</>
	);
}

// ── Base Modal (for richer content like the comment review) ───────────────────
interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
	return (
		<ModalShell open={open} onClose={onClose} labelId="modal-title">
			<div className="w-full max-w-md" style={{ maxWidth: "28rem" }}>
				{title && (
					<div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
						<h3 id="modal-title" className="text-base font-bold text-white">
							{title}
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
							aria-label="Close"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				)}
				{children}
			</div>
		</ModalShell>
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
	showIcon?: boolean;
}

// Icon paths per variant
const VARIANT_ICONS: Record<ConfirmVariant, string> = {
	danger:
		"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
	success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
	warning:
		"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
};

// Icon ring + fill colors
const VARIANT_ICON_CLS: Record<
	ConfirmVariant,
	{ ring: string; bg: string; color: string }
> = {
	danger: {
		ring: "border-red-500/20",
		bg: "bg-red-500/10",
		color: "text-red-400",
	},
	success: {
		ring: "border-green-500/20",
		bg: "bg-green-500/10",
		color: "text-green-400",
	},
	warning: {
		ring: "border-yellow-500/20",
		bg: "bg-yellow-500/10",
		color: "text-yellow-400",
	},
};

// Confirm button colors
const VARIANT_CONFIRM_CLS: Record<ConfirmVariant, string> = {
	danger: "bg-red-600 hover:bg-red-700",
	success: "bg-[#1a2e1a] hover:bg-[#253e25]",
	warning: "bg-yellow-600 hover:bg-yellow-700",
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
	showIcon = true,
}: ConfirmModalProps) {
	const icon = VARIANT_ICONS[variant];
	const iconCls = VARIANT_ICON_CLS[variant];
	const confirmCls = VARIANT_CONFIRM_CLS[variant];

	return (
		<ModalShell open={open} onClose={onClose} labelId="confirm-dialog-title">
			<div className="p-7">
				{/* Icon — optional */}
				{showIcon && (
					<div
						className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${iconCls.ring} ${iconCls.bg}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-6 w-6 ${iconCls.color}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.8}
							aria-hidden="true"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d={icon} />
						</svg>
					</div>
				)}

				<h2
					id="confirm-dialog-title"
					className="mb-1.5 text-center text-lg font-bold text-white"
				>
					{title}
				</h2>
				<p className="mb-6 text-center text-sm text-white/50">{message}</p>

				<div className="flex gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/8 hover:text-white disabled:opacity-40"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={loading}
						className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${confirmCls}`}
					>
						{loading ? "Processing…" : confirmLabel}
					</button>
				</div>
			</div>
		</ModalShell>
	);
}
