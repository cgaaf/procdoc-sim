export type UltrasoundType =
	| 'fast'
	| 'cardiac'
	| 'dvt'
	| 'echolung'
	| 'soft_tissue'
	| 'gallbladder'
	| 'obstetric';

export const ULTRASOUND_TYPES: {
	value: UltrasoundType;
	displayName: string;
	hasTemplate: boolean;
}[] = [
	{ value: 'fast', displayName: 'FAST', hasTemplate: true },
	{ value: 'cardiac', displayName: 'Cardiac', hasTemplate: false },
	{ value: 'dvt', displayName: 'DVT', hasTemplate: true },
	{ value: 'echolung', displayName: 'Echo/Lung', hasTemplate: true },
	{ value: 'soft_tissue', displayName: 'Soft Tissue', hasTemplate: true },
	{ value: 'gallbladder', displayName: 'Gallbladder', hasTemplate: true },
	{ value: 'obstetric', displayName: 'OB/Pelvic', hasTemplate: true }
];

export type RepeatPhysicianType = 'same' | 'different';
