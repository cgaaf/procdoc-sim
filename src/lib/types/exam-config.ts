import type { UltrasoundType } from "./procedure";
import type { ProcdocDefinition } from "./procdoc-definition";
import type { TemplatePart } from "./template";
import type { NoteSpan } from "./note";
import type { NoteAssemblerState } from "$lib/logic/note-assembler";
import type { ExamState } from "$lib/state/exam-state.svelte";

export interface ExamConfig {
  type: UltrasoundType;
  slug: string;
  displayName: string;
  definition: ProcdocDefinition;
  templateParts: TemplatePart[];
  buildNote: (state: NoteAssemblerState) => NoteSpan[];
  presets: ExamPreset[];
  onMacroChange?: (macroId: string, state: ExamState) => void;
  showRepeatProcedure: boolean;
  interpretation: InterpretationConfig;
}

export interface ExamPreset {
  label: string;
  apply: (state: ExamState) => void;
}

export type InterpretationConfig =
  | {
      kind: "fast";
      applyNegativeFAST4: (state: ExamState) => void;
      applyNegativeEFAST5: (state: ExamState) => void;
    }
  | { kind: "dvt"; macroId: string }
  | { kind: "none" };
