# Repository architecture

## Files tree

List of main files to develop.

```
.
├── controllers/
├── core/
│   ├── frontend                Web browser files: JS, CSS
│   ├── models                  Business models and unit tests
│   ├── utils                   Business functions and unit tests
│   └── i18n.yml
├── docs/                       User documentation
├── e2e/
│   ├── **/config.yml           Options for each export
│   ├── exec-modelize.sh        Series of commands to generate exports to execute E2E tests
│   └── **.cy.js                Cypress E2E testing files
├── static/
│   ├── icons                   Images
│   └── template                Contains app exports (cosmoscope, report) templates
├── app.js                      Root, CLI commands rooting
├── webpack-back.config.mjs     Webpack config to build executable (JS+raw)
├── webpack-front.config.mjs    Webpack config to build frontend bundle (JS+CSS)
│
├── temp/                       E2E tests exports
└── dist/                       Webpack bundles
    └── back.cjs                App executable
```

## Published tree

Only next files will be published on NPM on execute `npm publish`.

```
.
├── LICENSE
├── README.md
├── dist/
│   └── back.cjs
├── docs
├── man
└── package.json
```
