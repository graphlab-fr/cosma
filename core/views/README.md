---
dir: /core/views
author: Guillaume Brioudes <https://myllaume.fr/>
date: 2021-08-16
---

# Concepts

Electron works on three script levels:

1. `main.js` (and its imports) : access to packages, NodeJs process (include Electron process)
2. `preload.js` : access to Electron process
3. `render.js` : access to window content (web page) and API

These levels are nested as follows:

`main.js` import `preload.js` and the web page content (`.html` file).
The web page import `render.js` (with a markup `<script src="render.js"></script>`).

Into Cosma's architecture, **`preload.js` is `controller.js`**, the API bridge.

The data circulates in this way :

`main.js` had access to all data and the computing power.
`controller.js` set the API bridge (between `main.js` & `render.js`), set and check names of the API channels to secure it.
`render.js` calls channels set by `controller.js`. On the other side of the channels, `main.js` send a response to `render.js`.
`render.js` integrate the response from `main.js` into the windows (web page)

# Tree

Subdirectories contains pages content.
`**-render.js` are render files.
`**-source.html` are web page body files.

.
└── [page_name]/
    ├── index.js
    ├── main-render.js
    ├── main-source.html
    ├── modal-[usage_name]-render.js
    └── modal-[usage_name]-source.html