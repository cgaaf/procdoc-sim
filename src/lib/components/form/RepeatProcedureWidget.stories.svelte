<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import RepeatProcedureWidget from './RepeatProcedureWidget.svelte';
	import AppStateDecorator from '$lib/components/storybook/AppStateDecorator.svelte';

	const { Story } = defineMeta({
		title: 'Form/RepeatProcedureWidget',
		component: RepeatProcedureWidget,
		tags: ['autodocs'],
		decorators: [
			() => ({ Component: AppStateDecorator, props: { ultrasoundType: 'fast' } })
		]
	});
</script>

<Story name="Unchecked" />
