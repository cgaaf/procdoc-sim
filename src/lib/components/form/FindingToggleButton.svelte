<script lang="ts">
	import type { FindingRow } from '$lib/types/procdoc-definition';
	import { getAppState } from '$lib/state/context';

	let { finding }: { finding: FindingRow } = $props();

	const state = getAppState();

	type FindingState = 'present' | 'absent' | 'none';

	let selected = $derived(state.macroSelections.get(finding.macroId));

	let currentState: FindingState = $derived.by(() => {
		if (selected == null) return 'none';
		if (selected === finding.absentOption) return 'absent';
		if (finding.presentOptions.includes(selected)) return 'present';
		return 'none';
	});

	let bgColor = $derived(
		currentState === 'present'
			? 'var(--color-finding-present-bg)'
			: currentState === 'absent'
				? 'var(--color-finding-absent-bg)'
				: 'var(--color-finding-null-bg)'
	);

	let borderColor = $derived(
		currentState === 'present'
			? 'var(--color-finding-present-border)'
			: currentState === 'absent'
				? 'var(--color-finding-absent-border)'
				: 'var(--color-finding-null-border)'
	);

	function onPresentTap() {
		if (currentState === 'present') {
			const currentIndex = finding.presentOptions.indexOf(selected!);
			const nextIndex = (currentIndex + 1) % finding.presentOptions.length;
			if (nextIndex === 0) {
				state.setMacroSelection(finding.macroId, null);
			} else {
				state.setMacroSelection(finding.macroId, finding.presentOptions[nextIndex]);
			}
		} else {
			state.setMacroSelection(finding.macroId, finding.presentOptions[0]);
		}
	}

	function onAbsentTap() {
		if (currentState === 'absent') {
			state.setMacroSelection(finding.macroId, null);
		} else {
			state.setMacroSelection(finding.macroId, finding.absentOption);
		}
	}
</script>

<div class="flex items-center py-[2px]">
	<!-- Label -->
	<div class="w-[140px] shrink-0 font-epic text-[12px] font-bold" style:color="var(--color-text-primary)">
		{finding.label}
	</div>
	<div class="w-1"></div>
	<!-- Toggle control -->
	<div
		class="flex w-[200px] rounded-[3px] border"
		style:border-color={borderColor}
	>
		<!-- Plus button (present = pathology = RED) -->
		<button
			class="flex h-[30px] w-[28px] shrink-0 items-center justify-center border-x-[0.5px]"
			style:background-color={currentState === 'present' ? 'var(--color-finding-present-icon)' : 'transparent'}
			style:border-color={currentState === 'present' ? 'var(--color-finding-present-icon)' : 'var(--color-finding-null-border)'}
			onclick={onPresentTap}
		>
			<span class="text-[14px] leading-none" style:color={currentState === 'present' ? 'white' : '#9e9e9e'}>+</span>
		</button>

		<!-- Finding label center area -->
		<div
			class="flex flex-1 items-center justify-center overflow-hidden px-2 py-1.5 text-center font-epic text-[11px] font-semibold"
			style:background-color={bgColor}
			style:color={currentState === 'none' ? '#757575' : 'var(--color-text-primary)'}
		>
			<span class="truncate">{finding.findingLabel}</span>
		</div>

		<!-- Minus button (absent = normal = GREEN) -->
		<button
			class="flex h-[30px] w-[28px] shrink-0 items-center justify-center border-x-[0.5px]"
			style:background-color={currentState === 'absent' ? 'var(--color-finding-absent-icon)' : 'transparent'}
			style:border-color={currentState === 'absent' ? 'var(--color-finding-absent-icon)' : 'var(--color-finding-null-border)'}
			onclick={onAbsentTap}
		>
			<span class="text-[14px] leading-none" style:color={currentState === 'absent' ? 'white' : '#9e9e9e'}>−</span>
		</button>
	</div>
</div>
