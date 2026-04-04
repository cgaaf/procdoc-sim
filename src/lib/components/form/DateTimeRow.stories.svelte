<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import DateTimeRow from "./DateTimeRow.svelte";
  import AppStateDecorator from "$lib/components/storybook/AppStateDecorator.svelte";

  const { Story } = defineMeta({
    title: "Form/DateTimeRow",
    component: DateTimeRow,
    tags: ["autodocs"],
    decorators: [
      () => ({
        Component: AppStateDecorator,
        props: { ultrasoundType: "fast" },
      }),
    ],
  });
</script>

<Story name="Empty" />
