<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NormalPresetsBar from './NormalPresetsBar.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';
	import { examConfigs } from '$lib/exams';

	const { Story } = defineMeta({
		title: 'Form/NormalPresetsBar',
		component: NormalPresetsBar,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="FAST Presets" args={{ presets: examConfigs.fast.presets }} />

<Story
	name="DVT Presets"
	args={{ presets: examConfigs.dvt.presets }}
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>
