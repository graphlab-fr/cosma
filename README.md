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
<img src="https://cosma.arthurperret.fr/img/logo-universite-jean-moulin-lyon-3.png" title="Université Jean Moulin Lyon 3 - logo" height="100px" width="auto" style="display: inline" />
<img src="https://cosma.arthurperret.fr/img/logo-universite-bordeaux-montaigne.png" title="Université Bordeaux Montaigne - logo" height="100px" width="auto" style="display: inline" />
</div>

## Commands

### Install

Need NodeJs v.18 or later.

You want to install app on your computer:

```bash
npm i @graphlab-fr/cosma --global
cosma --help # enjoy
```

You want to install app on your own project ([see exemple](https://github.com/Myllaume/cosmoscope-generator)):

```bash
npm i @graphlab-fr/cosma
npx cosma --help
# or
./node_modules/.bin/cosma cosma --help
```

You have dowloaded this repository and want to execute app:

```bash
npm i # install dependences + build executable file
node dist/back.cjs # execute app
```

### Development

You want build executable each time you edit files:

```bash
npm run watch:front # build web browser script
npm run watch:back # build NodeJs executable file

# install nodemon and export files when executable change
nodemon --ext css,njk,js,cjs --watch dist/ --watch static/ --exec "sh e2e/exec-modelize.sh"
```

You want build production app and export files with:

```bash
npm prepare
sh e2e/exec-modelize.sh
```

## Maintenance

The software is written in JavaScript. Uses ESM.
Code is documented wherever possible using (JSDoc)[https://jsdoc.app/], by add heads to functions, classes and variables. You find many exemples on repository.
Code from directory `core/frontend` should be executed on web browser, the rest with NodeJS.

### Build

The software is build as `back.cjs` NodeJs CommonJs executable, using Webpack. See below how code is bundled in two steps.

```
                                      ────────────┐             
                    ───┐    static/icons/**       │             
   core/frontend/**.js │    static/template/**.njk│             
   core/frontend/**.css├──► front.raw.js          │             
───────────────────────┘                          │             
webpack-front.config.mjs    core/i18n.yml         │             
                            app.js                ├───► back.cjs
                            ──────────────────────┘             
                            webpack-back.config.mjs             
```

Read architecture.md for details about repository files and directories.

### Testing

**Unit testing**: make some asserts and documentation about business functions and models.
Using [Jest](https://jestjs.io/).

```bash
npm run test:unit
npm run test:unit -- --verbose --watchAll
npm run test:unit -- --runTestsByPath <filepath> --verbose --watchAll
```

**E2E testing**: generate Cosma's .html and .md files and make some asserts on.
Using [Cypress](https://www.cypress.io/).

```bash
npm prepare
sh e2e/exec-modelize.sh
npm run test:e2e -- --spec "**/graph.cy.js"
```

### CI

For each PR and commit at "develop" branch, unit and e2e tests are executed.
In case of e2e tests fail, you can download .zip contains screenshots and .html files are tested by Cypress.

## Concepts

### Graph

Cosma read files (.md, .csv and .json) to extract _Records_. Each _Record_ contains metadatas (id, title, types, tags…) and links to other _Records_. Links are parsed from files content, as wikilinks `[[link]]` or quotes `@author`. Each _Record_ became a node and links became edges on a graph. This process is made by the software named _Cosmographe_. Cosma finally exports .html file, which is visualization tool for the graph. This file is called _Cosmoscope_.

User give .yml config file contains options to control _Records_ extraction and _Cosmoscope_ display. For exemple, config file contains types for records and links. Cosma will remove unknows types from graph entities.
