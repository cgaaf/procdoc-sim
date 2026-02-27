<script lang="ts">
	import { getAppState } from '$lib/state/context';

	const state = getAppState();
</script>

<div class="flex items-center gap-3 px-3 py-2">
	<span class="font-epic text-[13px]" style:color="var(--color-text-primary)">Date:</span>
	<input
		type="text"
		class="h-[28px] w-[120px] rounded-[2px] border px-1.5 py-1 font-epic text-[13px]"
		style:background-color="var(--color-input-bg)"
		style:border-color="var(--color-input-border)"
		style:color="var(--color-text-primary)"
		value={state.procedureDate}
		oninput={(e) => (state.procedureDate = e.currentTarget.value)}
	/>
	<span class="font-epic text-[13px]" style:color="var(--color-text-primary)">Time:</span>
	<input
		type="text"
		class="h-[28px] w-[100px] rounded-[2px] border px-1.5 py-1 font-epic text-[13px]"
		style:background-color="var(--color-input-bg)"
		style:border-color="var(--color-input-border)"
		style:color="var(--color-text-primary)"
		value={state.procedureTime}
		oninput={(e) => (state.procedureTime = e.currentTarget.value)}
	/>
	<button
		class="rounded-[3px] border px-2.5 py-1 font-epic text-[12px]"
		style:background-color="var(--color-btn-default-bg)"
		style:border-color="var(--color-btn-default-border)"
		style:color="var(--color-text-primary)"
		onclick={() => state.setNow()}
	>
		Now
	</button>
</div>
