<script lang="ts">
  import { onMount } from "svelte";
  import { setContext } from "svelte";
  import { EXAM_STATE_KEY } from "$lib/state/context";
  import { ExamState } from "$lib/state/exam-state.svelte";
  import { examConfigs } from "$lib/exams";
  import type { UltrasoundType } from "$lib/types/procedure";
  import NormalPresetsBar from "$lib/components/form/NormalPresetsBar.svelte";
  import UltrasoundTypeGrid from "$lib/components/form/UltrasoundTypeGrid.svelte";
  import FindingsPanel from "$lib/components/form/FindingsPanel.svelte";
  import DateTimeRow from "$lib/components/form/DateTimeRow.svelte";
  import ProcdocRenderer from "$lib/components/preview/ProcdocRenderer.svelte";

  let { examType }: { examType: UltrasoundType } = $props();

  const config = examConfigs[examType];
  const examState = new ExamState(config);
  setContext(EXAM_STATE_KEY, examState);

  const DIVIDER_WIDTH = 12;
  const MIN_PREVIEW_WIDTH = 200;
  const MIN_FORM_WIDTH = 520;
  const DRAG_THRESHOLD = 5;

  let previewWidth = $state(0);
  let isDragging = $state(false);
  let isCollapsed = $derived(previewWidth === 0);

  let containerEl: HTMLDivElement;
  let dragStartX = 0;
  let dragStartWidth = 0;
  let didDrag = false;

  onMount(() => {
    const available = containerEl.clientWidth - DIVIDER_WIDTH;
    previewWidth = Math.floor(available * 0.4);
  });

  function onPointerDown(e: PointerEvent) {
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    isDragging = true;
    didDrag = false;
    dragStartX = e.clientX;
    dragStartWidth = previewWidth;
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    if (Math.abs(e.clientX - dragStartX) > DRAG_THRESHOLD) {
      didDrag = true;
    }
    if (!didDrag) return;
    const delta = dragStartX - e.clientX;
    const containerWidth = containerEl.clientWidth;
    const maxPreview = containerWidth - DIVIDER_WIDTH - MIN_FORM_WIDTH;
    let newWidth = dragStartWidth + delta;

    if (newWidth < MIN_PREVIEW_WIDTH) {
      newWidth = 0;
    } else {
      newWidth = Math.min(newWidth, maxPreview);
    }
    previewWidth = newWidth;
  }

  function onPointerUp(e: PointerEvent) {
    isDragging = false;
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);
    if (!didDrag) {
      if (isCollapsed) {
        const available = containerEl.clientWidth - DIVIDER_WIDTH;
        previewWidth = Math.floor(available * 0.4);
      } else {
        previewWidth = 0;
      }
    }
  }
</script>

<div
  class="flex h-screen"
  class:select-none={isDragging}
  style:background-color="var(--color-bg-primary)"
  bind:this={containerEl}
>
  <!-- Left panel: form controls -->
  <div class="min-w-[520px] flex-1 overflow-auto">
    <div class="py-2">
      {#if config.presets.length > 0}
        <NormalPresetsBar presets={config.presets} />
        <div class="h-2"></div>
      {/if}

      <UltrasoundTypeGrid />

      {#if config.definition.findingsGroups.length > 0}
        <div class="h-3"></div>
        <FindingsPanel
          findingsGroups={config.definition.findingsGroups}
          limitationOptions={config.definition.limitationOptions}
          helperText={config.definition.findingsHelperText}
          showRepeatProcedure={config.showRepeatProcedure}
          interpretation={config.interpretation}
        />
      {/if}

      <DateTimeRow />
      <div class="h-6"></div>
    </div>
  </div>

  <!-- Divider bar (always visible, doubles as drag handle + click to toggle) -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="flex h-full w-3 shrink-0 cursor-col-resize items-center justify-center border-l"
    style:background-color="var(--color-bg-toolbar)"
    style:border-color="var(--color-divider)"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
  >
    <span
      class="text-[14px] leading-none opacity-40"
      style:color="var(--color-text-heading)"
    >
      {isCollapsed ? "›" : "‹"}
    </span>
  </div>

  <!-- Right panel: generated note preview -->
  {#if !isCollapsed}
    <div class="shrink-0 overflow-auto" style:width="{previewWidth}px">
      <div class="py-2">
        <ProcdocRenderer />
        <div class="h-6"></div>
      </div>
    </div>
  {/if}
</div>
