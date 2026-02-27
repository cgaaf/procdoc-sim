<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LimitationsWidget from './LimitationsWidget.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';
	import { fastProcdocDefinition, dvtProcdocDefinition } from '$lib/data/procdoc-definitions';

	const { Story } = defineMeta({
		title: 'Form/LimitationsWidget',
		component: LimitationsWidget,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="FAST No Selections" args={{ options: fastProcdocDefinition.limitationOptions }} />

<Story
	name="FAST With Preset"
	args={{ options: fastProcdocDefinition.limitationOptions }}
	decorators={[
		() => ({
			Component: AppStateDecorator,
			props: { ultrasoundType: 'fast', applyPreset: 'normalEFAST' }
		})
	]}
/>

<Story
	name="DVT No Selections"
	args={{ options: dvtProcdocDefinition.limitationOptions }}
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>

<Story
	name="DVT Normal Bilateral"
	args={{ options: dvtProcdocDefinition.limitationOptions }}
	decorators={[
		() => ({
			Component: AppStateDecorator,
			props: { ultrasoundType: 'dvt', applyPreset: 'normalDvtBilateral' }
		})
	]}
/>
