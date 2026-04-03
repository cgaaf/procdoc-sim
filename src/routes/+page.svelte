<script lang="ts">
	import { setContext } from 'svelte';
	import { APP_STATE_KEY } from '$lib/state/context';
	import { AppState } from '$lib/state/app-state.svelte';
	import NormalPresetsBar from '$lib/components/form/NormalPresetsBar.svelte';
	import UltrasoundTypeGrid from '$lib/components/form/UltrasoundTypeGrid.svelte';
	import FindingsPanel from '$lib/components/form/FindingsPanel.svelte';
	import DateTimeRow from '$lib/components/form/DateTimeRow.svelte';
	import ProcdocRenderer from '$lib/components/preview/ProcdocRenderer.svelte';

	const appState = new AppState();
	setContext(APP_STATE_KEY, appState);

	let previewCollapsed = $state(false);
</script>

<div class="flex h-screen" style:background-color="var(--color-bg-primary)">
	<!-- Left panel: form controls -->
	<div class="flex-1 overflow-auto">
		<div class="min-w-[520px]">
			<div class="py-2">
				{#if appState.selectedUltrasoundType === 'fast' || appState.selectedUltrasoundType === 'dvt'}
					<NormalPresetsBar />
					<div class="h-2"></div>
				{/if}

				<UltrasoundTypeGrid />

				{#if appState.procdocDefinition && appState.procdocDefinition.findingsGroups.length > 0}
					<div class="h-3"></div>
					<FindingsPanel
						findingsGroups={appState.procdocDefinition.findingsGroups}
						limitationOptions={appState.procdocDefinition.limitationOptions}
						helperText={appState.procdocDefinition.findingsHelperText}
						showRepeatProcedure={appState.selectedUltrasoundType !== 'dvt'}
					/>
				{/if}

				{#if appState.selectedUltrasoundType != null}
					{@const typeInfo = ['fast', 'dvt'].includes(appState.selectedUltrasoundType)}
					{#if !typeInfo}
						<div class="p-3">
							<div
								class="rounded-[2px] border p-4"
								style:background-color="var(--color-bg-surface)"
								style:border-color="var(--color-divider)"
							>
								<span class="font-epic text-[13px] italic text-gray-400">
									Template coming soon for {appState.selectedUltrasoundType === 'cardiac' ? 'Cardiac' : appState.selectedUltrasoundType}
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

	<!-- Right panel: generated note preview (collapsible horizontally) -->
	{#if previewCollapsed}
		<button
			class="flex h-full w-[36px] shrink-0 cursor-pointer items-start border-l pt-2"
			style:background-color="var(--color-bg-toolbar)"
			style:border-color="var(--color-divider)"
			onclick={() => previewCollapsed = false}
			title="Show preview"
		>
			<span class="flex w-full flex-col items-center gap-1">
				<span class="text-[16px] leading-none" style:color="var(--color-text-heading)">›</span>
				<span
					class="font-epic text-[11px] font-bold"
					style:color="var(--color-text-heading)"
					style:writing-mode="vertical-rl"
				>Preview</span>
			</span>
		</button>
	{:else}
		<div class="flex-1 overflow-auto">
			<div class="py-2">
				{#if appState.procdocDefinition}
					<ProcdocRenderer oncollapse={() => previewCollapsed = true} />
				{/if}
				<div class="h-6"></div>
			</div>
		</div>
	{/if}
</div>
