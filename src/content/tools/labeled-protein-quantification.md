---
name: "Labeled Protein Quantification"
phase: protein-quantification
order: 2
summary: "LabeledProteinQuantification aggregates peptide quantification results to protein groups using both light and heavy peptide signals."
inputsFrom: [join-quant-with-peptide-ions]
---

## Tool Description

LabeledProteinQuantification aggregates peptide quantification results to protein groups using both light and heavy peptide signals. The first mandatory stage combines the labeled versions of a peptide and calculates their light/heavy intensity ratio. Charge-state and modification aggregation are optional; the final stage aggregates peptides to protein groups.

The tool requires a `.quantAndProt` file produced by [JoinQuantPepIonsWithProteins](./join-quant-with-peptide-ions.md), which combines results from [ProteinInference](./protein-inference.md) and [PSMBasedQuantification](./psm-based-quantification.md).

Aggregation proceeds from matched light and heavy peptide forms to optional charge-state and modification aggregation, and finally to protein groups. Each performed stage writes its results as a tab-separated file. Optional stages can be skipped without stopping the following protein-level aggregation.

## How does Labeled Protein Quantification work?

The labeled workflow begins by combining light and heavy versions of a peptide. Further aggregation steps use the preceding available results. When a charge-state or modification step is skipped, its input is passed to the next enabled step.

1. **Aggregate light and heavy peptide forms (required)**

   Peptides sharing the same sequence, modifications and charge are combined across their labeling states. The tool aggregates light and heavy intensities and calculates the light/heavy ratio. The stage is controlled by `AggregateGlobalModificationsParams`.

2. **Aggregate charge states and modifications (optional)**

   Optionally combine differently charged forms of a peptide and then differently modified forms of the same sequence. Each stage can be enabled independently using `AggregateModifiedPeptidesParams`; the charge-state stage uses AggregatePeptideChargeStatesParams.

3. **Aggregate peptides to protein groups (required)**

   Finally, combine the quantified peptide information into protein-level values for both labeling channels and their ratio. This mandatory stage is specified by `AggregateToProteinGroupsParams`.

### What happens when optional stages are skipped?

If charge-state aggregation is disabled, the downstream stage still receives peptide forms with different charges. If modification aggregation is disabled, differently modified forms remain separate. When both are skipped, protein aggregation receives the direct result of light/heavy matching, including peptide sequences occurring with multiple charges or modifications.

## Inputs

The labeled protein quantification tool expects the following command-line arguments:

| Flag | Meaning | Comes from |
| --- | --- | --- |
| `-i` | One or more `.quantAndProt` input files combining peptide-ion intensities with protein group assignments. | [JoinQuantPepIonsWithProteins](./join-quant-with-peptide-ions.md) |
| `-o` | Directory for the generated tab-separated aggregation results. | Chosen output location |
| `-p` | Path to a JSON parameter file specifying the correlation threshold, modification filter and all aggregation stages. | [Default labeled parameter file ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabeledQuantificationParams.json) |

**Important:** The input must be a combined quantification-and-protein-inference result. This tool aggregates existing peptide signals and does not identify peptides or infer proteins itself.

## Parameter file

The parameters are passed as JSON. The main record is `LabeledQuantificationParams`; every performed aggregation stage uses the `LabeledProteinQuantification.AggregationParams` record with light, heavy and ratio settings.

### General settings

| Parameter | Default / type | Meaning |
| --- | --- | --- |
| `AggregateGlobalModificationsParams` | `LabeledProteinQuantification.AggregationParams (required)` | First, combine light and heavy versions of a peptide with the same sequence, modifications and charge; determine their intensity ratio. |
| `AggregatePeptideChargeStatesParams` | `Some LabeledProteinQuantification.AggregationParams` (documented default); the minimal preset sets this optional stage to `None` | Optional aggregation of differently charged versions of the same peptide. Use None/null to skip. |
| `AggregateModifiedPeptidesParams` | `Some LabeledProteinQuantification.AggregationParams` (documented default); this optional stage is `None` unless modification aggregation is enabled | Optional aggregation across different peptide modifications. Use None/null to skip. |
| `AggregateToProteinGroupsParams` | `LabeledProteinQuantification.AggregationParams` (required) | Final mandatory aggregation of quantified peptides to protein groups. |

**Additional top-level parameters:** Correlation_Light_Heavy_Threshold (documented default: Some 0.0) sets an optional minimum light/heavy correlation. ModificationFilter defaults to `UseModifiedPeptides.All`; alternatives include `UseModifiedPeptides.No` or `UseModifiedPeptides.UseOnly` for selected modifications.

**About the presets:** The minimal JSON uses null for the correlation threshold and both optional stages; `Some AggregationParams` activates an optional step. The *minimal* preset skips them, while a correlation-filter preset uses 0.9 (charge presets use 0.0). The optional JSON fields use `null` when disabled.

### Light/heavy label aggregation

This mandatory first step matches light and heavy peptide versions having the same sequence, modifications and charge. `AggregatePeptideChargeStatesParams` controls a separate optional charge-stage, not the label-matching step. Labeled aggregation is configured by AggregateGlobalModificationsParams, with `Some` transformation/filter options or default *Shared aggregation settings*. To omit optional filters and transformations use `None` / JSON `null`.

In all four supplied JSON presets, light intensity, heavy intensity and ratio are each aggregated with NumericAggregation.Mean, without additional transformations or filters.

### Optional peptide aggregation

The charge-state step groups peptides of the same sequence and modifications that have different charges (AggregatePeptideChargeStatesParams). The modification step combines versions of a peptide that have different modifications. Set `AggregateModifiedPeptidesParams` to `Some` with aggregation settings to activate the modification step; `None` / JSON `null` skips it.

The minimal and correlation-only presets skip both optional steps. The charge preset enables charge aggregation; the most extensive preset enables charge and modification aggregation. All enabled steps use Mean for light, heavy and ratio values.

### Protein-group aggregation

At the last stage, the tool combines quantified peptide results for a protein group. Unlike charge-state and modification aggregation, `AggregateToProteinGroupsParams` is required and cannot be set to None.

In every supplied labeled JSON preset, the protein aggregation uses NumericAggregation.Mean separately for the light and heavy intensities and for the light/heavy ratio, with no transformations or filters.

### Shared aggregation settings

All enabled stages use the four fields of `LabeledProteinQuantification.AggregationParams`:

| Parameter | Default | Meaning |
| --- | --- | --- |
| `LabeledTransform` | `None` | Optional transformations of the light intensity, heavy intensity or their ratio. |
| `LabeledSingleFilters` | `None` | Optional minimum or maximum filter criteria applied to individual intensities or ratios. |
| `LabeledGroupFilters` | `None` | Optional filtering of intensity and ratio values within a group before aggregation. |
| `LabeledAggregation` | `{Light = Mean; Heavy = Mean; Ratio = Mean}` | Aggregation methods applied separately to light and heavy intensities and the light/heavy ratio. |

**Available numeric aggregation methods:** `NumericAggregation.Mean`, `NumericAggregation.Median` and `NumericAggregation.Sum`. The labeled aggregation configuration assigns a method to Light, Heavy and Ratio separately.

In JSON, optional `None` values become `null`. The default mean settings are encoded under `"LabeledAggregation": {"Light": {"Case": "Mean"}, "Heavy": {"Case": "Mean"}, "Ratio": {"Case": "Mean"}}`.

**Default parameter files:** Four official presets exist: minimal, correlation-filtered, correlation + charge, and correlation + charge + modification. The charge-only preset is available at github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabeledQuantificationParams_CorrFilter_ChargeAgg.json.

- [LabeledQuantificationParams.json: minimal labeled aggregation ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabeledQuantificationParams.json)
- [LabeledQuantificationParams_withCorrFilter.json: correlation filter ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabeledQuantificationParams_withCorrFilter.json)
- [LabeledQuantificationParams_CorrFilter_ChargeAgg_ModAgg.json: charge + modification aggregation ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabeledQuantificationParams_CorrFilter_ChargeAgg_ModAgg.json)

## Parameter generation

Use an official labeled JSON preset or generate your own with F#. The documentation defines `ProteomIQon.Dto` records and serializes them using `Json.serialize`. Labeled parameters include a mandatory label-matching stage.

### Minimal labeled JSON example

```json
{
  "Correlation_Light_Heavy_Threshold": null,
  "ModificationFilter": {"Case": "All"},
  "AggregateGlobalModificationsParams": {
    "LabeledTransform": null,
    "LabeledSingleFilters": null,
    "LabeledGroupFilters": null,
    "LabeledAggregation": {
      "Light": {"Case": "Mean"},
      "Heavy": {"Case": "Mean"},
      "Ratio": {"Case": "Mean"}
    }
  },
  "AggregatePeptideChargeStatesParams": null,
  "AggregateModifiedPeptidesParams": null,
  "AggregateToProteinGroupsParams": {
    "LabeledTransform": null,
    "LabeledSingleFilters": null,
    "LabeledGroupFilters": null,
    "LabeledAggregation": {
      "Light": {"Case": "Mean"},
      "Heavy": {"Case": "Mean"},
      "Ratio": {"Case": "Mean"}
    }
  }
}
```

### F# parameter-generation example

The script follows the documented labeled aggregation types. Optional charge-state and modification aggregation can be disabled with `None` or enabled using `Some chargeParams` and `Some modParams`. The serialized result can be saved as JSON.

```text
#r "nuget: ProteomIQon, 0.0.7"

open ProteomIQon
open ProteomIQon.Dto

let globalModParams : Common.LabeledProteinQuantification.AggregationParams =
{
LabeledTransform     = None
LabeledSingleFilters = None
LabeledGroupFilters  = None
LabeledAggregation   = {
Light = NumericAggregation.Mean
Heavy = NumericAggregation.Mean
Ratio = NumericAggregation.Mean
}
}

let chargeParams : Common.LabeledProteinQuantification.AggregationParams =
{
LabeledTransform     = None
LabeledSingleFilters = None
LabeledGroupFilters  = None
LabeledAggregation   = {
Light = NumericAggregation.Mean
Heavy = NumericAggregation.Mean
Ratio = NumericAggregation.Mean
}
}

let modParams : Common.LabeledProteinQuantification.AggregationParams =
{
LabeledTransform     = None
LabeledSingleFilters = None
LabeledGroupFilters  = None
LabeledAggregation   = {
Light = NumericAggregation.Mean
Heavy = NumericAggregation.Mean
Ratio = NumericAggregation.Mean
}
}

let protParams : Common.LabeledProteinQuantification.AggregationParams =
{
LabeledTransform     = None
LabeledSingleFilters = None
LabeledGroupFilters  = None
LabeledAggregation   = {
Light = NumericAggregation.Mean
Heavy = NumericAggregation.Mean
Ratio = NumericAggregation.Mean
}
}

let parameters : Dto.LabeledQuantificationParams =
{
Correlation_Light_Heavy_Threshold = Some 0.0
ModificationFilter = UseModifiedPeptides.All
AggregateGlobalModificationsParams = globalModParams
AggregatePeptideChargeStatesParams = Some chargeParams // or None
AggregateModifiedPeptidesParams = Some modParams      // or None
AggregateToProteinGroupsParams = protParams
}

let serialized = parameters |> Json.serialize
System.IO.File.WriteAllText("LabeledQuantificationParams.json", serialized)
```

**Documentation note:** This F# sample uses the parameters shown in the published documentation. `Some modParams` applies the modification aggregation, whereas *Some chargeParams* applies charge aggregation. The `chargeParams` record and `Some chargeParams` are used together; replace either optional stage with None to skip it.

## Outputs

The labeled tool writes a tab-separated result for each performed aggregation stage. The mandatory light/heavy stage produces quantitative values and ratios; the final stage reports aggregated protein-level values.

| Stage | Output content | When produced |
| --- | --- | --- |
| Light/heavy aggregation | Light and heavy versions of the same peptide are combined; light intensity, heavy intensity and their ratio are aggregated. | Always after `AggregateGlobalModificationsParams` is applied. |
| Optional charge and modification aggregation | Charge-state aggregation combines peptide forms with different charges; modification aggregation can then combine differently modified forms. | When `AggregatePeptideChargeStatesParams` and/or modification aggregation is enabled. |
| Protein-group aggregation | Aggregated light and heavy peptide quantities and their ratios at protein-group level. | Always performed last. |

**Output format:** Each performed step produces a tab-separated file. The official labeled documentation does not provide exact output filenames or column names, so none are invented here.

## Executing the tool

Process a `.quantAndProt` input, specifying the output directory and labeled JSON parameter file. The executable is proteomiqon-labeledproteinquantification.

### Convert one run

```text
proteomiqon-labeledproteinquantification \
-i "path/to/your/run.quantAndProt" \
-o "path/to/your/outDirectory" \
-p "path/to/your/params.json"
```

### Convert multiple runs

```text
proteomiqon-labeledproteinquantification \
-i "path/to/your/run1.quantAndProt" \
"path/to/your/run2.quantAndProt" \
"path/to/your/run3.quantAndProt" \
-o "path/to/your/outDirectory" \
-p "path/to/your/params.json"
```

In the original multi-run example, `-o` is omitted before the output directory. The example above includes it, consistently with the single-run command.

### All command-line options

```text
proteomiqon-labeledproteinquantification --help
```
