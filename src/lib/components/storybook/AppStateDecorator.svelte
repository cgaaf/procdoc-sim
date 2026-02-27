<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { APP_STATE_KEY } from '$lib/state/context';
	import { AppState } from '$lib/state/app-state.svelte';
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

	const state = new AppState();
	state.selectUltrasoundType(ultrasoundType);

	if (applyPreset) {
		switch (applyPreset) {
			case 'normalEFAST':
				state.applyNormalEFAST();
				break;
			case 'normalFAST':
				state.applyNormalFAST();
				break;
			case 'normalDvtBilateral':
				state.applyNormalDvtBilateral();
				break;
			case 'normalDvtLeft':
				state.applyNormalDvtLeft();
				break;
			case 'positiveFAST':
				state.setMacroSelection('macro_3', 'Effusion');
				break;
		}
	}

	setContext(APP_STATE_KEY, state);
</script>

<div style:background-color="var(--color-bg-primary)" class="p-4">
	{@render children()}
</div>
