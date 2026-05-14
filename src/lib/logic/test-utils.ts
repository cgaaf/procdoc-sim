import type { NoteSpan } from "$lib/types/note";
import type { NoteAssemblerState } from "./note-assembler";

export interface MockStateOptions {
  performingProvider?: string;
  authorizingProvider?: string;
  procedureDate?: string;
  procedureTime?: string;
  isRepeatProcedure?: boolean;
  repeatPhysicianType?: "same" | "different" | null;
  repeatReasons?: Iterable<string>;
  limitationsText?: string;
  additionalFindings?: string;
  includeConsent?: boolean;
  includeTimeout?: boolean;
  macros?: Record<string, string>;
  macrosMulti?: Record<string, Iterable<string>>;
  comments?: Record<string, string>;
}

export function makeMockState(opts: MockStateOptions = {}): NoteAssemblerState {
  const macros = new Map(Object.entries(opts.macros ?? {}));
  const macrosMulti = new Map<string, Set<string>>(
    Object.entries(opts.macrosMulti ?? {}).map(([k, v]) => [k, new Set(v)]),
  );
  const comments = new Map(Object.entries(opts.comments ?? {}));
  return {
    performingProvider: opts.performingProvider ?? "Dr. Test",
    authorizingProvider: opts.authorizingProvider ?? "Dr. Attending",
    procedureDate: opts.procedureDate ?? "01/01/2026",
    procedureTime: opts.procedureTime ?? "12:00 PM",
    isRepeatProcedure: opts.isRepeatProcedure ?? false,
    repeatPhysicianType: opts.repeatPhysicianType ?? null,
    repeatReasons: new Set(opts.repeatReasons ?? []),
    limitationsText: opts.limitationsText ?? "None",
    additionalFindings: opts.additionalFindings ?? "",
    includeConsent: opts.includeConsent,
    includeTimeout: opts.includeTimeout,
    macroGet(id) {
      return macros.get(id) ?? null;
    },
    macroGetMulti(id) {
      return macrosMulti.get(id) ?? new Set();
    },
    getComment(id) {
      return comments.get(id) ?? "";
    },
  };
}

export function spansToText(spans: NoteSpan[]): string {
  return spans.map((s) => s.text).join("");
}
