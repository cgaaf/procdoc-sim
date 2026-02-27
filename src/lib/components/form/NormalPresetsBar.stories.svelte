<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NormalPresetsBar from './NormalPresetsBar.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';

	const { Story } = defineMeta({
		title: 'Form/NormalPresetsBar',
		component: NormalPresetsBar,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="FAST Presets" />

<Story
	name="DVT Presets"
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>
