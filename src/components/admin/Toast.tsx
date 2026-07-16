"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
	id: string;
	title: string;
	message?: string;
	variant: ToastVariant;
}

interface ToastContextValue {
	toast: (opts: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		// Return a no-op during SSR or when used outside provider
		// (throw only in development to help catch real mistakes)
		if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
			throw new Error("useToast must be used inside <ToastProvider>");
		}
		return { toast: () => {} } as ToastContextValue;
	}
	return ctx;
}

// ── Variant config ────────────────────────────────────────────────────────────
const VARIANTS: Record<
	ToastVariant,
	{
		bar: string;
		iconBg: string;
		iconColor: string;
		icon: React.ReactNode;
	}
> = {
	success: {
		bar: "bg-emerald-400",
		iconBg: "bg-emerald-400/15",
		iconColor: "text-emerald-400",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
				<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		),
	},
	error: {
		bar: "bg-red-400",
		iconBg: "bg-red-400/15",
		iconColor: "text-red-400",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
				<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		),
	},
	warning: {
		bar: "bg-amber-400",
		iconBg: "bg-amber-400/15",
		iconColor: "text-amber-400",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
			</svg>
		),
	},
	info: {
		bar: "bg-blue-400",
		iconBg: "bg-blue-400/15",
		iconColor: "text-blue-400",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
				<path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
	},
};

const AUTO_DISMISS_MS = 4500;

// ── Single toast item ─────────────────────────────────────────────────────────
function ToastItem({
	toast,
	onDismiss,
}: {
	toast: Toast;
	onDismiss: (id: string) => void;
}) {
	const cfg = VARIANTS[toast.variant];
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(100);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startRef = useRef<number>(Date.now());
	const rafRef = useRef<number | null>(null);

	// Animate progress bar
	function startProgress() {
		startRef.current = Date.now();
		function tick() {
			const elapsed = Date.now() - startRef.current;
			const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
			setProgress(remaining);
			if (remaining > 0) {
				rafRef.current = requestAnimationFrame(tick);
			}
		}
		rafRef.current = requestAnimationFrame(tick);
	}

	function stopProgress() {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
	}

	useEffect(() => {
		// Slide in
		requestAnimationFrame(() => setVisible(true));
		startProgress();

		timerRef.current = setTimeout(() => {
			setVisible(false);
			setTimeout(() => onDismiss(toast.id), 350);
		}, AUTO_DISMISS_MS);

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			stopProgress();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toast.id]);

	function dismiss() {
		if (timerRef.current) clearTimeout(timerRef.current);
		stopProgress();
		setVisible(false);
		setTimeout(() => onDismiss(toast.id), 350);
	}

	return (
		<div
			role="alert"
			aria-live="polite"
			className={`relative w-80 overflow-hidden rounded-xl shadow-2xl border border-white/8 transition-all duration-350
				${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}`}
			style={{
				background: "linear-gradient(135deg, #0f2d1e 0%, #0a1f15 100%)",
				boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)",
			}}
		>
			{/* Content row */}
			<div className="flex items-start gap-3 px-4 pt-4 pb-3.5">
				{/* Icon */}
				<div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${cfg.iconBg} ${cfg.iconColor}`}>
					{cfg.icon}
				</div>

				{/* Text */}
				<div className="flex-1 min-w-0 pt-0.5">
					<p className="text-sm font-semibold text-white leading-snug">
						{toast.title}
					</p>
					{toast.message && (
						<p className="text-xs text-white/50 mt-0.5 leading-relaxed">
							{toast.message}
						</p>
					)}
				</div>

				{/* Dismiss */}
				<button
					type="button"
					onClick={dismiss}
					className="shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-colors"
					aria-label="Dismiss"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			{/* Progress bar */}
			<div className="h-0.5 w-full bg-white/5">
				<div
					className={`h-full ${cfg.bar} transition-none`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((opts: Omit<Toast, "id">) => {
		const id = `${Date.now()}-${Math.random()}`;
		setToasts((prev) => [...prev, { ...opts, id }]);
	}, []);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast: addToast }}>
			{children}

			{/* Toast stack — bottom right */}
			<div
				aria-live="polite"
				aria-atomic="false"
				className="fixed bottom-5 right-5 z-9999 flex flex-col gap-2.5 pointer-events-none"
			>
				{toasts.map((t) => (
					<div key={t.id} className="pointer-events-auto">
						<ToastItem toast={t} onDismiss={dismiss} />
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}
