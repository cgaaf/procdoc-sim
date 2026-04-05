import type { ProcdocDefinition } from "$lib/types/procdoc-definition";

// ─── Shared indication presets ─────────────────────────────────────

const STANDARD_LIMITATIONS = [
  "Body habitus",
  "Patient unable to cooperate",
  "Suboptimal acoustic windows",
  "Technical difficulties",
];

// ─── FAST ──────────────────────────────────────────────────────────

export const fastProcdocDefinition: ProcdocDefinition = {
  findingsHelperText:
    "Required views Cardiac window (subxiphoid or parasternal long acceptable) " +
    "/ RUQ morrison pouch renal hepatic interface / LUQ must see top of spleen " +
    "and kidney / Bladder transverse sweep\n\n" +
    "Extended version must include apical video clips both right and left " +
    "and lateral clip at diaphragm looking for hemothorax.",
  sections: [],
  limitationOptions: [
    "Body habitus",
    "Patient unable to cooperate",
    "Subcutaneous emphysema",
    "Suboptimal acoustic windows",
    "Technical difficulties",
    "Bowel gas",
  ],
  findingsGroups: [
    {
      header: "",
      label: "Indication",
      required: true,
      findings: [
        {
          kind: "buttonGroup",
          macroId: "macro_0",
          options: ["Blunt Trauma", "Penetrating Trauma", "Abdominal Pain"],
          multiSelect: true,
          exclusiveOptions: new Set(),
        },
      ],
    },
    {
      header: "Cardiac",
      required: false,
      layout: "vertical",
      findings: [
        {
          kind: "findingRow",
          label: "Subxiphoid",
          findingLabel: "Pericardial effusion",
          macroId: "macro_3",
          presentOptions: ["Positive"],
          absentOption: "Negative",
          triState: true,
          triStateLabels: {
            present: "Pericardial Effusion",
            absent: "No Effusion",
            indeterminate: "Indeterminate",
          },
        },
        {
          kind: "findingRow",
          label: "Parasternal Long",
          findingLabel: "Pericardial effusion",
          macroId: "macro_3b",
          presentOptions: ["Positive"],
          absentOption: "Negative",
          triState: true,
          triStateLabels: {
            present: "Pericardial Effusion",
            absent: "No Effusion",
            indeterminate: "Indeterminate",
          },
        },
      ],
    },
    {
      header: "Thoracic",
      required: false,
      layout: "vertical",
      findings: [
        {
          kind: "buttonGroup",
          label: "Left Hemithorax",
          macroId: "macro_7_left",
          options: ["Normal Lung Slide", "Pneumothorax", "Hemothorax", "Indeterminate"],
          multiSelect: true,
          exclusiveOptions: new Set(["Normal Lung Slide", "Indeterminate"]),
          commentable: true,
        },
        {
          kind: "buttonGroup",
          label: "Right Hemithorax",
          macroId: "macro_7_right",
          options: ["Normal Lung Slide", "Pneumothorax", "Hemothorax", "Indeterminate"],
          multiSelect: true,
          exclusiveOptions: new Set(["Normal Lung Slide", "Indeterminate"]),
          commentable: true,
        },
      ],
    },
    {
      header: "Abdominal",
      required: false,
      layout: "vertical",
      findings: [
        {
          kind: "findingRow",
          label: "RUQ (Morrison's Pouch)",
          findingLabel: "Free fluid",
          macroId: "macro_4",
          presentOptions: ["Positive"],
          absentOption: "Negative",
          triState: true,
          triStateLabels: { present: "Free Fluid", absent: "No Free Fluid", indeterminate: "Indeterminate" },
        },
        {
          kind: "findingRow",
          label: "LUQ (Splenorenal)",
          findingLabel: "Free fluid",
          macroId: "macro_5",
          presentOptions: ["Positive"],
          absentOption: "Negative",
          triState: true,
          triStateLabels: { present: "Free Fluid", absent: "No Free Fluid", indeterminate: "Indeterminate" },
        },
        {
          kind: "findingRow",
          label: "Bladder (Suprapubic)",
          findingLabel: "Free fluid",
          macroId: "macro_6",
          presentOptions: ["Positive"],
          absentOption: "Negative",
          triState: true,
          triStateLabels: { present: "Free Fluid", absent: "No Free Fluid", indeterminate: "Indeterminate" },
        },
      ],
    },
  ],
};

export const dvtProcdocDefinition: ProcdocDefinition = {
  findingsHelperText:
    "Compression views required at the inguinal crease (common femoral vein " +
    "and saphenofemoral junction) and the popliteal fossa (proximal, mid, " +
    "and distal). Veins should be completely collapsible with minimal " +
    "pressure and no echogenic material within.",
  sections: [],
  limitationOptions: [
    "Body habitus",
    "Patient unable to cooperate",
    "Edema limiting visualization",
    "Overlying dressing or cast",
    "Technical difficulties",
  ],
  findingsGroups: [
    {
      header: "",
      label: "Indication",
      required: true,
      findings: [
        {
          kind: "buttonGroup",
          macroId: "dvt_indication",
          options: ["Leg Pain", "Leg Swelling", "Leg Erythema", "Suspected DVT", "Suspected PE"],
          multiSelect: true,
          exclusiveOptions: new Set(),
        },
      ],
    },
    {
      header: "Venous Compression",
      required: false,
      findings: [
        { kind: "subHeader", title: "Left Lower Extremity" },
        {
          kind: "findingRow",
          label: "Common Femoral",
          findingLabel: "Incomplete Compressibility",
          macroId: "dvt_cfv_left",
          presentOptions: ["Incompletely compressible", "Clot seen within the vein"],
          absentOption: "Completely compressible",
          naOption: "Not obtained",
        },
        {
          kind: "findingRow",
          label: "SFJ",
          findingLabel: "Incomplete Compressibility",
          macroId: "dvt_sfj_left",
          presentOptions: ["Incompletely compressible", "Clot seen within the vein"],
          absentOption: "Completely compressible",
          naOption: "Not obtained",
        },
        {
          kind: "findingRow",
          label: "Popliteal",
          findingLabel: "Incomplete Compressibility",
          macroId: "dvt_pop_left",
          presentOptions: ["Incompletely compressible", "Clot seen within the vein"],
          absentOption: "Completely compressible",
          naOption: "Not obtained",
        },
        { kind: "subHeader", title: "Right Lower Extremity" },
        {
          kind: "findingRow",
          label: "Common Femoral",
          findingLabel: "Incomplete Compressibility",
          macroId: "dvt_cfv_right",
          presentOptions: ["Incompletely compressible", "Clot seen within the vein"],
          absentOption: "Completely compressible",
          naOption: "Not obtained",
        },
        {
          kind: "findingRow",
          label: "SFJ",
          findingLabel: "Incomplete Compressibility",
          macroId: "dvt_sfj_right",
          presentOptions: ["Incompletely compressible", "Clot seen within the vein"],
          absentOption: "Completely compressible",
          naOption: "Not obtained",
        },
        {
          kind: "findingRow",
          label: "Popliteal",
          findingLabel: "Incomplete Compressibility",
          macroId: "dvt_pop_right",
          presentOptions: ["Incompletely compressible", "Clot seen within the vein"],
          absentOption: "Completely compressible",
          naOption: "Not obtained",
        },
      ],
    },
  ],
};

// ─── Echo / Lung ───────────────────────────────────────────────────

export const echolungProcdocDefinition: ProcdocDefinition = {
  findingsHelperText:
    "Cardiac: Parasternal long/short, apical 4-chamber, subxiphoid views.\n" +
    "Lung: Bilateral anterior and lateral views evaluating for B-lines, " +
    "pleural effusion, consolidation, and lung sliding.",
  sections: [],
  limitationOptions: [
    ...STANDARD_LIMITATIONS,
    "Subcutaneous emphysema",
    "Mechanical ventilation artifact",
  ],
  findingsGroups: [
    {
      header: "",
      label: "Indication",
      required: true,
      findings: [
        {
          kind: "buttonGroup",
          macroId: "echo_indication",
          options: [
            "Dyspnea",
            "Chest Pain",
            "Hypotension",
            "Hypoxia",
            "Cardiac Arrest",
            "Tachycardia",
          ],
          multiSelect: true,
          exclusiveOptions: new Set(),
        },
      ],
    },
    {
      header: "Cardiac",
      required: false,
      findings: [
        {
          kind: "findingRow",
          label: "LV Function",
          findingLabel: "Reduced LV function",
          macroId: "echo_lv",
          presentOptions: ["Reduced", "Severely reduced"],
          absentOption: "Normal",
        },
        {
          kind: "findingRow",
          label: "RV Dilation",
          findingLabel: "RV dilation",
          macroId: "echo_rv",
          presentOptions: ["Dilated", "Indeterminate"],
          absentOption: "Normal",
        },
        {
          kind: "findingRow",
          label: "Pericardial Effusion",
          findingLabel: "Pericardial effusion",
          macroId: "echo_pericardium",
          presentOptions: ["Effusion", "Indeterminate"],
          absentOption: "No effusion",
        },
        {
          kind: "findingRow",
          label: "IVC",
          findingLabel: "IVC plethora",
          macroId: "echo_ivc",
          presentOptions: ["Plethoric (>2.1 cm, <50% collapse)", "Indeterminate"],
          absentOption: "Normal (<2.1 cm, >50% collapse)",
        },
      ],
    },
    {
      header: "Lung",
      required: false,
      findings: [
        { kind: "subHeader", title: "Left Lung" },
        {
          kind: "buttonGroup",
          macroId: "echo_lung_left",
          options: [
            "A-lines (normal)",
            "B-lines (≥3 per field)",
            "Pleural Effusion",
            "Consolidation",
          ],
          multiSelect: true,
          exclusiveOptions: new Set(["A-lines (normal)"]),
          commentable: true,
        },
        { kind: "subHeader", title: "Right Lung" },
        {
          kind: "buttonGroup",
          macroId: "echo_lung_right",
          options: [
            "A-lines (normal)",
            "B-lines (≥3 per field)",
            "Pleural Effusion",
            "Consolidation",
          ],
          multiSelect: true,
          exclusiveOptions: new Set(["A-lines (normal)"]),
          commentable: true,
        },
      ],
    },
  ],
};

// ─── Soft Tissue ───────────────────────────────────────────────────

export const softTissueProcdocDefinition: ProcdocDefinition = {
  findingsHelperText:
    "Evaluate soft tissue with linear high-frequency probe. " +
    "Identify and measure any fluid collection, assess for foreign body, " +
    "and evaluate surrounding tissue.",
  sections: [],
  limitationOptions: [...STANDARD_LIMITATIONS, "Wound dressing in place", "Overlying edema"],
  findingsGroups: [
    {
      header: "",
      label: "Indication",
      required: true,
      findings: [
        {
          kind: "buttonGroup",
          macroId: "st_indication",
          options: ["Abscess", "Cellulitis", "Foreign Body", "Mass", "Swelling"],
          multiSelect: true,
          exclusiveOptions: new Set(),
        },
      ],
    },
    {
      header: "Soft Tissue Findings",
      required: false,
      findings: [
        {
          kind: "findingRow",
          label: "Fluid Collection",
          findingLabel: "Fluid collection",
          macroId: "st_collection",
          presentOptions: ["Present - drainable", "Present - not drainable", "Indeterminate"],
          absentOption: "No fluid collection",
        },
        {
          kind: "findingRow",
          label: "Foreign Body",
          findingLabel: "Foreign body",
          macroId: "st_foreign_body",
          presentOptions: ["Visualized", "Indeterminate"],
          absentOption: "Not visualized",
        },
        {
          kind: "findingRow",
          label: "Cobblestoning",
          findingLabel: "Cobblestoning",
          macroId: "st_cobblestone",
          presentOptions: ["Present"],
          absentOption: "Absent",
        },
      ],
    },
  ],
};

// ─── Gallbladder ───────────────────────────────────────────────────

export const gallbladderProcdocDefinition: ProcdocDefinition = {
  findingsHelperText:
    "RUQ view with curvilinear probe. Evaluate gallbladder for stones, " +
    "wall thickening (>3 mm), pericholecystic fluid, and sonographic " +
    "Murphy's sign. Measure CBD if visualized (normal <6 mm).",
  sections: [],
  limitationOptions: [
    ...STANDARD_LIMITATIONS,
    "Bowel gas",
    "Non-fasting patient",
    "Post-cholecystectomy",
  ],
  findingsGroups: [
    {
      header: "",
      label: "Indication",
      required: true,
      findings: [
        {
          kind: "buttonGroup",
          macroId: "gb_indication",
          options: [
            "RUQ Pain",
            "Epigastric Pain",
            "Nausea/Vomiting",
            "Suspected Cholecystitis",
            "Jaundice",
          ],
          multiSelect: true,
          exclusiveOptions: new Set(),
        },
      ],
    },
    {
      header: "Gallbladder",
      required: false,
      findings: [
        {
          kind: "findingRow",
          label: "Gallstones",
          findingLabel: "Cholelithiasis",
          macroId: "gb_stones",
          presentOptions: ["Present", "Sludge only"],
          absentOption: "No stones",
        },
        {
          kind: "findingRow",
          label: "Wall Thickening",
          findingLabel: "Wall thickening",
          macroId: "gb_wall",
          presentOptions: ["Thickened (>3 mm)", "Indeterminate"],
          absentOption: "Normal (≤3 mm)",
        },
        {
          kind: "findingRow",
          label: "Pericholecystic Fluid",
          findingLabel: "Pericholecystic fluid",
          macroId: "gb_fluid",
          presentOptions: ["Present", "Indeterminate"],
          absentOption: "Absent",
        },
        {
          kind: "findingRow",
          label: "Sonographic Murphy's",
          findingLabel: "Sonographic Murphy's sign",
          macroId: "gb_murphys",
          presentOptions: ["Positive"],
          absentOption: "Negative",
        },
        {
          kind: "findingRow",
          label: "CBD",
          findingLabel: "CBD dilation",
          macroId: "gb_cbd",
          presentOptions: ["Dilated (>6 mm)", "Indeterminate"],
          absentOption: "Normal (≤6 mm)",
          naOption: "Not visualized",
        },
      ],
    },
  ],
};

// ─── Obstetric / Pelvic ────────────────────────────────────────────

export const obstetricProcdocDefinition: ProcdocDefinition = {
  findingsHelperText:
    "Transabdominal evaluation for intrauterine pregnancy (IUP). " +
    "Assess for fetal heart activity, gestational age, and free fluid in pelvis. " +
    "Transvaginal approach if transabdominal is non-diagnostic.",
  sections: [],
  limitationOptions: [
    ...STANDARD_LIMITATIONS,
    "Early gestation (< 6 weeks)",
    "Retroverted uterus",
    "Bowel gas",
  ],
  findingsGroups: [
    {
      header: "",
      label: "Indication",
      required: true,
      findings: [
        {
          kind: "buttonGroup",
          macroId: "ob_indication",
          options: [
            "Vaginal Bleeding",
            "Pelvic Pain",
            "Pregnancy Confirmation",
            "Abdominal Pain",
            "Suspected Ectopic",
          ],
          multiSelect: true,
          exclusiveOptions: new Set(),
        },
      ],
    },
    {
      header: "Uterus",
      required: false,
      findings: [
        {
          kind: "findingRow",
          label: "IUP",
          findingLabel: "Intrauterine pregnancy",
          macroId: "ob_iup",
          presentOptions: ["Definite IUP", "Probable IUP (gestational sac only)", "Indeterminate"],
          absentOption: "No IUP visualized",
        },
        {
          kind: "findingRow",
          label: "Fetal Heart Activity",
          findingLabel: "Fetal heart activity",
          macroId: "ob_fhr",
          presentOptions: ["Present"],
          absentOption: "Absent",
          naOption: "Not applicable",
        },
        {
          kind: "findingRow",
          label: "Fetal Number",
          findingLabel: "Multiple gestation",
          macroId: "ob_number",
          presentOptions: ["Multiple gestation"],
          absentOption: "Singleton",
        },
      ],
    },
    {
      header: "Pelvis",
      required: false,
      findings: [
        {
          kind: "findingRow",
          label: "Free Fluid",
          findingLabel: "Pelvic free fluid",
          macroId: "ob_free_fluid",
          presentOptions: ["Present", "Large amount"],
          absentOption: "Absent",
        },
        {
          kind: "findingRow",
          label: "Adnexal Mass",
          findingLabel: "Adnexal mass",
          macroId: "ob_adnexal",
          presentOptions: ["Visualized", "Indeterminate"],
          absentOption: "Not visualized",
        },
      ],
    },
  ],
};
