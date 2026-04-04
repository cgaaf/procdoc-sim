<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import InlineMacroWidget from "./InlineMacroWidget.svelte";
  import AppStateDecorator from "$lib/components/storybook/AppStateDecorator.svelte";

  const { Story } = defineMeta({
    title: "Preview/InlineMacroWidget",
    component: InlineMacroWidget,
    tags: ["autodocs"],
    decorators: [
      () => ({
        Component: AppStateDecorator,
        props: { ultrasoundType: "fast" },
      }),
    ],
  });
</script>

<Story
  name="Standard Dropdown"
  args={{
    macroId: "macro_3",
    options: ["Normal no effusion", "Effusion"],
    blankSingle: false,
  }}
/>

<Story
  name="Blank Single"
  args={{
    macroId: "macro_4",
    options: ["Normal no free fluid", "Free fluid"],
    blankSingle: true,
  }}
/>

<Story
  name="Many Options"
  args={{
    macroId: "dvt_cfv_left",
    options: [
      "Completely compressible",
      "Incompletely compressible",
      "Clot seen within the vein",
      "Not obtained",
    ],
    blankSingle: false,
  }}
/>
