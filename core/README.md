# cosma-core

Shared core functionality of the interfaces [cosma](https://github.com/graphlab-fr/cosma) and [cosma-cli](https://github.com/graphlab-fr/cosma-cli).

Updates to cosma-core must me pulled manually in each repository by running one of these commands:

```
npm run modules
git submodule foreach git pull origin master
```

## Development

We use cosma-core to develop the export named "cosmoscope".

The bellow commands to export a cosmoscope with fake data and open it on a devserver (http://localhost:9000/temp/cosmoscope.html). `/frontend` directory contains some JavaScipt files bundled and load by devserver.

```
npm i
npm start
```

The bellow command lauch some tests for Cosma's data models and processing.

```
npm test
```
