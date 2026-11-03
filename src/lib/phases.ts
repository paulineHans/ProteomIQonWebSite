// The five processing stages of the ProteomIQon pipeline, in pipeline order.
// Tool frontmatter refers to a stage by its id. Number, label and colour all come from here.
export const phases = [
	{ id: 'preprocessing', number: '01', label: 'Preprocessing', detail: 'mzML · mzlite · peptide database', tone: 'sky' },
	{ id: 'peptide-identification', number: '02', label: 'Peptide Identification', detail: 'spectrum matching · FDR', tone: 'orange' },
	{ id: 'peptide-quantification', number: '03', label: 'Peptide Quantification', detail: 'XIC · intensity', tone: 'teal' },
	{ id: 'protein-identification', number: '04', label: 'Protein Identification', detail: 'protein groups', tone: 'red' },
	{ id: 'protein-quantification', number: '05', label: 'Protein Quantification', detail: 'alignment · protein intensity', tone: 'green' },
] as const;

export type Phase = (typeof phases)[number];
export type PhaseId = Phase['id'];
export type PhaseTone = Phase['tone'];

export const phaseIds = phases.map((phase) => phase.id) as [PhaseId, ...PhaseId[]];

export function getPhase(id: PhaseId): Phase {
	return phases.find((phase) => phase.id === id)!;
}
