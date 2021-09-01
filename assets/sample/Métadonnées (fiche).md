---
title: Métadonnées (fiche)
id: 20210901133736
type: documentation
---

Pour être correctement interprétés par Cosma, les fichiers Markdown doivent respecter une certaine structure, et notamment la présence d'un en-tête en [YAML](http://yaml.org) au début du fichier.

Exemple :

```yaml
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

Un champ en YAML est composé d'un nom et d'une valeur séparés par un deux-points. Cosma reconnaît et utilise les quatre champs suivants :

`title`
: Titre de la fiche. Obligatoire.

`id`
: Identifiant unique de la fiche. Obligatoire. Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com).

`type`
: Type de la fiche. Facultatif. Un seul type peut être assigné à une fiche. Si le champ `type` n'est pas spécifié ou bien que sa valeur ne correspond à l'un des types enregistrés dans la configuration sous le paramètre `record_types`, Cosma interprètera le type de la fiche comme non défini (`undefined`).

`tags`
: Mots-clés de la fiche. Facultatif. La valeur doit être une liste. Une fiche peut disposer d'autant de mot-clés que vous souhaitez.

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

Vous pouvez ajouter des champs supplémentaires de manière arbitraire, par exemple un champ `description`.

**Note :** Certains logiciels établissent une série de présupposés qui servent à identifier les métadonnées d'un fichier de manière **heuristique**. Par exemple, si la première ligne du fichier est un titre de niveau 1, alors il s'agit du titre du fichier ; si la seconde ligne contient des mots préfixés par un croisillon `#`, alors il s'agit de mots-clés.

L'inconvénient de ce fonctionnement est qu'il n'est pas interopérable : chaque logiciel a ses propres conventions, ce qui limite la capacité de l'utilisateur à changer d'outil.

Utiliser un en-tête en YAML permet de déclarer des métadonnées comme le titre et l'identifiant unique d'une fiche de manière **explicite**. Ceci présente l'avantage de rendre triviale la détection et la manipulation de ces métadonnées, aussi bien par une machine que par un humain. L'utilisation d'un format commun (comme YAML) augmente le nombre d'outils compatibles avec un même ensemble de fichiers. Et des outils informatiques très répandus comme les expressions régulières et les scripts *shell* permettent aux utilisateurs de convertir eux-mêmes leurs données de manière relativement simple si besoin.
