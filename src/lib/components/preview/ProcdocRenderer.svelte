<script lang="ts">
	import { getAppState } from '$lib/state/context';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';

	const state = getAppState();
</script>

<div class="px-3">
	<SectionHeader title="Generated Note Preview" />
	<div
		class="w-full select-text rounded-[2px] border p-2.5"
		style:background-color="var(--color-bg-surface)"
		style:border-color="var(--color-divider)"
	>
		{#if state.assembledNote.length === 0}
			<span class="font-epic text-[13px] italic text-gray-400">
				Select an ultrasound type to see the procedure template.
			</span>
		{:else}
			{#each state.assembledNote as span}
				<span
					class="font-epic text-[13px]"
					class:font-bold={span.bold}
					class:underline={span.underline}
					style:color={span.color ?? 'var(--color-text-primary)'}
					style:white-space="pre-wrap"
				>{span.text}</span>
			{/each}
		{/if}
	</div>
</div>
