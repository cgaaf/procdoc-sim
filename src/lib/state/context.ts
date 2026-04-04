import { getContext } from "svelte";
import type { ExamState } from "./exam-state.svelte";

const EXAM_STATE_KEY = Symbol("exam-state");

export function getExamState(): ExamState {
  return getContext<ExamState>(EXAM_STATE_KEY);
}

export { EXAM_STATE_KEY };
