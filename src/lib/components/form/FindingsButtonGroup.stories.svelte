<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FindingsButtonGroup from './FindingsButtonGroup.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';
	import type { FindingsButtonGroupDef } from '$lib/types/procdoc-definition';

	const multiSelectGroup: FindingsButtonGroupDef = {
		kind: 'buttonGroup',
		macroId: 'macro_0',
		options: ['Blunt Trauma', 'Penetrating Trauma', 'Abdominal Pain'],
		multiSelect: true,
		exclusiveOptions: new Set()
	};

	const multiSelectExclusiveGroup: FindingsButtonGroupDef = {
		kind: 'buttonGroup',
		macroId: 'macro_7_left',
		options: ['Normal Lung Slide', 'Pneumothorax', 'Hemothorax'],
		multiSelect: true,
		exclusiveOptions: new Set(['Normal Lung Slide'])
	};

	const singleSelectGroup: FindingsButtonGroupDef = {
		kind: 'buttonGroup',
		macroId: 'dvt_indication',
		options: ['Leg Pain', 'Leg Swelling', 'Leg Erythema', 'Suspected DVT', 'Suspected PE'],
		multiSelect: true,
		exclusiveOptions: new Set()
	};

	const { Story } = defineMeta({
		title: 'Form/FindingsButtonGroup',
		component: FindingsButtonGroup,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="Multi-Select (Indication)" args={{ group: multiSelectGroup }} />

<Story name="Multi-Select with Exclusive" args={{ group: multiSelectExclusiveGroup }} />

<Story
	name="DVT Indication"
	args={{ group: singleSelectGroup }}
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>
