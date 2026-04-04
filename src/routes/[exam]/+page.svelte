<script lang="ts">
	import { setContext } from 'svelte';
	import { EXAM_STATE_KEY } from '$lib/state/context';
	import { ExamState } from '$lib/state/exam-state.svelte';
	import { examConfigs } from '$lib/exams';
	import NormalPresetsBar from '$lib/components/form/NormalPresetsBar.svelte';
	import UltrasoundTypeGrid from '$lib/components/form/UltrasoundTypeGrid.svelte';
	import FindingsPanel from '$lib/components/form/FindingsPanel.svelte';
	import DateTimeRow from '$lib/components/form/DateTimeRow.svelte';
	import ProcdocRenderer from '$lib/components/preview/ProcdocRenderer.svelte';

	let { data } = $props();

	let previewCollapsed = $state(false);
</script>

{#key data.examType}
	{@const config = examConfigs[data.examType]}
	{@const examState = new ExamState(config)}
	{(setContext(EXAM_STATE_KEY, examState), '')}

	<div class="flex h-screen" style:background-color="var(--color-bg-primary)">
		<!-- Left panel: form controls -->
		<div class="flex-1 overflow-auto">
			<div class="min-w-[520px]">
				<div class="py-2">
					{#if config.presets.length > 0}
						<NormalPresetsBar presets={config.presets} />
						<div class="h-2"></div>
					{/if}

					<UltrasoundTypeGrid />

					{#if config.definition.findingsGroups.length > 0}
						<div class="h-3"></div>
						<FindingsPanel
							findingsGroups={config.definition.findingsGroups}
							limitationOptions={config.definition.limitationOptions}
							helperText={config.definition.findingsHelperText}
							showRepeatProcedure={config.showRepeatProcedure}
							interpretation={config.interpretation}
						/>
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
					<ProcdocRenderer oncollapse={() => previewCollapsed = true} />
					<div class="h-6"></div>
				</div>
			</div>
		{/if}
	</div>
{/key}
