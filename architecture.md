# Repository architecture

## Files tree

Main project structure:

```
.
├── app.js                      CLI entry point, command root
├── controllers/                Business logic controllers
├── core/
│   ├── frontend/               Browser files: JS, CSS, UI components
│   ├── models/                 Business models and unit tests
│   ├── utils/                  Utility functions and unit tests
│   └── i18n.yml                Translation file
├── docs/                       User documentation
├── e2e/
│   ├── cypress.config.js       Cypress configuration file
│   ├── e2e-support.js          Cypress support utilities
│   ├── exec-modelize.sh        Shell script for E2E export automation
│   ├── *.cy.js                 Cypress test files
│   └── jsconfig.json           Node.js config for tests
├── man/                        Manual pages and related scripts
├── static/
│   ├── icons/                  Images and icons
│   └── template/               Export templates (cosmoscope, report)
├── temp/                       Temporary exports for E2E tests
├── dist/                       Webpack bundles
│   └── back.cjs                Main executable
├── babel.config.js             Babel configuration
├── jest.config.js              Jest configuration
├── package.json                NPM dependencies and scripts
├── README.md                   Main documentation
├── webpack-back.config.mjs     Webpack backend config
└── webpack-front.config.mjs    Webpack frontend config
```

## Environments

Project environments:

```
.
├── jsconfig.json                  Node.js ESM config (backend source code)
├── core/frontend/jsconfig.json    Browser ESM config (frontend code)
└── e2e/jsconfig.json              Node.js CommonJS config (Cypress tests)
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

