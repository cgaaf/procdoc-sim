<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import LimitationsWidget from "./LimitationsWidget.svelte";
  import AppStateDecorator from "$lib/components/storybook/AppStateDecorator.svelte";
  import {
    fastProcdocDefinition,
    dvtProcdocDefinition,
  } from "$lib/data/procdoc-definitions";
  import { examConfigs } from "$lib/exams";

  const { Story } = defineMeta({
    title: "Form/LimitationsWidget",
    component: LimitationsWidget,
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
  name="FAST No Selections"
  args={{
    options: fastProcdocDefinition.limitationOptions,
    interpretation: examConfigs.fast.interpretation,
  }}
/>

<Story
  name="FAST With Preset"
  args={{
    options: fastProcdocDefinition.limitationOptions,
    interpretation: examConfigs.fast.interpretation,
  }}
  decorators={[
    () => ({
      Component: AppStateDecorator,
      props: { ultrasoundType: "fast", applyPreset: "normalEFAST" },
    }),
  ]}
/>

<Story
  name="DVT No Selections"
  args={{
    options: dvtProcdocDefinition.limitationOptions,
    interpretation: examConfigs.dvt.interpretation,
  }}
  decorators={[
    () => ({ Component: AppStateDecorator, props: { ultrasoundType: "dvt" } }),
  ]}
/>

<Story
  name="DVT Normal Bilateral"
  args={{
    options: dvtProcdocDefinition.limitationOptions,
    interpretation: examConfigs.dvt.interpretation,
  }}
  decorators={[
    () => ({
      Component: AppStateDecorator,
      props: { ultrasoundType: "dvt", applyPreset: "normalDvtBilateral" },
    }),
  ]}
/>
