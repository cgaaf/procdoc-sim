<script lang="ts">
	import type { FindingRow } from '$lib/types/procdoc-definition';
	import { getAppState } from '$lib/state/context';
	import FindingCommentModal from './FindingCommentModal.svelte';

	let { finding }: { finding: FindingRow } = $props();

	const appState = getAppState();

	type FindingState = 'present' | 'absent' | 'indeterminate' | 'none';

	let selected = $derived(appState.macroSelections.get(finding.macroId));

	let currentState: FindingState = $derived.by(() => {
		if (selected == null) return 'none';
		if (selected === finding.absentOption) return 'absent';
		if (finding.presentOptions.includes(selected)) {
			return selected === 'Indeterminate' ? 'indeterminate' : 'present';
		}
		return 'none';
	});

	let bgColor = $derived(
		currentState === 'present'
			? 'var(--color-finding-present-bg)'
			: currentState === 'absent'
				? 'var(--color-finding-absent-bg)'
				: currentState === 'indeterminate'
					? 'var(--color-finding-indeterminate-bg)'
					: 'var(--color-finding-null-bg)'
	);

	let borderColor = $derived(
		currentState === 'present'
			? 'var(--color-finding-present-border)'
			: currentState === 'absent'
				? 'var(--color-finding-absent-border)'
				: currentState === 'indeterminate'
					? 'var(--color-finding-indeterminate-border)'
					: 'var(--color-finding-null-border)'
	);

	let commentModalOpen = $state(false);
	let hasComment = $derived(appState.getComment(finding.macroId) !== '');

	function onPresentTap() {
		if (currentState === 'present' || currentState === 'indeterminate') {
			const currentIndex = finding.presentOptions.indexOf(selected!);
			const nextIndex = (currentIndex + 1) % finding.presentOptions.length;
			if (nextIndex === 0) {
				appState.setMacroSelection(finding.macroId, null);
			} else {
				appState.setMacroSelection(finding.macroId, finding.presentOptions[nextIndex]);
			}
		} else {
			appState.setMacroSelection(finding.macroId, finding.presentOptions[0]);
		}
	}

	function onAbsentTap() {
		if (currentState === 'absent') {
			appState.setMacroSelection(finding.macroId, null);
		} else {
			appState.setMacroSelection(finding.macroId, finding.absentOption);
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
			style:background-color={currentState === 'present' ? 'var(--color-finding-present-icon)' : currentState === 'indeterminate' ? 'var(--color-finding-indeterminate-icon)' : 'transparent'}
			style:border-color={currentState === 'present' ? 'var(--color-finding-present-icon)' : currentState === 'indeterminate' ? 'var(--color-finding-indeterminate-icon)' : 'var(--color-finding-null-border)'}
			onclick={onPresentTap}
		>
			<span class="text-[14px] leading-none" style:color={currentState === 'present' || currentState === 'indeterminate' ? 'white' : '#9e9e9e'}>+</span>
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
	<!-- Comment button -->
	<div class="w-1"></div>
	<button
		class="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
		onclick={() => commentModalOpen = true}
		title="Add comment"
	>
		{#if hasComment}
			<!-- Document with lines (has comment) -->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#616161" stroke-width="1.5" class="h-[18px] w-[18px]">
				<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="8" y1="13" x2="16" y2="13" />
				<line x1="8" y1="17" x2="16" y2="17" />
			</svg>
		{:else}
			<!-- Blank document (no comment) -->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" stroke-width="1.5" class="h-[18px] w-[18px]">
				<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
				<polyline points="14 2 14 8 20 8" />
			</svg>
		{/if}
	</button>
</div>

{#if commentModalOpen}
	<FindingCommentModal
		label={finding.label}
		macroId={finding.macroId}
		onclose={() => commentModalOpen = false}
	/>
{/if}
