---
name: "Alignment-BasedQuantStatistics"
phase: peptide-quantification
order: 5
summary: "AlignmentBasedQuantStatistics gives every transferred quantification an alignment score and an alignment Q-value."
inputsFrom: [psm-based-quantification, quant-based-alignment, alignment-based-quantification]
---

## Tool description

AlignmentBasedQuantStatistics gives every transferred quantification an alignment score and an alignment Q-value, so downstream tools can filter transferred quantifications in the same way identifications are filtered by Q-value.

## How does AlignmentBasedQuantStatistics work?

1. A peptide ion transferred by alignment and quantified by AlignmentBasedQuantification has no identification behind it, so nothing says yet whether the peak found at the predicted scan time is the peptide.
2. It learns from peptide ions where the truth is known: the `.align` file also predicts ions the run had identified itself, and for those the transferred quantification can be compared with the quantification of the identified ion.
3. Ions where m/z and intensity agree closely are positive training examples; ions where they disagree are negative ones.
4. A gradient-boosted tree classifier trained on them scores every transferred ion, and the Q-value follows from the score distribution of the negative examples.

## Inputs

These inputs are needed to execute the tool:

| Flag | Meaning | Comes from |
| --- | --- | --- |
| `-i` | `.quant` of the run, before alignment | [PSMBasedQuantification](./psm-based-quantification.md) |
| `-ii` | `.align` of the run | [QuantBasedAlignment](./quant-based-alignment.md) |
| `-iii` | `.quant` of the run, after alignment | [AlignmentBasedQuantification](./alignment-based-quantification.md) |
| `-l` | `.quant` files after alignment of the runs used for training | [PSMBasedQuantification](./psm-based-quantification.md) |
| `-ll` | `.align` files of the runs used for training | [QuantBasedAlignment](./quant-based-alignment.md) |
| `-lll` | `.quant` files after alignment for the runs used for training | [AlignmentBasedQuantification](./alignment-based-quantification.md) |
| `-o` | Output directory, created when missing | — |
| `-p` | Parameter file (JSON) | — |
| `-c` | Number of runs scored in parallel (default: 1) | — |
| `-ts` | Switch: write the training examples selected from each run | — |
| `-dc` | Switch: write diagnostic charts | — |
| `-mf` | Switch: pair input files by name instead of position | — |

## Input file handling

| Parameter | Description |
| --- | --- |
| `-i` to `-iii` | Name the runs to score. |
| `-l` to `-lll` | Name the runs to learn from. These can be the same runs that are being scored. |
| File selection | Each of the six flags accepts a single file, multiple files, or a directory searched for `*.quant` or `*.align` files. |
| `-mf` | Pairs quant, align, and aligned quant files by filename without extension. Without this flag, files are paired by position. |
| Classifier training | Every scored run trains a classifier using pooled examples from all training runs. |
| `-ts` | Additionally writes a test set containing the training examples from the run of the same name. |
| `-dc` | Generates diagnostic plots for probability and Q-value distributions. |

## Parameter file

The four cutoffs decide which training ions count as positive and which as negative. Each compares a transferred value with the value of the identified ion (light or heavy, matching the ion's GlobalMod) and expresses the allowed difference as a fraction of the identified value.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `PositiveQuantMzCutoff` | `0.01` | Positive when the m/z difference is below this fraction of the identified m/z and the intensity condition holds too. |
| `NegativeQuantMzCutoff` | `0.99` | Negative when the m/z difference is above `(1 - NegativeQuantMzCutoff)` times the identified m/z, so above 1 percent with the default. |
| `PositiveQuantCutoff` | `0.1` | Positive when the intensity difference is below this fraction of the identified intensity and the m/z condition holds too. |
| `NegativeQuantCutoff` | `0.9` | Negative when the intensity difference is above `(1 - NegativeQuantCutoff)` times the identified intensity, so above 10 percent with the default. |

The positive test runs first. An ion that fails it is negative, whether or not it passes one of the negative conditions. The default file can be [downloaded here](https://github.com/CSBiology/ProteomIQon/blob/dev/src/ProteomIQon/defaultParams/AlignmentBasedQuantStatisticsParams.json).
