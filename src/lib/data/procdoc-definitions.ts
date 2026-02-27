import type { ProcdocDefinition } from '$lib/types/procdoc-definition';

export const fastProcdocDefinition: ProcdocDefinition = {
	findingsHelperText:
		'Required views Cardiac window (subxiphoid or parasternal long acceptable) ' +
		'/ RUQ morrison pouch renal hepatic interface / LUQ must see top of spleen ' +
		'and kidney / Bladder transverse sweep\n\n' +
		'Extended version must include apical video clips both right and left ' +
		'and lateral clip at diaphragm looking for hemothorax.',
	sections: [],
	limitationOptions: [
		'Body habitus',
		'Patient unable to cooperate',
		'Subcutaneous emphysema',
		'Suboptimal acoustic windows',
		'Technical difficulties',
		'Bowel gas'
	],
	findingsGroups: [
		{
			header: '',
			label: 'Indication',
			required: true,
			findings: [
				{
					kind: 'buttonGroup',
					macroId: 'macro_0',
					options: ['Blunt Trauma', 'Penetrating Trauma', 'Abdominal Pain'],
					multiSelect: true,
					exclusiveOptions: new Set()
				}
			]
		},
		{
			header: 'Cardiac',
			required: false,
			findings: [
				{
					kind: 'findingRow',
					label: 'Subxiphoid',
					findingLabel: 'Pericardial effusion',
					macroId: 'macro_3',
					presentOptions: ['Effusion'],
					absentOption: 'Normal no effusion',
					naOption: 'no obtained'
				},
				{
					kind: 'findingRow',
					label: 'Parasternal Long',
					findingLabel: 'Pericardial effusion',
					macroId: 'macro_3b',
					presentOptions: ['Effusion'],
					absentOption: 'Normal no effusion',
					naOption: 'no obtained'
				}
			]
		},
		{
			header: 'Thoracic',
			required: false,
			findings: [
				{ kind: 'subHeader', title: 'Left Hemithorax' },
				{
					kind: 'buttonGroup',
					macroId: 'macro_7_left',
					options: ['Normal Lung Slide', 'Pneumothorax', 'Hemothorax'],
					multiSelect: true,
					exclusiveOptions: new Set(['Normal Lung Slide'])
				},
				{ kind: 'subHeader', title: 'Right Hemithorax' },
				{
					kind: 'buttonGroup',
					macroId: 'macro_7_right',
					options: ['Normal Lung Slide', 'Pneumothorax', 'Hemothorax'],
					multiSelect: true,
					exclusiveOptions: new Set(['Normal Lung Slide'])
				}
			]
		},
		{
			header: 'Abdominal',
			required: false,
			findings: [
				{
					kind: 'findingRow',
					label: "RUQ (Morrison's Pouch)",
					findingLabel: 'Free fluid',
					macroId: 'macro_4',
					presentOptions: ['Free fluid'],
					absentOption: 'Normal no free fluid',
					naOption: 'not obtained'
				},
				{
					kind: 'findingRow',
					label: 'LUQ (Splenorenal)',
					findingLabel: 'Free fluid',
					macroId: 'macro_5',
					presentOptions: ['Free fluid'],
					absentOption: 'Normal no free fluid',
					naOption: 'not obtained'
				},
				{
					kind: 'findingRow',
					label: 'Bladder (Suprapubic)',
					findingLabel: 'Free fluid',
					macroId: 'macro_6',
					presentOptions: ['Free fluid'],
					absentOption: 'Normal no free fluid',
					naOption: 'not obtained'
				}
			]
		}
	]
};

export const dvtProcdocDefinition: ProcdocDefinition = {
	findingsHelperText:
		'Compression views required at the inguinal crease (common femoral vein ' +
		'and saphenofemoral junction) and the popliteal fossa (proximal, mid, ' +
		'and distal). Veins should be completely collapsible with minimal ' +
		'pressure and no echogenic material within.',
	sections: [],
	limitationOptions: [
		'Body habitus',
		'Patient unable to cooperate',
		'Edema limiting visualization',
		'Overlying dressing or cast',
		'Technical difficulties'
	],
	findingsGroups: [
		{
			header: '',
			label: 'Indication',
			required: true,
			findings: [
				{
					kind: 'buttonGroup',
					macroId: 'dvt_indication',
					options: ['Leg Pain', 'Leg Swelling', 'Leg Erythema', 'Suspected DVT', 'Suspected PE'],
					multiSelect: true,
					exclusiveOptions: new Set()
				}
			]
		},
		{
			header: 'Venous Compression',
			required: false,
			findings: [
				{ kind: 'subHeader', title: 'Left Lower Extremity' },
				{
					kind: 'findingRow',
					label: 'Common Femoral',
					findingLabel: 'Incomplete Compressibility',
					macroId: 'dvt_cfv_left',
					presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
					absentOption: 'Completely compressible',
					naOption: 'Not obtained'
				},
				{
					kind: 'findingRow',
					label: 'SFJ',
					findingLabel: 'Incomplete Compressibility',
					macroId: 'dvt_sfj_left',
					presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
					absentOption: 'Completely compressible',
					naOption: 'Not obtained'
				},
				{
					kind: 'findingRow',
					label: 'Popliteal',
					findingLabel: 'Incomplete Compressibility',
					macroId: 'dvt_pop_left',
					presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
					absentOption: 'Completely compressible',
					naOption: 'Not obtained'
				},
				{ kind: 'subHeader', title: 'Right Lower Extremity' },
				{
					kind: 'findingRow',
					label: 'Common Femoral',
					findingLabel: 'Incomplete Compressibility',
					macroId: 'dvt_cfv_right',
					presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
					absentOption: 'Completely compressible',
					naOption: 'Not obtained'
				},
				{
					kind: 'findingRow',
					label: 'SFJ',
					findingLabel: 'Incomplete Compressibility',
					macroId: 'dvt_sfj_right',
					presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
					absentOption: 'Completely compressible',
					naOption: 'Not obtained'
				},
				{
					kind: 'findingRow',
					label: 'Popliteal',
					findingLabel: 'Incomplete Compressibility',
					macroId: 'dvt_pop_right',
					presentOptions: ['Incompletely compressible', 'Clot seen within the vein'],
					absentOption: 'Completely compressible',
					naOption: 'Not obtained'
				}
			]
		}
	]
};
