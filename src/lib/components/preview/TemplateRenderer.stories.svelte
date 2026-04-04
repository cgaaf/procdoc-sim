<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import TemplateRenderer from "./TemplateRenderer.svelte";
  import AppStateDecorator from "$lib/components/storybook/AppStateDecorator.svelte";
  import { fastTemplate, dvtTemplate } from "$lib/data/template-data";
  import { parseTemplate } from "$lib/logic/template-parser";
  import type { TemplatePart } from "$lib/types/template";

  const fastParts = parseTemplate(fastTemplate);
  const dvtParts = parseTemplate(dvtTemplate);

  const minimalParts: TemplatePart[] = [
    { kind: "staticText", text: "Procedure: ", bold: true },
    {
      kind: "macroDropdown",
      id: "demo_macro",
      options: ["Option A", "Option B", "Option C"],
      blankSingle: false,
    },
    { kind: "lineBreak" },
    { kind: "staticText", text: "Performed by: ", bold: false },
    { kind: "me" },
    { kind: "lineBreak" },
    { kind: "staticText", text: "Date: ", bold: false },
    { kind: "now" },
    { kind: "lineBreak" },
    { kind: "signature" },
  ];

  const { Story } = defineMeta({
    title: "Preview/TemplateRenderer",
    component: TemplateRenderer,
    tags: ["autodocs"],
    decorators: [
      () => ({
        Component: AppStateDecorator,
        props: { ultrasoundType: "fast" },
      }),
    ],
  });
</script>

<Story name="FAST Template" args={{ parts: fastParts }} />

<Story
  name="DVT Template"
  args={{ parts: dvtParts }}
  decorators={[
    () => ({ Component: AppStateDecorator, props: { ultrasoundType: "dvt" } }),
  ]}
/>

<Story name="Minimal" args={{ parts: minimalParts }} />
