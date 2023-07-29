---
title: Citations
id: 20210901134745
type: documentation
---

Cosma intègre une fonctionnalité de traitement des citations. Elle repose sur le même écosystème que [Zettlr](https://www.zettlr.com) : les données et styles bibliographiques utilisent la norme [Citation Style Language (CSL)](https://citationstyles.org), tandis que l'insertion des citations dans le texte se fait avec la [syntaxe de citation de Pandoc](https://pandoc.org/MANUAL.html#citation-syntax).

### Fichiers requis

Pour traiter automatiquement les citations, Cosma requiert trois fichiers :

- Données bibliographiques : fichier contenant les métadonnées décrivant des références bibliographiques. Le format requis est CSL JSON (extension `.json`).
- Style bibliographique : fichier contenant les règles de mise en forme des citations et bibliographies. Le format requis est CSL (extension `.csl`). Vous pouvez télécharger des fichiers de style depuis le [répertoire de styles CSL de Zotero](https://www.zotero.org/styles).
- Localisation bibliographique : fichier contenant les traductions dans une certaine langue des termes employés en bibliographie (ex : éditeur, numéro…). Le format requis est XML (extension `.xml`). Vous pouvez télécharger des fichiers de localisation depuis le [dépôt GitHub du projet CSL](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

Dans le fichier de données, chaque référence doit posséder un identifiant unique (`id`) qui sert de clé de citation. Exemple :

```json
[
  {
    "id": "goody1979",
    "author": [{ "family": "Goody", "given": "Jack" }],
    "citation-key": "goody1979",
    "event-place": "Paris",
    "ISBN": "978-2-7073-0240-3",
    "issued": { "date-parts": [[1979]] },
    "language": "fr",
    "publisher": "Les Editions de Minuit",
    "publisher-place": "Paris",
    "title": "La Raison graphique : la domestication de la pensée sauvage",
    "title-short": "La Raison graphique",
    "type": "book"
  }
]
```

Vous pouvez utiliser le gestionnaire de références bibliographiques [Zotero](https://www.zotero.org/) avec l'extension [Better BibTeX](https://retorque.re/zotero-better-bibtex/) afin de créer des clés de citation uniques pour chaque référence ainsi que des exports automatiquement mis à jour.

### Syntaxe de citation

Pour citer une référence dans une fiche, intégrez la clé de citation de cette référence en utilisant la [syntaxe de citation de Pandoc](https://pandoc.org/MANUAL.html#citation-syntax).

Exemple :

```
À propos de raison graphique [@goody1979, 46-52]…
```

### Créer un cosmoscope avec citations

Cliquez sur Fichier › Nouveau cosmoscope avec citations (`Cmd/Ctrl + Maj + R`) pour générer un cosmoscope avec le traitement des citations activé. Le traitement des citations est également disponible lors de l'export (voir [[20210901144524]] Partager un cosmoscope). Chaque clé de citation est alors remplacée par du texte formaté et une bibliographie est générée en-dessous du corps de chaque fiche contenant des références.

Exemple :

```
À propos de raison graphique (Goody 1979, 46-52)…

Bibliographie
-------------

GOODY, Jack, 1979. La Raison graphique : la domestication de la pensée sauvage.
  Paris : Les Editions de Minuit. ISBN 978-2-7073-0240-3.
```

Les données CSL JSON correspondant aux références citées sont enregistrées dans le cosmoscope au format JSON. Vous pouvez consulter et télécharger ces données dans le cosmoscope en cliquant sur le bouton « Données » en bas du menu latéral gauche. Vous pouvez également y accéder en consultant le code source du cosmoscope au niveau de la balise `<article id="citation-references">`.
