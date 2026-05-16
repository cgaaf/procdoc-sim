import { describe, expect, it } from "vitest";
import {
  fastProcdocDefinition,
  dvtProcdocDefinition,
  echolungProcdocDefinition,
  softTissueProcdocDefinition,
  gallbladderProcdocDefinition,
  obstetricProcdocDefinition,
} from "./procdoc-definitions";
import type {
  FindingsButtonGroupDef,
  FindingsGroupSection,
  FindingsItem,
  ProcdocDefinition,
  FindingRow,
} from "$lib/types/procdoc-definition";

function indicationGroup(def: ProcdocDefinition): FindingsGroupSection {
  const g = def.findingsGroups.find((g) => g.label === "Indication");
  if (!g) throw new Error("indication group not found");
  return g;
}

function indicationButtonGroup(def: ProcdocDefinition): FindingsButtonGroupDef {
  const item = indicationGroup(def).findings[0];
  if (item.kind !== "buttonGroup") throw new Error("indication is not a buttonGroup");
  return item;
}

function findButtonGroup(def: ProcdocDefinition, macroId: string): FindingsButtonGroupDef {
  for (const g of def.findingsGroups) {
    for (const f of g.findings) {
      if (f.kind === "buttonGroup" && f.macroId === macroId) return f;
    }
  }
  throw new Error(`button group ${macroId} not found`);
}

function findFindingRow(def: ProcdocDefinition, macroId: string): FindingRow {
  for (const g of def.findingsGroups) {
    for (const f of g.findings) {
      if (f.kind === "findingRow" && f.macroId === macroId) return f;
    }
  }
  throw new Error(`finding row ${macroId} not found`);
}

function findGroup(def: ProcdocDefinition, predicate: (g: FindingsGroupSection) => boolean) {
  const g = def.findingsGroups.find(predicate);
  if (!g) throw new Error("group not found");
  return g;
}

describe("Indication comment icons (cross-cutting A)", () => {
  it.each<[string, ProcdocDefinition]>([
    ["FAST", fastProcdocDefinition],
    ["DVT", dvtProcdocDefinition],
    ["Echo/Lung", echolungProcdocDefinition],
    ["Soft Tissue", softTissueProcdocDefinition],
    ["Gallbladder", gallbladderProcdocDefinition],
    ["OB/Pelvic", obstetricProcdocDefinition],
  ])("%s indication is commentable", (_label, def) => {
    expect(indicationButtonGroup(def).commentable).toBe(true);
  });
});

describe("FAST definition", () => {
  it("indication includes the abdomen/pericardium catch-all", () => {
    const bg = indicationButtonGroup(fastProcdocDefinition);
    expect(bg.options).toContain(
      "Concern for pathologic free fluid in abdomen and/or pericardium",
    );
  });

  it("hemithorax options replace Pneumothorax/Hemothorax with Negative lung sliding/Pleural effusion", () => {
    const left = findButtonGroup(fastProcdocDefinition, "macro_7_left");
    const right = findButtonGroup(fastProcdocDefinition, "macro_7_right");
    for (const bg of [left, right]) {
      expect(bg.options).toContain("Negative lung sliding");
      expect(bg.options).toContain("Pleural effusion");
      expect(bg.options).not.toContain("Pneumothorax");
      expect(bg.options).not.toContain("Hemothorax");
      expect(bg.exclusiveOptions.has("Normal Lung Slide")).toBe(true);
      expect(bg.exclusiveOptions.has("Indeterminate")).toBe(true);
    }
  });

  it("every FAST view finding row has a 'Not obtained' naOption", () => {
    for (const macroId of ["macro_3", "macro_3b", "macro_4", "macro_5", "macro_6"]) {
      const row = findFindingRow(fastProcdocDefinition, macroId);
      expect(row.naOption).toBe("Not obtained");
    }
  });
});

describe("DVT definition", () => {
  it("renames SFJ label to 'Femoral' for both sides", () => {
    const left = findButtonGroup(dvtProcdocDefinition, "dvt_sfj_left");
    const right = findButtonGroup(dvtProcdocDefinition, "dvt_sfj_right");
    expect(left.label).toBe("Femoral");
    expect(right.label).toBe("Femoral");
  });

  it("findings helper text describes ECUS and does not mention two-point compression", () => {
    expect(dvtProcdocDefinition.findingsHelperText).toMatch(/extended compression ultrasound/i);
    expect(dvtProcdocDefinition.findingsHelperText).toMatch(/ECUS/);
    expect(dvtProcdocDefinition.findingsHelperText).not.toMatch(/two-point/i);
  });
});

describe("Lung definition", () => {
  it("includes a Zones Imaged buttonGroup per side", () => {
    const expected = [
      "Upper anterior (zone 1)",
      "Lower anterior (zone 2)",
      "Upper lateral (zone 3)",
      "Lower lateral (zone 4)",
    ];
    const left = findButtonGroup(echolungProcdocDefinition, "echo_lung_zones_left");
    const right = findButtonGroup(echolungProcdocDefinition, "echo_lung_zones_right");
    for (const bg of [left, right]) {
      expect(bg.multiSelect).toBe(true);
      for (const opt of expected) expect(bg.options).toContain(opt);
    }
  });

  it("B-lines Pattern is gated on B-lines selected in either lung", () => {
    const bg = findButtonGroup(echolungProcdocDefinition, "echo_lung_blines_pattern");
    expect(bg.visibleWhen).toEqual({
      macroId: ["echo_lung_left", "echo_lung_right"],
      value: "B-lines (≥3 per field)",
      multi: true,
    });
  });
});

describe("Soft Tissue definition", () => {
  it("includes a required Body Part Examined section", () => {
    const g = findGroup(softTissueProcdocDefinition, (g) => g.label === "Body Part");
    expect(g.required).toBe(true);
    const f = g.findings[0] as FindingsItem;
    if (f.kind !== "buttonGroup") throw new Error("expected buttonGroup");
    expect(f.multiSelect).toBe(true);
    expect(f.options).toContain("Head/Neck");
    expect(f.options).toContain("Chest");
    expect(f.options).toContain("Lower extremity - leg/foot");
  });
});

describe("Gallbladder definition", () => {
  it("helper text mentions phased array and no longer says curvilinear-only", () => {
    expect(gallbladderProcdocDefinition.findingsHelperText).toMatch(/phased array/i);
  });

  it("Gallstones options contain 'Stones and sludge'", () => {
    const bg = findButtonGroup(gallbladderProcdocDefinition, "gb_stones");
    expect(bg.options).toContain("Stones and sludge");
  });

  it("CBD finding present label surfaces age-adjusted caveat", () => {
    const row = findFindingRow(gallbladderProcdocDefinition, "gb_cbd");
    const combined = `${row.triStateLabels?.present ?? ""} ${gallbladderProcdocDefinition.findingsHelperText ?? ""}`;
    expect(combined.toLowerCase()).toContain("age-adjusted");
  });
});

describe("OB/Pelvic definition", () => {
  it("ob_iup options remove Probable IUP and include criteria suffix on Definite IUP", () => {
    const bg = findButtonGroup(obstetricProcdocDefinition, "ob_iup");
    expect(bg.options.some((o) => /probable iup/i.test(o))).toBe(false);
    expect(bg.options).toContain("Definite IUP (yolk sac and/or fetal pole)");
  });

  it("ob_free_fluid contains 'Small amount' between Absent and Present", () => {
    const bg = findButtonGroup(obstetricProcdocDefinition, "ob_free_fluid");
    const idxSmall = bg.options.indexOf("Small amount");
    const idxAbsent = bg.options.indexOf("Absent");
    const idxPresent = bg.options.indexOf("Present");
    expect(idxSmall).toBeGreaterThan(-1);
    expect(idxAbsent).toBe(0);
    expect(idxSmall).toBe(idxAbsent + 1);
    expect(idxSmall).toBeLessThan(idxPresent);
  });

  it("Fetal Biometry group exists with visibleWhen gated on Definite IUP", () => {
    const g = findGroup(obstetricProcdocDefinition, (g) => g.header === "Fetal Biometry");
    expect(g.defaultCollapsed).toBe(true);
    const trimester = g.findings.find(
      (f): f is FindingsButtonGroupDef =>
        f.kind === "buttonGroup" && f.label === "Trimester",
    );
    if (!trimester) throw new Error("trimester missing");
    expect(trimester.visibleWhen).toEqual({
      macroId: "ob_iup",
      value: "Definite IUP (yolk sac and/or fetal pole)",
    });
    expect(trimester.commentable).toBe(true);
    const measurements = g.findings.find(
      (f): f is FindingsButtonGroupDef =>
        f.kind === "buttonGroup" && f.label === "Measurements Used",
    );
    if (!measurements) throw new Error("measurements missing");
    expect(measurements.multiSelect).toBe(true);
    expect(measurements.options).toContain("CRL (crown-rump length)");
  });
});
