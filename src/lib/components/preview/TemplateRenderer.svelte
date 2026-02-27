<script lang="ts">
	import type { TemplatePart } from '$lib/types/template';
	import InlineMacroWidget from './InlineMacroWidget.svelte';

	let { parts }: { parts: TemplatePart[] } = $props();
</script>

<div
	class="select-text rounded-[2px] border p-2.5"
	style:background-color="var(--color-bg-surface)"
	style:border-color="var(--color-divider)"
>
	{#each parts as part}
		{#if part.kind === 'staticText'}
			<span
				class="font-epic text-[13px]"
				class:font-bold={part.bold}
				style:color="var(--color-text-primary)"
			>{part.text}</span>
		{:else if part.kind === 'macroDropdown'}
			<InlineMacroWidget
				macroId={part.id}
				options={part.options}
				blankSingle={part.blankSingle}
			/>
		{:else if part.kind === 'signature'}
			<span class="font-epic text-[13px] italic text-gray-400">[Signature]</span>
		{:else if part.kind === 'me'}
			<span class="font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">[Current User]</span>
		{:else if part.kind === 'now'}
			<span class="font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">[Current Time]</span>
		{:else if part.kind === 'lineBreak'}
			<br />
		{/if}
	{/each}
</div>
