# cosma-docs

Documentation for [cosma](https://github.com/graphlab-fr/cosma) and [cosma-cli](https://github.com/graphlab-fr/cosma-cli). Currently available in French and English.

Previewing and building the docs requires Eleventy.

Live preview:

```
npm run start
```

Build:

```
npm run build
```

Updates to cosma-docs must me pulled manually in the cosma and cosma-cli repositories by running either of these commands over there:

```
npm run modules
git submodule foreach git pull origin master
```