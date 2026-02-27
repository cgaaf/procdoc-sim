<script lang="ts">
	import type { FindingsButtonGroupDef } from '$lib/types/procdoc-definition';
	import { getAppState } from '$lib/state/context';

	let { group }: { group: FindingsButtonGroupDef } = $props();

	const state = getAppState();

	let selectedSet = $derived.by((): Set<string> => {
		if (group.multiSelect) {
			return state.macroSelections.getMulti(group.macroId);
		}
		const single = state.macroSelections.get(group.macroId);
		return single != null ? new Set([single]) : new Set();
	});

	function handleTap(option: string) {
		if (group.multiSelect) {
			handleMultiTap(option);
		} else {
			const isSelected = selectedSet.has(option);
			state.setMacroSelection(group.macroId, isSelected ? null : option);
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

		state.setMultiMacroSelection(group.macroId, next);
	}
</script>

<div class="flex flex-wrap gap-1.5 py-[2px]">
	{#each group.options as option}
		{@const isSelected = selectedSet.has(option)}
		<button
			class="rounded-[3px] border px-2.5 py-1.5 font-epic text-[11px] transition-colors"
			class:font-semibold={isSelected}
			style:background-color={isSelected ? 'var(--color-btn-selected-bg)' : 'var(--color-btn-default-bg)'}
			style:border-color={isSelected ? 'var(--color-btn-selected-border)' : 'var(--color-btn-default-border)'}
			style:color={isSelected ? 'var(--color-btn-selected-text)' : 'var(--color-text-primary)'}
			onclick={() => handleTap(option)}
		>
			{option}
		</button>
	{/each}
</div>
