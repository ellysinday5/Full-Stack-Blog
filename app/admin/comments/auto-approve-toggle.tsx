"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/admin/Toast";
import { toggleAutoApprove } from "../moderation-actions";

interface Props {
	initialEnabled: boolean;
}

export function AutoApproveToggle({ initialEnabled }: Props) {
	const [enabled, setEnabled] = useState(initialEnabled);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	function handleToggle() {
		const nextState = !enabled;
		setEnabled(nextState);

		startTransition(async () => {
			const fd = new FormData();
			fd.set("enabled", nextState ? "true" : "false");
			const result = await toggleAutoApprove({}, fd);

			if (result.error) {
				setEnabled(enabled); // Rollback state on error
				toast({
					variant: "error",
					title: "Failed to update setting",
					message: result.error,
				});
			} else {
				toast({
					variant: "success",
					title: nextState ? "Auto-approve Enabled" : "Auto-approve Disabled",
					message: nextState
						? "New comments will be automatically approved."
						: "New comments will require manual approval.",
				});
			}
		});
	}

	return (
		<div className="flex items-center gap-4 rounded-xl border border-[#dcefe3] bg-white px-5 py-3 shadow-sm select-none transition-all duration-300 hover:border-[#1f6f4d]/30">
			<div className="flex flex-col">
				<span className="text-sm font-semibold text-[#1a2e1a]">
					Auto-approve Comments
				</span>
				<span className="text-xs text-[#7a9a7a]">
					Skip moderation queue for new comments
				</span>
			</div>
			<button
				type="button"
				onClick={handleToggle}
				disabled={isPending}
				className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1a2e1a]/20 disabled:opacity-50 ${
					enabled ? "bg-[#1f6f4d]" : "bg-[#dcefe3]"
				}`}
				role="switch"
				aria-checked={enabled}
			>
				<span
					aria-hidden="true"
					className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
						enabled ? "translate-x-5" : "translate-x-0"
					}`}
				/>
			</button>
		</div>
	);
}
