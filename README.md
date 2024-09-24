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

## Install

```bash
npm i # install dependences + build JS files
```

## Development

```bash
npm run watch:front # build web browser script
npm run watch:back # build NodeJs executable file
nodemon --ext css,njk,js,cjs --watch dist/ --watch static/ --exec "sh e2e/exec-modelize.sh" # make cosmoscope files for dev or E2E testing
```

## Testing

**Unit testing**: make some asserts on core functions.
Using [Jest](https://jestjs.io/).

```bash
npm run test:unit -- --verbose --watchAll
```

**E2E testing**: generate Cosma's HTML and Markdown files and make some asserts on.
Using [Cypress](https://www.cypress.io/).

```bash
sh e2e/exec-modelize.sh
npm run test:e2e -- --spec "**/graph.cy.js"
```
