import type { UltrasoundType, RepeatPhysicianType } from '$lib/types/procedure';
import type { ProcdocDefinition } from '$lib/types/procdoc-definition';
import type { TemplatePart } from '$lib/types/template';
import type { NoteSpan } from '$lib/types/note';
import { ULTRASOUND_TYPES } from '$lib/types/procedure';
import { fastProcdocDefinition, dvtProcdocDefinition } from '$lib/data/procdoc-definitions';
import { fastTemplate, dvtTemplate } from '$lib/data/template-data';
import { parseTemplate } from '$lib/logic/template-parser';
import { buildFastNote, buildDvtNote, getDvtDerivedSide } from '$lib/logic/note-assembler';
import { MacroSelections } from './macro-selections.svelte';

const DVT_LEFT_VESSEL_IDS = ['dvt_cfv_left', 'dvt_sfj_left', 'dvt_pop_left'];
const DVT_RIGHT_VESSEL_IDS = ['dvt_cfv_right', 'dvt_sfj_right', 'dvt_pop_right'];
const DVT_ALL_VESSEL_IDS = [...DVT_LEFT_VESSEL_IDS, ...DVT_RIGHT_VESSEL_IDS];

export class AppState {
	selectedUltrasoundType = $state<UltrasoundType | null>(null);
	templateParts = $state<TemplatePart[]>([]);
	procdocDefinition = $state<ProcdocDefinition | null>(null);
	macroSelections = new MacroSelections();

	isRepeatProcedure = $state(false);
	repeatPhysicianType = $state<RepeatPhysicianType | null>(null);
	repeatReasons = $state<Set<string>>(new Set());
	selectedLimitations = $state<Set<string>>(new Set());

	additionalFindings = $state('');
	performingProvider = $state('Emergency, Attending Physician, MD');
	authorizingProvider = $state('Emergency, Attending Physician, MD');
	procedureDate = $state('');
	procedureTime = $state('');

	limitationsText = $derived.by(() => {
		if (this.selectedLimitations.size === 0) return 'none';
		return [...this.selectedLimitations].join(', ');
	});

	dvtDerivedSide = $derived.by(() => {
		return getDvtDerivedSide({
			macroGet: (id: string) => this.macroSelections.get(id),
			macroGetMulti: (id: string) => this.macroSelections.getMulti(id),
			performingProvider: this.performingProvider,
			authorizingProvider: this.authorizingProvider,
			procedureDate: this.procedureDate,
			procedureTime: this.procedureTime,
			isRepeatProcedure: this.isRepeatProcedure,
			repeatPhysicianType: this.repeatPhysicianType,
			repeatReasons: this.repeatReasons,
			limitationsText: this.limitationsText,
			additionalFindings: this.additionalFindings
		});
	});

	assembledNote = $derived.by((): NoteSpan[] => {
		const stateForAssembler = {
			performingProvider: this.performingProvider,
			authorizingProvider: this.authorizingProvider,
			procedureDate: this.procedureDate,
			procedureTime: this.procedureTime,
			isRepeatProcedure: this.isRepeatProcedure,
			repeatPhysicianType: this.repeatPhysicianType,
			repeatReasons: this.repeatReasons,
			limitationsText: this.limitationsText,
			additionalFindings: this.additionalFindings,
			macroGet: (id: string) => this.macroSelections.get(id),
			macroGetMulti: (id: string) => this.macroSelections.getMulti(id)
		};
		switch (this.selectedUltrasoundType) {
			case 'fast':
				return buildFastNote(stateForAssembler);
			case 'dvt':
				return buildDvtNote(stateForAssembler);
			default:
				return [];
		}
	});

	constructor() {
		this.selectUltrasoundType('fast');
	}

	selectUltrasoundType(type: UltrasoundType) {
		this.selectedUltrasoundType = type;
		this.macroSelections.clear();
		this.selectedLimitations = new Set();
		this.additionalFindings = '';
		this.isRepeatProcedure = false;
		this.repeatPhysicianType = null;
		this.repeatReasons = new Set();

		const typeInfo = ULTRASOUND_TYPES.find((t) => t.value === type);
		if (typeInfo?.hasTemplate) {
			const raw = type === 'fast' ? fastTemplate : type === 'dvt' ? dvtTemplate : '';
			this.templateParts = parseTemplate(raw);

			this.procdocDefinition =
				type === 'fast'
					? fastProcdocDefinition
					: type === 'dvt'
						? dvtProcdocDefinition
						: null;
		} else {
			this.templateParts = [];
			this.procdocDefinition = null;
		}
	}

	setMacroSelection(macroId: string, value: string | null) {
		this.macroSelections.set(macroId, value);
		if (this.selectedUltrasoundType === 'fast') {
			if (macroId !== 'macro_8') this._updateFastInterpretation();
			this._syncViewsFromFindings();
		}
		if (this.selectedUltrasoundType === 'dvt') {
			if (macroId !== 'dvt_interp') this._updateDvtInterpretation();
		}
	}

	setMultiMacroSelection(macroId: string, value: Set<string>) {
		this.macroSelections.setMulti(macroId, value);
		if (this.selectedUltrasoundType === 'fast') {
			if (macroId !== 'macro_8') this._updateFastInterpretation();
			this._syncViewsFromFindings();
		}
		if (this.selectedUltrasoundType === 'dvt') {
			if (macroId !== 'dvt_interp') this._updateDvtInterpretation();
		}
	}

	toggleLimitation(limitation: string) {
		const next = new Set(this.selectedLimitations);
		if (next.has(limitation)) {
			next.delete(limitation);
		} else {
			next.add(limitation);
		}
		this.selectedLimitations = next;
	}

	toggleRepeatReason(reason: string) {
		const next = new Set(this.repeatReasons);
		if (next.has(reason)) {
			next.delete(reason);
		} else {
			next.add(reason);
		}
		this.repeatReasons = next;
	}

	setRepeatProcedure(value: boolean) {
		this.isRepeatProcedure = value;
		if (!value) {
			this.repeatPhysicianType = null;
			this.repeatReasons = new Set();
		}
	}

	setNow() {
		const now = new Date();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours() === 0 ? 12 : now.getHours();
		const minute = String(now.getMinutes()).padStart(2, '0');
		const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
		this.procedureDate = `${month}/${day}/${now.getFullYear()}`;
		this.procedureTime = `${hour}:${minute} ${ampm}`;
	}

	// ─── FAST presets (setIfEmpty — won't overwrite) ────────────

	applyNormalCardiac() {
		this.macroSelections.setIfEmpty('macro_3', 'Normal no effusion');
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	applyNormalLung() {
		this.macroSelections.setMultiIfEmpty('macro_7_left', new Set(['Normal Lung Slide']));
		this.macroSelections.setMultiIfEmpty('macro_7_right', new Set(['Normal Lung Slide']));
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	applyNormalAbdomen() {
		this.macroSelections.setIfEmpty('macro_4', 'Normal no free fluid');
		this.macroSelections.setIfEmpty('macro_5', 'Normal no free fluid');
		this.macroSelections.setIfEmpty('macro_6', 'Normal no free fluid');
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	applyNormalFAST() {
		this.macroSelections.setIfEmpty('macro_3', 'Normal no effusion');
		this.macroSelections.setIfEmpty('macro_4', 'Normal no free fluid');
		this.macroSelections.setIfEmpty('macro_5', 'Normal no free fluid');
		this.macroSelections.setIfEmpty('macro_6', 'Normal no free fluid');
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	applyNormalEFAST() {
		this.macroSelections.setIfEmpty('macro_3', 'Normal no effusion');
		this.macroSelections.setIfEmpty('macro_4', 'Normal no free fluid');
		this.macroSelections.setIfEmpty('macro_5', 'Normal no free fluid');
		this.macroSelections.setIfEmpty('macro_6', 'Normal no free fluid');
		this.macroSelections.setMultiIfEmpty('macro_7_left', new Set(['Normal Lung Slide']));
		this.macroSelections.setMultiIfEmpty('macro_7_right', new Set(['Normal Lung Slide']));
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	// ─── FAST override presets (set — overwrite everything) ─────

	applyNegativeFAST4() {
		this.macroSelections.set('macro_3', 'Normal no effusion');
		this.macroSelections.set('macro_4', 'Normal no free fluid');
		this.macroSelections.set('macro_5', 'Normal no free fluid');
		this.macroSelections.set('macro_6', 'Normal no free fluid');
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	applyNegativeEFAST5() {
		this.macroSelections.set('macro_3', 'Normal no effusion');
		this.macroSelections.set('macro_4', 'Normal no free fluid');
		this.macroSelections.set('macro_5', 'Normal no free fluid');
		this.macroSelections.set('macro_6', 'Normal no free fluid');
		this.macroSelections.setMulti('macro_7_left', new Set(['Normal Lung Slide']));
		this.macroSelections.setMulti('macro_7_right', new Set(['Normal Lung Slide']));
		this._updateFastInterpretation();
		this._syncViewsFromFindings();
	}

	// ─── DVT presets ────────────────────────────────────────────

	applyNormalDvtLeft() {
		for (const id of DVT_LEFT_VESSEL_IDS) {
			this.macroSelections.setIfEmpty(id, 'Completely compressible');
		}
		this._updateDvtInterpretation();
	}

	applyNormalDvtRight() {
		for (const id of DVT_RIGHT_VESSEL_IDS) {
			this.macroSelections.setIfEmpty(id, 'Completely compressible');
		}
		this._updateDvtInterpretation();
	}

	applyNormalDvtBilateral() {
		for (const id of DVT_ALL_VESSEL_IDS) {
			this.macroSelections.setIfEmpty(id, 'Completely compressible');
		}
		this._updateDvtInterpretation();
	}

	// ─── Private derivation logic ───────────────────────────────

	private _syncViewsFromFindings() {
		const left = this.macroSelections.getMulti('macro_7_left');
		const right = this.macroSelections.getMulti('macro_7_right');
		const hasLungs = left.size > 0 || right.size > 0;

		if (hasLungs) {
			this.macroSelections.set('macro_1', 'All E FAST Views');
			this.macroSelections.set('macro_2', 'Was');
		} else {
			this.macroSelections.set('macro_1', 'All FAST Views');
			this.macroSelections.set('macro_2', 'was NOT');
		}
	}

	private _hasAnyPositiveFinding(): boolean {
		const m3 = this.macroSelections.get('macro_3');
		const m3b = this.macroSelections.get('macro_3b');
		if (m3 === 'Effusion' || m3b === 'Effusion') return true;

		const m4 = this.macroSelections.get('macro_4');
		const m5 = this.macroSelections.get('macro_5');
		const m6 = this.macroSelections.get('macro_6');
		if (m4 === 'Free fluid' || m5 === 'Free fluid' || m6 === 'Free fluid') return true;

		const left = this.macroSelections.getMulti('macro_7_left');
		const right = this.macroSelections.getMulti('macro_7_right');
		if (
			left.has('Pneumothorax') ||
			left.has('Hemothorax') ||
			right.has('Pneumothorax') ||
			right.has('Hemothorax')
		) {
			return true;
		}

		return false;
	}

	private _isCardiacNegative(): boolean {
		const m3 = this.macroSelections.get('macro_3');
		const m3b = this.macroSelections.get('macro_3b');
		return m3 === 'Normal no effusion' || m3b === 'Normal no effusion';
	}

	private _isAbdominalAllNegative(): boolean {
		return (
			this.macroSelections.get('macro_4') === 'Normal no free fluid' &&
			this.macroSelections.get('macro_5') === 'Normal no free fluid' &&
			this.macroSelections.get('macro_6') === 'Normal no free fluid'
		);
	}

	private _isLungAllNegative(): boolean {
		const left = this.macroSelections.getMulti('macro_7_left');
		const right = this.macroSelections.getMulti('macro_7_right');
		return (
			left.size === 1 &&
			left.has('Normal Lung Slide') &&
			right.size === 1 &&
			right.has('Normal Lung Slide')
		);
	}

	private _updateFastInterpretation() {
		if (this._hasAnyPositiveFinding()) {
			this.macroSelections.set('macro_8', 'Positive FAST');
		} else if (
			this._isCardiacNegative() &&
			this._isAbdominalAllNegative() &&
			this._isLungAllNegative()
		) {
			this.macroSelections.set('macro_8', 'E-FAST Negative x 5');
		} else if (this._isCardiacNegative() && this._isAbdominalAllNegative()) {
			this.macroSelections.set('macro_8', 'FAST Negative x 4');
		} else {
			this.macroSelections.set('macro_8', null);
		}
	}

	private _updateDvtInterpretation() {
		const documented = DVT_ALL_VESSEL_IDS.map((id) => this.macroSelections.get(id)).filter(
			(v): v is string => v != null && v !== 'Not obtained'
		);

		if (documented.length === 0) {
			this.macroSelections.set('dvt_interp', null);
			return;
		}

		if (
			documented.some(
				(v) => v === 'Clot seen within the vein' || v === 'Incompletely compressible'
			)
		) {
			this.macroSelections.set('dvt_interp', 'Positive for DVT');
		} else if (documented.every((v) => v === 'Completely compressible')) {
			this.macroSelections.set('dvt_interp', 'Negative for DVT');
		} else {
			this.macroSelections.set('dvt_interp', null);
		}
	}
}
