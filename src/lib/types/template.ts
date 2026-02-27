export type TemplatePart =
	| { kind: 'staticText'; text: string; bold: boolean }
	| { kind: 'macroDropdown'; id: string; options: string[]; blankSingle: boolean }
	| { kind: 'signature' }
	| { kind: 'me' }
	| { kind: 'now' }
	| { kind: 'lineBreak' };
