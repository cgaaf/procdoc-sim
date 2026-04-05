export interface ProcdocDefinition {
  sections: ProcdocSection[];
  findingsGroups: FindingsGroupSection[];
  limitationOptions: string[];
  findingsHelperText?: string;
}

// --- Procdoc section discriminated union ---

export type ProcdocSection =
  | { kind: "staticText"; text: string; bold: boolean }
  | {
      kind: "dropdownField";
      label: string;
      macroId: string;
      options: string[];
      blankSingle: boolean;
    }
  | { kind: "limitations"; options: string[] }
  | { kind: "freeText"; label: string }
  | { kind: "signature" }
  | { kind: "mixedText"; parts: import("./template").TemplatePart[] };

// --- Findings group ---

export interface FindingsGroupSection {
  header: string;
  label?: string;
  required: boolean;
  findings: FindingsItem[];
  /** When 'vertical', render findings in a single column instead of the default two-column split */
  layout?: "vertical" | "columns";
}

// --- Findings item discriminated union ---

export type FindingsItem =
  | FindingsSubHeader
  | FindingRow
  | FindingsButtonGroupDef
  | RadioFindingSubsection;

export interface FindingsSubHeader {
  kind: "subHeader";
  title: string;
}

export interface FindingRow {
  kind: "findingRow";
  label: string;
  findingLabel: string;
  macroId: string;
  presentOptions: string[];
  absentOption: string;
  naOption?: string;
  /** Render as 3 equal Positive / Negative / Indeterminate buttons instead of the +/−  toggle */
  triState?: boolean;
  /** Custom display labels for triState buttons (stored values stay unchanged) */
  triStateLabels?: { present: string; absent: string; indeterminate: string };
}

export interface FindingsButtonGroupDef {
  kind: "buttonGroup";
  label?: string;
  macroId: string;
  options: string[];
  multiSelect: boolean;
  exclusiveOptions: Set<string>;
  commentable?: boolean;
}

export interface RadioFindingSubsection {
  kind: "radioSubsection";
  header: string;
  rows: RadioFindingRow[];
}

export interface RadioFindingRow {
  label: string;
  macroId: string;
  options: string[];
}
