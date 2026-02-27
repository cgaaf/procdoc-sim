<script lang="ts">
	import { getAppState } from '$lib/state/context';
	import EpicButton from '$lib/components/ui/EpicButton.svelte';

	const state = getAppState();

	let presets = $derived.by(() => {
		if (state.selectedUltrasoundType === 'dvt') {
			return [
				{ label: 'Normal Left', action: () => state.applyNormalDvtLeft() },
				{ label: 'Normal Right', action: () => state.applyNormalDvtRight() },
				{ label: 'Normal Bilateral', action: () => state.applyNormalDvtBilateral() }
			];
		}
		return [
			{ label: 'Normal Cardiac', action: () => state.applyNormalCardiac() },
			{ label: 'Normal Lung', action: () => state.applyNormalLung() },
			{ label: 'Normal Abdomen', action: () => state.applyNormalAbdomen() },
			{ label: 'Normal FAST', action: () => state.applyNormalFAST() },
			{ label: 'Normal E-FAST', action: () => state.applyNormalEFAST() }
		];
	});
</script>

<div class="flex items-center px-3">
	<span class="font-epic text-[11px] font-bold" style:color="var(--color-text-primary)">Macros:</span>
	<div class="ml-1.5 flex flex-wrap gap-1">
		{#each presets as preset, i}
			<EpicButton
				label="{i + 1}. {preset.label}"
				compact
				onclick={preset.action}
			/>
		{/each}
		<EpicButton
			label="Clear All"
			compact
			onclick={() => state.selectUltrasoundType(state.selectedUltrasoundType!)}
		/>
	</div>
</div>
