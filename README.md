# Cosma [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.5920616.svg)](https://doi.org/10.5281/zenodo.5920616)

**Cosma** is a document graph visualization tool. It modelizes interlinked Markdown files and renders them as an interactive network in a web interface.

Visit <https://cosma.graphlab.fr/en/about/> to learn more about the project.

This is the command-line interface (CLI) version of Cosma. It requires [NodeJS](https://nodejs.org/fr/) v12 or higher.

Run these commands to clone and edit the repository :

```bash
git clone --recurse-submodules https://github.com/graphlab-fr/cosma-cli cosma-cli
cd cosma-cli
npm i
node app modelize # cmd 'cosma modelize' -> 'node app modelize'
```

## Documentation

User and developer documentation for Cosma CLI will be published progressively in 2022 at <https://cosma.graphlab.fr/docs>.

## History

The first version of Cosma was a CLI prototype developed during late 2020 and early 2021. We then worked on a GUI version with Electron, and in the process much of the code was changed. After publishing the GUI version as Cosma 1.0, we came back to the CLI prototype and worked on integrating all the changes. As a result, Cosma is available again as a CLI tool.

## What’s new

This section presents notes for the latest release. To check all release notes, visit the [Changelog section of the documentation](https://cosma.graphlab.fr/en/docs/user-manual/#changelog).

Version 1.1 adds the following features:

- New `modelize` option, `--config`, the value of which must be the absolute path of a config file. This makes Cosma CLI capable of working with multiple directories, without having to manually shuffle around config files in the support folder.
- If a config file includes YAML syntax mistakes, an error is thrown with a helpful message.
- Records directories are now read recursively. This means all records are now taken into account, whatever their location in a possible subdirectory structure.
- HTML elements used in the text of records are now recognized and interpreted.

Bugs have also been solved:

- Context tooltips for typed links are no longer empty (issue #15).
- Clicking on saved views displays them again (issue #16).
- Vertical and horizontal attraction settings are no longer switched (issue #18).
- The `--custom-css` (or `-css`) option works again (issue #19).