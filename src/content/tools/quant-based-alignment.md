---
name: "Quant-Based Alignment"
phase: peptide-quantification
order: 3
summary: "Run alignment maps the scan time of one run onto another, so that a later tool can look for the peptide where it should elute."
inputsFrom: []
---

## Tool Description

Run alignment maps the scan time of one run onto another, so that a later tool can look for the peptide where it should elute.

## What's happening?

In data dependent acquisition the instrument picks the ions it fragments more or less at random. A peptide identified and quantified in one run is therefore often present in another run without ever having been fragmented there, so that run has no identification and no quantification for it. QuantBasedAlignment reads the quantified peptide ions of a target run (-i) and of one or more source runs (-ii). On the peptide ions a source run shares with the target it fits a smoothing spline from source scan times to target scan times, and with that spline it predicts the scan time of every source peptide ion in the target run. AlignmentBasedQuantification then extracts and quantifies the peptide ions at the predicted scan times. The tool links Intel MKL, so its package is platform specific: install ProteomIQon.QuantBasedAlignment_win_x64 on Windows or ProteomIQon.QuantBasedAlignment_linux_x64 on Linux. Both install the command proteomiqon-quantbasedalignment. The package ProteomIQon.QuantBasedAlignment on nuget.org is the library both wrap and installs no command.
