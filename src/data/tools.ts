export interface Tool {
	slug: string;
	name: string;
	source: string;
	phase: string;
	phaseNumber: string;
	summary: string;
}

export const tools: Tool[] = [
	{ slug: 'mzml-to-mzlite', name: 'MzML to MzLite', source: 'MzMLToMzLite.html', phase: 'Prepare', phaseNumber: '01', summary: 'Convert an mzML file into the mzlite format used by the pipeline.' },
	{ slug: 'mzml-to-mzlite-ion-mobility', name: 'MzML to MzLite · Ion Mobility', source: 'MzMLToMzLiteIonMobility.html', phase: 'Prepare', phaseNumber: '01', summary: 'Convert mzML files from ion-mobility instruments such as Bruker timsTOF.' },
	{ slug: 'peptide-db', name: 'PeptideDB', source: 'PeptideDB.html', phase: 'Prepare', phaseNumber: '01', summary: 'Digest FASTA proteins in silico and store peptides, masses and modifications in SQLite.' },
	{ slug: 'peptide-spectrum-matching', name: 'Peptide Spectrum Matching', source: 'PeptideSpectrumMatching.html', phase: 'Identify', phaseNumber: '02', summary: 'Match candidate peptides to MS/MS spectra and score target and decoy identifications.' },
	{ slug: 'peptide-spectrum-matching-tims', name: 'Peptide Spectrum Matching · TIMS', source: 'PeptideSpectrumMatchingTIMs.html', phase: 'Identify', phaseNumber: '02', summary: 'Identify peptides in timsTOF runs using precursor ion-mobility information.' },
	{ slug: 'psm-statistics', name: 'PSM Statistics', source: 'PSMStatistics.html', phase: 'Identify', phaseNumber: '02', summary: 'Learn a combined score from peptide-spectrum matching results for downstream filtering.' },
	{ slug: 'ms-fragger-to-psm', name: 'MSFragger to PSM', source: 'MsFraggerToPSM.html', phase: 'Identify', phaseNumber: '02', summary: 'Turn FragPipe MSFragger results into qPSM files for ion-mobility quantification.' },
	{ slug: 'protein-inference', name: 'Protein Inference', source: 'ProteinInference.html', phase: 'Infer', phaseNumber: '03', summary: 'Map identified peptides back to proteins and report protein groups with shared evidence.' },
	{ slug: 'psm-based-quantification', name: 'PSM-Based Quantification', source: 'PSMBasedQuantification.html', phase: 'Quantify', phaseNumber: '04', summary: 'Turn the identifications from PSM statistics into peptide-ion intensities.' },
	{ slug: 'psm-based-quantification-tims', name: 'PSM-Based Quantification · TIMS', source: 'PSBasedQuantificaitonTIMs.html', phase: 'Quantify', phaseNumber: '04', summary: 'The PSM-based quantification variant for timsTOF runs.' },
	{ slug: 'quant-based-alignment', name: 'Quant-Based Alignment', source: 'QuantBasedAlignment.html', phase: 'Quantify', phaseNumber: '04', summary: 'Map the scan time of one run onto another so transferred peptides can be found.' },
	{ slug: 'alignment-based-quantification', name: 'Alignment-Based Quantification', source: 'AlignmentsBasedQuantification.html', phase: 'Quantify', phaseNumber: '04', summary: 'Predict where a peptide ion should elute in another run and quantify it there.' },
	{ slug: 'alignment-based-quant-statistics', name: 'Alignment-Based Quant Statistics', source: 'AlignmentBasedQuantStatistics.html', phase: 'Quantify', phaseNumber: '04', summary: 'Give transferred quantifications an alignment score and alignment Q-value.' },
	{ slug: 'add-deduced-peptides', name: 'Add Deduced Peptides', source: 'AddDeducedPeptides.html', phase: 'Quantify', phaseNumber: '04', summary: 'Assign combined protein groups to peptides present in each aligned quantification.' },
	{ slug: 'join-quant-with-peptide-ions', name: 'Join Quant with Peptide Ions', source: 'JoinQuantWithPepIons.html', phase: 'Quantify', phaseNumber: '04', summary: 'Join peptide-ion intensities with the protein groups that contain each sequence.' },
	{ slug: 'label-free-protein-quantification', name: 'Label-Free Protein Quantification', source: 'LabelFreeProteinQuantification.html', phase: 'Summarize', phaseNumber: '05', summary: 'Aggregate quantified peptide ions into one intensity per protein group and run.' },
	{ slug: 'labeled-protein-quantification', name: 'Labeled Protein Quantification', source: 'LabeledProteinQuantification.html', phase: 'Summarize', phaseNumber: '05', summary: 'Aggregate light and heavy intensities into one ratio per protein group and run.' },
	{ slug: 'ratio-lfq', name: 'Ratio LFQ', source: 'RatioLFQ.html', phase: 'Summarize', phaseNumber: '05', summary: 'Turn labeled-run ratios into comparable label-free-style intensities.' },
];

export const toolBySlug = Object.fromEntries(tools.map((tool) => [tool.slug, tool]));
