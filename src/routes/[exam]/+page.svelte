<script lang="ts">
  import ExamPageContent from "./ExamPageContent.svelte";

  let { data } = $props();
</script>

{#key data.examType}
  <ExamPageContent examType={data.examType} />
{/key}
