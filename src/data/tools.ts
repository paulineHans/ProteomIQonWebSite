export interface Tool {
	slug: string;
	name: string;
	source: string;
	phase: string;
	phaseNumber: string;
}

export const tools: Tool[] = [
	{ slug: 'mzml-to-mzlite', name: 'MzMLToMzLite', source: 'MzMLToMzLite.html', phase: 'Preprocessing', phaseNumber: '01'},
	{ slug: 'mzml-to-mzlite-ion-mobility', name: 'MzMLToMzLiteIonMobility', source: 'MzMLToMzLiteIonMobility.html', phase: 'Preprocessing', phaseNumber: '01'},
	{ slug: 'peptide-db', name: 'PeptideDB', source: 'PeptideDB.html', phase: 'Preprocessing', phaseNumber: '01'},
	{ slug: 'peptide-spectrum-matching', name: 'PeptideSpectrumMatching', source: 'PeptideSpectrumMatching.html', phase: 'Peptide Identification', phaseNumber: '02'},
	{ slug: 'peptide-spectrum-matching-tims', name: 'PeptideSpectrumMatchingTIMs', source: 'PeptideSpectrumMatchingTIMs.html', phase: 'Peptide Identification', phaseNumber: '02'},
	{ slug: 'psm-statistics', name: 'PSMStatistics', source: 'PSMStatistics.html', phase: 'Peptide Identification', phaseNumber: '02'},
	{ slug: 'ms-fragger-to-psm', name: 'MSFragger to PSM', source: 'MsFraggerToPSM.html', phase: 'Peptide Identification', phaseNumber: '02'},
	{ slug: 'protein-inference', name: 'Protein Inference', source: 'ProteinInference.html', phase: 'Protein Identification', phaseNumber: '04'},
	{ slug: 'psm-based-quantification', name: 'PSMBasedQuantification', source: 'PSMBasedQuantification.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'psm-based-quantification-tims', name: 'PSMBasedQuantificationTIMS', source: 'PSBasedQuantificaitonTIMs.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'quant-based-alignment', name: 'Quant-Based Alignment', source: 'QuantBasedAlignment.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'alignment-based-quantification', name: 'Alignment-Based Quantification', source: 'AlignmentsBasedQuantification.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'alignment-based-quant-statistics', name: 'Alignment-BasedQuantStatistics', source: 'AlignmentBasedQuantStatistics.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'add-deduced-peptides', name: 'Add Deduced Peptides', source: 'AddDeducedPeptides.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'join-quant-with-peptide-ions', name: 'JoinQuantWithPepIons', source: 'JoinQuantWithPepIons.html', phase: 'Peptide Quantification', phaseNumber: '03'},
	{ slug: 'label-free-protein-quantification', name: 'Label-Free Protein Quantification', source: 'LabelFreeProteinQuantification.html', phase: 'Protein Quantification', phaseNumber: '05'},
	{ slug: 'labeled-protein-quantification', name: 'Labeled Protein Quantification', source: 'LabeledProteinQuantification.html', phase: 'Protein Quantification', phaseNumber: '05'},
	{ slug: 'ratio-lfq', name: 'Ratio LFQ', source: 'RatioLFQ.html', phase: 'Protein Quantification', phaseNumber: '05'},
];

export const toolBySlug = Object.fromEntries(tools.map((tool) => [tool.slug, tool]));
