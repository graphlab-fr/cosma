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
├── docs/                       User documentation (including Docker usage)
├── e2e/
│   ├── cypress.config.js       Cypress configuration file
│   ├── e2e-support.js          Cypress support utilities
│   ├── exec-modelize.sh        Shell script for E2E export automation
│   ├── *.cy.js                 Cypress test files
│   └── jsconfig.json           Node.js config for tests
├── Dockerfile                  Docker image for test & development
├── docker-compose.yml          Helper for running tests in Docker
├── man/                        Manual pages and related scripts
├── scripts/
│   └── docker-test.sh          Helper script to run unit tests in Docker
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

## Docker test environment

Cosma provides a Docker-based **test and development** environment, documented in `docs/DOCKER.md`.

- The image is built from the root `Dockerfile` and tagged `cosma-test`.
- It is intended for running the CLI and the unit tests in an isolated Linux environment, not for production.
- The main dedicated script is `scripts/docker-test.sh`, which runs the unit test suite inside the container.
- Inside the container, Cosma runs as the non-root user `cosmauser` and stores its CLI data under the home directory (e.g. `~/.local/share/cosma-cli/`).
- A named Docker volume can be mounted on `/home/cosmauser/.local/share` to persist user data between container runs.

See `docs/DOCKER.md` for complete usage examples and commands.

