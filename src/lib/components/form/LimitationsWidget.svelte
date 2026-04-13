<script lang="ts">
  import type { InterpretationConfig } from "$lib/types/exam-config";
  import { getExamState } from "$lib/state/context";
  import FindingCommentModal from "./FindingCommentModal.svelte";

  let {
    options,
    interpretation,
  }: {
    options: string[];
    interpretation: InterpretationConfig;
  } = $props();

  const appState = getExamState();

  let noneSelected = $derived(appState.selectedLimitations.size === 0);

  let interpCommentOpen = $state(false);
  let interpMacroId = $derived.by(() => {
    if (interpretation.kind === "buttons" || interpretation.kind === "buttonsMulti") {
      return interpretation.macroId;
    }
    if (interpretation.kind === "fast") return "macro_8";
    return null;
  });
  let hasInterpComment = $derived(
    interpMacroId != null ? appState.getComment(interpMacroId) !== "" : false,
  );

  const allButtons = $derived.by(() => {
    return [
      { label: "None", isSelected: noneSelected },
      ...options.map((opt) => ({
        label: opt,
        isSelected: appState.selectedLimitations.has(opt),
      })),
    ];
  });


  function handleNoneTap() {
    for (const opt of [...appState.selectedLimitations]) {
      appState.toggleLimitation(opt);
    }
  }

  function handleLimitationTap(label: string) {
    if (label === "None") {
      handleNoneTap();
    } else {
      appState.toggleLimitation(label);
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
    const currentValue = appState.macroSelections.get("macro_8");
    if (option === "FAST Negative x 4") {
      interpretation.applyNegativeFAST4(appState);
    } else if (option === "E-FAST Negative x 5") {
      interpretation.applyNegativeEFAST5(appState);
    } else {
      if (currentValue === option) {
        appState.setMacroSelection("macro_8", null);
      } else {
        appState.setMacroSelection("macro_8", option);
      }
    }
  }
</script>

{#snippet interpCommentIcon()}
  <button
    class="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
    onclick={() => (interpCommentOpen = true)}
    title="Add free text"
    aria-label="Add free text interpretation"
  >
    {#if hasInterpComment}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#616161"
        stroke-width="1.5"
        class="h-[18px] w-[18px]"
      >
        <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#bdbdbd"
        stroke-width="1.5"
        class="h-[18px] w-[18px]"
      >
        <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    {/if}
  </button>
{/snippet}

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
        {@const currentValue = appState.macroSelections.get(interpretation.macroId)}
        <div class="flex flex-wrap items-center gap-1">
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
                  appState.setMacroSelection(interpretation.macroId, null);
                } else {
                  appState.setMacroSelection(interpretation.macroId, option);
                }
              }}
            >
              {option}
            </button>
          {/each}
          {@render interpCommentIcon()}
        </div>
      {:else if interpretation.kind === "buttonsMulti"}
        {@const selected = appState.macroSelections.getMulti(interpretation.macroId)}
        <div class="flex flex-wrap items-center gap-1">
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
                appState.setMultiMacroSelection(interpretation.macroId, next);
              }}
            >
              {option}
            </button>
          {/each}
          {@render interpCommentIcon()}
        </div>
      {:else if interpretation.kind === "fast"}
        {@const currentValue = appState.macroSelections.get("macro_8")}
        <div class="flex flex-wrap items-center gap-1">
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
          {@render interpCommentIcon()}
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
    bind:value={appState.additionalFindings}
  ></textarea>
</div>

{#if interpCommentOpen && interpMacroId != null}
  <FindingCommentModal
    label="Interpretation"
    macroId={interpMacroId}
    onclose={() => (interpCommentOpen = false)}
  />
{/if}
