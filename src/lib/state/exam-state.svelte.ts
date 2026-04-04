import type { RepeatPhysicianType } from "$lib/types/procedure";
import type { ExamConfig } from "$lib/types/exam-config";
import type { NoteSpan } from "$lib/types/note";
import { MacroSelections } from "./macro-selections.svelte";

export class ExamState {
  readonly config: ExamConfig;
  macroSelections = new MacroSelections();

  isRepeatProcedure = $state(false);
  repeatPhysicianType = $state<RepeatPhysicianType | null>(null);
  repeatReasons = $state<Set<string>>(new Set());
  selectedLimitations = $state<Set<string>>(new Set());

  additionalFindings = $state("");
  performingProvider = $state("Emergency, Attending Physician, MD");
  authorizingProvider = $state("Emergency, Attending Physician, MD");
  procedureDate = $state("");
  procedureTime = $state("");

  limitationsText = $derived.by(() => {
    if (this.selectedLimitations.size === 0) return "none";
    return [...this.selectedLimitations].join(", ");
  });

  assembledNote = $derived.by((): NoteSpan[] => {
    return this.config.buildNote({
      performingProvider: this.performingProvider,
      authorizingProvider: this.authorizingProvider,
      procedureDate: this.procedureDate,
      procedureTime: this.procedureTime,
      isRepeatProcedure: this.isRepeatProcedure,
      repeatPhysicianType: this.repeatPhysicianType,
      repeatReasons: this.repeatReasons,
      limitationsText: this.limitationsText,
      additionalFindings: this.additionalFindings,
      macroGet: (id: string) => this.macroSelections.get(id),
      macroGetMulti: (id: string) => this.macroSelections.getMulti(id),
      getComment: (id: string) => this.macroSelections.getComment(id),
    });
  });

  constructor(config: ExamConfig) {
    this.config = config;
  }

  setComment(macroId: string, text: string) {
    this.macroSelections.setComment(macroId, text);
  }

  getComment(macroId: string): string {
    return this.macroSelections.getComment(macroId);
  }

  setMacroSelection(macroId: string, value: string | null) {
    this.macroSelections.set(macroId, value);
    this.config.onMacroChange?.(macroId, this);
  }

  setMultiMacroSelection(macroId: string, value: Set<string>) {
    this.macroSelections.setMulti(macroId, value);
    this.config.onMacroChange?.(macroId, this);
  }

  toggleLimitation(limitation: string) {
    const next = new Set(this.selectedLimitations);
    if (next.has(limitation)) {
      next.delete(limitation);
    } else {
      next.add(limitation);
    }
    this.selectedLimitations = next;
  }

  toggleRepeatReason(reason: string) {
    const next = new Set(this.repeatReasons);
    if (next.has(reason)) {
      next.delete(reason);
    } else {
      next.add(reason);
    }
    this.repeatReasons = next;
  }

  setRepeatProcedure(value: boolean) {
    this.isRepeatProcedure = value;
    if (!value) {
      this.repeatPhysicianType = null;
      this.repeatReasons = new Set();
    }
  }

  setNow() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour =
      now.getHours() > 12 ? now.getHours() - 12 : now.getHours() === 0 ? 12 : now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    this.procedureDate = `${month}/${day}/${now.getFullYear()}`;
    this.procedureTime = `${hour}:${minute} ${ampm}`;
  }

  reset() {
    this.macroSelections.clear();
    this.selectedLimitations = new Set();
    this.additionalFindings = "";
    this.isRepeatProcedure = false;
    this.repeatPhysicianType = null;
    this.repeatReasons = new Set();
  }
}
