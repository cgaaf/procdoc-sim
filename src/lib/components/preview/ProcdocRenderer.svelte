<script lang="ts">
  import { getExamState } from "$lib/state/context";

  let { oncollapse }: { oncollapse: () => void } = $props();

  const appState = getExamState();
</script>

<div class="px-3">
  <button class="mb-1 flex w-full items-center" onclick={oncollapse}>
    <span
      class="text-[18px] leading-none"
      style:color="var(--color-text-heading)"
    >
      ‹
    </span>
    <h2
      class="ml-0.5 font-epic text-[14px] font-bold"
      style:color="var(--color-text-heading)"
    >
      Generated Note Preview
    </h2>
  </button>
  <div
    class="w-full select-text rounded-[2px] border p-2.5"
    style:background-color="var(--color-bg-surface)"
    style:border-color="var(--color-divider)"
  >
    {#if appState.assembledNote.length === 0}
      <span class="font-epic text-[13px] italic text-gray-400">
        Select an ultrasound type to see the procedure template.
      </span>
    {:else}
      {#each appState.assembledNote as span, i (i)}
        <span
          class="font-epic text-[13px]"
          class:font-bold={span.bold}
          class:underline={span.underline}
          style:color={span.color ?? "var(--color-text-primary)"}
          style:white-space="pre-wrap">{span.text}</span
        >
      {/each}
    {/if}
  </div>
</div>
