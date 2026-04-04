<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { EXAM_STATE_KEY } from '$lib/state/context';
	import { ExamState } from '$lib/state/exam-state.svelte';
	import { examConfigs } from '$lib/exams';
	import type { UltrasoundType } from '$lib/types/procedure';

	let {
		children,
		ultrasoundType = 'fast',
		applyPreset
	}: {
		children: Snippet;
		ultrasoundType?: UltrasoundType;
		applyPreset?: string;
	} = $props();

	const config = examConfigs[ultrasoundType];
	const state = new ExamState(config);

	if (applyPreset) {
		const presetMap: Record<string, () => void> = {
			normalEFAST: () => config.presets.find((p) => p.label === 'Normal E-FAST')?.apply(state),
			normalFAST: () => config.presets.find((p) => p.label === 'Normal FAST')?.apply(state),
			normalDvtBilateral: () => config.presets.find((p) => p.label === 'Normal Bilateral')?.apply(state),
			normalDvtLeft: () => config.presets.find((p) => p.label === 'Normal Left')?.apply(state),
			positiveFAST: () => state.setMacroSelection('macro_3', 'Effusion'),
		};
		presetMap[applyPreset]?.();
	}

	setContext(EXAM_STATE_KEY, state);
</script>

<div style:background-color="var(--color-bg-primary)" class="p-4">
	{@render children()}
</div>
