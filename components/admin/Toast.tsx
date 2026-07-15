"use client";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
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

// ── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
	return ctx;
}

// ── Variant config ────────────────────────────────────────────────────────────
const VARIANT_CONFIG: Record<
	ToastVariant,
	{ bg: string; border: string; icon: React.ReactNode; titleColor: string }
> = {
	success: {
		bg: "bg-white",
		border: "border-green-400",
		icon: <CheckCircle size={18} className="text-green-500 shrink-0" />,
		titleColor: "text-[#1a2e1a]",
	},
	error: {
		bg: "bg-white",
		border: "border-red-400",
		icon: <XCircle size={18} className="text-red-500 shrink-0" />,
		titleColor: "text-red-700",
	},
	warning: {
		bg: "bg-white",
		border: "border-amber-400",
		icon: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
		titleColor: "text-amber-700",
	},
	info: {
		bg: "bg-white",
		border: "border-blue-400",
		icon: <Info size={18} className="text-blue-500 shrink-0" />,
		titleColor: "text-blue-700",
	},
};

// ── Single toast item ─────────────────────────────────────────────────────────
const AUTO_DISMISS_MS = 4500;

function ToastItem({
	toast,
	onDismiss,
}: {
	toast: Toast;
	onDismiss: (id: string) => void;
}) {
	const cfg = VARIANT_CONFIG[toast.variant];
	const [visible, setVisible] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Slide in
	useEffect(() => {
		requestAnimationFrame(() => setVisible(true));
	}, []);

	// Auto dismiss
	useEffect(() => {
		timerRef.current = setTimeout(() => {
			setVisible(false);
			setTimeout(() => onDismiss(toast.id), 300);
		}, AUTO_DISMISS_MS);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [toast.id, onDismiss]);

	function dismiss() {
		if (timerRef.current) clearTimeout(timerRef.current);
		setVisible(false);
		setTimeout(() => onDismiss(toast.id), 300);
	}

	return (
		<div
			className={`w-80 rounded-xl border-l-4 ${cfg.border} ${cfg.bg} shadow-lg px-4 py-3.5
			            flex items-start gap-3 transition-all duration-300
			            ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
			role="alert"
			aria-live="polite"
		>
			{cfg.icon}
			<div className="flex-1 min-w-0">
				<p className={`text-sm font-semibold leading-snug ${cfg.titleColor}`}>
					{toast.title}
				</p>
				{toast.message && (
					<p className="text-xs text-[#5a7a5a] mt-0.5 leading-relaxed">
						{toast.message}
					</p>
				)}
			</div>
			<button
				type="button"
				onClick={dismiss}
				className="shrink-0 mt-0.5 text-[#9ab09a] hover:text-[#1a2e1a] transition-colors"
				aria-label="Dismiss notification"
			>
				<X size={14} />
			</button>
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

			{/* Toast stack — top right */}
			<div
				aria-live="polite"
				aria-atomic="false"
				className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
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
