---
title: Citations et bibliographies
id: 20210901134745
type: documentation
---

Cosma intègre une fonctionnalité de traitement des citations qui repose sur le même écosystème que Zettlr : des données et styles bibliographiques respectant la norme CSL, et la syntaxe définie par Pandoc pour insérer des citations dans un texte.

Vous pouvez utiliser le gestionnaire de références bibliographiques [Zotero](https://www.zotero.org/) avec l'extension [Better BibTeX](https://retorque.re/zotero-better-bibtex/) afin de générer des clés de citation uniques pour chaque référence. Exportez vos données bibliographiques au format CSL JSON et renseignez le fichier dans la configuration de Cosma (voir [Configuration](#configuration)).

Vous pouvez ensuite intégrer les clés de citation au sein de vos fiches en utilisant une syntaxe inspirée par [celle de Pandoc](https://pandoc.org/MANUAL.html#extension-citations) :

```
Sur la raison et la déraison graphique [@goody1979; @christin1995, 46-52]…
```

Cliquez sur Nouveau cosmoscope avec citations pour générer un cosmoscope avec le traitement des citations activé. Chaque clé de citation est alors remplacée par du texte formaté et une bibliographie est générée en-dessous du corps de chaque fiche contenant des références.

```
Sur la raison et la déraison graphique (Goody 1979 ; Christin 1995, p. 46-52)…

Bibliographie
-------------

GOODY, Jack, 1979. La Raison graphique : la domestication de la pensée sauvage.
  Paris : Les Editions de Minuit. ISBN 978-2-7073-0240-3.

CHRISTIN, Anne-Marie, 1995. L’image écrite, ou, La déraison graphique.
  Paris : Flammarion. Idées et recherches. ISBN 978-2-08-012635-1. 
```

Vous pouvez modifier le style de citation (par défaut : ISO690-author-date-fr) en indiquant un fichier de style CSL dans la configuration. Téléchargez des styles depuis la [base de données de Zotero](https://www.zotero.org/styles).

Vous pouvez modifier la traduction des mots-clés de la notice bibliographique (par défaut : français) en remplaçant le fichier `/template/citeproc/locales.xml`. Téléchargez une nouvelle traduction depuis la [base de donnée CSL](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

Les données correspondant aux références citées sont enregistrées dans le cosmoscope au format JSON. Vous pouvez retrouver et télécharger ces données en cliquant sur le lien « Données », au bas du menu latéral gauche. Dans le code source du cosmoscope, elles se situent sous la balise `<article id="citation-references">`.