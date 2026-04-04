<script lang="ts">
  let {
    label,
    selected = false,
    compact = false,
    disabled = false,
    onclick,
  }: {
    label: string;
    selected?: boolean;
    compact?: boolean;
    disabled?: boolean;
    onclick?: () => void;
  } = $props();

  let hovering = $state(false);
</script>

<button
  class="rounded-[3px] border text-center font-epic transition-colors select-none"
  class:px-3={!compact}
  class:py-2={!compact}
  class:px-2={compact}
  class:py-[3px]={compact}
  class:text-[12px]={true}
  class:text-[11px]={compact}
  style:background-color={selected
    ? "var(--color-btn-selected-bg)"
    : hovering && !disabled
      ? "var(--color-btn-hover-bg)"
      : "var(--color-btn-default-bg)"}
  style:border-color={selected
    ? "var(--color-btn-selected-border)"
    : "var(--color-btn-default-border)"}
  style:color={disabled
    ? "#9e9e9e"
    : selected
      ? "var(--color-btn-selected-text)"
      : "var(--color-text-primary)"}
  style:opacity={disabled ? "0.5" : "1"}
  style:cursor={disabled ? "default" : "pointer"}
  onmouseenter={() => (hovering = true)}
  onmouseleave={() => (hovering = false)}
  onclick={disabled ? undefined : onclick}
  {disabled}
>
  {label}
</button>
