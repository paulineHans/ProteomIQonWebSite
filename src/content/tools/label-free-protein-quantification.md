---
name: "Label-Free Protein Quantification"
phase: protein-quantification
order: 1
summary: "LabelFreeProteinQuantification turns peptide ion intensities into one intensity per protein group and run."
inputsFrom: [join-quant-with-peptide-ions]
---

## Tool Description

After [JoinQuantPepIonsWithProteins](./join-quant-with-peptide-ions.md) every quantified peptide ion carries its protein group. LabelFreeProteinQuantification turns these ion intensities into one intensity per protein group and run.

## How does Label-Free Protein Quantification work?

1. **Aggregate peptide charge states (optional)**

   The first step merges the charge states of a peptide

2. **Aggregate modified peptides (optional)**

   The second step merges the modified forms of a peptide

3. **Aggregate to protein groups**

   The third step merges all peptides of a protein group

The first two steps are optional. Each step has the same shape: transform the values, drop single values or outliers within a group, then aggregate what is left. Only light rows (GlobalMod 0) go in, so this tool is for unlabeled samples. For labeled samples use [LabeledProteinQuantification](./labeled-protein-quantification.md).

### What happens when stages are skipped?

If charge-state aggregation is disabled, differently charged versions of the same peptide remain separate for the next stage. If modification aggregation is disabled, differently modified versions remain separate. If both are disabled, protein-group aggregation works directly on the unaggregated peptide ions, so a peptide sequence may still occur with multiple charge states and modifications.

## Inputs

| Flag | Meaning | Comes from |
| --- | --- | --- |
| `-i` | One or more `.quantAndProt` input files containing peptide quantification and protein-group assignments. | [JoinQuantPepIonsWithProteins](./join-quant-with-peptide-ions.md) |
| `-o` | Directory in which the aggregation results are written. | Chosen output location |
| `-p` | Path to a JSON file specifying modification filtering and aggregation settings. | [Default parameter file ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabelFreeQuantificationParams.json) |

**Important:** The input must already combine peptide-level quantification with protein inference. The tool does not perform those upstream steps itself.

## Parameter file

### General settings

| Parameter | Default / type | Meaning |
| --- | --- | --- |
| `ModificationFilter` | `UseModifiedPeptides.All` | Specifies which modified peptides can be used in the aggregation stages. |
| `AggregatePeptideChargeStatesParams` | `None` in the minimal JSON preset; otherwise `Some AggregationParams` | Optional settings for combining differently charged versions of a peptide. Enabled in the charge-aggregation presets. |
| `AggregateModifiedPeptidesParams` | `None` in the minimal and charge-only JSON presets; otherwise `Some AggregationParams` | Optional settings for combining differently modified versions of a peptide. Enabled in the charge-and-modification preset. |
| `AggregateToProteinGroupsParams` | `AggregationParams` (required) | Settings for the final aggregation of peptide intensities to protein groups. |

**Modification filter options:** `UseModifiedPeptides.All` (use all), `UseModifiedPeptides.No` (exclude modified peptides), or `UseModifiedPeptides.UseOnly` (allow specified modifications).

**About the defaults:** The documentation lists the optional stage parameters as `Some AggregationParams`, but the repository also supplies a *minimal* JSON preset in which both optional fields are `null`. Which stages run therefore depends on the chosen preset.

### Charge-state aggregation

When enabled, this stage combines versions of the same modified peptide that differ only in precursor charge. Set `AggregatePeptideChargeStatesParams` to a `Some` record containing the settings listed under *Shared aggregation settings*. Set it to `None` / JSON `null` to skip the stage.

In the supplied charge-aggregation JSON preset, filtering and transformation are disabled and light intensities are aggregated using the mean.

### Modification aggregation

When enabled, this stage combines peptide versions with the same amino-acid sequence but different modifications. Set `AggregateModifiedPeptidesParams` to a `Some` record using the shared aggregation settings; `None` / JSON `null` skips the stage.

In the supplied charge-and-modification JSON preset, light intensities are aggregated using the mean and the three optional transformation/filter fields are disabled.

### Protein-group aggregation

The final aggregation combines the peptide intensities assigned to each protein group. Unlike the previous two stages, `AggregateToProteinGroupsParams` is not optional and always contains an aggregation-parameter record.

The official JSON presets use the mean of light intensities without additional transformations or filtering for this step.

### Shared aggregation settings

Each enabled stage uses the same four-field `LabelFreeQuantification.AggregationParams` record.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `Transform` | `None` | Optional transformation applied to intensity values. |
| `SingleFilters` | `None` | Optional lower and/or upper limits for individual intensities. |
| `GroupFilters` | `None` | Optional filtering of the group of intensities being aggregated. |
| `Aggregation` | `{Light = NumericAggregation.Mean}` | Specifies how the intensity values in a group are combined. |

**Numeric aggregation choices:** `NumericAggregation.Mean`, `NumericAggregation.Median` and `NumericAggregation.Sum`.

In JSON, the `None` values are represented by `null`, and the mean aggregator is encoded as `"Aggregation": {"Light": {"Case": "Mean"}}`.

**Default parameter files:** Choose the preset matching the aggregation stages you want to run.

- [Minimal: protein-group aggregation only ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabelFreeQuantificationParams.json)
- [Charge-state + protein-group aggregation ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabelFreeQuantificationParams_ChargeAgg.json)
- [Charge-state + modification + protein-group aggregation ↗](https://github.com/CSBiology/ProteomIQon/blob/main/src/ProteomIQon/defaultParams/LabelFreeQuantificationParams_ChargeAgg_ModAgg.json)

## Outputs

| Stage | Output content | When produced |
| --- | --- | --- |
| Charge-state aggregation | Intensities combined across charge states of the same modified peptide. | Only if `AggregatePeptideChargeStatesParams` is enabled. |
| Modification aggregation | Intensities combined across differently modified versions of the same peptide sequence. | Only if `AggregateModifiedPeptidesParams` is enabled. |
| Protein-group aggregation | Peptide intensities aggregated to protein-group level. | Always performed. |

**Output format:** tab-separated files. The referenced documentation does not specify exact output filenames or a column-by-column output schema, so no unverified filenames or columns are assumed here.

## Installing and executing the tool

1. **Installing**

   Install the Tool with the following command inside the choosen Command-Line

   ```sh
   dotnet tool install --global ProteomIQon.LabelFreeProteinQuantification
   ```

2. **Execute**

   - Running the tool

     ```sh
     proteomiqon-labelfreeproteinquantification -i path/to/run.quantAndProt -o path/to/output -p path/to/LabelFreeQuantificationParams.json
     ```

3. **Several runs in one table, from a list or from a directory**

   ```sh
   proteomiqon-labelfreeproteinquantification -i path/to/run1.quantAndProt path/to/run2.quantAndProt -o path/to/output -p path/to/LabelFreeQuantificationParams.json
   proteomiqon-labelfreeproteinquantification -i path/to/quantAndProt -o path/to/output -p path/to/LabelFreeQuantificationParams.json
   ```

4. **Two directories, paired by file name**

   ```sh
   proteomiqon-psmbasedquantification -i path/to/mzliteFolder -ii path/to/qpsmFolder -d path/to/database.db -o path/to/output -p path/to/QuantificationParams.json -c 3 -mf
   ```

5. **All Flags**

   ```sh
   proteomiqon-labelfreeproteinquantification --help
   ```
