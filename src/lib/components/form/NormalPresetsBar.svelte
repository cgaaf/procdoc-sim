<script lang="ts">
  import type { ExamPreset } from "$lib/types/exam-config";
  import { getExamState } from "$lib/state/context";
  import EpicButton from "$lib/components/ui/EpicButton.svelte";

  let { presets }: { presets: ExamPreset[] } = $props();

  const state = getExamState();
</script>

<div class="flex items-center px-3">
  <span
    class="font-epic text-[11px] font-bold"
    style:color="var(--color-text-primary)">Macros:</span
  >
  <div class="ml-1.5 flex flex-wrap gap-1">
    {#each presets as preset, i (preset.label)}
      <EpicButton
        label="{i + 1}. {preset.label}"
        compact
        onclick={() => preset.apply(state)}
      />
    {/each}
    <EpicButton label="Clear All" compact onclick={() => state.reset()} />
  </div>
</div>
