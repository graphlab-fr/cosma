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

## Module System Architecture

Cosma uses a **hybrid module system approach** that combines modern development practices with maximum compatibility for distribution.

### Development: ES Modules (ESM)

The **source code** uses modern ES Modules syntax:

- **Import syntax**: `import fs from 'node:fs'`
- **Export syntax**: `export default function()` and `export { named }`
- **Benefits**:
  - Modern, clean syntax
  - Better tree-shaking capabilities
  - Improved static analysis by development tools
  - Future-proof approach

#### Configuration Files

- **Webpack configs**: Use `.mjs` extension (`webpack-back.config.mjs`, `webpack-front.config.mjs`)
- **Main jsconfig.json**: Configured with `"module": "esnext"` to support ESM syntax
- **Development tools**: Full ESM support for better IntelliSense and error detection

### Distribution: CommonJS (CJS)

The **built application** uses CommonJS for maximum compatibility:

- **Output format**: `dist/back.cjs` (explicit `.cjs` extension)
- **Module system**: Traditional `require()` and `module.exports`
- **Benefits**:
  - **Universal compatibility** with Node.js environments
  - **Stable ecosystem** support (many npm packages still use CommonJS)
  - **CLI tool distribution** works across all Node.js versions

### Build Process Flow

```
Source Code (ESM) → Webpack Transformation → Distribution (CommonJS)
```

1. **Source**: Modern ESM syntax in development
2. **Webpack**: Transforms and bundles ESM code
3. **Output**: Single CommonJS executable (`back.cjs`)

This approach provides:
- ✅ **Developer Experience**: Modern syntax and tooling
- ✅ **User Experience**: Maximum compatibility and reliability
- ✅ **Maintenance**: Best of both module systems

### Testing Architecture

#### E2E Tests: Isolated CommonJS Environment

The `e2e/` folder uses **CommonJS exclusively**:

- **Separate configuration**: `e2e/jsconfig.json` with `"module": "commonjs"`
- **Cypress compatibility**: Native CommonJS support without additional configuration
- **Isolated concerns**: Testing environment separated from main codebase

#### Rationale for CommonJS in E2E

- **Cypress ecosystem**: Historically built around CommonJS
- **Simplicity**: Avoid additional ESM configuration complexity
- **Focus**: Tests don't benefit from ESM advantages (tree-shaking, etc.)
- **Stability**: Proven CommonJS patterns for test files

### Configuration Files Overview

| File | Module System | Purpose |
|------|---------------|---------|
| `jsconfig.json` (root) | `"module": "esnext"` | Main source code development |
| `e2e/jsconfig.json` | `"module": "commonjs"` | Cypress E2E testing |
| `webpack-*.config.mjs` | ESM (`.mjs`) | Build configuration |
| Source `*.js` files | ESM syntax | Application logic |
| E2E `*.cy.js` files | CommonJS syntax | Test specifications |

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
