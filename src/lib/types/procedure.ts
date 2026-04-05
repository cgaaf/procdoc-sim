export type UltrasoundType =
  | "fast"
  | "dvt"
  | "echolung"
  | "soft_tissue"
  | "gallbladder"
  | "obstetric";

export const ULTRASOUND_TYPES: {
  value: UltrasoundType;
  displayName: string;
  slug: string;
  hasTemplate: boolean;
}[] = [
  { value: "fast", displayName: "FAST", slug: "fast", hasTemplate: true },
  { value: "dvt", displayName: "DVT", slug: "dvt", hasTemplate: true },
  { value: "echolung", displayName: "Cardiac/Lung", slug: "cardiac-lung", hasTemplate: true },
  { value: "soft_tissue", displayName: "Soft Tissue", slug: "soft-tissue", hasTemplate: true },
  { value: "gallbladder", displayName: "Gallbladder", slug: "gallbladder", hasTemplate: true },
  { value: "obstetric", displayName: "OB/Pelvic", slug: "obstetric", hasTemplate: true },
];

export type RepeatPhysicianType = "same" | "different";
