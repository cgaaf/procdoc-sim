<script lang="ts">
	import { ULTRASOUND_TYPES } from '$lib/types/procedure';
	import { getAppState } from '$lib/state/context';
	import EpicButton from '$lib/components/ui/EpicButton.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';

	const state = getAppState();
</script>

<div class="px-3">
	<SectionHeader title="Procedure Performed" />
	<div class="flex flex-wrap gap-1.5">
		{#each ULTRASOUND_TYPES as type}
			<div class="w-[180px]">
				<EpicButton
					label={type.displayName}
					selected={state.selectedUltrasoundType === type.value}
					onclick={() => state.selectUltrasoundType(type.value)}
				/>
			</div>
		{/each}
	</div>
</div>
