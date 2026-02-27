<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import UltrasoundTypeGrid from './UltrasoundTypeGrid.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';

	const { Story } = defineMeta({
		title: 'Form/UltrasoundTypeGrid',
		component: UltrasoundTypeGrid,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="FAST Selected" />

<Story
	name="DVT Selected"
	decorators={[() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'dvt' } })]}
/>
