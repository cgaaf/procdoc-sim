<script lang="ts">
	import { setContext } from 'svelte';
	import { APP_STATE_KEY } from '$lib/state/context';
	import { AppState } from '$lib/state/app-state.svelte';
	import NormalPresetsBar from '$lib/components/form/NormalPresetsBar.svelte';
	import UltrasoundTypeGrid from '$lib/components/form/UltrasoundTypeGrid.svelte';
	import FindingsPanel from '$lib/components/form/FindingsPanel.svelte';
	import DateTimeRow from '$lib/components/form/DateTimeRow.svelte';
	import ProcdocRenderer from '$lib/components/preview/ProcdocRenderer.svelte';

	const state = new AppState();
	setContext(APP_STATE_KEY, state);
</script>

<div class="flex h-screen" style:background-color="var(--color-bg-primary)">
	<!-- Left panel: form controls -->
	<div class="flex-1 overflow-auto">
		<div class="min-w-[520px]">
			<div class="py-2">
				{#if state.selectedUltrasoundType === 'fast' || state.selectedUltrasoundType === 'dvt'}
					<NormalPresetsBar />
					<div class="h-2"></div>
				{/if}

				<UltrasoundTypeGrid />

				{#if state.procdocDefinition && state.procdocDefinition.findingsGroups.length > 0}
					<div class="h-3"></div>
					<FindingsPanel
						findingsGroups={state.procdocDefinition.findingsGroups}
						limitationOptions={state.procdocDefinition.limitationOptions}
						helperText={state.procdocDefinition.findingsHelperText}
						showRepeatProcedure={state.selectedUltrasoundType !== 'dvt'}
					/>
				{/if}

				{#if state.selectedUltrasoundType != null}
					{@const typeInfo = ['fast', 'dvt'].includes(state.selectedUltrasoundType)}
					{#if !typeInfo}
						<div class="p-3">
							<div
								class="rounded-[2px] border p-4"
								style:background-color="var(--color-bg-surface)"
								style:border-color="var(--color-divider)"
							>
								<span class="font-epic text-[13px] italic text-gray-400">
									Template coming soon for {state.selectedUltrasoundType === 'cardiac' ? 'Cardiac' : state.selectedUltrasoundType}
								</span>
							</div>
						</div>
					{/if}
				{/if}

				<DateTimeRow />
				<div class="h-6"></div>
			</div>
		</div>
	</div>

	<!-- Right panel: generated note preview -->
	<div class="flex-1 overflow-auto">
		<div class="py-2">
			{#if state.procdocDefinition}
				<ProcdocRenderer />
			{/if}
			<div class="h-6"></div>
		</div>
	</div>
</div>
