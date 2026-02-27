<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FindingToggleButton from './FindingToggleButton.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';
	import type { FindingRow } from '$lib/types/procdoc-definition';

	const cardiacFinding: FindingRow = {
		kind: 'findingRow',
		label: 'Subxiphoid',
		findingLabel: 'Pericardial effusion',
		macroId: 'macro_3',
		presentOptions: ['Effusion'],
		absentOption: 'Normal no effusion',
		naOption: 'no obtained'
	};

	const abdominalFinding: FindingRow = {
		kind: 'findingRow',
		label: "RUQ (Morrison's Pouch)",
		findingLabel: 'Free fluid',
		macroId: 'macro_4',
		presentOptions: ['Free fluid'],
		absentOption: 'Normal no free fluid',
		naOption: 'not obtained'
	};

	const dvtFinding: FindingRow = {
		kind: 'findingRow',
		label: 'Common Femoral',
		findingLabel: 'Incomplete Compressibility',
		macroId: 'dvt_cfv_left',
		presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
		absentOption: 'Completely compressible',
		naOption: 'Not obtained'
	};

	const { Story } = defineMeta({
		title: 'Form/FindingToggleButton',
		component: FindingToggleButton,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="Cardiac (Binary)" args={{ finding: cardiacFinding }} />

<Story name="Abdominal" args={{ finding: abdominalFinding }} />

<Story
	name="DVT (Multi-Present Cycling)"
	args={{ finding: dvtFinding }}
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>
