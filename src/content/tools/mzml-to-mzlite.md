---
name: "MzMLToMzLite"
phase: preprocessing
order: 1
summary: "MzMLToMzLite converts an mzML file into an mzlite file."
inputsFrom: []
---

## Tool Description

MzMLToMzLite converts an mzML file into an mzlite file. It is the first tool of the chain, every later tool reads the mzlite it writes. mzlite is the SQLite based storage format of MzIO.

## How does AddDeducedPeptides work?

1. **MzML to Mzlite**

   It holds the same spectra and metadata as the mzML, in a form that supports random access to single spectra.

2. **How to get MzML**

   To get mzML from vendor raw files, use [MSConvert](https://proteowizard.sourceforge.io/). On [Galaxy.eu](https://galaxyproject.org/use/) runs msconvert in the browser without a local install.

3. **Converting**

   During the conversion the tool can restrict the spectra to a retention time window and can centroid profile spectra with a wavelet peak picker. Centroiding replaces the many points that describe one peak by a single m/z and intensity pair. The algorithm is described in the [BioFSharp.Mz documentation](https://www.biofsharp.com/BioFSharp/).

## Inputs

These inputs are needed to execute the tool:

| Flag | Meaning | Comes from |
| --- | --- | --- |
| `-i` | one or more mzML files, or a directory that is searched for `*.mzML` and `*.mzml` (not recursive) | MSConvert |
| `-o` | the output directory, created when missing | - |
| `-p` | the parameter file in JSON | [Github ProteomIQon Core](https://github.com/CSBiology/ProteomIQon/blob/dev/src/ProteomIQon/defaultParams/mzMLToMzLiteParams.json) |
| `-c` | number of files converted at the same time, default 1, no effect on a single file | - |
| `-f` | switch: rewrite every input file in place and remove " in vendor raw files | - |

- -f rewrites every input file in place and removes the string " from it. Some mzML exports contain that string in places where the XML reader cannot handle it. Leave the flag off unless the conversion fails on such a file.
- The tool writes one `run.mzlite` per input `run.mzML` into the output directory.
- Only spectra with MS level 1 or 2 are copied, and spectra whose peak array is empty after peak picking are skipped. Scan times in the mzlite are stored in minutes, whatever unit the mzML used.
- The mzlite is read by [PeptideSpectrumMatching](./peptide-spectrum-matching.md), [PSMBasedQuantification](./psm-based-quantification.md) and [AlignmentBasedQuantification](./alignment-based-quantification.md). The output directory also receives `MzMLToMzLite_log.txt` and one `run_log.txt` per input.

## Parameter file

| Parameter | Default | Meaning |
| --- | --- | --- |
| `Compress` | Compression.NoCompression | Compression of the peak arrays in the mzlite. Compression.ZLib and Compression.NumPress are the other options, Compression.NumPressZLib combines both. |
| `StartRetentionTime` | None | With Some t, only spectra with a scan time above t are copied. The comparison uses the time unit of the mzML file. |
| `EndRetentionTime` | None | With Some t, only spectra with a scan time below t are copied, same unit as above. |
| `MS1PeakPicking` | PeakPicking.ProfilePeaks | How MS1 peaks are extracted. PeakPicking.ProfilePeaks copies the peak arrays as they are. PeakPicking.Centroid (CentroidizationMode.Wavelet w) runs the wavelet peak picker with the parameters w. |
| `MS2PeakPicking` | PeakPicking.ProfilePeaks | same choice for MS2 spectra. |

- CentroidizationMode.Manufacturer is for vendor raw files. For mzML input use ProfilePeaks or the wavelet centroiding.

- When a spectrum type is set to PeakPicking.Centroid (CentroidizationMode.Wavelet w), w is a WaveletPeakPickingParams record. The values below are the MS1 settings from the ion mobility default file and serve as a starting point.

  <table>
  <thead>
  <tr><th>Parameter</th><th>Example</th><th>Meaning</th></tr>
  </thead>
  <tbody>
  <tr><td><code>NumberOfScales</code></td><td>3</td><td>Number of wavelet widths the transform is evaluated at</td></tr>
  <tr><td><code>YThreshold</code></td><td>YThreshold.Fixed 1.0</td><td>Intensity floor for the transform. YThreshold.MinSpectrumIntensity uses the lowest intensity of each spectrum instead of a fixed value.</td></tr>
  <tr><td><code>Centroid_MzTolerance</code></td><td>0.1</td><td>m/z tolerance within which neighbouring maxima are merged into one centroid.</td></tr>
  <tr><td><code>SNRS_Percentile</code></td><td>95.0</td><td>Percentile of the signal used to estimate the noise level.</td></tr>
  <tr><td><code>MinSNR</code></td><td>1.0</td><td>Minimum signal to noise ratio a centroid has to reach.</td></tr>
  <tr><td><code>RefineMZ</code></td><td>false</td><td>Whether the centroid m/z is refined from the profile points around the maximum.</td></tr>
  <tr><td><code>SumIntensities</code></td><td>false</td><td>Whether the centroid intensity is the sum of the profile intensities under the peak instead of the maximum.</td></tr>
  <tr><td><code>PaddingParams</code></td><td>None</td><td><ul> <li>Some p pads gaps in sparse profile spectra before the transform.</li> <li><strong>P</strong> is a PaddingParams record with MaximumPaddingPoints (int option)</li> <li><code>Padding_MzTolerance</code> (float)</li> <li><code>WindowSize</code> (int) and</li> <li>SpacingPerc (float).</li> <li>The MS2 settings of the ion mobility default file use <code>Some { MaximumPaddingPoints = Some 7; Padding_MzTolerance = 0.05; WindowSize = 150; SpacingPerc = 95.0 }.</code></li> </ul></td></tr>
  </tbody>
  </table>

- The default file is [mzMLToMzLiteParams.json](https://github.com/CSBiology/ProteomIQon/blob/dev/src/ProteomIQon/defaultParams/mzMLToMzLiteParams.json). A file with wavelet centroiding on both levels is [TIMsMzMLtoMzLiteParams.json](https://github.com/CSBiology/ProteomIQon/blob/dev/src/ProteomIQon/defaultParams/TIMsMzMLtoMzLiteParams.json).

## Installing and executing the tool

1. **Installing**

   Install the Tool with the following command inside the choosen Command-Line

   ```sh
   dotnet tool install --global ProteomIQon.MzMLToMzLite
   ```

2. **Execute**

   - Convert one run

     ```sh
     proteomiqon-mzmltomzlite -i path/to/run.mzML -o path/to/output -p path/to/mzMLToMzLiteParams.json
     ```

   - Convert multiple runs

     ```sh
     proteomiqon-mzmltomzlite -i path/to/run1.mzML path/to/run2.mzML path/to/run3.mzML -o path/to/output -p path/to/mzMLToMzLiteParams.json -c
     ```

3. **Help**

   If the execution of one or multiple runs failed, use the `-f` flag to get rid of the `quot` part that is a common leftover in the raw vendor files

   ```sh
   proteomiqon-mzmltomzlite -i path/to/run.mzML -o path/to/output -p path/to/mzMLToMzLiteParams.json -f
   ```

4. **All Flags**

   ```sh
   proteomiqon-mzmltomzlite --help
   ```
