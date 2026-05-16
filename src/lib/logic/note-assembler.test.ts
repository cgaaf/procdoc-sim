import { describe, expect, it } from "vitest";
import {
  buildFastNote,
  buildDvtNote,
  buildEchoLungNote,
  buildSoftTissueNote,
  buildGallbladderNote,
  buildObstetricNote,
} from "./note-assembler";
import { makeMockState, spansToText } from "./test-utils";

const CONSENT_NEEDLE = "Consent was obtained verbally";
const TIMEOUT_NEEDLE = "A time out was performed";

describe("Consent & Timeout flags (cross-cutting B)", () => {
  it("FAST: defaults include consent + timeout (back-compat)", () => {
    const state = makeMockState({
      macros: { macro_4: "Negative", macro_5: "Negative", macro_6: "Negative" },
    });
    const text = spansToText(buildFastNote(state));
    expect(text).toContain(CONSENT_NEEDLE);
    expect(text).toContain(TIMEOUT_NEEDLE);
  });

  it("FAST: omits consent + timeout when both flags are false", () => {
    const state = makeMockState({
      macros: { macro_4: "Negative", macro_5: "Negative", macro_6: "Negative" },
      includeConsent: false,
      includeTimeout: false,
    });
    const text = spansToText(buildFastNote(state));
    expect(text).not.toContain(CONSENT_NEEDLE);
    expect(text).not.toContain(TIMEOUT_NEEDLE);
  });

  it("DVT: omits consent + timeout when both flags are false", () => {
    const state = makeMockState({
      macros: { dvt_cfv_left: "Completely compressible" },
      includeConsent: false,
      includeTimeout: false,
    });
    const text = spansToText(buildDvtNote(state));
    expect(text).not.toContain(CONSENT_NEEDLE);
    expect(text).not.toContain(TIMEOUT_NEEDLE);
  });

  it("Echo/Lung: omits consent + timeout when both flags are false", () => {
    const state = makeMockState({
      macros: { echo_lv: "Normal" },
      includeConsent: false,
      includeTimeout: false,
    });
    const text = spansToText(buildEchoLungNote(state));
    expect(text).not.toContain(CONSENT_NEEDLE);
    expect(text).not.toContain(TIMEOUT_NEEDLE);
  });

  it("Soft Tissue: omits consent + timeout when both flags are false", () => {
    const state = makeMockState({
      macros: { st_collection: "No fluid collection" },
      includeConsent: false,
      includeTimeout: false,
    });
    const text = spansToText(buildSoftTissueNote(state));
    expect(text).not.toContain(CONSENT_NEEDLE);
    expect(text).not.toContain(TIMEOUT_NEEDLE);
  });

  it("Gallbladder: omits consent + timeout when both flags are false", () => {
    const state = makeMockState({
      macros: { gb_stones: "No stones" },
      includeConsent: false,
      includeTimeout: false,
    });
    const text = spansToText(buildGallbladderNote(state));
    expect(text).not.toContain(CONSENT_NEEDLE);
    expect(text).not.toContain(TIMEOUT_NEEDLE);
  });

  it("OB/Pelvic: omits consent + timeout when both flags are false", () => {
    const state = makeMockState({
      macros: { ob_iup: "No IUP visualized" },
      includeConsent: false,
      includeTimeout: false,
    });
    const text = spansToText(buildObstetricNote(state));
    expect(text).not.toContain(CONSENT_NEEDLE);
    expect(text).not.toContain(TIMEOUT_NEEDLE);
  });
});

describe("FAST note builder", () => {
  it("indication includes free-text comment", () => {
    const state = makeMockState({
      macrosMulti: { macro_0: ["Blunt Trauma"] },
      comments: { macro_0: "fall from height" },
      macros: { macro_4: "Negative" },
    });
    const text = spansToText(buildFastNote(state));
    expect(text).toMatch(/Blunt Trauma.*fall from height/);
  });

  it("Subxiphoid set to 'Not obtained' renders a 'not obtained' line", () => {
    const state = makeMockState({
      macros: { macro_3: "Not obtained", macro_4: "Negative" },
    });
    const text = spansToText(buildFastNote(state));
    expect(text).toMatch(/Subxiphoid view not obtained/i);
  });

  it("FAST Negative x 3 interpretation expands with cardiac-not-obtained caveat", () => {
    const state = makeMockState({
      macros: {
        macro_3: "Not obtained",
        macro_4: "Negative",
        macro_5: "Negative",
        macro_6: "Negative",
        macro_8: "FAST Negative x 3",
      },
    });
    const text = spansToText(buildFastNote(state));
    expect(text).toContain(
      "FAST Negative x 3 – no intraperitoneal free fluid (cardiac view not obtained)",
    );
  });
});

describe("DVT note builder", () => {
  it("uses 'Femoral Vein' label and ECUS protocol string", () => {
    const state = makeMockState({
      macros: {
        dvt_cfv_left: "Completely compressible",
        dvt_sfj_left: "Incompletely compressible",
        dvt_pop_left: "Completely compressible",
        dvt_interp: "Positive for DVT",
      },
    });
    const text = spansToText(buildDvtNote(state));
    expect(text).toContain("Femoral Vein");
    expect(text).not.toContain("Saphenofemoral Junction");
    expect(text).toMatch(/Extended compression ultrasound \(ECUS\)/);
    expect(text).not.toMatch(/Two-point/i);
    expect(text).toContain("left femoral vein incompletely compressible");
  });
});

describe("Echo/Lung note builder", () => {
  it("emits zones imaged per side and B-lines pattern in interpretation", () => {
    const state = makeMockState({
      macrosMulti: {
        echo_lung_zones_right: ["Upper anterior (zone 1)", "Lower lateral (zone 4)"],
        echo_lung_right: ["B-lines (≥3 per field)"],
        echo_interp: ["Pulmonary edema"],
      },
      macros: {
        echo_lung_blines_pattern: "Diffuse B-lines",
      },
    });
    const text = spansToText(buildEchoLungNote(state));
    expect(text).toMatch(/Right lung: imaged Upper anterior \(zone 1\), Lower lateral \(zone 4\)/);
    expect(text).toMatch(/Diffuse B-lines/);
  });
});

describe("Soft Tissue note builder", () => {
  it("emits body part(s) examined in findings header block", () => {
    const state = makeMockState({
      macrosMulti: { st_body_part: ["Lower extremity - leg/foot"] },
      macros: { st_collection: "No fluid collection" },
    });
    const text = spansToText(buildSoftTissueNote(state));
    expect(text).toContain("Body part examined: Lower extremity - leg/foot");
  });
});

describe("Obstetric note builder", () => {
  it("emits Fetal Biometry block when group has selections", () => {
    const state = makeMockState({
      macros: {
        ob_iup: "Definite IUP (yolk sac and/or fetal pole)",
        ob_trimester: "First",
      },
      macrosMulti: {
        ob_biometry: ["CRL (crown-rump length)", "BPD (biparietal diameter)"],
      },
      comments: { ob_biometry: "CRL 4.2 cm = 11w 2d" },
    });
    const text = spansToText(buildObstetricNote(state));
    expect(text).toContain("Fetal Biometry");
    expect(text).toContain("First");
    expect(text).toContain("CRL (crown-rump length)");
    expect(text).toContain("BPD (biparietal diameter)");
    expect(text).toContain("CRL 4.2 cm = 11w 2d");
  });
});
