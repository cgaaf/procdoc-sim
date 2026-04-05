<script lang="ts">
  import { goto } from "$app/navigation";
  import { ULTRASOUND_TYPES } from "$lib/types/procedure";
  import { getExamState } from "$lib/state/context";
  import EpicButton from "$lib/components/ui/EpicButton.svelte";
  import SectionHeader from "$lib/components/ui/SectionHeader.svelte";

  const state = getExamState();
</script>

<div class="px-3">
  <SectionHeader title="Procedure Performed" />
  <div class="flex flex-wrap gap-1.5">
    {#each ULTRASOUND_TYPES as type (type.value)}
      {#if type.value === "cardiac"}
        <EpicButton label={type.displayName} selected={false} disabled />
      {:else}
        <EpicButton
          label={type.displayName}
          selected={state.config.type === type.value}
          onclick={() => goto(`/${type.slug}`)}
        />
      {/if}
    {/each}
  </div>
</div>
