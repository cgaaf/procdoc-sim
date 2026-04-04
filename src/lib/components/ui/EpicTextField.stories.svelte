<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import EpicTextField from "./EpicTextField.svelte";

  const { Story } = defineMeta({
    title: "UI Primitives/EpicTextField",
    component: EpicTextField,
    tags: ["autodocs"],
    args: {
      value: "",
      placeholder: "",
    },
  });
</script>

<Story name="Empty" />

<Story
  name="With Placeholder"
  args={{ placeholder: "Enter provider name..." }}
/>

<Story
  name="With Value"
  args={{ value: "Emergency, Attending Physician, MD" }}
/>

<Story
  name="With Both"
  args={{ value: "Dr. Smith", placeholder: "Enter provider name..." }}
/>
