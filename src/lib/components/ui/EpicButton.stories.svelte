<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import EpicButton from './EpicButton.svelte';

	const { Story } = defineMeta({
		title: 'UI Primitives/EpicButton',
		component: EpicButton,
		tags: ['autodocs'],
		args: {
			label: 'Button Text',
			onclick: fn()
		}
	});
</script>

<Story name="Default" />

<Story name="Selected" args={{ selected: true }} />

<Story name="Compact" args={{ compact: true }} />

<Story name="Compact Selected" args={{ compact: true, selected: true }} />

<Story name="Long Label" args={{ label: 'Normal Lung Slide (Extended Label)' }} />
