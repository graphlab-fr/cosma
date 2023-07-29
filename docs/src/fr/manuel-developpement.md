---
title: Manuel de développement
date: Last Modified
description: >-
  Manuel d'aide aux développeurs souhaitant contribuer ou réutiliser
  le code source de Cosma pour créer leur propre outil.
lang: fr
layout: doc
tags: dev
---

Cette documentation est destinée aux développeurs souhaitant devenir contributeur ou *forker* du projet (code source) Cosma. Nous vous recommandons vivement de lire la [documentation des utilisateurs](manuel-d-utilisation.html) pour bien saisir l'ensemble des usages implémentés dans le code source présenté ci-dessous.

Cosma repose sur l'environnement de développement NodeJS et les **technologies du Web** (HTML, CSS). Il est intégralement développé en JavaScript (ES2019). Une bonne connaissance de ces langages est requise pour modifier le cœur de Cosma ou son interface en ligne de commande Cosma-cli.
Modifier l'interface graphique (Cosma-GUI) nécessite en plus de maîtriser le *framework* [ElectronJS](https://www.electronjs.org/).

## Code source

Les principales fonctionnalités de Cosma sont programmées dans le [dépôt Cosma-core](https://github.com/graphlab-fr/cosma-core).

- La lecture et le traitement d'un répertoire de fichiers Mardown ;
- La génération de données d'un graphe (nœuds et liens) au format JSON ;
- L'intégration des données (JSON), styles (CSS) et scripts (JavaScript) dans un *template* de fichier HTML ;

Ces fonctionnalités peuvent être utilisées via deux interfaces (Cosma-GUI et Cosma-CLI), implémentées dans deux autres dépôts, où est intégré le Cosma-core dans un répertoire `/core`.

- Interface graphique (GUI), basée sur le *framework* [Electron,](https://www.electronjs.org/) stockée dans le dépôt [Cosma](https://github.com/graphlab-fr/cosma)
- Interface en ligne de commande (CLI) stockée dans le dépôt [Cosma-CLI](https://github.com/graphlab-fr/cosma-cli)

## Architecture du logiciel

### Vue générale

Cosma est intégralement implémenté en JavaScript. Le logiciel repose sur deux systèmes distincts, le cosmographe et le cosmoscope, programmées dans le [dépôt Cosma-core](https://github.com/graphlab-fr/cosma-core).

Le **cosmographe** repose sur l'environnement Node.js. Il s'agit d'une série d'objets (`/core/models`) listés ci-dessous constituant l'API (interface de programmation) de Cosma. Elle permet d'appeler les principales fonctionnalités comme la création de fiche ou la génération de cosmoscopes. Cette API est manipulée par les deux interfaces que sont Cosma-GUI et Cosma-CLI pour rendre le même comoscope.

- `Config.js` : vérifier et actualiser le fichier de configuration ;
- `Record.js` :  générer des fichiers Markdown et leur entête ;
- `Graph.js` : lire un répertoire pour en extraire les fichiers Markdown et analyser leur contenu (Markdown, métadonnées YAML et liens style wiki) afin de générer des données JSON ;
- `Template.js` : assembler HTML (`/core/template.njk` et `/core/icons/**.svg`), CSS (`/core/**.css` et depuis `Graph.js`), JavaScript (`/core/scripts/**.js` et `/core/libs/**.js`) et données JSON (depuis `Graph.js`) pour rendre un cosmoscope ;
- `Lang.js` : traduire les éléments d'interface depuis le fichier multilingue `/core/lang.yml`.

Le **cosmoscope** est un fichier `.html` intégrant les éléments listés ci-dessous et généré via `Template.js`. Il peut être rendu sur navigateur web, que ce soit Chromium pour afficher le comoscope dans l'application ElectronJS, ou un autre navigateur choisi par un utilisateur pour lire un comoscope.

- métadonnées (titre, auteur, description, mots-clés issus de la configuration) ;
- styles (CSS) issus de `/core` et de la configuration (types de fiches, de liens, couleur de surbrillance…)
- scripts et bibliothèques JavaScript (outils de visualisation et de navigation) ;
- des index (mots-clés, titre de fiche, vues) ;
- les fiches.

### Interfaces des classes

L'objet `Config.js` (`/core/models/config.js`) est connecté à tous les autres objets de Cosma-core. Il permet de retrouver le fichier où est inscrite la configuration (`Config.getFilePath()`) en fonction de l'envrionnement (ElectronJS ou pas) et de le rendre (`Config.get()`).

En reposant sur cette première classe

### Application Electron

L'application ElectronJS est constuite selon le modèle MVC (*Model*, *View*, *Controller*). Il prescrit de séparer les fichiers responsables du (*Model*) traitement des données, de (*View*) l'affichage de l'interface et de coordonner (*Controller*) l'intégration des données dans l'interface.

|             | *Model*                   | *View*                   | *Controller*            |
|-------------|---------------------------|--------------------------|-------------------------|
| description | traitement des données    | affichage de l'interface | intégration des données |
| répertoire  | `/models`, `/core/models` | `/views`                 | `/controller`           |

Les répertoires `/models`, `/core/models` contiennent des classes JavaScript permettant de brasser l'ensemble des données du logiciel (graphe, fiches, historique, gestion des fenêtres…)

Le répertoire `/views` contient le fichier `/views/style.css` un répertoire par fenêtre de l'application. Dans chaque répertoire vous retrouverez l'arborescence suivante.
Un `/views/index.js` pour lancer l'affichage ou le *build* (génération du fichier `.html` source depuis un *template*) de la fenêtre.
Un `/views/preload.js` pour réceptionner les données depuis les *Controllers* et les intégrer à la fenêtre.
Un `/views/render.js` pour animer les éléments de la fenêtre.
Un répertoire `/views/src/` contenant le *template* de la source `.html` de la page. Ce *template* est basé sur le fichier `/views/src/index.njk` et instancié par `/views/build-page.js`.

```
index.js
preload.js
render.js
src/
  index.njk
  **.njk
```

## Terminologie

Les fichiers Markdown interprétés par Cosma sont qualifiés ici de « fiches » plutôt que de « notes », en référence à la tradition de la fiche érudite et à l'histoire de la documentation. L'acception documentaire de « fiche » n'a pas de traduction directe en anglais (sinon *index card*). En revanche, elle est conceptuellement proche du mot « *record* » issu du [*records management*](https://fr.wikipedia.org/wiki/Records_management). Le code de Cosma emploie donc le mot record pour désigner une fiche.

## Traduction

Pour ajouter une entrée de traduction au logiciel, il faut ajouter son code (norme [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1)) à la variable `validLangages` de la classe Config (`/core/models/config`) tel que ci-dessous.

```js
static validLangages = {
	...
	es: "Español"
};
```

Vous pouvez ensuite compléter le fichier `/core/lang.yml` en ajoutant ce drapeau comme dernier enfant d'une arboresence tel que ci-dessous :

```yaml
dialog:
  btn:
    cancel:
      fr: Annuler
      en: Cancel
      es: Cancelar
```

Vous pouvez appeler l'objet traduit via le module `/core/models/lang.js` tel que ci-dessous. Selon le langue configurée par l'utilisateur, c'est l'entrée correspondante qui sera appelée.

```js
const lang = require('./core/models/lang');

lang.getFor(lang.i.dialog.btn.cancel)
```

Vous pouvez également insérer des chaînes à compléter tel que ci-dessous. 

```yaml
dialog:
  btn:
    file_filter:
      fr: Fichiers $1 envoyé vers $2
      en: $1 file send to $2
      es: Archivo $1 enviado a $2
```

Pour chaque `$n`, vous pouvez insérer depuis un tableau une valeur de remplacement.

```js
const lang = require('../core/models/lang');

lang.getWith(
    lang.i.dialog.btn.file_filter,
    [
        fileExtension.toUpperCase(), // $1
        fileTarget // $2
    ]
)
```

## Mise à jour des modules

Après modification depuis leur dépôt respectif, les modules [Cosma-core](https://github.com/graphlab-fr/cosma-core) (`/core`) et [Cosma-docs](https://github.com/graphlab-fr/cosma-docs) (`/docs`) peuvent être mis à jour depuis les dépôts [Cosma](https://github.com/graphlab-fr/cosma) et [Cosma-CLI](https://github.com/graphlab-fr/cosma-cli) via la commande suivante.

```
npm run modules
```