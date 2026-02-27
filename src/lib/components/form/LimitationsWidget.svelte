<script lang="ts">
	import { getAppState } from '$lib/state/context';

	let { options }: { options: string[] } = $props();

	const state = getAppState();

	let noneSelected = $derived(state.selectedLimitations.size === 0);

	const allButtons = $derived.by(() => {
		return [
			{ label: 'None', isSelected: noneSelected },
			...options.map((opt) => ({
				label: opt,
				isSelected: state.selectedLimitations.has(opt)
			}))
		];
	});

	let topRow = $derived(allButtons.slice(0, Math.ceil(allButtons.length / 2)));
	let bottomRow = $derived(allButtons.slice(Math.ceil(allButtons.length / 2)));

	function handleNoneTap() {
		for (const opt of [...state.selectedLimitations]) {
			state.toggleLimitation(opt);
		}
	}

	function handleLimitationTap(label: string) {
		if (label === 'None') {
			handleNoneTap();
		} else {
			state.toggleLimitation(label);
		}
	}

	// FAST interpretation
	const fastInterpretationOptions = ['FAST Negative x 4', 'E-FAST Negative x 5', 'Positive FAST'];

	function handleFastInterpTap(option: string) {
		const currentValue = state.macroSelections.get('macro_8');
		if (option === 'FAST Negative x 4') {
			state.applyNegativeFAST4();
		} else if (option === 'E-FAST Negative x 5') {
			state.applyNegativeEFAST5();
		} else {
			if (currentValue === option) {
				state.setMacroSelection('macro_8', null);
			} else {
				state.setMacroSelection('macro_8', option);
			}
		}
	}
</script>

{#snippet limitButton(btn: { label: string; isSelected: boolean })}
	<button
		class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
		class:font-semibold={btn.isSelected}
		style:background-color={btn.isSelected ? 'var(--color-btn-selected-bg)' : 'var(--color-btn-default-bg)'}
		style:border-color={btn.isSelected ? 'var(--color-btn-selected-border)' : 'var(--color-btn-default-border)'}
		style:color={btn.isSelected ? 'var(--color-btn-selected-text)' : 'var(--color-text-primary)'}
		onclick={() => handleLimitationTap(btn.label)}
	>
		{btn.label}
	</button>
{/snippet}

<div class="pb-1.5">
	<p class="font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">Limitations:</p>
	<div class="mt-1 flex gap-1">
		{#each topRow as btn}
			{@render limitButton(btn)}
		{/each}
	</div>
	<div class="mt-1 flex gap-1">
		{#each bottomRow as btn}
			{@render limitButton(btn)}
		{/each}
	</div>

	<p class="mt-4 font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">Interpretation:</p>
	<div class="mt-1">
		{#if state.selectedUltrasoundType === 'dvt'}
			{@const dvtInterp = state.macroSelections.get('dvt_interp')}
			{@const label = dvtInterp ?? 'Pending (fill vessel findings)'}
			{@const isPositive = dvtInterp === 'Positive for DVT'}
			{@const isNegative = dvtInterp === 'Negative for DVT'}
			<div
				class="inline-block rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px]"
				class:font-semibold={dvtInterp != null}
				class:italic={dvtInterp == null}
				style:background-color={isPositive
					? 'var(--color-finding-present-bg)'
					: isNegative
						? 'var(--color-finding-absent-bg)'
						: 'var(--color-btn-default-bg)'}
				style:border-color={isPositive
					? 'var(--color-finding-present-border)'
					: isNegative
						? 'var(--color-finding-absent-border)'
						: 'var(--color-btn-default-border)'}
				style:color={isPositive
					? 'var(--color-finding-present-icon)'
					: isNegative
						? 'var(--color-finding-absent-icon)'
						: 'var(--color-text-primary)'}
			>
				{label}
			</div>
		{:else}
			{@const currentValue = state.macroSelections.get('macro_8')}
			<div class="flex gap-1">
				{#each fastInterpretationOptions as option}
					{@const isSelected = currentValue === option}
					<button
						class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
						class:font-semibold={isSelected}
						style:background-color={isSelected ? 'var(--color-btn-selected-bg)' : 'var(--color-btn-default-bg)'}
						style:border-color={isSelected ? 'var(--color-btn-selected-border)' : 'var(--color-btn-default-border)'}
						style:color={isSelected ? 'var(--color-btn-selected-text)' : 'var(--color-text-primary)'}
						onclick={() => handleFastInterpTap(option)}
					>
						{option}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<p class="mt-4 font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">Additional findings:</p>
	<textarea
		class="mt-1 w-full rounded-[2px] border p-2 font-epic text-[13px]"
		style:background-color="var(--color-input-bg)"
		style:border-color="var(--color-input-border)"
		style:color="var(--color-text-primary)"
		rows="2"
		bind:value={state.additionalFindings}
	></textarea>
</div>
