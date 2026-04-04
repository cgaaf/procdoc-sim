<script lang="ts">
	import { getExamState } from '$lib/state/context';

	const state = getExamState();

	function toggleRepeat() {
		state.setRepeatProcedure(!state.isRepeatProcedure);
	}

	function setPhysicianType(type: 'same' | 'different') {
		state.repeatPhysicianType = state.repeatPhysicianType === type ? null : type;
	}
</script>

{#snippet toggleBtn(label: string, isSelected: boolean, onclick: () => void)}
	<button
		class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
		class:font-semibold={isSelected}
		style:background-color={isSelected ? 'var(--color-btn-selected-bg)' : 'var(--color-btn-default-bg)'}
		style:border-color={isSelected ? 'var(--color-btn-selected-border)' : 'var(--color-btn-default-border)'}
		style:color={isSelected ? 'var(--color-btn-selected-text)' : 'var(--color-text-primary)'}
		{onclick}
	>
		{label}
	</button>
{/snippet}

<div class="py-2 pl-5">
	<label class="flex items-center gap-1.5">
		<input
			type="checkbox"
			class="h-4 w-4"
			checked={state.isRepeatProcedure}
			onchange={toggleRepeat}
		/>
		<span class="font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">Repeat Procedure</span>
	</label>

	{#if state.isRepeatProcedure}
		<div class="mt-2 pl-[26px]">
			<p class="font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">Physician:</p>
			<div class="mt-1 flex gap-1">
				{@render toggleBtn('Same Physician', state.repeatPhysicianType === 'same', () => setPhysicianType('same'))}
				{@render toggleBtn('Different Physician', state.repeatPhysicianType === 'different', () => setPhysicianType('different'))}
			</div>

			<p class="mt-2 font-epic text-[13px] font-bold" style:color="var(--color-text-primary)">Reason:</p>
			<div class="mt-1 flex gap-1">
				{@render toggleBtn(
					'Clinical status change',
					state.repeatReasons.has('Clinical status change'),
					() => state.toggleRepeatReason('Clinical status change')
				)}
				{@render toggleBtn(
					'Assess effectiveness of resuscitation',
					state.repeatReasons.has('Assess effectiveness of resuscitation'),
					() => state.toggleRepeatReason('Assess effectiveness of resuscitation')
				)}
			</div>
		</div>
	{/if}
</div>
