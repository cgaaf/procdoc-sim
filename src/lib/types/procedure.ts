export type UltrasoundType = 'fast' | 'cardiac' | 'dvt';

export const ULTRASOUND_TYPES: {
	value: UltrasoundType;
	displayName: string;
	hasTemplate: boolean;
}[] = [
	{ value: 'fast', displayName: 'FAST', hasTemplate: true },
	{ value: 'cardiac', displayName: 'Cardiac', hasTemplate: false },
	{ value: 'dvt', displayName: 'DVT', hasTemplate: true }
];

export type RepeatPhysicianType = 'same' | 'different';
