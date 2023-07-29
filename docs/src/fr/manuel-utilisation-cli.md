---
title: Manuel d’utilisation (CLI)
version: CLI v2.0.0
date: Last Modified
description: >-
  Manuel d’utilisation de Cosma CLI.
lang: fr
layout: doc
tags: user
---

## Installation et mise à jour

### Installation

Cosma est disponible en deux versions : une application à interface graphique (*graphical user interface*, GUI) et une application exécutable en ligne de commande (*command line interface*, CLI). Les informations concernant la version GUI sont détaillées [sur une page dédiée](https://cosma.graphlab.fr/docs/manuel-utilisation/).

La version CLI de Cosma est disponible pour macOS, Windows et Linux.

L'installation de [NodeJS](https://nodejs.org/) version 12 minimum est requise.

Le gestionnaire de paquets NPM est installé automatiquement avec NodeJS. NPM peut être utilisé pour gérer l'installation de Cosma CLI. Entrez la commande ci-dessous dans votre terminal pour installer Cosma CLI de manière globale. Le logiciel s'exécute alors en écrivant `cosma`.

```
npm install @graphlab-fr/cosma -g
```

Si vous souhaitez installer Cosma CLI comme dépendance d'un projet NodeJS, utilisez la commande ci-dessous. Le logiciel s'exécute alors depuis la racine du projet en écrivant `./node_modules/.bin/cosma`.

```
npm install @graphlab-fr/cosma
```

### Mise à jour

La commande suivante affiche la liste des paquets installés via NPM pour lesquels une mise à jour existe :

```
npm outdated
```

La commande suivante met à jour Cosma CLI si une mise à jour existe :

```
npm update cosma
```

## Présentation

Cosma CLI est la version ligne de commande (*command-line interface*, CLI) de Cosma, un logiciel qui permet de représenter des graphes documentaires sous forme de réseaux interactifs dans une interface web.

Cosma CLI fonctionne sur la base de fichiers de configuration écrits en YAML. Chaque fichier de configuration indique une source des données à utiliser, ainsi que différents paramètres qui régissent le comportement de Cosma pour cette source de données.

Deux approches peuvent être adoptées en fonction des besoins :

La première consiste à exécuter la commande `cosma` dans un répertoire où se trouve un fichier de configuration. On parle dans ce cas de fichier de configuration local. Les fichiers de configuration locaux doivent toujours être nommés `config.yml`.

L'autre approche consiste à exécuter la commande `cosma` en ajoutant l'option `--project <nom>`, où `<nom>` correspond au nom d'un fichier de configuration présent dans un dossier spécial, le répertoire de données utilisateur. On parle dans ce cas de fichier de configuration global, ou **projet**. Celui-ci peut être nommé librement (ex : `toto.yml`). Cette seconde approche permet d'exécuter la commande `cosma` depuis n'importe quel emplacement.

::: astuce
La méthode locale favorise l'automatisation et la reproductibilité dans un contexte de travail partagé ou distribué sur plusieurs machines. Elle permet en effet de transmettre simultanément données, configuration et instructions d'utilisation (commandes) sous une forme utilisable telle quelle, sans aucun paramétrage supplémentaire requis de la part du destinataire (humain ou machine).

À l'inverse, la méthode globale facilite l'utilisation prolongée du logiciel par un individu sur une seule machine.
:::

## La commande `cosma`

La commande `cosma` s'utilise de trois manières :

1. `cosma` affiche l'aide ;
2. `cosma <option>` exécute une option globale ;
2. `cosma <commande> <options>` exécute l'une des cinq commandes de Cosma (`config`, `record`, `autorecord`, `batch` et `modelize`), avec une ou plusieurs options facultatives.

Les cinq commandes existent en version longue et en version courte (ex : `cosma config` ou `cosma c`). Certaines options disposent également d'une version courte (ex : `cosma config --global` ou `cosma config -g`). Dans les deux cas, version longue et version courte sont fonctionnellement identiques ; la version courte sert simplement à gagner du temps lors d'une utilisation répétée et prolongée.

Les sous-sections qui suivent détaillent les options globales.

### Créer le répertoire de données utilisateur

```
cosma --create-user-data-dir
```

Cette commande crée un répertoire de données utilisateur intitulé `cosma-cli` à un emplacement qui respecte la spécification [XDG Base Directory](https://xdgbasedirectoryspecification.com). L'emplacement exact dépend de chaque système d'exploitation et peut varier d'une version à l'autre d'un même système.

Si le répertoire de données utilisateur existe déjà, la commande affiche simplement son emplacement.

### Afficher les projets

```
cosma --list-projects
```

Cette commande liste les fichiers de configuration présents dans le répertoire de données utilisateur, aussi appelés projets.

### Afficher le numéro de version

```
cosma --version
cosma -V
```

### Afficher l'aide

Cosma dispose d'une aide générale :

```
cosma --help
cosma -h
```

Une aide contextuelle est également disponible pour les cinq commandes de Cosma. Ajoutez l'option `-h/--help` à l'une de ces commandes pour afficher l'aide contextuelle.

Exemple :

```
cosma config --help
```

## Configuration

### Créer un fichier de configuration

```
cosma config
cosma c
```

Cette commande crée un fichier `config.yml` dans le répertoire actuel.

### Créer un fichier de configuration global (projet)

```
cosma config --global <nom>
cosma c -g <nom>
```

L'option `-g/--global` suivie d'un nom crée un fichier `nom.yml` dans le répertoire de données utilisateur.

### Créer un fichier de configuration par défaut

```
cosma config --global
cosma c -g
```

Lorsqu'elle n'est pas suivie d'un nom, l'option `-g/--global` crée un fichier `defaults.yml` dans le répertoire de données utilisateur. Ce fichier peut être ensuite modifié pour définir les valeur par défaut des différents paramètres de configuration de Cosma. Ces valeurs par défaut seront appliquées aux fichiers de configuration créés par la suite.

### Paramètres de configuration

Vous trouverez ci-dessous la liste des paramètres utilisés par Cosma. Si un paramètre est absent d'un fichier de configuration, Cosma considère qu'il a sa valeur par défaut.

::: important
Les types de fiches et de liens « undefined » sont requis pour le fonctionnement de l'application. Si vous les supprimez d'un fichier de configuration, Cosma les ré-insèrera automatiquement lors de la prochaine utilisation de ce fichier.
:::

nom | description | valeurs possibles | valeur par défaut
---|---|---|---
`select_origin` | Type de la source de données | `directory` (répertoire de fiches), `csv` (fichiers CSV locaux) ou `online` (fichiers CSV en ligne) | `directory`
`files_origin` | Emplacement des fiches pour `directory` | chemin (répertoire) | 
`nodes_origin` | Emplacement des nœuds pour `csv` | chemin (fichier CSV) | 
`links_origin` | Emplacement des liens pour `csv` | chemin (fichier CSV) | 
`nodes_online` | Emplacement des nœuds pour `online` | URL | 
`links_online` | Emplacement des liens pour `online` | URL | 
`images_origin` | Emplacement des images utilisées dans le cosmoscope | chemin (répertoire) | 
`export_target` | Emplacement des exports | chemin (répertoire) | 
`history` | Copie de chaque cosmoscope généré via Cosma dans le répertoire `history` | `true` ou `false` | `true`
`focus_max` | Distance maximale au nœud sélectionné en mode focus | nombre entier | 2
`record_types` | Liste des types d'entités | liste |
type d'entité | | chaîne de caractères | 
`fill` | Couleur de remplissage du type de nœud | couleur HTML | 
`stroke` | Couleur du contour du type de nœud (utilisée lorsque le nœud est rempli par une image) | couleur HTML | 
`link_types` | Liste des types de liens | liste |
type de lien | | chaîne de caractères | 
`stroke` | Style de tracé du type de lien | `simple` (trait plein), `dash` (tirets), `dash` (pointillés), `double` (deux traits parallèles) | `simple`
`color` | Couleur du type de lien | couleur HTML | 
`record_filters` | Liste de métadonnées filtres | | 
métadonnée filtre | Les fiches incluant cette métadonnée seront exclues lors de la création d'un cosmoscope | type, mot-clé, métadonnée déclarée dans `record_metas` | 
`graph_background_color` | Couleur de fond du graphe | couleur HTML | 
`graph_highlight_color` | Couleur de surbrillance | couleur HTML | 
`graph_highlight_on_hover` | Application de la surbrillance au survol et à la sélection des nœuds | `true` ou `false` | `true`
`graph_text_size` | Taille des étiquettes des nœuds | nombre entier compris entre 2 et 15 | 10
`graph_arrows` | Ajout de flèches directionnelles aux extrémités des liens | `true` ou `false` | `true`
`node_size_method` | Méthode de dimensionnement des nœuds | `degree` (taille proportionnelle au degré) ou `unique` (taille fixe) | `degree`
`node_size` | Taille des nœuds (taille fixe) | nombre entier compris entre 2 et 20 | 10
`node_size_max` | Taille maximale des nœuds (taille proportionnelle) | nombre entier compris entre 2 et 20 | 20
`node_size_min` | Taille minimale des nœuds (taille proportionnelle) | nombre entier compris entre 2 et 20 | 2
`attraction_force` | Force d'attraction | nombre compris entre 50 et 600 | 200
`attraction_distance_max` | Distance maximum entre les nœuds | nombre compris entre 200 et 800 | 250
`attraction_vertical` | Force d'attraction vers l'axe vertical | nombre compris entre 0 (désactivé) et 1 | 0
`attraction_horizontal` | Force d'attraction vers l'axe horizontal | nombre compris entre 0 (désactivé) et 1 | 0
`views` | Liste des vues enregistrées (GUI) | liste | 
`chronological_record_meta` | Métadonnée utilisée pour le mode chronologique | `created`, `last_edit`, `last_open`, `timestamp`, métadonnée déclarée dans `record_metas` | `created`
`record_metas` | Liste de métadonnées (présentes dans la source de données) à inclure dans le cosmoscope | liste |
`title` | Titre du cosmoscope | chaîne de caractères | 
`author` | Auteur du cosmoscope | chaîne de caractères | 
`description` | Decription du cosmoscope | chaîne de caractères | 
`keywords` | Liste de mots-clés du cosmoscope | liste | 
mot-clé | | chaîne de caractères |
`link_symbol` | Symbole à afficher en remplacement des identifiants comme texte des liens internes dans le cosmoscope | chaîne de caractères | 
`csl` | Style bibliographique | chemin (fichier XML) | 
`bibliography` | Données bibliographiques | chemin (fichier JSON) | 
`csl_locale` | Localisation bibliographique | chemin (fichier XML) | 
`css_custom` | Feuille de styles CSS pour la personnalisation du cosmoscope | chemin (fichier CSS) | 
`devtools` | Affichage des outils de développement (GUI) | `true` ou `false` | `true`
`lang` | Langue du cosmoscope | `en` (anglais) ou `fr` (français) | `en`

::: astuce
La couleur de fond du graphe et la couleur de surbrillance sont modifiables directement via le fichier de configuration mais toutes les couleurs de l'interface peuvent être modifiées en utilisant une feuille de style CSS personnalisée.

Appliquer une force verticale/horizontale resserre le graphe et permet de ramener plus près du centre les nœuds isolés.
:::

### Modèle de configuration

Voici le modèle utilisé par Cosma pour générer un fichier de configuration :

```
select_origin: directory
files_origin: ''
nodes_origin: ''
links_origin: ''
nodes_online: ''
links_online: ''
images_origin: ''
export_target: ''
history: true
focus_max: 2
record_types:
  undefined:
    fill: '#858585'
    stroke: '#858585'
link_types:
  undefined:
    stroke: simple
    color: '#e1e1e1'
record_filters: []
graph_background_color: '#ffffff'
graph_highlight_color: '#ff6a6a'
graph_highlight_on_hover: true
graph_text_size: 10
graph_arrows: true
node_size_method: degree
node_size: 10
node_size_max: 20
node_size_min: 2
attraction_force: 200
attraction_distance_max: 250
attraction_vertical: 0
attraction_horizontal: 0
views: {}
chronological_record_meta: last_edit
record_metas: []
title: ''
author: ''
description: ''
keywords: []
link_symbol: ''
csl: ''
bibliography: ''
csl_locale: ''
css_custom: ''
devtools: false
lang: en
```

## Créer du contenu : fichiers texte (Markdown)

Lorsque la source de données est de type `directory` (répertoire de fichiers Markdown), les données doivent respecter les règles suivantes :

- contenu rédigé en Markdown, extension de fichier `.md` ;
- métadonnées exprimées en YAML, dans un en-tête présent en début de fichier ;
- liens internes exprimés avec une syntaxe de type wiki (doubles crochets `[[ ]]`) et basés sur des identifiants uniques.

Les sous-sections qui suivent expliquent ces règles en détail.

::: note
Cette combinaison de normes d'écriture correspond au croisement de plusieurs cultures textuelles : la documentation (enrichir et indexer le contenu avec des métadonnées) ; les wikis (interrelier des connaissances) ; les pratiques de type Zettelkasten (tradition des fiches érudites) ; l'écriture scientifique avec Pandoc (utiliser le format texte comme source pour plusieurs autres formats).

Cosma fonctionne donc particulièrement bien lorsqu'il est utilisé en tandem avec des environnements d'écriture qui adoptent également cette approche, comme [Zettlr](https://zettlr.com) ou l'extension [Foam](https://foambubble.github.io/foam/) pour Visual Studio Code et VSCodium.
:::

### Métadonnées

Pour être correctement interprétés par Cosma, les fichiers Markdown (`.md`) doivent respecter une certaine structure, et notamment la présence d'un en-tête en [YAML](http://yaml.org) au début du fichier. Cet en-tête est créé automatiquement lorsque la fiche est créée via Cosma.

Exemple :

```
---
title: Titre du document
id: 20201209111625
types:
- undefined
tags:
- mot-clé 1
- mot-clé 2
---
```

L'en-tête YAML est délimité par deux séries de trois tirets seuls sur une ligne (`---`). Un champ en YAML est composé d'un nom et d'une valeur séparés par un double-points.

Conformément à la spécification YAML, les listes peuvent être inscrite en mode *block* :

```yaml
tags:
- mot-clé 1
- mot-clé 2
```

Ou bien en mode *flow* :

```yaml
tags: [mot-clé 1, mot-clé 2]
```

::: note
**Pourquoi un en-tête en YAML ?**

Certains logiciels identifient les métadonnées d'un fichier de manière heuristique. Par exemple, si la première ligne du fichier est un titre de niveau 1, alors celui-ci sera interprété comme le titre du fichier ; si la seconde ligne contient des mots préfixés par un croisillon `#`, alors ils seront interprétés comme des mots-clés.

L'inconvénient de ce fonctionnement est qu'il n'est pas interopérable : chaque logiciel a ses propres conventions, ce qui limite la capacité de l'utilisateur à changer d'outil.

Utiliser un en-tête en YAML permet de déclarer des métadonnées comme le titre et l'identifiant unique d'une fiche de manière explicite. Ceci présente l'avantage de rendre triviale la détection et la manipulation de ces métadonnées, aussi bien par une machine que par un humain. L'utilisation d'un format commun (comme YAML) augmente le nombre d'outils compatibles avec un même ensemble de fichiers. Et des outils informatiques très répandus comme les expressions régulières et les scripts *shell* permettent aux utilisateurs de convertir eux-mêmes leurs données de manière relativement simple si besoin.
:::

#### Métadonnées reconnues

Cosma reconnaît et utilise les champs suivants :

`title`
: Obligatoire.
: Titre de la fiche.

`id`
: Obligatoire.
: Identifiant unique de la fiche. Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com).

`type` ou `types`
: Types de la fiche. Facultatif. Une fiche peut avoir un ou plusieurs types. Si le champ n'est pas renseigné ou bien que ses valeurs ne correspondent pas à l'un des types renseignés dans la configuration, Cosma interprètera le type de la fiche comme non défini (`undefined`).

`tags` (ou `keywords`)
: Mots-clés de la fiche. Facultatif. La valeur doit être une liste. Il est possible d'utiliser `keywords` au lieu de `tags`, dans une logique de compatibilité avec Pandoc. Si une fiche comporte un champ `tags` et un champ `keywords`, seuls les mots-clés déclarés dans le champ `tags` sont interprétés par Cosma.

`thumbnail`
: Facultatif.
: Nom de fichier d'une image à utiliser comme vignette pour cette fiche dans le cosmoscope (à l'intérieur du nœud correspondant et en haut du panneau de droite lorsque la fiche est ouverte).

`begin`
: Facultatif.
: Métadonnée temporelle utilisée pour le mode chronologique.

`end`
: Facultatif.
: Métadonnée temporelle utilisée pour le mode chronologique.

#### Ajouter d'autres métadonnées

Il est possible d'ajouter librement d'autres métadonnées dans l'en-tête YAML. Par défaut, Cosma ignore ces métadonnées au moment de créer un cosmoscope : elles ne sont pas incluses dans le rendu HTML des fiches. Pour que ces métadonnées soient prises en compte, inscrivez-les dans le fichier de configuration au niveau du champ `record_metas`.

Exemple :

```
record_metas: [author, date, lang]
```

### Contenu

Cosma interprète les fichiers comme étant rédigés en [CommonMark](https://spec.commonmark.org/0.30/), une version strictement définie du langage de balisage léger Markdown.

::: astuce
Le [tutoriel CommonMark traduit en français](https://www.arthurperret.fr/tutomd/) permet d'apprendre les bases de Markdown en 10 minutes.

Si vous souhaitez découvrir l'utilisation conjointe de Markdown et Pandoc, vous pouvez consulter le cours en ligne [Markdown et vous](https://infolit.be/md/).
:::

Cosma génère un rendu des fichiers Markdown en HTML. Par conséquent, les fichiers Markdown peuvent également inclure du code HTML, ainsi que des images vectorielles en SVG. Cosma supporte également l'[ajout d'attributs via des accolades](https://www.npmjs.com/package/markdown-it-attrs), comme présenté ci-dessous.

```markdown
Ce paragraphe sera en rouge{.red}
```

```html
<div class="red">Ce paragraphe sera en rouge</div>
```

Les images au format JPG ou PNG peuvent être incluses dans le cosmoscope via la syntaxe Markdown. Exemple :

```markdown
![Texte alternatif](image.jpg)
```

Pour réduire la taille du cosmoscope, privilégiez les images hébergées sur le Web et incluses via une URL. Exemple :

```markdown
![Texte alternatif](http://domaine.fr/image.jpg)
```

### Liens

À l'intérieur des fiches, vous pouvez créer des liens avec l'identifiant de la fiche cible entre double crochets.

Exemple :

```
Un lien vers [[20201209111625]] une fiche.
```

À partir de la v2, vous pouvez également inclure le texte du lien entre les crochets.

Exemple :

```
Un lien vers [[20201209111625|une fiche]].
```

Cosma permet de définir des types de liens. Chaque type de lien est caractérisé par un nom, une couleur et un tracé. Pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points.

Exemple :

```
Le concept B dérive du [[générique:20201209111625]] concept A.

La personne D a écrit contre [[opposant:20201209111625]] la personne C.
```

::: astuce
Si vous n'utilisez pas la syntaxe alternative, vous pouvez tout de même améliorer la lisibilité des fiches dans le cosmoscope en utilisant le paramètre `link_symbol`. Celui-ci accepte comme valeur une chaîne de caractères Unicode arbitraire, qui remplacera les identifiants entre les crochets dans le rendu HTML des fiches. Ceci permet d'alléger visuellement le texte des fiches en remplaçant les longs identifiants numériques par une convention personnelle. Cela peut être par exemple un symbole comme une manicule ☞, une flèche →, une étoile ⟡, etc.
:::

### Identifiants uniques

Pour être correctement interprétée par Cosma, chaque fiche doit avoir un identifiant unique. Cet identifiant sert de cible aux liens internes.

**L'identifiant doit être une suite unique de caractères.**

Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes). Nous nous inspirons ici du fonctionnement de logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) et [Zettlr](https://www.zettlr.com).

::: note
De nombreux logiciels de prise de notes interreliées proposent d'établir les liens entre fichiers via leurs noms, et de gérer automatiquement la maintenance des liens lorsque les noms de fichiers sont modifiés. En choisissant plutôt d'utiliser des identifiants uniques, nous avons donné à Cosma un fonctionnement plus classique, plus strict, proche de celui du Web. Nous pensons qu'il s'agit de la manière la plus simple d'éviter les [liens morts](https://fr.wikipedia.org/wiki/Lien_mort) de façon pérenne. Le fait de ne pas recourir à une maintenance automatique des liens notamment rend les données moins dépendantes d'une solution logicielle en particulier.
:::

### Créer des fiches via Cosma

Cosma inclut plusieurs commandes qui permettent de créer rapidement des fiches en générant automatiquement leur en-tête.

::: important
Ces commandes ne fonctionnent que pour une source de données de type `directory` (fichiers Markdown).

Ces commandes requièrent un fichier de configuration avec le paramètre `files_origin` correctement renseigné. Cela peut être soit un fichier `config.yml` présent dans le répertoire courant, soit un projet indiqué via l'option `-p/--project`.
:::

#### `record` : créer une fiche (mode formulaire)

```
cosma record
cosma r
cosma record --project <nom>
```

Cette commande permet de créer une fiche à la manière d'un formulaire. Une fois la commande lancée, le logiciel demande successivement de saisir un titre, un ou plusieurs types, et un ou plusieurs mots clés. Seul le titre est obligatoire.

#### `autorecord` : créer une fiche (mode *one-liner*)

```
cosma autorecord <titre> <types> <mots-clés>
cosma a <titre> <type> <mots-clés>
cosma autorecord <titre> <types> <mots-clés> --project <nom>
```

Cette commande permet de créer une fiche en une seule saisie. Seul le titre est obligatoire. Si vous saisissez plusieurs types ou plusieurs mots-clés, séparez-les par des virgules (les espaces suivant la virgule sont ignorés). Exemple : `type A, type B`, `mot-clé1, mot-clé2`.

#### `batch` : créer un lot de fiches

```
cosma batch <chemin>
cosma b <chemin>
cosma batch <chemin> --project <nom>
```

Cette commande permet de créer plusieurs fiches d'un coup. `<chemin>` correspond à l'emplacement d'un fichier au format JSON ou CSV décrivant les fiches à créer. Comme pour tous les autres modes de création de fiches, le titre (`title`) est obligatoire et les autres champs sont facultatifs.

Exemple de fichier JSON contenant deux fiches :

```json
[
  {
    "title": "Titre de la fiche"
  },
  {
    "title": "Paul Otlet",
    "type" : ["Personne", "Histoire"],
    "metas": {
        "prenom" : "Paul",
        "nom" : "Otlet"
    },
    "tags" : ["documentation"],
    "begin" : "1868",
    "end" : "1944",
    "content" : "Lorem...",
    "thumbnail" : "image.jpg",
    "references" : ["otlet1934"]
  }
]
```

Exemple de fichier CSV contenant ces mêmes fiches :

```csv
title,content,type:nature,type:field,meta:prenom,meta:nom,tag:genre,time:begin,time:end,thumbnail,references
Titre de la fiche,,,,,,,,,,,
Paul Otlet,Lorem...,Personne,Histoire,Paul,Otlet,homme,1868,1944,image.png,otlet1934
```

::: note
**Identifiants des fiches créées par lot**

Cosma génère des identifiants à 14 chiffres par horodatage : année, mois, jour, heures, minutes et secondes. Par conséquent, il est possible de créer manuellement une fiche par seconde, soit 86 400 fiches par jour. Ceci signifie qu'il existe une plage de 86 400 identifiants « réservés » à la création manuelle de fiches. Pour le 15 janvier 2022 par exemple, ces identifiants vont de 20220115000000 à 20220115235959.

Pour conserver ce fonctionnement sans risquer de générer des identifiants en double, le mode de création par lots génère des identifiants par pseudo-horodatage. Les 8 premiers chiffres, correspondant à la date (année, mois, jour), sont réels. Exemple : 20220115 (15 janvier 2022). En revanche, ceux correspondant aux heures, minutes et secondes sont générés en dehors des plages horaires réelles. Exemple : 256495. Comme il est impossible de créer une fiche manuellement à 25h 64min et 95s, il n'y a pas de risque de générer des identifiants en double en utilisant simultanément les deux méthodes. 

Du fait de ce fonctionnement, il est possible de créer par lot jusqu'à 913 599 fiches par jour et par répertoire avant d'être à cours d'identifiants.
:::

## Créer du contenu : données tabulaires (CSV)

Cosma peut interpréter des données tabulaires contenues dans des fichiers CSV locaux ou en ligne. Il s'agit d'une alternative aux fichiers Markdown.

Les données tabulaires destinées à Cosma doivent être contenues dans deux fichiers : un pour les nœuds et un autre pour les liens. Les emplacement de ces fichiers doivent être renseignés dans le fichier de configuration.

::: note
Vous pouvez générer des fichiers CSV via un tableur, et notamment depuis un tableur collaboratif en ligne. En fait, c'est parce que ce type d'outil existe que nous avons ajouté les fichiers CSV comme source de données alternative aux fichiers Markdown pour Cosma.

Nous vous proposons [un modèle de tableur Google Sheets](https://docs.google.com/spreadsheets/d/1Wxm3lxgSnHaqsIVQVyuMR4TmiJwjDSr-KJWaKqNjz_o/) dont vous pouvez vous inspirer. Une feuille doit être consacrée aux nœuds et une autre aux liens. Cliquez sur Fichier › Partager › Publier sur le Web. Sélectionnez la feuille contenant les nœuds, puis changez le format « Page Web » en « Valeurs séparées par des virgules (.csv) ». Cliquez sur « Publier » puis copiez le lien de partage. Répétez l'opération pour la feuille contenant les liens (dans notre modèle, il s'agit de la feuille « Extraction » et pas « Liens »). Collez chaque lien dans le champ correspondant de la configuration du projet.
:::

Les en-têtes de colonnes des fichiers CSV doivent respecter les règles suivantes.

### Métadonnées pour les nœuds

Pour les nœuds, seule la métadonnée `title` (titre) est requise.

nom | description
----|------------
`title` | Titre de la fiche (requis)
`id` | Identifiant unique
`type:<nom>` | Typologie de fiches. Chaque typologie contient un ou plusieurs types. Ex : une colonne peut être appelée `type:primaire` et contenir des types comme `personne`, `œuvre`, `institution` ; une autre colonne peut être appelée `type:secondaire`, avec d'autres types.
`tag:<nom>` | Liste de mots-clés
`meta:<nom>` | Métadonnée définie par l'utilisateur
`time:begin`, `time:end` | Métadonnées utilisées par le mode chronologique
`content` | Contenu textuel de la fiche
`thumbnail` | Nom de fichier d'une image à inclure sous forme de vignette dans la fiche. Formats pris en charge : JPG, PNG. L'emplacement des fichiers images doit être renseigné via le paramètre `images_origin` dans le fichier de configuration.
`reference` | Liste de clés de citation à inclure en bibliographie dans la fiche.

### Métadonnées pour les liens

nom | description
----|------------
`id` | Identifiant du lien (requis). Cet identifiant doit être unique.
`source` | Identifiant de la fiche d'où part le lien (requis)
`target` | Identifiant de la fiche que cible le lien (requis)
`label` | Description du lien (optionnelle). Cette description s'affiche dans les infobulles de contexte des liens/rétroliens.

## Créer un cosmoscope

```
cosma modelize
cosma m
cosma modelize --citeproc --custom-css
```

### Générer un cosmoscope d'exemple

```
cosma modelize --sample
```

Cette commande permet de générer un cosmoscope d'exemple. Ceci ne requiert pas de fichier de configuration. Le cosmoscope contient un extrait du manuel d'utilisation de Cosma sous forme hypertextuelle.

### Traiter les citations

```
cosma modelize --citeproc
```

Cosma intègre une fonctionnalité de traitement des citations. Elle repose sur le même écosystème que [Zettlr](https://www.zettlr.com) : les données et styles bibliographiques utilisent la norme [Citation Style Language (CSL)](https://citationstyles.org), tandis que l'insertion des citations dans le texte se fait avec la [syntaxe de citation de Pandoc](https://pandoc.org/MANUAL.html#citation-syntax).

#### Fichiers requis

Pour traiter automatiquement les citations, Cosma requiert trois fichiers :

Données bibliographiques
: Fichier contenant les métadonnées décrivant des références bibliographiques. Le format requis est CSL JSON (extension `.json`).

Style bibliographique
: Fichier contenant les règles de mise en forme des citations et bibliographies. Le format requis est CSL (extension `.csl`). Vous pouvez télécharger des fichiers de style depuis le [répertoire de styles CSL de Zotero](https://www.zotero.org/styles).

Localisation bibliographique
: Fichier contenant les traductions dans une certaine langue des termes employés en bibliographie (ex : éditeur, numéro…). Le format requis est XML (extension `.xml`). Vous pouvez télécharger des fichiers de localisation depuis le [dépôt GitHub du projet CSL](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

Dans le fichier de données, chaque référence doit posséder un identifiant unique (`id`) qui sert de clé de citation. Exemple :

```json
[
  {
    "id":"goody1979",
    "author":[{"family":"Goody","given":"Jack"}],
    "citation-key":"goody1979",
    "event-place":"Paris",
    "ISBN":"978-2-7073-0240-3",
    "issued":{"date-parts":[[1979]]},
    "language":"fr",
    "publisher":"Les Editions de Minuit",
    "publisher-place":"Paris",
    "title":"La Raison graphique : la domestication de la pensée sauvage",
    "title-short":"La Raison graphique",
    "type":"book"
  }
]
```

::: astuce
Vous pouvez utiliser le gestionnaire de références bibliographiques [Zotero](https://www.zotero.org/) avec l'extension [Better BibTeX](https://retorque.re/zotero-better-bibtex/) afin de créer des clés de citation uniques pour chaque référence ainsi que des exports automatiquement mis à jour.
:::

#### Syntaxe de citation

Pour citer une référence dans une fiche, intégrez la clé de citation de cette référence en utilisant la [syntaxe de citation de Pandoc](https://pandoc.org/MANUAL.html#citation-syntax).

Exemple :

```
À propos de raison graphique [@goody1979, 46-52]…
```

#### Rendu des citations et bibliographies

Lors du traitement des citations, chaque clé de citation est remplacée par du texte formaté et une bibliographie est générée en-dessous du corps de chaque fiche contenant des références.

Exemple :

```
À propos de raison graphique (Goody 1979, p. 46-52)…

Bibliographie
-------------

GOODY, Jack, 1979. La Raison graphique : la domestication de la pensée sauvage.
  Paris : Les Editions de Minuit. ISBN 978-2-7073-0240-3.
```

Les données CSL JSON correspondant aux références citées sont également incluses dans le cosmoscope au format JSON. Vous pouvez consulter et télécharger ces données dans le cosmoscope en cliquant sur le bouton « Données » en bas du menu latéral gauche. Vous pouvez également y accéder en consultant le code source du cosmoscope au niveau de la balise `<article id="citation-references">`.

### Appliquer une CSS personnalisée

```
cosma modelize --custom-css
```

Il est possible de personnaliser l'apparence d'un cosmoscope via une feuille de styles CSS. Pour cela, renseignez son emplacement au niveau du paramètre `css_custom` dans le fichier de configuration et appliquez l'option `--custom-css` au moment de générer le cosmoscope.

Pour élaborer votre CSS, ouvrez le cosmoscope dans un navigateur web et utiliser les outils de développement du navigateur pour inspecter le code, ou bien consultez le code source de Cosma, spécifiquement `/cosma-core/template.njk` (pour connaître la structure HTML du cosmoscope), `/cosma-core/styles.css` et `/cosma-core/print.css` (pour les styles d'impression activés lors de l'impression d'une fiche). Ceci vous permettra de connaître les sélecteurs à utiliser pour telle ou telle déclaration CSS.

Les feuilles de style du cosmoscope utilisent des variables CSS pour définir les couleurs et les polices utilisées. Vous pouvez redéfinir uniquement ces variables pour modifier tous les éléments d'interface auxquels elles s'appliquent. Dans l'exemple ci-dessous, le fichier `custom.css` contient des déclarations qui modifient les polices utilisées dans le cosmoscope :

```css
:root {
  --sans: "IBM Plex Sans", sans-serif;
  --serif: "IBM Plex Serif", serif;
  --mono: "IBM Plex Mono", monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```

### Utiliser un fichier de configuration global

```
cosma modelize --project <nom>
cosma m -p <nom>
```

L'option `-p/--project` applique les paramètres du projet `nom`.

### Exclure certaines fiches du cosmoscope

Il est possible d'exclure certaines fiches du cosmoscope sur la base du paramètre `record_filters`. Celui-ci prend pour valeur une liste dont les éléments peuvent être des types, des mots-clés ou des valeurs prises par les métadonnées déclarées dans `record_metas`. Les fiches dont l'en-tête contient au moins un élément de la liste sont exclues au moment de générer le cosmoscope.

```
record_filters:
  - meta: <type/tag/nom de métadonnée>
    value: <valeur du type/tag/de la métadonnée>
```

Pour chaque filtre, le paramètre `meta` prend pour valeur soit `type` (type de fiche), soit `tag` (mot-clé), soit le nom d'une métadonnée déclarée dans `record_metas`. Le paramètre `value` prend pour valeur le type, le mot-clé ou la valeur de métadonnée sur laquelle exclure les fiches.

Voici un exemple. Considérez la fiche suivante :

```
---
title: Paul Otlet
type: personne
groupe: auteurs
tags: [documentation, pacifisme]
---

Paul Otlet (1868-1944) est un avocat, bibliographe
et militant pacifiste belge considéré comme le
fondateur de la documentation moderne…
```

La métadonnée `groupe` peut être déclarée via `record_metas` dans le fichier de configuration :

```
record_metas: [groupe]
```

Ceci permet d'utiliser la métadonnée `groupe` (en plus du titre et des mots-clés) comme critère pour exclure certaines fiches via `record_filters`. Dans l'exemple ci-dessous, toutes les fiches contenant `groupe: auteurs` et/ou le mot-clé `pacifisme` sont exclues :

```
record_filters:
  - meta: groupe
    value: auteurs
  - meta: tag
    value: pacifisme
```

### Historique

Par défaut, Cosma exporte automatiquement une copie de chaque cosmoscope dans un répertoire `history`. Ceci peut être désactivé en renseignant `history: false` dans le fichier de configuration.

<!-- Emplacement ? -->

### Rapport d'erreurs

Si Cosma rencontre des problèmes durant la génération d'un cosmoscope, il crée un rapport d'erreurs dans un sous-répertoire `logs` du répertoire de données utilisateur. Si ce dernier n'existe pas, `logs` est placé dans le répertoire d'installation de Cosma.

## Utilisation du cosmoscope

Le cosmoscope est un fichier HTML. Pour l'utiliser, ouvrez-le dans un navigateur web.

Le cosmoscope est organisé en trois colonnes :

Panneau latéral gauche (Menu)
: Regroupe les fonctionnalités permettant de chercher de l'information et de modifier l'affichage de manière globale.

Zone centrale (Graphe)
: Affiche le graphe et les contrôles associés (zoom, focus).

Panneau latéral droit (Fiche)
: Affiche les fiches (métadonnées et contenu) ainsi qu'une liste des liens sortants (Liens) et entrants (Rétroliens).

### Graphe

Le graphe situé dans la zone centrale de l'interface affiche des nœuds étiquetés et interreliés. Chaque nœud correspond à une fiche ; l'étiquette correspond au titre de la fiche. Les liens correspondent aux liens établis entre les fiches via leur identifiant.

Survoler un nœud le met temporairement en surbrillance, lui et ses connexions. Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

Vous pouvez zoomer librement dans le graphe à la souris, au pavé tactile, en double cliquant sur le fond du graphe ou bien avec les boutons dédiés situés en bas à gauche. Appuyez sur la touche `C` pour zoomer sur un nœud sélectionné (dont la fiche est ouverte). Le bouton Recentrer (raccourci : touche `R`) réinitialise le zoom.

Les nœuds sont organisés dans l'espace par un algorithme de simulation de forces. Une barre colorée située au sommet du panneau latéral gauche témoigne de l'état de la simulation (en cours ou bien terminée). Cliquez sur cette barre (raccourci : touche `Espace`) pour lancer un cycle de simulation supplémentaire.

::: astuce
Quelques pressions successives de la touche `Espace` permettent de « déplier » progressivement un graphe emmêlé.
:::

Le graphe n'est pas figé, les nœuds peuvent donc être déplacés par cliquer-glisser. Cependant, les nœuds et liens restent soumis en permanence à la simulation, donc il n'est pas possible de les disposer manuellement de manière arbitraire. Chaque modification du cosmoscope est susceptible de modifier la disposition des nœuds dans l'espace.

L'affichage du graphe peut être modifié de manière temporaire via les contrôles placés sous Paramètres du graphe dans le panneau latéral gauche. Pour modifier l'affichage de manière permanente, modifiez les valeurs par défaut des paramètres correspondants dans le fichier de configuration.

::: astuce
Modifiez la force et la distance maximale entre les nœuds pour adapter l'affichage à la résolution et la taille de votre écran. Ajoutez une force d'attraction vers l'axe vertical/horizontal pour resserrer le graphe et ramener les nœuds isolés plus près du centre.
:::

L'affichage est possible sur tous types d'écrans mais n'est pas optimisé pour les terminaux mobiles : le tactile ne donne pas accès à certaines interactions comme le survol, et les petits écrans restreignent l'utilité du graphe.

### Fiches

Les fiches peuvent être ouvertes en cliquant sur un nœud, une entrée de l'index, une suggestion du moteur de recherche, ou un lien dans le corps ou le pied d'une fiche. Ouvrir une fiche affiche son contenu dans le panneau latéral droit.

Ouvrir une fiche met à jour l'URL de la page dans le navigateur. Ceci permet de naviguer entre les fiches visitées via les fonctionnalités Précédent / Suivant du navigateur, mais aussi de les retrouver dans l'historique du navigateur ou encore d'obtenir un lien direct vers la fiche à partager.

Cliquer sur le bouton « Fermer » referme le panneau latéral droit de lecture et désélectionne le nœud correspondant dans le graphe.

Les liens présents dans les fiches sont cliquables. Dans un navigateur où est ouvert un cosmoscope, vous pouvez ouvrir ces liens dans un nouvel onglet via un clic droit. Le titre du lien (affiché en infobulle après 1-2 secondes de survol) est celui de la fiche correspondante.

En bas de chaque fiche se trouve une liste des liens sortants et des liens entrants (ou rétroliens). Les liens et rétroliens sont contextualisés : au survol, une infobulle s'affiche, montrant le paragraphe qui entoure ce lien dans la fiche correspondante.

::: note
Les liens et rétroliens contextualisés font partie des fonctionnalités les plus utiles des systèmes hypertextuels. C'est une fonctionnalité notoirement absente du Web. En revanche, de nombreuses applications de prise de notes interreliées traitent les liens comme un élément de première importance, et cela inclut les rétroliens contextualisés. Cependant, lorsque ces notes sont partagées sur le Web, cette fonctionnalité n'est pas toujours incluse, ou alors elle fait partie d'un service de publication payant. Avec Cosma, les rétroliens contextualisés font partie du logiciel, que vous soyez l'auteur d'un cosmoscope travaillant sur sa machine, ou quelqu'un qui explore un cosmoscope sur le Web.
:::

### Mode focus

Le bouton Activer le focus (raccourci : touche `F`) situé en bas à gauche du graphe permet de restreindre l'affichage au nœud sélectionné : en mode focus, seules les connexions directes à la fiche sélectionnée sont affichées dans l'interface. Le mode focus ne fonctionne que si vous avez sélectionné une fiche.

Le curseur qui apparaît sous le bouton Activer le focus permet de faire varier la distance d'affichage, jusqu'au maximum indiqué dans Préférences › Niveau maximum de focus. Une valeur de 1 signifie que seules les connexions immédiates seront affichées en mode Focus. Une valeur de 2 signifie que vous pouvez étendre le focus aux connexions des connexions, et ainsi de suite.

::: astuce
Le curseur du niveau de focus est contrôlable via les flèches du clavier. Vous pouvez enchaîner les raccourcis : `F` pour activer le focus, puis les flèches pour augmenter le niveau de focus.
:::

### Mode chronologique

Le bouton Mode chronologique en bas à gauche du graphe permet d'afficher une frise interactive avec laquelle il est possible de modifier l'affichage des nœuds en fonction d'une métadonnée temporelle :

- date de création (par défaut) : `created` ;
- date de dernière modification : `last_edit` ;
- date de dernière ouverture : `last_open` ;
- identifiant si celui-ci correspond à un horodatage (ce qui est le cas des identifiants générés par Cosma) : `timestamp` ;
- métadonnée déclarée dans `record_metas` si celle-ci correspond à une date au format YYYY-MM-DD.

### Moteur de recherche

Le champ de texte situé en haut du panneau latéral gauche est un moteur de recherche qui fonctionne sur les titres de fiches. Il suggère une liste de fiches dont le titre est le plus proche de ce que vous saisissez dans la barre de recherche (*fuzzy search*). Cliquer sur une suggestion sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante dans le panneau latéral de droite.

::: important
Les suggestions disponibles sont contraintes par les [filtres](#filtrer-laffichage-par-types) et le [mode focus](#mode-focus) : une fiche masquée par l'une ou l'autre de ces fonctionnalités ne sera pas accessible via le moteur de recherche. Lorsque vous voulez repartir de zéro pour une nouvelle requête, vous pouvez cliquer sur Réinitialiser l'affichage (raccourci : `Alt` + `R`).
:::

### Filtrer l'affichage par types

La liste des types de fiches située en haut du panneau latéral gauche permet de filtrer l'affichage. Cliquer sur un type permet de masquer et réafficher les fiches du type correspondant dans le graphe, l'index et les suggestions du moteur de recherche. Cliquer sur un type en maintenant la touche `Alt` enfoncée permet de masquer et réafficher les fiches des autres types.

Pour qu'un type apparaisse, il doit être déclaré dans le fichier de configuration et être attribué à au moins une fiche.

### Mots-clés

La liste des mots-clés située dans le panneau latéral gauche permet de filtrer le graphe. Sélectionner un mot-clé affiche les fiches qui contiennent ce mot-clé, dans le graphe et dans l'index. Vous pouvez activer simultanément plusieurs mots-clés. Pour désactiver un mot-clé, cliquez à nouveau sur le bouton correspondant.

Pour qu'un mot-clé apparaisse, il suffit qu'il ait été déclaré dans l'en-tête YAML d'au moins une fiche avec le champ `tags` (ou `keywords`).

### Index

L'index alphabétique des fiches situé dans le panneau latéral gauche permet d'accéder directement à une fiche sans passer par le graphe. Cliquer sur un titre sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante. L'index peut être trié par ordre alphabétique croissant ou décroissant. Les filtres, les mots-clés et le mode focus modifient l'affichage de l'index.

### Vues

Les Vues sont une fonctionnalité de la version GUI de Cosma, qui consiste à sauvegarder l'état du graphe (fiche sélectionnée, filtres actifs, mode focus) pour un accès ultérieur, via l'ajout d'un bouton dans la section Vues du panneau latéral gauche. Cliquer sur ce bouton applique tous les paramètres qui étaient actifs au moment de l'enregistrement de la vue. Cliquer à nouveau sur le bouton rétablit l'affichage normal. Il n'est pas possible de créer de vue depuis un cosmoscope en dehors de la version GUI.

## Partage et publication d'un cosmoscope

Les cosmoscopes intègrent les métadonnées titre, auteur, description et mots-clés si elles ont été renseignées dans le fichier de configuration. Ces métadonnées sont affichées dans le panneau « À propos ». Elles sont également incluses dans le code source du cosmoscope sous la forme de balises `meta`, afin d'améliorer la description d'un cosmoscope destiné à être publié sur le Web.

Un cosmoscope peut être partagé comme n'importe quel fichier informatique : email, transfert de fichiers, messagerie, mise en ligne sur un serveur…

Dans le cas d'un cosmoscope publié sur le Web, il est possible de créer un lien directement vers une fiche en ajoutant son identifiant précédé d'un croisillon `#` en fin d'URL. Exemple :

`https://domaine.fr/cosmoscope.html#20210427185546`

## Crédits

### Équipe

- [Arthur Perret](https://www.arthurperret.fr/) (porteur du projet)
- [Guillaume Brioudes](https://myllaume.fr/) (développeur)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (chercheur)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (chercheur)

### Bibliothèques utilisées

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement utilise les bibliothèques suivantes :

- Zettlr/citr : 1.2.2
- Axios : 0.27.2
- Citeproc : 2.4.62
- Csv-parse : 5.3.0
- D3 : 4.13.0
- D3-array : 2.12.1
- D3-scale : 3.3.0
- Fuse.js : 6.6.2
- Glob : 7.2.0
- Graphology : 0.25.1
- Graphology-traversal : 0.3.1
- Hotkeys-js : 3.10.0
- Markdown-it : 13.0.1
- Markdown-it-attrs : 4.1.4
- Nunjucks : 3.2.3
- Slugify : 1.6.5
- Yaml : 2.2.1
- Babel/core : 7.20.5
- Babel/preset-env : 7.20.2
- Faker-js/faker : 7.5.0
- Babel-loader : 9.1.0
- Chai : 4.3.6
- Chai-fs : 2.0.0
- Cypress : 10.9.0
- Mocha : 10.0.0
- Prettier : 2.8.0
- Webpack : 5.74.0
- Webpack-cli : 4.10.0
- Webpack-dev-server : 4.11.1

## Changelog

### v2.0.0

#### Ajouts

- Gérer plusieurs configurations (globales et locales)
- Utiliser une syntaxe alternative pour les liens
- Inclure des métadonnées supplémentaires lors de la création par lots (batch)
- Afficher des métadonnées supplémentaires dans les fiches dans le cosmoscope
- Exclure certaines fiches lors de la génération du cosmoscope, sur la base des types, mots-clés et métadonnées supplémentaires
- Afficher les nœuds en mode chronologique
- Embarquer des images dans le cosmoscope (en base64). Formats pris en charge : JPG, PNG
- Associer une image à un type de fiche
- Associer une image à une fiche (affichée sur le nœud et dans la fiche)
- Définir une couleur de contour pour les types de nœuds
- Choisir entre nœuds de taille fixe et de taille proportionnelle à leur degré

#### Améliorations

- Les liens en bibliographie sont désormais cliquables
- Les messages affichés à l'exécution des commandes sont plus informatifs
- Le rapport d'erreurs et d'avertissements est plus informatif
- Les mots-clés au sommet des fiches dans le cosmoscope ne débordent plus de la mise en page
- Cosma lit désormais les répertoires de fiches de manière récursive (ticket [#4](https://github.com/graphlab-fr/cosma/issues/4))
- L'enregistrement automatique des cosmoscopes se fait dans un sous-répertoire `history`, soit dans le répertoire de données utilisateur pour les configurations globales, soit dans le même répertoire que la configuration locale pour cette dernière.

#### Bugs résolus

- Les infobulles de contexte des liens/rétroliens mettent correctement en évidence la fiche cible (ticket [#23](https://github.com/graphlab-fr/cosma/issues/23))

#### Bugs connus

- Les citations sont traitées dans les infobulles des liens mais pas celles des rétroliens
- Les retours chariot Windows (CR LF) ne sont pas correctement interprétés
- L'exécution de la commande `modelize` ne s'interrompt pas lorsque les données sont issues de fichiers CSV en ligne
- Si l'identifiant d'une fiche n'est pas une suite de chiffres, les liens vers cette fiche ne fonctionnent pas
- Les liens vers des fiches dont l'identifiant contient des espaces ne sont pas rendus correctement dans le corps des fiches