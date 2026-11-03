---
title: "Installation Guide"
eyebrow: "Set up the toolchain"
intro: "Install the full pipeline or choose individual ProteomIQon tools."
description: "Install ProteomIQon as a complete pipeline or as individual tools."
order: 2
---

## Installtion of ProteomIQon as Pipeline

To install ProteomIQon as a whole Pipeline with all the tools [overview ProteomIQon Tools](../../tools/) the easiest way is to use Nuget.org [ProteomIQon Nuget.org](https://www.nuget.org/packages/ProteomIQon/). Alternatively, you can install ProteomIQon as a whole Pipeline with all the tools from the command line using the following command:

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

Most of the ProteomIQon tools need a param file (in .JSON format) to run. The param file contains all the parameters for the tool. Detailed information about the single parameters can be found in the respective tool documentation. [ProteomIQon Tools](../../tools/)

## How to build binaries or packages

The build is a FAKE project in the `./build` folder with the `build.cmd` and the `build.sh` run it with the target name as the first argument. Without a target it builds the whole solution.

## Building

The Build target compiles every released tool listed in build/ProjectInfo.fs.

\- For Windows

```sh
.\build.cmd build
```

\- For Linux:

```sh
.\build.sh build
```

The Preprocessing project references packages from the CSBiology feed on GitHub Packages. nuget.config reads the credentials for that feed from the environment variables GithubUser and PackageToken. Set both before building the full solution, which includes that project. The released tools restore from nuget.org alone. To build a single tool, call dotnet on its project file:

```sh
dotnet build src/PeptideDB/PeptideDB.fsproj -c Release
```

## Packing

The Pack target creates a NuGet package for every released project in pkg/. The version comes from the top entry of each project's RELEASE_NOTES.md that has a version, so bump that file first. A leading #### Unreleased section without a version collects changes until the next release and is skipped; replace it with the version and the date when you release: For Windows:

```sh
.\build.cmd pack
```

For Linux:

```sh
.\build.sh pack
```

PackPrerelease does the same with a suffix it asks for on the console. Every tool packs as a .NET tool with the package id ProteomIQon.`<ToolName>` and the command name proteomiqon-`<toolname>`. A package from pkg/ can be installed locally to try it out before publishing:

```sh
dotnet tool install --global ProteomIQon.PeptideDB --add-source ./pkg --version 0.0.10
```

Published versions are on [Nuget.org](https://www.nuget.org/)

## Tests

RunTests builds and runs tests/ProteomIQon.Tests.fsproj. The end to end pipeline tests start the tool assemblies, so this target needs the full build to succeed first: For Windows:

```sh
.\build.cmd runtests
```

For Linux:

```sh
.\build.sh runtests
```
