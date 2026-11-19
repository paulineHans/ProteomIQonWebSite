---
title: "Installation Guide"
eyebrow: "Set up the toolchain"
intro: "Install the full pipeline or choose individual ProteomIQon tools."
description: "Install ProteomIQon as a complete pipeline or as individual tools."
order: 2
---

## Installtion of ProteomIQon as Pipeline

To install ProteomIQon as a whole Pipeline with all the tools [overview ProteomIQon Tools](../tools/) the easiest way is to use Nuget.org [ProteomIQon Nuget.org](https://www.nuget.org/packages/ProteomIQon/). Alternatively, you can install ProteomIQon as a whole Pipeline with all the tools from the command line using the following command:

```sh
dotnet add package ProteomIQon --version 0.0.11
```

This approach is for Linux and Windows suitable.

## Installation of Individual Tools

To install individual tools of ProteomIQon you can use for example, Nuget.org [PeptideSpectrumMatching](https://www.nuget.org/packages/ProteomIQon.PeptideSpectrumMatching). Alternatively, you can install individual tools from the command line using the following command:

```sh
dotnet tool install --global ProteomIQon.[ToolName] --version [x.x.x]
```

This approach is for Linux and Windows suitable.

## Important to know

Most of the ProteomIQon tools need a param file (in .JSON format) to run. The param file contains all the parameters for the tool. Detailed information about the single parameters can be found in the respective tool documentation. [ProteomIQon Tools](../tools/)
