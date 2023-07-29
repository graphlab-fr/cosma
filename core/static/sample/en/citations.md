---
title: Citations
id: 20210901134745
type: documentation
---

Cosma offers automatic citation processing. This feature works similarly as in Zettlr: CSL-compliant bibliographic data and styles, and Pandoc-style citation syntax.

You can use [Zotero](https://www.zotero.org/) with the [Better BibTeX](https://retorque.re/zotero-better-bibtex/) plugin to generate unique citation keys for each reference and then export the references in CSL JSON. Load the file in the Bibibliography section of Cosma's configuration.

You can then integrate the citation keys into your Markdown files using [Pandoc-style syntax](https://pandoc.org/MANUAL.html#extension-citations):

```
Sur la raison et la déraison graphique [@goody1979; @christin1995, 46-52]…
```

Click on New cosmoscope with citations to generate a cosmoscope with citation processing enabled. Each citation key is then replaced with formatted text and a bibliography is generated below the body of each record containing references.

```
Sur la raison et la déraison graphique (Goody 1979 ; Christin 1995, p. 46-52)…

Bibliographie
-------------

GOODY, Jack, 1979. La Raison graphique : la domestication de la pensée sauvage.
  Paris : Les Editions de Minuit. ISBN 978-2-7073-0240-3.

CHRISTIN, Anne-Marie, 1995. L’image écrite, ou, La déraison graphique.
  Paris : Flammarion. Idées et recherches. ISBN 978-2-08-012635-1.
```

You can change the citation style (default: ISO690-author-date-fr) by loading a CSL style file in the configuration. Download styles from the [Zotero database](https://www.zotero.org/styles).

You can localize bibliographic terms (default: French) by loading an XML translation file. Download translations from the [CSL database](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

Bibliographic data corresponding to the cited references is embedded in the cosmoscope in JSON. You can access this data by clicking on the "Data" button at the bottom of the left side panel. In the cosmoscope source code, they are located under the `<article id="citation-references">` tag.
