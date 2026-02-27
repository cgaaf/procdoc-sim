<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProcdocRenderer from './ProcdocRenderer.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';

	const { Story } = defineMeta({
		title: 'Preview/ProcdocRenderer',
		component: ProcdocRenderer,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="FAST Default" />

<Story
	name="FAST Normal E-FAST"
	decorators={[
		() => ({
			Component: AppStateDecorator,
			props: { ultrasoundType: 'fast', applyPreset: 'normalEFAST' }
		})
	]}
/>

<Story
	name="FAST Positive"
	decorators={[
		() => ({
			Component: AppStateDecorator,
			props: { ultrasoundType: 'fast', applyPreset: 'positiveFAST' }
		})
	]}
/>

<Story
	name="DVT Normal Bilateral"
	decorators={[
		() => ({
			Component: AppStateDecorator,
			props: { ultrasoundType: 'dvt', applyPreset: 'normalDvtBilateral' }
		})
	]}
/>

<Story
	name="Empty State"
	decorators={[
		() => ({
			Component: AppStateDecorator,
			props: { ultrasoundType: 'cardiac' }
		})
	]}
/>
