import type { UltrasoundType } from "$lib/types/procedure";
import type { ExamConfig } from "$lib/types/exam-config";
import { fastConfig } from "./fast-config";
import { dvtConfig } from "./dvt-config";
import { echolungConfig } from "./echolung-config";
import { softTissueConfig } from "./soft-tissue-config";
import { gallbladderConfig } from "./gallbladder-config";
import { obstetricConfig } from "./obstetric-config";

export const examConfigs: Record<string, ExamConfig> = {
  fast: fastConfig,
  dvt: dvtConfig,
  echolung: echolungConfig,
  soft_tissue: softTissueConfig,
  gallbladder: gallbladderConfig,
  obstetric: obstetricConfig,
};

export const SLUG_TO_TYPE: Record<string, UltrasoundType> = {
  fast: "fast",
  dvt: "dvt",
  echolung: "echolung",
  "soft-tissue": "soft_tissue",
  gallbladder: "gallbladder",
  obstetric: "obstetric",
};

export const EXAM_LIST = Object.values(examConfigs);
