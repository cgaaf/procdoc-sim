import type { NoteSpan } from '$lib/types/note';

/**
 * Minimal interface the note assembler needs from AppState.
 * Using an interface avoids a circular dependency on the .svelte.ts state file.
 */
export interface NoteAssemblerState {
	performingProvider: string;
	authorizingProvider: string;
	procedureDate: string;
	procedureTime: string;
	isRepeatProcedure: boolean;
	repeatPhysicianType: 'same' | 'different' | null;
	repeatReasons: Set<string>;
	limitationsText: string;
	additionalFindings: string;
	macroGet(macroId: string): string | null;
	macroGetMulti(macroId: string): Set<string>;
}

// ─── FAST Note Builder ──────────────────────────────────────────────

export function buildFastNote(state: NoteAssemblerState): NoteSpan[] {
	const spans: NoteSpan[] = [];

	const hasCardiac = hasCardiacFindings(state);
	const hasAbdominal = hasAbdominalFindings(state);
	const hasLungs = hasLungFindings(state);
	const hasAnyFindings = hasCardiac || hasAbdominal || hasLungs;
	const indication = getIndication(state);
	const interp = state.macroGet('macro_8');
	const dateTime = getDateTime(state);

	// Title
	spans.push({ text: 'Ultrasound - Point of Care', bold: true });
	spans.push({ text: '\n\n' });

	// Provider info
	spans.push({ text: 'Performed by: ', bold: true });
	spans.push({ text: `${state.performingProvider}\n`, bold: true });
	spans.push({ text: 'Authorized by: ', bold: true });
	spans.push({ text: `${state.authorizingProvider}\n`, bold: true });
	spans.push({ text: '\n' });

	// CPT codes
	if (hasCardiac || hasAbdominal || hasLungs) {
		if (hasCardiac) {
			spans.push({ text: 'CPT 93308', bold: true });
			spans.push({ text: '  Transthoracic echocardiography, limited\n' });
		}
		if (hasAbdominal) {
			spans.push({ text: 'CPT 76705', bold: true });
			spans.push({ text: '  Ultrasound, abdominal, limited\n' });
		}
		if (hasLungs) {
			spans.push({ text: 'CPT 76604', bold: true });
			spans.push({ text: '  Ultrasound, chest\n' });
		}
		spans.push({ text: '\n' });
		spans.push({ text: 'Relevant modifier reference:\n', bold: true });
		spans.push({ text: '-26: Professional component (interpretation and report)\n' });
		spans.push({ text: '-TC: Technical component (equipment and supplies)\n' });
		if (state.isRepeatProcedure) {
			if (state.repeatPhysicianType === 'same') {
				spans.push({ text: '-76: Repeat procedure, same physician\n' });
			} else if (state.repeatPhysicianType === 'different') {
				spans.push({ text: '-77: Repeat procedure, different physician\n' });
			}
		}
		spans.push({ text: '\n' });
	}

	// Indication
	if (indication) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Indication: ', bold: true });
		spans.push({ text: `${indication}\n` });
	}

	// Views obtained
	const views = getViewsObtained(state);
	if (views.length > 0) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Views obtained: ', bold: true });
		spans.push({ text: `${views.join(', ')}\n` });
	}

	// Repeat procedure info
	if (state.isRepeatProcedure && state.repeatPhysicianType) {
		spans.push({ text: '\n' });
		const physicianLabel =
			state.repeatPhysicianType === 'same' ? 'same physician' : 'different physician';
		const reasonParts: string[] = [];
		if (state.repeatReasons.has('Clinical status change')) {
			reasonParts.push('reassess after clinical status change');
		}
		if (state.repeatReasons.has('Assess effectiveness of resuscitation')) {
			reasonParts.push('assess effectiveness of resuscitation');
		}
		const reasonSuffix = reasonParts.length > 0 ? ` to ${reasonParts.join(', ')}` : '';
		spans.push({ text: 'Repeat procedure ', bold: true });
		spans.push({ text: `by ${physicianLabel}${reasonSuffix}\n` });
	}

	// Findings header
	if (hasAnyFindings) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Findings\n', bold: true, underline: true });
	}

	// Cardiac findings
	if (hasCardiac) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Cardiac:\n', bold: true });
		addCardiacFindingLines(state, spans);
	}

	// Abdominal findings
	if (hasAbdominal) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Abdominal:\n', bold: true });
		addAbdominalFindingLine(state, spans, 'macro_4', "RUQ (Morrison's Pouch)", 'free fluid');
		addAbdominalFindingLine(state, spans, 'macro_5', 'LUQ (Splenorenal)', 'free fluid');
		addAbdominalFindingLine(state, spans, 'macro_6', 'Bladder (Suprapubic)', 'free fluid');
	}

	// Thoracic findings
	if (hasLungs) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Thoracic:\n', bold: true });
		addThoracicFindingLines(state, spans);
	}

	// Limitations
	if (hasAnyFindings) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Limitations: ', bold: true });
		spans.push({ text: `${state.limitationsText}\n` });
	}

	// Interpretation
	if (interp) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Interpretation: ', bold: true });
		spans.push({ text: `${buildInterpretation(state, interp)}\n` });
	}

	// Additional findings
	if (state.additionalFindings) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Additional findings: ', bold: true });
		spans.push({ text: `${state.additionalFindings}\n` });
	}

	// Consent & Standard Precautions
	if (hasAnyFindings) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Consent and Standard Precautions\n', bold: true, underline: true });
		spans.push({
			text:
				'Consent was obtained verbally from the patient or appropriate guardian. ' +
				'In emergent situations where the patient was unable to provide consent, implied consent was utilized. ' +
				'Informed them of alternatives to comprehensive imaging, limitations of study, ' +
				'possibility of follow up studies required, and possibilities of referral.\n\n'
		});
		spans.push({
			text:
				'Standard precautions of appropriate PPE and cleaning of the probes per the AIUM and ACEP EUS Guidelines ' +
				'for Infection Control were maintained during the procedure and following its conclusion.\n\n'
		});
		spans.push({
			text:
				'A time out was performed prior to initiation and all available imaging was done at the bedside and ' +
				'interpreted by the performing clinician. Patient was identified via their wrist band and ' +
				'verbal acknowledgement.\n'
		});
	}

	// Attestation
	if (hasAnyFindings) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Images obtained and saved.\n\n' });
		spans.push({ text: `${state.performingProvider}\n`, bold: true });
		spans.push({ text: 'Emergency Medicine\n', bold: true });
		spans.push({ text: dateTime, bold: true });
	}

	return spans;
}

// ─── DVT Note Builder ───────────────────────────────────────────────

const DVT_LEFT_VESSEL_IDS = ['dvt_cfv_left', 'dvt_sfj_left', 'dvt_pop_left'];
const DVT_RIGHT_VESSEL_IDS = ['dvt_cfv_right', 'dvt_sfj_right', 'dvt_pop_right'];
const DVT_ALL_VESSEL_IDS = [...DVT_LEFT_VESSEL_IDS, ...DVT_RIGHT_VESSEL_IDS];

const DVT_VESSEL_LABELS: Record<string, string> = {
	dvt_cfv_left: 'left common femoral vein',
	dvt_sfj_left: 'left saphenofemoral junction',
	dvt_pop_left: 'left popliteal vein',
	dvt_cfv_right: 'right common femoral vein',
	dvt_sfj_right: 'right saphenofemoral junction',
	dvt_pop_right: 'right popliteal vein'
};

export function buildDvtNote(state: NoteAssemblerState): NoteSpan[] {
	const spans: NoteSpan[] = [];

	const hasAnyVessel = hasDvtFindings(state);
	const indication = getDvtIndication(state);
	const side = getDvtDerivedSide(state);
	const interp = state.macroGet('dvt_interp');
	const dateTime = getDateTime(state);

	// Title
	spans.push({ text: 'Ultrasound - Point of Care', bold: true });
	spans.push({ text: '\n\n' });

	// Provider info
	spans.push({ text: 'Performed by: ', bold: true });
	spans.push({ text: `${state.performingProvider}\n`, bold: true });
	spans.push({ text: 'Authorized by: ', bold: true });
	spans.push({ text: `${state.authorizingProvider}\n`, bold: true });
	spans.push({ text: 'Comments: ', bold: true });
	spans.push({ text: 'Lower Extremity Venous Thrombosis Evaluation\n', bold: true });
	spans.push({ text: '\n' });

	// CPT code
	if (hasAnyVessel) {
		if (side === 'Bilateral') {
			spans.push({ text: 'CPT 93970', bold: true });
			spans.push({ text: '  Duplex scan of extremity veins, complete bilateral study\n' });
		} else {
			spans.push({ text: 'CPT 93971', bold: true });
			spans.push({
				text: '  Duplex scan of extremity veins, unilateral or limited study\n'
			});
		}
		spans.push({ text: '\n' });
		spans.push({ text: 'Relevant modifier reference:\n', bold: true });
		spans.push({ text: '-26: Professional component (interpretation and report)\n' });
		spans.push({ text: '-TC: Technical component (equipment and supplies)\n' });
		spans.push({ text: '\n' });
	}

	// Indication
	if (indication) {
		spans.push({ text: 'Indication: ', bold: true });
		spans.push({ text: `${indication}\n` });
	}

	// Side
	if (side) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Side: ', bold: true });
		const sideText =
			side === 'Bilateral' ? 'Bilateral lower extremities' : `${side} lower extremity`;
		spans.push({ text: `${sideText}\n` });
	}

	// Protocol
	if (hasAnyVessel) {
		spans.push({ text: '\n' });
		spans.push({
			text: 'Two-point compression with color flow Doppler was utilized for evaluation.\n'
		});
	}

	// Findings
	if (hasAnyVessel) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Findings\n', bold: true, underline: true });

		const hasLeft = hasDvtSideFindings(state, DVT_LEFT_VESSEL_IDS);
		const hasRight = hasDvtSideFindings(state, DVT_RIGHT_VESSEL_IDS);

		if (hasLeft) {
			spans.push({ text: '\n' });
			spans.push({ text: '  Left Lower Extremity:\n', bold: true });
			addDvtVesselLine(state, spans, 'dvt_cfv_left', 'Common Femoral Vein');
			addDvtVesselLine(state, spans, 'dvt_sfj_left', 'Saphenofemoral Junction');
			addDvtVesselLine(state, spans, 'dvt_pop_left', 'Popliteal Vein');
		}
		if (hasRight) {
			spans.push({ text: '\n' });
			spans.push({ text: '  Right Lower Extremity:\n', bold: true });
			addDvtVesselLine(state, spans, 'dvt_cfv_right', 'Common Femoral Vein');
			addDvtVesselLine(state, spans, 'dvt_sfj_right', 'Saphenofemoral Junction');
			addDvtVesselLine(state, spans, 'dvt_pop_right', 'Popliteal Vein');
		}
	}

	// Limitations
	if (hasAnyVessel) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Limitations: ', bold: true });
		spans.push({ text: `${state.limitationsText}\n` });
	}

	// Interpretation
	if (interp) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Interpretation: ', bold: true });
		spans.push({ text: `${buildDvtInterpretation(state, interp)}\n` });
	}

	// Additional findings
	if (state.additionalFindings) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Additional findings: ', bold: true });
		spans.push({ text: `${state.additionalFindings}\n` });
	}

	// High-risk advisory
	if (hasAnyVessel) {
		spans.push({ text: '\n' });
		spans.push({ text: 'High-Risk Patient Advisory\n', bold: true, underline: true });
		spans.push({
			text:
				'Caveat in high pre test suspicion patient population ultrasound even ' +
				'performed by radiology personnel has an almost 20% miss rate. If high ' +
				'clinical suspicion is had get a consultative study, if this is ' +
				'unavailable place the patient on lovenox until one can be performed ' +
				'assuming the patient is otherwise stable.\n\n'
		});
		spans.push({
			text:
				'In high risk patients who were given lovenox the risks and benefits ' +
				'were discussed with them regarding following up tomorrow for repeat ' +
				'sonography as well as concerning signs of symptoms of interval ' +
				'worsening or complication from our intervention that would require ' +
				'immediate return and repeat evaluation. The patient and/or appropriate ' +
				'family members were present and demonstrated good understanding of our ' +
				"protocol and were all in agreement. Arrangements for repeat evaluation " +
				"have been made on the patient's behalf.\n"
		});
	}

	// Formal follow-up
	if (state.macroGet('dvt_formal_fu') != null) {
		spans.push({ text: '\n' });
		spans.push({
			text: 'Consultative radiology duplex study has been ordered for comprehensive evaluation.\n',
			bold: true
		});
	}

	// Consent
	if (hasAnyVessel) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Consent and Standard Precautions\n', bold: true, underline: true });
		spans.push({
			text:
				'Consent was obtained verbally from the patient or appropriate guardian. ' +
				'In emergent situations where the patient was unable to provide consent, implied consent was utilized. ' +
				'Informed them of alternatives to comprehensive imaging, limitations of study, ' +
				'possibility of follow up studies required, and possibilities of referral.\n\n'
		});
		spans.push({
			text:
				'Standard precautions of appropriate PPE and cleaning of the probes per the AIUM and ACEP EUS Guidelines ' +
				'for Infection Control were maintained during the procedure and following its conclusion.\n\n'
		});
		spans.push({
			text:
				'A time out was performed prior to initiation and all available imaging was done at the bedside and ' +
				'interpreted by the performing clinician. Patient was identified via their wrist band and ' +
				'verbal acknowledgement.\n'
		});
	}

	// Attestation
	if (hasAnyVessel) {
		spans.push({ text: '\n' });
		spans.push({ text: 'Images obtained and saved.\n\n' });
		spans.push({ text: `${state.performingProvider}\n`, bold: true });
		spans.push({ text: 'Emergency Medicine\n', bold: true });
		spans.push({ text: dateTime, bold: true });
	}

	return spans;
}

// ─── Helpers ────────────────────────────────────────────────────────

function hasCardiacFindings(state: NoteAssemblerState): boolean {
	for (const id of ['macro_3', 'macro_3b']) {
		const v = state.macroGet(id);
		if (v != null && v !== 'no obtained') return true;
	}
	return false;
}

function hasAbdominalFindings(state: NoteAssemblerState): boolean {
	for (const id of ['macro_4', 'macro_5', 'macro_6']) {
		const v = state.macroGet(id);
		if (v != null && v !== 'not obtained') return true;
	}
	return false;
}

function hasLungFindings(state: NoteAssemblerState): boolean {
	const left = state.macroGetMulti('macro_7_left');
	const right = state.macroGetMulti('macro_7_right');
	return left.size > 0 || right.size > 0;
}

function getIndication(state: NoteAssemblerState): string | null {
	const multi = state.macroGetMulti('macro_0');
	if (multi.size > 0) return [...multi].join(', ');
	return state.macroGet('macro_0');
}

function getViewsObtained(state: NoteAssemblerState): string[] {
	const views: string[] = [];

	if (isObtained(state.macroGet('macro_3'), 'no obtained')) views.push('Subxiphoid');
	if (isObtained(state.macroGet('macro_3b'), 'no obtained')) views.push('Parasternal long');
	if (isObtained(state.macroGet('macro_4'), 'not obtained'))
		views.push("RUQ (Morrison's Pouch)");
	if (isObtained(state.macroGet('macro_5'), 'not obtained')) views.push('LUQ (Splenorenal)');
	if (isObtained(state.macroGet('macro_6'), 'not obtained'))
		views.push('Bladder (Suprapubic)');
	if (state.macroGetMulti('macro_7_left').size > 0) views.push('Left hemithorax');
	if (state.macroGetMulti('macro_7_right').size > 0) views.push('Right hemithorax');

	return views;
}

function isObtained(value: string | null, notObtainedLabel: string): boolean {
	return value != null && value !== notObtainedLabel;
}

function getDateTime(state: NoteAssemblerState): string {
	if (state.procedureDate && state.procedureTime) {
		return `${state.procedureDate} ${state.procedureTime}`;
	}
	const now = new Date();
	const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours() === 0 ? 12 : now.getHours();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const minute = String(now.getMinutes()).padStart(2, '0');
	const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
	return `${month}/${day}/${now.getFullYear()} ${hour}:${minute} ${ampm}`;
}

function addCardiacFindingLines(state: NoteAssemblerState, spans: NoteSpan[]) {
	const m3 = state.macroGet('macro_3');
	const m3b = state.macroGet('macro_3b');

	if (m3 != null && m3 !== 'no obtained') {
		const desc =
			m3 === 'Effusion'
				? 'positive for pericardial effusion'
				: 'negative for pericardial effusion';
		spans.push({ text: `Subxiphoid view ${desc}\n` });
	}
	if (m3b != null && m3b !== 'no obtained') {
		const desc =
			m3b === 'Effusion'
				? 'positive for pericardial effusion'
				: 'negative for pericardial effusion';
		spans.push({ text: `Parasternal long view ${desc}\n` });
	}
}

function addAbdominalFindingLine(
	state: NoteAssemblerState,
	spans: NoteSpan[],
	macroId: string,
	viewLabel: string,
	findingLabel: string
) {
	const value = state.macroGet(macroId);
	if (value == null || value === 'not obtained') return;
	const desc =
		value === 'Free fluid' ? `positive for ${findingLabel}` : `negative for ${findingLabel}`;
	spans.push({ text: `${viewLabel} view ${desc}\n` });
}

function addThoracicFindingLines(state: NoteAssemblerState, spans: NoteSpan[]) {
	const left = state.macroGetMulti('macro_7_left');
	const right = state.macroGetMulti('macro_7_right');

	if (left.size > 0) {
		spans.push({ text: `Left hemithorax: ${formatLungFindings(left)}\n` });
	}
	if (right.size > 0) {
		spans.push({ text: `Right hemithorax: ${formatLungFindings(right)}\n` });
	}
}

function formatLungFindings(findings: Set<string>): string {
	return [...findings]
		.map((f) => (f === 'Normal Lung Slide' ? 'normal lung sliding' : f.toLowerCase()))
		.join(', ');
}

function buildInterpretation(state: NoteAssemblerState, interp: string): string {
	switch (interp) {
		case 'E-FAST Negative x 5':
			return (
				'E-FAST Negative x 5 \u2013 no pericardial effusion, ' +
				'no intraperitoneal free fluid, normal bilateral lung sliding'
			);
		case 'FAST Negative x 4':
			return (
				'FAST Negative x 4 \u2013 no pericardial effusion, ' +
				'no intraperitoneal free fluid'
			);
		case 'Positive FAST':
			return buildPositiveInterpretation(state);
		default:
			return interp;
	}
}

function buildPositiveInterpretation(state: NoteAssemblerState): string {
	const findings: string[] = [];

	const m3 = state.macroGet('macro_3');
	const m3b = state.macroGet('macro_3b');
	if (m3 === 'Effusion' || m3b === 'Effusion') {
		findings.push('pericardial effusion');
	}

	const fluidSites: string[] = [];
	if (state.macroGet('macro_4') === 'Free fluid') fluidSites.push('RUQ');
	if (state.macroGet('macro_5') === 'Free fluid') fluidSites.push('LUQ');
	if (state.macroGet('macro_6') === 'Free fluid') fluidSites.push('Bladder');
	if (fluidSites.length > 0) {
		findings.push(`intraperitoneal free fluid (${fluidSites.join(', ')})`);
	}

	const left = state.macroGetMulti('macro_7_left');
	const right = state.macroGetMulti('macro_7_right');

	const ptxSides: string[] = [];
	if (left.has('Pneumothorax')) ptxSides.push('left');
	if (right.has('Pneumothorax')) ptxSides.push('right');
	if (ptxSides.length > 0) {
		const side = ptxSides.length === 2 ? 'bilateral' : ptxSides[0];
		findings.push(`${side} pneumothorax`);
	}

	const htxSides: string[] = [];
	if (left.has('Hemothorax')) htxSides.push('left');
	if (right.has('Hemothorax')) htxSides.push('right');
	if (htxSides.length > 0) {
		const side = htxSides.length === 2 ? 'bilateral' : htxSides[0];
		findings.push(`${side} hemothorax`);
	}

	if (findings.length === 0) return 'Positive';
	return `Positive \u2013 ${findings.join(', ')}`;
}

// ─── DVT Helpers ────────────────────────────────────────────────────

function hasDvtFindings(state: NoteAssemblerState): boolean {
	for (const id of DVT_ALL_VESSEL_IDS) {
		const v = state.macroGet(id);
		if (v != null && v !== 'Not obtained') return true;
	}
	return false;
}

function hasDvtSideFindings(state: NoteAssemblerState, vesselIds: string[]): boolean {
	for (const id of vesselIds) {
		const v = state.macroGet(id);
		if (v != null && v !== 'Not obtained') return true;
	}
	return false;
}

export function getDvtDerivedSide(state: NoteAssemblerState): string | null {
	const hasLeft = DVT_LEFT_VESSEL_IDS.some((id) => {
		const v = state.macroGet(id);
		return v != null && v !== 'Not obtained';
	});
	const hasRight = DVT_RIGHT_VESSEL_IDS.some((id) => {
		const v = state.macroGet(id);
		return v != null && v !== 'Not obtained';
	});
	if (hasLeft && hasRight) return 'Bilateral';
	if (hasLeft) return 'Left Lower Extremity';
	if (hasRight) return 'Right Lower Extremity';
	return null;
}

function getDvtIndication(state: NoteAssemblerState): string | null {
	const multi = state.macroGetMulti('dvt_indication');
	if (multi.size > 0) return [...multi].join(', ');
	return state.macroGet('dvt_indication');
}

function addDvtVesselLine(
	state: NoteAssemblerState,
	spans: NoteSpan[],
	macroId: string,
	vesselLabel: string
) {
	const value = state.macroGet(macroId);
	if (value == null || value === 'Not obtained') return;
	spans.push({ text: `    ${vesselLabel}: ${value.toLowerCase()}\n` });
}

function buildDvtInterpretation(state: NoteAssemblerState, interp: string): string {
	if (interp === 'Negative for DVT') {
		return (
			'Negative for DVT \u2013 complete compressibility of all examined ' +
			'vessels, no intraluminal echogenic material'
		);
	}
	if (interp === 'Positive for DVT') {
		const abnormal: string[] = [];
		for (const id of DVT_ALL_VESSEL_IDS) {
			const v = state.macroGet(id);
			if (v === 'Incompletely compressible' || v === 'Clot seen within the vein') {
				const label = DVT_VESSEL_LABELS[id] ?? id;
				abnormal.push(`${label} ${v.toLowerCase()}`);
			}
		}
		if (abnormal.length === 0) return 'Positive for DVT';
		return `Positive for DVT \u2013 ${abnormal.join(', ')}`;
	}
	return interp;
}
