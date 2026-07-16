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
		topBar: string;       // thick top border color
		bg: string;           // card background
		border: string;       // card border
		titleColor: string;   // title text color
		msgColor: string;     // message text color
		dismissColor: string; // X button color
		progressBar: string;  // shrinking progress bar color
	}
> = {
	success: {
		topBar: "bg-green-600",
		bg: "bg-green-50",
		border: "border-green-200",
		titleColor: "text-green-800",
		msgColor: "text-green-700",
		dismissColor: "text-green-600 hover:text-green-800",
		progressBar: "bg-green-500",
	},
	error: {
		topBar: "bg-red-600",
		bg: "bg-red-50",
		border: "border-red-200",
		titleColor: "text-red-700",
		msgColor: "text-red-600",
		dismissColor: "text-red-500 hover:text-red-700",
		progressBar: "bg-red-500",
	},
	warning: {
		topBar: "bg-amber-500",
		bg: "bg-amber-50",
		border: "border-amber-200",
		titleColor: "text-amber-800",
		msgColor: "text-amber-700",
		dismissColor: "text-amber-600 hover:text-amber-800",
		progressBar: "bg-amber-500",
	},
	info: {
		topBar: "bg-blue-600",
		bg: "bg-blue-50",
		border: "border-blue-200",
		titleColor: "text-blue-800",
		msgColor: "text-blue-700",
		dismissColor: "text-blue-500 hover:text-blue-700",
		progressBar: "bg-blue-500",
	},
};

const AUTO_DISMISS_MS = 5000;

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
		requestAnimationFrame(() => setVisible(true));
		startProgress();

		timerRef.current = setTimeout(() => {
			setVisible(false);
			setTimeout(() => onDismiss(toast.id), 300);
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
		setTimeout(() => onDismiss(toast.id), 300);
	}

	return (
		<div
			role="alert"
			aria-live="polite"
			className={`w-80 overflow-hidden rounded-lg border shadow-md transition-all duration-300
				${cfg.bg} ${cfg.border}
				${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
		>
			{/* Thick top progress bar — drains as the toast auto-dismisses */}
			<div className="h-1 w-full bg-black/10">
				<div
					className={`h-full transition-none ${cfg.progressBar}`}
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Content */}
			<div className="flex items-start justify-between gap-3 px-4 py-3.5">
				<div className="flex-1 min-w-0">
					<p className={`text-sm font-bold leading-snug ${cfg.titleColor}`}>
						{toast.title}
					</p>
					{toast.message && (
						<p className={`text-xs mt-0.5 leading-relaxed ${cfg.msgColor}`}>
							{toast.message}
						</p>
					)}
				</div>

				{/* Dismiss × */}
				<button
					type="button"
					onClick={dismiss}
					className={`shrink-0 mt-0.5 text-base font-semibold leading-none transition-colors ${cfg.dismissColor}`}
					aria-label="Dismiss"
				>
					✕
				</button>
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
				className="fixed top-5 right-5 z-9999 flex flex-col gap-2.5 pointer-events-none"
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
