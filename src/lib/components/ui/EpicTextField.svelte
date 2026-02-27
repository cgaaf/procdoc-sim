<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = ''
	}: {
		value?: string;
		placeholder?: string;
	} = $props();
</script>

<input
	type="text"
	bind:value
	{placeholder}
	class="h-[28px] rounded-[2px] border px-1.5 py-1 font-epic text-[13px]"
	style:background-color="var(--color-input-bg)"
	style:border-color="var(--color-input-border)"
	style:color="var(--color-text-primary)"
/>
