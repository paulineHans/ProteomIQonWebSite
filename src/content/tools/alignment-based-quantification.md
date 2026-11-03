---
name: "Alignment-Based Quantification"
phase: peptide-quantification
order: 4
summary: "AlignmentBasedQuantification quantifies a peptide ion identified in another run at the place in this run where QuantBasedAlignment predicts it to elute."
inputsFrom: []
---

## Tool Description

QuantBasedAlignment predicts where a peptide ion identified in another run should elute in this run. AlignmentBasedQuantification goes to that place.

## What's happening?

For every peptide ion in the .align file it extracts an ion chromatogram from the .mzlite file around the predicted scan time, and, with PerformLocalWarp set, moves the scan time estimate by dynamic time warping of the extracted chromatogram against the chromatogram the ion had in the source run. Baseline correction, peak detection, peak fitting and the labeled counterpart work as in PSMBasedQuantification. The result is a .quant file that holds the quantifications of this run's own identifications together with the transferred ones.

## Good to know!

Further processing can be done with the [AlignmentBasedQuantStatistics](./alignment-based-quant-statistics.md) tool
