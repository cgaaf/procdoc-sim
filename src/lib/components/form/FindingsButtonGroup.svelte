<script lang="ts">
	import type { FindingsButtonGroupDef } from '$lib/types/procdoc-definition';
	import { getAppState } from '$lib/state/context';
	import FindingCommentModal from './FindingCommentModal.svelte';

	let { group }: { group: FindingsButtonGroupDef } = $props();

	const appState = getAppState();

	let commentModalOpen = $state(false);
	let hasComment = $derived(group.commentable ? appState.getComment(group.macroId) !== '' : false);

	let selectedSet = $derived.by((): Set<string> => {
		if (group.multiSelect) {
			return appState.macroSelections.getMulti(group.macroId);
		}
		const single = appState.macroSelections.get(group.macroId);
		return single != null ? new Set([single]) : new Set();
	});

	function handleTap(option: string) {
		if (group.multiSelect) {
			handleMultiTap(option);
		} else {
			const isSelected = selectedSet.has(option);
			appState.setMacroSelection(group.macroId, isSelected ? null : option);
		}
	}

	function handleMultiTap(option: string) {
		const isExclusive = group.exclusiveOptions.has(option);
		const alreadySelected = selectedSet.has(option);

		let next: Set<string>;

		if (alreadySelected) {
			next = new Set(selectedSet);
			next.delete(option);
		} else if (isExclusive) {
			next = new Set([option]);
		} else {
			next = new Set(selectedSet);
			next.add(option);
			for (const ex of group.exclusiveOptions) {
				next.delete(ex);
			}
		}

		appState.setMultiMacroSelection(group.macroId, next);
	}
</script>

<div class="flex flex-wrap items-center gap-1.5 py-[2px]">
	{#each group.options as option}
		{@const isSelected = selectedSet.has(option)}
		<button
			class="bold-stable rounded-[3px] border px-2.5 py-1.5 font-epic text-[11px] transition-colors"
			class:font-semibold={isSelected}
			data-text={option}
			style:background-color={isSelected ? 'var(--color-btn-selected-bg)' : 'var(--color-btn-default-bg)'}
			style:border-color={isSelected ? 'var(--color-btn-selected-border)' : 'var(--color-btn-default-border)'}
			style:color={isSelected ? 'var(--color-btn-selected-text)' : 'var(--color-text-primary)'}
			onclick={() => handleTap(option)}
		>
			{option}
		</button>
	{/each}
	{#if group.commentable}
		<button
			class="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
			onclick={() => commentModalOpen = true}
			title="Add comment"
		>
			{#if hasComment}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#616161" stroke-width="1.5" class="h-[18px] w-[18px]">
					<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
					<polyline points="14 2 14 8 20 8" />
					<line x1="8" y1="13" x2="16" y2="13" />
					<line x1="8" y1="17" x2="16" y2="17" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" stroke-width="1.5" class="h-[18px] w-[18px]">
					<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
					<polyline points="14 2 14 8 20 8" />
				</svg>
			{/if}
		</button>
	{/if}
</div>

{#if commentModalOpen}
	<FindingCommentModal
		label={group.macroId === 'macro_7_left' ? 'Left Hemithorax' : group.macroId === 'macro_7_right' ? 'Right Hemithorax' : group.macroId}
		macroId={group.macroId}
		onclose={() => commentModalOpen = false}
	/>
{/if}

<style>
	/* Hidden bold reserve: an invisible pseudo-element always renders the
	   button text in bold, reserving the maximum width so toggling
	   font-weight on the visible text never causes a size shift. */
	.bold-stable {
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	.bold-stable::after {
		content: attr(data-text);
		font-weight: 600;
		height: 0;
		overflow: hidden;
		visibility: hidden;
		display: block;
		pointer-events: none;
	}
</style>
