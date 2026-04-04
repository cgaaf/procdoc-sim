import type { ExamConfig } from "$lib/types/exam-config";
import { gallbladderProcdocDefinition } from "$lib/data/procdoc-definitions";
import { buildGallbladderNote } from "$lib/logic/note-assembler";

export const gallbladderConfig: ExamConfig = {
  type: "gallbladder",
  slug: "gallbladder",
  displayName: "Gallbladder",
  definition: gallbladderProcdocDefinition,
  templateParts: [],
  buildNote: buildGallbladderNote,
  showRepeatProcedure: true,
  interpretation: { kind: "none" },
  presets: [],
};
