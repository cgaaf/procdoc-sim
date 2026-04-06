<script lang="ts">
  import type { InterpretationConfig } from "$lib/types/exam-config";
  import { getExamState } from "$lib/state/context";

  let {
    options,
    interpretation,
  }: {
    options: string[];
    interpretation: InterpretationConfig;
  } = $props();

  const state = getExamState();

  let noneSelected = $derived(state.selectedLimitations.size === 0);

  const allButtons = $derived.by(() => {
    return [
      { label: "None", isSelected: noneSelected },
      ...options.map((opt) => ({
        label: opt,
        isSelected: state.selectedLimitations.has(opt),
      })),
    ];
  });


  function handleNoneTap() {
    for (const opt of [...state.selectedLimitations]) {
      state.toggleLimitation(opt);
    }
  }

  function handleLimitationTap(label: string) {
    if (label === "None") {
      handleNoneTap();
    } else {
      state.toggleLimitation(label);
    }
  }

  // FAST interpretation
  const fastInterpretationOptions = [
    "FAST Negative x 4",
    "E-FAST Negative x 5",
    "Positive FAST",
  ];

  function handleFastInterpTap(option: string) {
    if (interpretation.kind !== "fast") return;
    const currentValue = state.macroSelections.get("macro_8");
    if (option === "FAST Negative x 4") {
      interpretation.applyNegativeFAST4(state);
    } else if (option === "E-FAST Negative x 5") {
      interpretation.applyNegativeEFAST5(state);
    } else {
      if (currentValue === option) {
        state.setMacroSelection("macro_8", null);
      } else {
        state.setMacroSelection("macro_8", option);
      }
    }
  }
</script>

{#snippet limitButton(btn: { label: string; isSelected: boolean })}
  <button
    class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
    class:font-semibold={btn.isSelected}
    style:background-color={btn.isSelected
      ? "var(--color-btn-selected-bg)"
      : "var(--color-btn-default-bg)"}
    style:border-color={btn.isSelected
      ? "var(--color-btn-selected-border)"
      : "var(--color-btn-default-border)"}
    style:color={btn.isSelected
      ? "var(--color-btn-selected-text)"
      : "var(--color-text-primary)"}
    onclick={() => handleLimitationTap(btn.label)}
  >
    {btn.label}
  </button>
{/snippet}

<div class="pb-1.5">
  <p
    class="font-epic text-[13px] font-bold"
    style:color="var(--color-text-primary)"
  >
    Limitations:
  </p>
  <div class="mt-1 flex flex-wrap gap-1">
    {#each allButtons as btn (btn.label)}
      {@render limitButton(btn)}
    {/each}
  </div>

  {#if interpretation.kind !== "none"}
    <p
      class="mt-4 font-epic text-[13px] font-bold"
      style:color="var(--color-text-primary)"
    >
      Interpretation:
    </p>
    <div class="mt-1">
      {#if interpretation.kind === "buttons"}
        {@const currentValue = state.macroSelections.get(interpretation.macroId)}
        <div class="flex flex-wrap gap-1">
          {#each interpretation.options as option (option)}
            {@const isSelected = currentValue === option}
            <button
              class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
              style:background-color={isSelected
                ? "var(--color-btn-selected-bg)"
                : "var(--color-btn-default-bg)"}
              style:border-color={isSelected
                ? "var(--color-btn-selected-border)"
                : "var(--color-btn-default-border)"}
              style:color={isSelected
                ? "var(--color-btn-selected-text)"
                : "var(--color-text-primary)"}
              onclick={() => {
                if (currentValue === option) {
                  state.setMacroSelection(interpretation.macroId, null);
                } else {
                  state.setMacroSelection(interpretation.macroId, option);
                }
              }}
            >
              {option}
            </button>
          {/each}
        </div>
      {:else if interpretation.kind === "buttonsMulti"}
        {@const selected = state.macroSelections.getMulti(interpretation.macroId)}
        <div class="flex flex-wrap gap-1">
          {#each interpretation.options as option (option)}
            {@const isSelected = selected.has(option)}
            <button
              class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
              style:background-color={isSelected
                ? "var(--color-btn-selected-bg)"
                : "var(--color-btn-default-bg)"}
              style:border-color={isSelected
                ? "var(--color-btn-selected-border)"
                : "var(--color-btn-default-border)"}
              style:color={isSelected
                ? "var(--color-btn-selected-text)"
                : "var(--color-text-primary)"}
              onclick={() => {
                const next = new Set(selected);
                const isExclusive = interpretation.exclusiveOptions.has(option);
                if (isSelected) {
                  next.delete(option);
                } else if (isExclusive) {
                  next.clear();
                  next.add(option);
                } else {
                  for (const ex of interpretation.exclusiveOptions) next.delete(ex);
                  next.add(option);
                }
                state.setMultiMacroSelection(interpretation.macroId, next);
              }}
            >
              {option}
            </button>
          {/each}
        </div>
      {:else if interpretation.kind === "fast"}
        {@const currentValue = state.macroSelections.get("macro_8")}
        <div class="flex gap-1">
          {#each fastInterpretationOptions as option (option)}
            {@const isSelected = currentValue === option}
            <button
              class="rounded-[3px] border px-2.5 py-[5px] font-epic text-[12px] transition-colors"
              class:font-semibold={isSelected}
              style:background-color={isSelected
                ? "var(--color-btn-selected-bg)"
                : "var(--color-btn-default-bg)"}
              style:border-color={isSelected
                ? "var(--color-btn-selected-border)"
                : "var(--color-btn-default-border)"}
              style:color={isSelected
                ? "var(--color-btn-selected-text)"
                : "var(--color-text-primary)"}
              onclick={() => handleFastInterpTap(option)}
            >
              {option}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <p
    class="mt-4 font-epic text-[13px] font-bold"
    style:color="var(--color-text-primary)"
  >
    Additional findings:
  </p>
  <textarea
    class="mt-1 w-full rounded-[2px] border p-2 font-epic text-[13px]"
    style:background-color="var(--color-input-bg)"
    style:border-color="var(--color-input-border)"
    style:color="var(--color-text-primary)"
    rows="2"
    bind:value={state.additionalFindings}
  ></textarea>
</div>
