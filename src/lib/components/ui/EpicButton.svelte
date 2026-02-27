<script lang="ts">
	let {
		label,
		selected = false,
		compact = false,
		onclick
	}: {
		label: string;
		selected?: boolean;
		compact?: boolean;
		onclick?: () => void;
	} = $props();

	let hovering = $state(false);
</script>

<button
	class="rounded-[3px] border text-center font-epic transition-colors select-none"
	class:px-3={!compact}
	class:py-2={!compact}
	class:px-2={compact}
	class:py-[3px]={compact}
	class:text-[12px]={true}
	class:text-[11px]={compact}
	style:background-color={selected
		? 'var(--color-btn-selected-bg)'
		: hovering
			? 'var(--color-btn-hover-bg)'
			: 'var(--color-btn-default-bg)'}
	style:border-color={selected ? 'var(--color-btn-selected-border)' : 'var(--color-btn-default-border)'}
	style:color={selected ? 'var(--color-btn-selected-text)' : 'var(--color-text-primary)'}
	onmouseenter={() => (hovering = true)}
	onmouseleave={() => (hovering = false)}
	{onclick}
>
	{label}
</button>
