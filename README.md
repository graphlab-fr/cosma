# Cosma [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.5920616.svg)](https://doi.org/10.5281/zenodo.5920616)

Cosma is a visualization tool for knowledge workers. It reads plain text files with [[wiki links]] and renders them as an interactive network of index cards.

Cosma provides an interface to navigate and share non-linear documentation:

- if you have a **personal wiki**, Zettelkasten or digital garden;
- if you create **mind maps**, networks of people and concepts;
- if you work with **citations** and **bibliographies**;
- if you study things that involve **time metadata**;

then you can use Cosma to create a portable knowledge base, combining rich hypertextual descriptions with the affordances of a graph view, contextualized backlinks, automatically generated citations, metadata filters and more.

Visit <https://cosma.arthurperret.fr> to learn more about the software.

- [Installing](https://cosma.arthurperret.fr/installing.html)
- [Getting started](https://cosma.arthurperret.fr/getting-started.html)
- [User manual](https://cosma.arthurperret.fr/user-manual.html)

Cosma's development is publicly funded through [Université Jean Moulin Lyon 3](https://www.univ-lyon3.fr/accueil-en) and [Université Bordeaux Montaigne](https://www.u-bordeaux-montaigne.fr/en/index.html).

<div>
<img src="https://cosma.arthurperret.fr/img/logo-universite-jean-moulin-lyon-3.png" title="Université Jean Moulin Lyon 3 - logo" height="100px" width="auto" style="display: inline; background-color: #fff;" />
<img src="https://cosma.arthurperret.fr/img/logo-universite-bordeaux-montaigne.png" title="Université Bordeaux Montaigne - logo" height="100px" width="auto" style="display: inline; background-color: #fff;" />
</div>

## License

This work is dual-licensed under GPL 3.0 and CeCILL 2.1. You can choose between one of them if you use this work.

## Commands

### Install

Requires Node.js v22 or later.

You want to install Cosma on your computer:

```bash
npm i @graphlab-fr/cosma --global
cosma --help # enjoy
```

You want to install Cosma as a dependency in your own Node.js project ([see exemple](https://github.com/Myllaume/cosmoscope-generator)):

```bash
npm i @graphlab-fr/cosma
npx cosma --help
# or
./node_modules/.bin/cosma cosma --help
```

You have downloaded this repository and want to execute Cosma from here:

```bash
npm i # install dependences + build executable file
node dist/back.cjs # execute app
```

### Development

You want to rebuild the executable automatically each time you edit the source code files:

```bash
npm run watch:front # build web browser script
npm run watch:back # build Node.js executable file

# install nodemon and export files when executable change
nodemon --ext css,njk,js,cjs --watch dist/ --watch static/ --exec "sh e2e/exec-modelize.sh"
```

You want to build the app for production as well as test files:

```bash
npm prepare
sh e2e/exec-modelize.sh
```

## Maintenance

The software is written in JavaScript. Uses ESM.
Code is documented wherever possible using [JSDoc](https://jsdoc.app/), by adding headers to functions, classes and variables. You find many examples on repository.
Code from the `core/frontend` directory should be executed in a web browser, the rest with Node.js.

### Build

The software is built as `back.cjs`, a Node.js CommonJS executable file, using Webpack. See below how the code is bundled in two steps.

```
                                      ────────────┐             
                            static/icons/**       │             
                    ───┐    static/template/**.njk│             
    core/frontend/**.js├──► front.raw.js          │             
───────────────────────┘                          │             
webpack-front.config.mjs    core/i18n.yml         │             
                            app.js                ├───► back.cjs
                            ──────────────────────┘             
                            webpack-back.config.mjs             
```

Read architecture.md for details about repository files and directories.

### Testing

**Unit testing**: make some asserts and documentation about business functions and models.
Uses [Jest](https://jestjs.io/).

```bash
npm run test:unit
npm run test:unit -- --verbose --watchAll
npm run test:unit -- --runTestsByPath <filepath> --verbose --watchAll
```

You can also run the unit tests in an isolated Linux environment using Docker. See `docs/docker.md`. This is useful to reproduce issues on a clean system or to avoid installing Node.js locally.

**E2E testing**: generate Cosma's .html and .md files and make some asserts on.
Uses [Cypress](https://www.cypress.io/).

```bash
npm prepare
sh e2e/exec-modelize.sh
npm run test:e2e -- --spec "**/graph.cy.js"
```

### CI

For each PR and commit on the "develop" branch, unit and e2e tests are executed.
In case the e2e tests fail, you can download a .zip file containing screenshots and .html files tested by Cypress.

## Concepts

### Graph

Cosma reads files (.md, .csv and .json) to extract _Records_. Each _Record_ contains metadata (id, title, types, tags…) and links to other _Records_. Links are parsed from files content, as wikilinks `[[link]]` or citations `@author`. Each _Record_ becomes a node and links become edges in a graph. This process is made by a part of the software nicknamed the _Cosmographer_. Cosma then exports an .html file, which is the actual visualization tool for the graph. This file is called a _Cosmoscope_.

Users give an .yml config file containing options to control _Records_ extraction and _Cosmoscope_ display. For example, config file contain types for records and links. Cosma will remove unknown types from graph entities.
