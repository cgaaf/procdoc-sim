/**
 * Reactive macro selections container using Svelte 5 runes.
 *
 * Stores both single-value and multi-value (Set) selections keyed by macro ID.
 * Reassigns Maps on mutation to trigger Svelte reactivity (Map.set() alone
 * won't trigger updates since the reference doesn't change).
 */
export class MacroSelections {
	selections = $state<Map<string, string | null>>(new Map());
	multiSelections = $state<Map<string, Set<string>>>(new Map());
	comments = $state<Map<string, string>>(new Map());

	get(macroId: string): string | null {
		return this.selections.get(macroId) ?? null;
	}

	set(macroId: string, value: string | null): void {
		const next = new Map(this.selections);
		next.set(macroId, value);
		this.selections = next;
	}

	getMulti(macroId: string): Set<string> {
		return this.multiSelections.get(macroId) ?? new Set();
	}

	setMulti(macroId: string, value: Set<string>): void {
		const next = new Map(this.multiSelections);
		next.set(macroId, value);
		this.multiSelections = next;
	}

	setIfEmpty(macroId: string, value: string): void {
		if (this.selections.get(macroId) == null) {
			this.set(macroId, value);
		}
	}

	setMultiIfEmpty(macroId: string, value: Set<string>): void {
		const current = this.multiSelections.get(macroId);
		if (!current || current.size === 0) {
			this.setMulti(macroId, value);
		}
	}

	getComment(macroId: string): string {
		return this.comments.get(macroId) ?? '';
	}

	setComment(macroId: string, text: string): void {
		const trimmed = text.trim();
		const next = new Map(this.comments);
		if (trimmed === '') {
			next.delete(macroId);
		} else {
			next.set(macroId, trimmed);
		}
		this.comments = next;
	}

	clear(): void {
		this.selections = new Map();
		this.multiSelections = new Map();
		this.comments = new Map();
	}
}
