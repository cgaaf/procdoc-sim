<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import SectionHeader from "./SectionHeader.svelte";

  const { Story } = defineMeta({
    title: "UI Primitives/SectionHeader",
    component: SectionHeader,
    tags: ["autodocs"],
    args: {
      title: "Section Title",
    },
  });
</script>

<Story name="Default" />

<Story
  name="Long Title"
  args={{ title: "Generated Note Preview with Extended Description" }}
/>

<Story name="Short Title" args={{ title: "FAST" }} />
