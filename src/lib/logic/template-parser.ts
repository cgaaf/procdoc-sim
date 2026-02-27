import type { TemplatePart } from '$lib/types/template';

/**
 * Parses an Epic-style raw template string into structured TemplatePart[].
 *
 * Recognizes:
 *   {Blank single:19197::"opt1","opt2"} → macroDropdown (blankSingle)
 *   {:19197::"opt1","opt2"}              → macroDropdown (standard)
 *   @SIGNATURE@                          → signature placeholder
 *   .me / .now                           → token substitutions
 *   **text**                             → bold toggle
 */
export function parseTemplate(rawTemplate: string): TemplatePart[] {
	let macroCounter = 0;
	const parts: TemplatePart[] = [];
	const lines = rawTemplate.split('\n');

	for (let i = 0; i < lines.length; i++) {
		if (i > 0) parts.push({ kind: 'lineBreak' });
		parseLine(lines[i], parts);
	}

	return parts;

	function parseLine(line: string, out: TemplatePart[]) {
		if (line.trim() === '') return;

		// Pattern matches Epic macro syntax, signature token, .me, .now, and bold markers
		const pattern =
			/\{Blank single:\d+::"([^"]*(?:","[^"]*)*)"\}|\{:\d+::"([^"]*(?:","[^"]*)*)"\}|@SIGNATURE@|\.now|\.me|\*\*/g;

		let bold = false;
		let lastEnd = 0;
		let match: RegExpExecArray | null;

		while ((match = pattern.exec(line)) !== null) {
			if (match.index > lastEnd) {
				const text = line.substring(lastEnd, match.index);
				if (text) out.push({ kind: 'staticText', text, bold });
			}

			const fullMatch = match[0];

			if (fullMatch === '**') {
				bold = !bold;
			} else if (fullMatch === '@SIGNATURE@') {
				out.push({ kind: 'signature' });
			} else if (fullMatch === '.me') {
				out.push({ kind: 'me' });
			} else if (fullMatch === '.now') {
				out.push({ kind: 'now' });
			} else if (match[1] != null) {
				// Blank single macro — starts with no selection
				out.push({
					kind: 'macroDropdown',
					id: `macro_${macroCounter++}`,
					options: match[1].split('","'),
					blankSingle: true
				});
			} else if (match[2] != null) {
				// Standard macro — pre-selects first option
				out.push({
					kind: 'macroDropdown',
					id: `macro_${macroCounter++}`,
					options: match[2].split('","'),
					blankSingle: false
				});
			}

			lastEnd = match.index + fullMatch.length;
		}

		if (lastEnd < line.length) {
			const text = line.substring(lastEnd);
			if (text) out.push({ kind: 'staticText', text, bold });
		}
	}
}
