<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FindingsPanel from './FindingsPanel.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';
	import { fastProcdocDefinition, dvtProcdocDefinition } from '$lib/data/procdoc-definitions';

	const { Story } = defineMeta({
		title: 'Form/FindingsPanel',
		component: FindingsPanel,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story
	name="FAST Complete"
	args={{
		findingsGroups: fastProcdocDefinition.findingsGroups,
		limitationOptions: fastProcdocDefinition.limitationOptions,
		helperText: fastProcdocDefinition.findingsHelperText,
		showRepeatProcedure: true
	}}
/>

<Story
	name="FAST No Repeat"
	args={{
		findingsGroups: fastProcdocDefinition.findingsGroups,
		limitationOptions: fastProcdocDefinition.limitationOptions,
		helperText: fastProcdocDefinition.findingsHelperText,
		showRepeatProcedure: false
	}}
/>

<Story
	name="DVT Complete"
	args={{
		findingsGroups: dvtProcdocDefinition.findingsGroups,
		limitationOptions: dvtProcdocDefinition.limitationOptions,
		helperText: dvtProcdocDefinition.findingsHelperText,
		showRepeatProcedure: true
	}}
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>

<Story
	name="Minimal"
	args={{
		findingsGroups: [fastProcdocDefinition.findingsGroups[0]],
		limitationOptions: [],
		showRepeatProcedure: false
	}}
/>
