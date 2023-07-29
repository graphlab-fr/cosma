---
title: Métadonnées
id: 20210901133736
type: documentation
---

Pour être correctement interprétés par Cosma, les fichiers Markdown (`.md`) doivent respecter une certaine structure, et notamment la présence d'un en-tête en [YAML](http://yaml.org) au début du fichier.

Cet en-tête est créé automatiquement lorsque vous créez une fiche via Cosma. Vous pouvez le modifier ou le reproduire avec un autre logiciel ou manuellement.

Exemple :

```
---
title: Titre du document
id: 20201209111625
type: undefined
tags:
- mot-clé 1
- mot-clé 2
---
```

L'en-tête YAML est délimité par deux séries de trois tirets seuls sur une ligne (`---`).

Un champ en YAML est composé d'un nom et d'une valeur séparés par un double-points. Cosma reconnaît et utilise les quatre champs suivants.

## Titre

`title` (obligatoire) : titre de la fiche.

## Identifiant

`id` (obligatoire) : identifiant unique de la fiche. Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com).

## Type

`type` : type de la fiche. Facultatif. Un seul type peut être assigné à une fiche. Si le champ `type` n'est pas spécifié ou bien que sa valeur ne correspond à l'un des types enregistrés dans la configuration, Cosma interprètera le type de la fiche comme non défini (`undefined`).

## Mots-clés

`tags` (ou `keywords`) : mots-clés de la fiche. Facultatif. La valeur doit être une liste. Une fiche peut disposer d'autant de mot-clés que vous souhaitez. Vous pouvez utiliser `keywords` au lieu de `tags`, dans une logique de compatibilité avec Pandoc. Si une fiche comporte un champ `tags` et un champ `keywords`, seuls les mots-clés déclarés dans le champ `tags` sont interprétés par Cosma.

Conformément à la spécification YAML, la liste des mots-clés peut être inscrite en mode *block* :

```yaml
tags:
  - mot-clé 1
  - mot-clé 2
```

Ou bien en mode *flow* :

```yaml
tags: [mot-clé 1, mot-clé 2]
```

## Autres champs

Vous pouvez ajouter des champs supplémentaires de manière arbitraire, par exemple ceux reconnus par Pandoc.

## Pourquoi un en-tête en YAML ?

Certains logiciels identifier les métadonnées d'un fichier de manière heuristique. Par exemple, si la première ligne du fichier est un titre de niveau 1, alors il sera interprété comme le titre du fichier ; si la seconde ligne contient des mots préfixés par un croisillon `#`, alors ils seront interprétés comme des mots-clés.

L'inconvénient de ce fonctionnement est qu'il n'est pas interopérable : chaque logiciel a ses propres conventions, ce qui limite la capacité de l'utilisateur à changer d'outil.

Utiliser un en-tête en YAML permet de déclarer des métadonnées comme le titre et l'identifiant unique d'une fiche de manière explicite. Ceci présente l'avantage de rendre triviale la détection et la manipulation de ces métadonnées, aussi bien par une machine que par un humain. L'utilisation d'un format commun (comme YAML) augmente le nombre d'outils compatibles avec un même ensemble de fichiers. Et des outils informatiques très répandus comme les expressions régulières et les scripts _shell_ permettent aux utilisateurs de convertir eux-mêmes leurs données de manière relativement simple si besoin.
