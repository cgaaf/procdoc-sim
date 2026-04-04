<script lang="ts">
  import { getExamState } from "$lib/state/context";

  let {
    macroId,
    options,
    blankSingle = false,
  }: {
    macroId: string;
    options: string[];
    blankSingle?: boolean;
  } = $props();

  const examState = getExamState();
  let open = $state(false);

  let selected = $derived(examState.macroSelections.get(macroId));
  let displayText = $derived(selected ?? (blankSingle ? "___" : options[0]));
  let hasSelection = $derived(selected != null);

  function selectOption(option: string) {
    examState.setMacroSelection(macroId, option);
    open = false;
  }
</script>

<span class="relative inline-block">
  <button
    class="rounded-sm border px-1 py-0.5 font-epic text-[13px] font-bold"
    style:background-color={hasSelection ? "#c8e6c9" : "#fff9c4"}
    style:border-color={hasSelection ? "#81c784" : "#fdd835"}
    style:color="var(--color-text-primary)"
    onclick={() => (open = !open)}
  >
    {displayText}
  </button>
  {#if open}
    <div
      class="absolute top-full left-0 z-50 mt-1 min-w-[180px] rounded border bg-white shadow-md"
      style:border-color="var(--color-divider)"
    >
      {#each options as option (option)}
        <button
          class="block w-full px-3 py-1.5 text-left font-epic text-[12px] hover:bg-gray-100"
          style:color="var(--color-text-primary)"
          class:font-bold={selected === option}
          onclick={() => selectOption(option)}
        >
          → {option}
        </button>
      {/each}
    </div>
  {/if}
</span>
