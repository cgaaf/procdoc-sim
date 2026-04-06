<script lang="ts">
  import type {
    FindingsGroupSection,
    FindingsItem,
    FindingRow as FindingRowType,
    FindingsSubHeader,
  } from "$lib/types/procdoc-definition";
  import type { InterpretationConfig } from "$lib/types/exam-config";
  import { SvelteSet } from "svelte/reactivity";
  import { getExamState } from "$lib/state/context";
  import FindingToggleButton from "./FindingToggleButton.svelte";
  import FindingsButtonGroup from "./FindingsButtonGroup.svelte";
  import RepeatProcedureWidget from "./RepeatProcedureWidget.svelte";
  import LimitationsWidget from "./LimitationsWidget.svelte";

  let {
    findingsGroups,
    limitationOptions = [],
    helperText,
    showRepeatProcedure = true,
    interpretation = { kind: "none" } as InterpretationConfig,
  }: {
    findingsGroups: FindingsGroupSection[];
    limitationOptions?: string[];
    helperText?: string;
    showRepeatProcedure?: boolean;
    interpretation?: InterpretationConfig;
  } = $props();

  const appState = getExamState();

  let collapsed = new SvelteSet<string>(
    findingsGroups.filter((g) => g.defaultCollapsed).map((g) => g.header),
  );

  function toggleCollapse(header: string) {
    if (collapsed.has(header)) {
      collapsed.delete(header);
    } else {
      collapsed.add(header);
    }
  }

  function isItemVisible(item: FindingsItem): boolean {
    if (item.kind !== "findingRow" && item.kind !== "buttonGroup") return true;
    const cond = item.visibleWhen;
    if (!cond) return true;
    return appState.macroSelections.get(cond.macroId) === cond.value;
  }

  function hasSubHeaders(items: FindingsItem[]): boolean {
    return items.some((item) => item.kind === "subHeader");
  }

  function splitBySubHeader(
    items: FindingsItem[],
  ): { header: string; items: FindingsItem[] }[] {
    const columns: { header: string; items: FindingsItem[] }[] = [];
    let currentHeader: string | null = null;
    let currentItems: FindingsItem[] = [];

    for (const item of items) {
      if (item.kind === "subHeader") {
        if (currentHeader != null) {
          columns.push({ header: currentHeader, items: currentItems });
          currentItems = [];
        }
        currentHeader = item.title;
      } else {
        currentItems.push(item);
      }
    }
    if (currentHeader != null) {
      columns.push({ header: currentHeader, items: currentItems });
    }
    return columns;
  }
</script>

{#snippet findingsItem(item: FindingsItem)}
  {#if isItemVisible(item)}
    {#if item.kind === "findingRow"}
      <FindingToggleButton finding={item} />
    {:else if item.kind === "buttonGroup"}
      <FindingsButtonGroup group={item} />
    {/if}
  {/if}
{/snippet}

{#snippet findingsContent(items: FindingsItem[], layout?: "vertical" | "columns")}
  {#if hasSubHeaders(items)}
    {@const columns = splitBySubHeader(items)}
    <div class={layout === "vertical" ? "pl-5" : "flex gap-2 pl-5"}>
      {#each columns as col (col.header)}
        <div class={layout === "vertical" ? "" : "flex-1"}>
          <p
            class="mb-1.5 mt-0.5 font-epic text-[13px] font-bold"
            style:color="var(--color-text-heading)"
          >
            {col.header}
          </p>
          {#each col.items as item, i (i)}
            {@render findingsItem(item)}
          {/each}
        </div>
      {/each}
    </div>
  {:else if layout === "vertical"}
    <div class="space-y-4 pl-5">
      {#each items as item, i (i)}
        {@render findingsItem(item)}
      {/each}
    </div>
  {:else}
    {@const rows = items.filter(
      (i): i is FindingRowType => i.kind === "findingRow",
    )}
    {@const mid = Math.ceil(rows.length / 2)}
    <div class="flex gap-2 pl-5">
      <div class="flex-1 pr-2">
        {#each rows.slice(0, mid) as row (row.macroId)}
          <FindingToggleButton finding={row} />
        {/each}
      </div>
      <div class="flex-1">
        {#each rows.slice(mid) as row (row.macroId)}
          <FindingToggleButton finding={row} />
        {/each}
      </div>
    </div>
  {/if}
{/snippet}

<div class="px-3">
  {#if helperText}
    <p
      class="whitespace-pre-line pl-5 pt-1 pb-2 font-epic text-[13px] italic"
      style:color="var(--color-text-heading)"
    >
      {helperText}
    </p>
  {/if}

  {#each findingsGroups as group, i (i)}
    <div class="mb-3">
      {#if group.header === ""}
        <!-- Headerless section -->
        <div class="border-t" style:border-color="var(--color-divider)"></div>
        {#if group.label}
          <div class="flex items-center gap-1.5 pt-3 pb-1.5 pl-5">
            <span
              class="font-epic text-[13px] font-bold"
              style:color="var(--color-text-heading)"
            >
              {group.label}
            </span>
            {#if group.required}
              <span class="font-epic text-[11px] font-semibold text-red-500"
                >Required</span
              >
            {/if}
          </div>
        {/if}
        <div class="pl-5">
          {#each group.findings as item, i (i)}
            {@render findingsItem(item)}
          {/each}
        </div>
        {#if showRepeatProcedure}
          <RepeatProcedureWidget />
        {/if}
      {:else}
        <!-- Collapsible section -->
        {@const isCollapsed = collapsed.has(group.header)}
        <button
          class="flex w-full items-center py-1"
          onclick={() => toggleCollapse(group.header)}
        >
          <span
            class="inline-block text-[18px] leading-none transition-transform duration-150"
            style:color="var(--color-text-heading)"
            style:transform={isCollapsed ? "rotate(0deg)" : "rotate(90deg)"}
          >
            ›
          </span>
          <span
            class="ml-0.5 font-epic text-[14px] font-bold"
            style:color="var(--color-text-heading)"
          >
            {group.header}
          </span>
          <span
            class="ml-2 flex-1 border-t"
            style:border-color="var(--color-divider)"
          ></span>
        </button>
        {#if !isCollapsed}
          {@render findingsContent(group.findings, group.layout)}
        {/if}
      {/if}
    </div>
  {/each}

  {#if limitationOptions.length > 0}
    <div class="border-t py-1" style:border-color="var(--color-divider)"></div>
    <div class="pl-5">
      <LimitationsWidget options={limitationOptions} {interpretation} />
    </div>
  {/if}
</div>
