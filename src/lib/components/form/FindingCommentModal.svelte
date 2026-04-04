<script lang="ts">
	import { onMount } from 'svelte';
	import { getExamState } from '$lib/state/context';

	let {
		label,
		macroId,
		onclose
	}: {
		label: string;
		macroId: string;
		onclose: () => void;
	} = $props();

	const appState = getExamState();

	let dialogEl: HTMLDialogElement;
	let text = $state('');

	onMount(() => {
		text = appState.getComment(macroId);
		dialogEl.showModal();
	});

	function handleSave() {
		appState.setComment(macroId, text);
		onclose();
	}

	function handleCancel() {
		onclose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogEl) {
			onclose();
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	class="m-auto max-w-[400px] w-full rounded-[3px] border p-0 font-epic"
	style:background-color="var(--color-bg-surface)"
	style:border-color="var(--color-divider)"
	onclick={handleBackdropClick}
	onclose={handleCancel}
>
	<!-- Title bar -->
	<div
		class="flex items-center justify-between border-b px-3 py-2"
		style:border-color="var(--color-divider)"
	>
		<span class="text-[13px] font-semibold" style:color="var(--color-text-heading)">
			Comment: {label}
		</span>
		<button
			class="flex h-[22px] w-[22px] items-center justify-center rounded-[3px] border text-[14px] leading-none"
			style:background-color="var(--color-btn-default-bg)"
			style:border-color="var(--color-btn-default-border)"
			style:color="var(--color-text-primary)"
			onclick={handleCancel}
			aria-label="Close"
		>
			&times;
		</button>
	</div>

	<!-- Body -->
	<div class="px-3 py-3">
		<textarea
			bind:value={text}
			rows="4"
			class="w-full rounded-[3px] border p-2 font-epic text-[12px]"
			style:background-color="var(--color-input-bg)"
			style:border-color="var(--color-input-border)"
			style:color="var(--color-text-primary)"
		></textarea>
	</div>

	<!-- Button row -->
	<div class="flex justify-end gap-2 border-t px-3 py-2" style:border-color="var(--color-divider)">
		<button
			class="rounded-[3px] border px-3 py-1.5 font-epic text-[12px]"
			style:background-color="var(--color-btn-default-bg)"
			style:border-color="var(--color-btn-default-border)"
			style:color="var(--color-text-primary)"
			onclick={handleCancel}
		>
			Cancel
		</button>
		<button
			class="rounded-[3px] border px-3 py-1.5 font-epic text-[12px]"
			style:background-color="var(--color-btn-selected-bg)"
			style:border-color="var(--color-btn-selected-border)"
			style:color="var(--color-btn-selected-text)"
			onclick={handleSave}
		>
			Save
		</button>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
</style>
