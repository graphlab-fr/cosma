---
title: Manuel d’utilisation (GUI)
version: GUI v2.0-beta-2
date: Last Modified
description: >-
  Manuel d’utilisation de Cosma GUI v2.
lang: fr
layout: doc
tags: user
---

## Installation et mise à jour

### Installation

Cosma est disponible en deux versions : une application à interface graphique (*graphical user interface*, GUI) et une application exécutable en ligne de commande (*command line interface*, CLI). Ce manuel concerne la version GUI. Les informations concernant la version CLI sont détaillées [sur une page dédiée](https://cosma.graphlab.fr/docs/cli/manuel-utilisation/).

La bêta de la v2 de Cosma GUI est disponible pour macOS, Windows et Linux (Debian). Visitez [la page Télécharger du site pour obtenir la dernière version du logiciel](https://cosma.graphlab.fr/telecharger/).

::: important
L'application n'est pas signée avec un certificat de sécurité, vous devez disposer des privilèges administrateurs sur votre session pour pouvoir l'exécuter.
:::

::: note
Les instructions ci-dessous mentionnent des variables d'environnement (`$HOME`, `%APPDATA%`) dont la valeur dépend du système d'exploitation. Par exemple sur macOS, `$HOME` correspond à `/Users/USERNAME`, où `USERNAME` est votre nom d'utilisateur. Sur Windows, `%APPDATA%` correspond à `C:\Users\USERNAME\AppData\Roaming`.

Pour connaître la valeur que prend une variable sur votre ordinateur, utilisez la commande `echo` suivie du nom de la variable.
:::

Sur macOS
: Téléchargez puis ouvrez le fichier dmg et copiez le fichier `Cosma.app` dans `$HOME/Applications`. Au premier lancement, faites clic droit › Ouvrir sur l'application pour l'exécuter.

Sur Windows
: Téléchargez puis décompressez le fichier `Cosma-win32-x64.zip`, renommez le dossier « Cosma » et placez-le dans `C:\Programmes` ou `C:\Programmes (86)`.

Sur Linux
: Téléchargez puis ouvrez le fichier `Cosma_amd64.deb` avec votre gestionnaire de paquets pour installer Cosma.

L’installation de Cosma crée automatiquement un dossier support à l’emplacement suivant :

Sur macOS
: `$HOME/Library/Application Support/cosma`

Sur Windows
: `%APPDATA%\Cosma`

Sur Linux
: `$HOME/.config/Cosma`

### Mise à jour

Cosma n'est pas mis à jour automatiquement. Vous pouvez être averti d’une mise à jour en vous abonnant à l’une ou l’autre de ces sources :

- [cosma-annonces](https://groupes.renater.fr/sympa/info/cosma-annonces) (liste de diffusion par email dédiée exclusivement aux annonces de mises à jour de Cosma) ;
- [flux RSS du site de Cosma](https://cosma.graphlab.fr/feed.xml) (contient les notes de version publiées sur le site).

::: important
**Si Cosma ne fonctionne plus suite à une mise à jour :** la structure du [dossier support](#dossier-support) a probablement été modifiée et n’est plus compatible avec l’ancienne version. Supprimez le dossier support et relancez l’application. Le dossier support sera recréé automatiquement et fonctionnera de nouveau correctement.
:::

## Paramétrer le logiciel

Les paramètres de Cosma peuvent être modifiés via les Préférences.

### Langue de l'application

Vous pouvez choisir entre Français et Anglais comme langue pour l'interface de Cosma.

Un redémarrage de l'application est nécessaire pour que le changement de langue prenne effet.

La langue peut également être réglée individuellement pour chaque projet via sa Configuration.

### Outils de développement

Cochez cette case pour accéder aux outils de développement via le menu Affichage. Ceci permet notamment d'inspecter le code du logiciel en direct.

## Créer un projet

Pour commencer à utiliser Cosma, créez un projet :

- cliquez sur le menu Projets puis sur Ajouter un projet ;
- indiquez le type de données via le menu déroulant : répertoire local de fichiers Markdown, fichiers CSV locaux ou fichiers CSV distants ;
- indiquez l'emplacement des données via le sélecteur de fichiers ;
- cliquez sur OK.

Pour modifier les paramètres d'un projet, cliquez sur [Configuration](#configuration).

## Créer du contenu : fichiers texte (Markdown)

Vous pouvez créer du contenu pour Cosma de deux façons : sous forme de fichiers texte rédigés en Markdown, ou bien sous formes de données tabulaires contenues dans des fichiers CSV. Cette section porte sur la première méthode.

::: important
Quelle que soit la méthode choisie, Cosma a besoin de connaître l'emplacement des données. Cette information doit être renseignée dans la configuration du projet.

Pour des fichiers texte rédigés en Markdown, sélectionnez « Fichiers Markdown », puis indiquez l'emplacement du répertoire en question. Cosma interprètera les fichiers contenus dans ce répertoire ainsi que dans les sous-répertoires éventuellement présents.
:::

Cosma ne prescrit pas l'utilisation d'un logiciel d'écriture particulier. En revanche, il interprète uniquement les fichiers texte respectant les quelques règles suivantes :

- contenu rédigé en Markdown, extension de fichier `.md` ;
- métadonnées exprimées en YAML, dans un en-tête présent en début de fichier ;
- liens internes exprimés avec une syntaxe de type wiki (doubles crochets `[[ ]]`) et basés sur des identifiants uniques (suite unique de chiffres).

Les sous-sections qui suivent expliquent ces règles en détail.

::: note
Cette combinaison de normes d'écriture correspond au croisement de plusieurs cultures textuelles : la documentation (enrichir et indexer le contenu avec des métadonnées) ; les wikis (interrelier des connaissances) ; la méthode Zettelkasten (organiser ses notes) ; l'écriture scientifique avec Pandoc (utiliser le format texte comme source pour plusieurs autres formats).

Cosma fonctionne donc particulièrement bien lorsqu'il est utilisé en tandem avec des environnements d'écriture qui adoptent également cette approche, comme [Zettlr](https://zettlr.com) ou l'extension [Foam](https://foambubble.github.io/foam/) pour Visual Studio Code et VSCodium.
:::

Vous pouvez créer un fichier conforme pour Cosma via le formulaire de l'application (cliquez sur Fichier › Nouvelle fiche ou tapez `Ctrl + N`) ou bien en passant directement par votre éditeur de texte préféré. Certains éditeurs de texte peuvent vous faire gagner du temps en vous permettant d'enregistrer des modèles de documents que vous pouvez ensuite utiliser pour créer rapidement des fiches à destination de Cosma.

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

L'en-tête YAML est délimité par deux séries de trois tirets seuls sur une ligne (`---`).

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

Il est possible d'ajouter librement d'autres métadonnées dans l'en-tête YAML. Par défaut, Cosma ignore ces métadonnées au moment de créer un cosmoscope : elles ne sont pas incluses dans le rendu HTML des fiches. Pour que ces métadonnées soient prises en compte, renseignez-les dans la configuration du projet.

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

Ces liens sont rendus au format HTML avec l'identifiant comme texte cliquable :

```html
Un lien vers <a href="#20201209111625">20201209111625</a> une fiche.
```

Vous pouvez utiliser l'option Symbole de lien, située dans la configuration du projet, pour définir un texte cliquable qui s'applique à tous les liens entre fiches. Il peut s'agir d'un unique caractère Unicode, comme → ou ☞.

```
Un lien vers [[20201209111625]] une fiche.
```

```html
Un lien vers <a href="#20201209111625">→</a> une fiche.
```

Vous pouvez également définir manuellement le texte cliquable de chaque lien.

```
Un lien vers [[20201209111625|une fiche]].
```

```html
Un lien vers <a href="#20201209111625">une fiche</a>.
```

Enfin, Cosma permet de définir des [types de liens](#types-de-liens) via la configuration du projet. Chaque type de lien est caractérisé par un nom, une couleur et un tracé. Une fois ces types créés, pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points. Ceci fonctionne également si vous définissez manuellement le texte cliquable du lien.

Exemple :

```
Dupont a été critiqué par [[opposant:20201209111625]] Smith.

Dupont a été critiqué par [[opposant:20201209111625|Smith]].
```

### Identifiants uniques

Pour être correctement interprétée par Cosma, chaque fiche doit avoir un identifiant unique. Cet identifiant sert de cible aux liens internes.

**L'identifiant doit être une suite unique de caractères.**

Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes). Nous nous inspirons ici du fonctionnement de logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) et [Zettlr](https://www.zettlr.com).

À terme, nous souhaitons permettre à l'utilisateur de définir un motif d'identifiant de son choix, à la manière de Zettlr.

::: note
De nombreux logiciels de prise de notes interreliées proposent d'établir les liens entre fichiers via leurs noms, et de gérer automatiquement la maintenance des liens lorsque les noms de fichiers sont modifiés. En choisissant plutôt d'utiliser des identifiants uniques, nous avons donné à Cosma un fonctionnement plus classique, plus strict, proche de celui du Web. Nous pensons qu'il s'agit de la manière la plus simple d'éviter les [liens morts](https://fr.wikipedia.org/wiki/Lien_mort) de façon pérenne. Le fait de ne pas recourir à une maintenance automatique des liens notamment rend les données moins dépendantes d'une solution logicielle en particulier.
:::

### Créer une fiche via Cosma

Cliquez sur Fichier › Nouvelle fiche (`Ctrl/Cmd + N`) pour ouvrir le formulaire de création de fiche de Cosma.

Le titre est obligatoire. Les autres champs sont facultatifs.

Vous pouvez assigner un ou plusieurs types à la fiche. Ils doivent être définis préalablement dans la configuration du projet.

Vous pouvez également ajouter des mots-clés à la fiche. Les mots-clés doivent être séparés par des virgules. Exemple : `mots-clé 1, mot-clé 2`. Une aide visuelle est présente dans ce champ pour confirmer que les mots-clés sont bien saisis (surlignement des mots-clés).

Cliquez sur OK pour créer la fiche.

::: note
Le nom de fichier est généré à partir du titre. Pour une meilleure interopérabilité entre les différents systèmes d'exploitation, le nom de fichier ne contient que des caractères alphanumériques non accentués et des tirets.

Exemple : une fiche intitulée « Métadonnées web sémantique » sera enregistrée comme `metadonnees-web-semantique.md`.
:::

## Créer du contenu : données tabulaires (CSV)

Cosma peut interpréter des données tabulaires contenues dans des fichiers CSV locaux ou en ligne. Les données tabulaires destinées à Cosma doivent être contenues dans deux fichiers : un pour les nœuds et un autre pour les liens. Les emplacements de ces fichiers doivent être renseignés dans la configuration.

Pour créer un projet à partir de fichiers CSV locaux, sélectionnez le type de données « Fichiers CSV (locaux) » et indiquez l'emplacement de fichiers CSV sur votre machine.

Pour créer un projet à partir de fichiers CSV en ligne, sélectionnez le type de données « Fichiers CSV (en ligne) » et indiquez les URL des fichiers CSV.

::: note
Vous pouvez générer les fichiers CSV depuis Google Sheets. Vous pouvez consulter notre tableur modèle pour vous en inspirer. Une feuille doit être consacrée aux nœuds et une autre aux liens. Cliquez sur Fichier › Partager › Publier sur le Web. Sélectionnez la feuille contenant les nœuds, puis changez le format « Page Web » en « Valeurs séparées par des virgules (.csv) ». Cliquez sur « Publier » puis copiez le lien de partage. Répétez l'opération pour la feuille contenant les liens. Collez chaque lien dans le champ correspondant au moment de créer le projet ou de le configurer.
:::

### Métadonnées (en-têtes de colonnes)

Les fichiers de données doivent contenir des en-têtes de colonnes correspondant aux métadonnées utilisées par Cosma.

#### Métadonnées pour les nœuds

Pour les nœuds, seule la métadonnée `title` (titre) est requise.

nom | description
----|------------
`title` | Titre de la fiche (requis)
`id` | Identifiant unique
`type:<nom>` | Typologie de fiches. Chaque typologie contient un ou plusieurs types. Ex : une colonne peut être appelée `type:primaire` et contenir des types comme `personne`, `œuvre`, `institution` ; une autre colonne peut être appelée `type:secondaire`, avec d'autres types. Le `<nom>` peut être choisi librement.
`tag:<nom>` | Liste de mots-clés
`meta:<nom>` | Métadonnée définie par l'utilisateur
`time:begin`, `time:end` | Métadonnées utilisées par le mode chronologique
`content` | Contenu textuel de la fiche
`thumbnail` | Nom de fichier d'une image à inclure sous forme de vignette dans la fiche. Formats pris en charge : JPG, PNG. L'emplacement des fichiers images doit être renseigné via le paramètre `images_origin` dans le fichier de configuration.
`reference` | Liste de clés de citation à inclure en bibliographie dans la fiche.

#### Métadonnées pour les liens

nom | description
----|------------
`id` | Identifiant du lien (requis)
`source` | Identifiant de la fiche d'où part le lien (requis)
`target` | Identifiant de la fiche que cible le lien (requis)
`label` | Description du lien (optionnelle). Cette description s'affiche dans les infobulles de contexte des liens/rétroliens.

## Créer un cosmoscope

Cliquez sur Nouveau cosmoscope (`Cmd/Ctrl + R`) pour lancer la génération d'un nouveau cosmoscope. Il s'affiche automatiquement dans l'interface du logiciel.

Cosma crée automatiquement un rapport d'erreurs qui décrit les problèmes éventuellement rencontrés durant la génération d'un cosmoscope. Cliquez sur Fichier › Historique (`Cmd/Ctrl + H`) et sélectionnez une entrée pour consulter le rapport d'erreurs associé.

### Traiter les citations

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

Cliquez sur Fichier › Nouveau cosmoscope avec citations (`Cmd/Ctrl + Maj + R`) pour générer un cosmoscope avec le traitement des citations activé. Le traitement des citations est également disponible lors de l'[export](#partager-un-cosmoscope).

Lors du traitement des citations, chaque clé de citation est remplacée par du texte formaté et une bibliographie est générée en-dessous du corps de chaque fiche contenant des références.

Exemple :

```
À propos de raison graphique [@goody1979, 46-52]…

Bibliographie
-------------

GOODY, Jack, 1979. La Raison graphique : la domestication de la pensée sauvage.
  Paris : Les Editions de Minuit. ISBN 978-2-7073-0240-3.
```

Les données CSL JSON correspondant aux références citées sont enregistrées dans le cosmoscope au format JSON. Vous pouvez consulter et télécharger ces données dans le cosmoscope en cliquant sur le bouton « Données » en bas du menu latéral gauche. Vous pouvez également y accéder en consultant le code source du cosmoscope au niveau de la balise `<article id="citation-references">`.

### Appliquer une CSS personnalisée

Il est possible de personnaliser l'apparence d'un cosmoscope via une feuille de styles CSS. Pour cela, renseignez son emplacement dans la configuration du projet et sélectionnez l'option CSS personnalisée au moment de générer le cosmoscope.

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

### Exclure certaines fiches du cosmoscope

Il est possible d'exclure automatiquement certaines fiches du cosmoscope au moment de sa génération. Ceci repose sur des filtres à définir dans la configuration du projet. Un filtre peut être un type, un mot-clé ou une valeur spécifique prise par une métadonnée supplémentaire (pour rappel, celle-ci doit être déclarée dans la configuration du projet). Les fiches dont l'en-tête contient au moins un élément ciblé par un filtre sont exclues au moment de générer le cosmoscope.

Pour créer un filtre, sélectionnez d'abord sa nature (type de fiche, mot-clé, ou métadonnée supplémentaire) puis indiquez la valeur à filtrer.

### Rapport d'erreurs

Si Cosma rencontre des problèmes durant la génération d'un cosmoscope, il crée un rapport d'erreurs. Vous pouvez consulter celui-ci via l'historique.

## Historique

Par défaut, Cosma exporte automatiquement chaque cosmoscope dans un répertoire `cosma-history` situé dans les répertoires temporaires du système d'exploitation.

Vous pouvez activer ou désactiver l'enregistrement automatique dans Configuration › Général.

Le cosmocope actif est toujours enregistré dans l'historique comme dernière entrée. C'est cette dernière entrée qui est affichée lors de l'ouverture du projet. Si l'enregistrement automatique des cosmoscopes est désactivé, cette dernière entrée sera simplement écrasée à chaque nouvelle génération de cosmoscope.

Cliquez sur Fichier › Historique (`Cmd/Ctrl + H`) pour consulter et gérer les entrées de l'historique à l'aide des boutons suivants :

Modifier la description
: Ajouter ou modifier le texte décrivant l'entrée d'historique.

Ouvrir dans Cosma
: Ouvrir le cosmoscope dans l'interface de Cosma.

Localiser le fichier
: Révèler le cosmoscope dans l'explorateur de fichiers du système d'exploitation.

Rapport d'erreurs
: Afficher le rapport d'erreurs créé lors de la génération du cosmoscope.

Supprimer
: Supprimer une entrée d'historique.

Vider l'historique…
: Supprimer toutes les entrées de l'historique du projet.

## Utilisation du cosmoscope

### Description générale de l'interface

Le cosmoscope est un fichier HTML. Après avoir été généré, il est affiché dans la fenêtre principale de Cosma

Le cosmoscope est organisé en trois colonnes :

Panneau latéral gauche (Menu)
: Regroupe les fonctionnalités permettant de chercher de l'information et de modifier l'affichage de manière globale.

Zone centrale (Graphe)
: Affiche le graphe et les contrôles associés (zoom, focus).

Panneau latéral droit (Fiche)
: Affiche les fiches (métadonnées et contenu) ainsi qu'une liste des liens sortants (Liens) et entrants (Rétroliens).

Vous retrouverez la même interface, les mêmes raccourcis et outils de visualisation dans un cosmoscope ouvert dans l'application Cosma que dans un export ouvert dans un navigateur web, à une différence près : les boutons permettant d'interagir avec l'application Cosma (Nouvelle fiche, Nouveau cosmoscope, etc.) ne s'affichent que dans l'application, pas dans les exports.

### Graphe

Le graphe situé dans la zone centrale de l'interface affiche des nœuds étiquetés et interreliés. Chaque nœud correspond à une fiche ; l'étiquette correspond au titre de la fiche. Les liens correspondent aux liens établis entre les fiches via leur identifiant.

Survoler un nœud le met temporairement en surbrillance, lui et ses connexions. Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

Vous pouvez zoomer librement dans le graphe à la souris, au pavé tactile, en double cliquant sur le fond du graphe ou bien avec les boutons dédiés situés en bas à gauche. Appuyez sur la touche `C` pour zoomer sur un nœud sélectionné (dont la fiche est ouverte). Le bouton Recentrer (raccourci : touche `R`) réinitialise le zoom.

Les nœuds sont organisés dans l'espace par un algorithme de simulation de forces. Une barre colorée sous le logo Cosma témoigne de l'état de la simulation (stable ou en calcul). Cliquez sur cette barre (raccourci : touche `Espace`) pour lancer un cycle de simulation supplémentaire.

::: astuce
Quelques pressions rapides sur la touche `Espace` permettent de « déplier » progressivement un graphe emmêlé.
:::

Le graphe n'est pas figé, les nœuds peuvent donc être déplacés par cliquer-glisser. Cependant, les nœuds et liens restent soumis en permanence à la simulation, donc il n'est pas possible de les disposer manuellement de manière arbitraire. Chaque modification du cosmoscope est susceptible de modifier la disposition des nœuds dans l'espace.

L'affichage du graphe peut être modifié de manière temporaire via les contrôles placés sous Paramètres du graphe dans le panneau latéral gauche. Pour modifier l'affichage de manière permanente, modifiez les valeurs par défaut des paramètres correspondants dans Préférences › Graphe.

::: astuce
Modifiez la force et la distance maximale entre les nœuds pour adapter l'affichage à la résolution et la taille de votre écran. Ajoutez une force d'attraction vers l'axe vertical/horizontal pour resserrer le graphe et ramener les nœuds isolés plus près du centre.
:::

L'affichage est possible sur tous types d'écrans mais n'est pas optimisé pour les terminaux mobiles : le tactile ne donne pas accès à certaines interactions comme le survol, et les petits écrans restreignent l'utilité du graphe.

### Fiches

Les fiches peuvent êtres ouvertes en cliquant sur un nœud, une entrée de l'index, une suggestion du moteur de recherche, ou un lien dans le corps ou le pied d'une fiche. Ouvrir une fiche affiche son contenu dans le panneau latéral droit.

Dans l'application Cosma, vous pouvez naviguer dans l'historique d'ouverture des fiches avec les boutons Précédent / Suivant situés dans le panneau latéral gauche.

Dans un navigateur web où est ouvert un cosmoscope, ouvrir une fiche met à jour l'URL de la page avec l'identifiant de la fiche : ceci permet de naviguer entre les fiches visitées via les fonctionnalités Précédent / Suivant du navigateur, mais aussi de les retrouver dans l'historique du navigateur ou encore d'obtenir un lien direct vers la fiche à partager.

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

- date de création (par défaut) ;
- date de dernière modification ;
- date de dernière ouverture ;
- identifiant, si celui-ci correspond à un horodatage (ce qui est le cas des identifiants générés par Cosma) ;
- métadonnée supplémentaire ajoutée dans la configuration, si celle-ci correspond à une date au format YYYY-MM-DD.

### Moteur de recherche

Le champ de texte situé en haut du panneau latéral gauche est un moteur de recherche qui fonctionne sur les titres de fiches. Il suggère une liste de fiches dont le titre est le plus proche de ce que vous saisissez dans la barre de recherche (*fuzzy search*). Cliquer sur une suggestion sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante dans le panneau latéral de droite.

::: important
Les suggestions disponibles sont contraintes par les [filtres](#filtrer-laffichage-par-types) et le [mode focus](#mode-focus) : une fiche masquée par l'une ou l'autre de ces fonctionnalités ne sera pas accessible via le moteur de recherche. Lorsque vous voulez repartir de zéro pour une nouvelle requête, vous pouvez cliquer sur Réinitialiser l'affichage (raccourci : `Alt` + `R`).
:::

### Filtrer l'affichage par types

La liste des types de fiches située en haut du panneau latéral gauche permet de filtrer l'affichage. Cliquer sur un type permet de masquer et réafficher les fiches du type correspondant dans le graphe, l'index et les suggestions du moteur de recherche. Cliquer sur un type en maintenant la touche `Alt` enfoncée permet de masquer et réafficher les fiches des autres types.

Pour qu'un type apparaisse, il doit être déclaré dans Préférences › Types de fiches et être attribué à au moins une fiche.

### Mots-clés

La liste des mots-clés située dans le panneau latéral gauche permet de filtrer le graphe. Sélectionner un mot-clé affiche les fiches qui contiennent ce mot-clé, dans le graphe et dans l'index. Vous pouvez activer simultanément plusieurs mots-clés. Pour désactiver un mot-clé, cliquez à nouveau sur le bouton correspondant.

Pour qu'un mot-clé apparaisse, il suffit qu'il ait été déclaré dans l'en-tête YAML d'au moins une fiche avec le champ `tags` .

### Index

L'index alphabétique des fiches situé dans le panneau latéral gauche permet d'accéder directement à une fiche sans passer par le graphe. Cliquer sur un titre sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante. L'index peut être trié par ordre alphabétique croissant ou décroissant. Les filtres, les mots-clés et le mode focus modifient l'affichage de l'index.

### Vues

Les Vues sont une fonctionnalité spécifique à la version GUI de Cosma, qui consiste à sauvegarder l'état du graphe (fiche sélectionnée, filtres actifs, mode focus) pour un accès ultérieur, via l'ajout d'un bouton dans la section Vues du panneau latéral gauche. Cliquer sur ce bouton applique tous les paramètres qui étaient actifs au moment de l'enregistrement de la vue. Cliquer à nouveau sur le bouton rétablit l'affichage normal.

::: important
Les Vues ne fonctionnent pas actuellement aussi bien que nous le voudrions, nous travaillons donc sur une amélioration de la fonctionnalité.
:::

## Partager un cosmoscope

Cliquez sur Fichier › Partager (`Cmd/Ctrl + E`) pour lancer la génération d'un cosmoscope destiné à être partagé.

Deux options sont disponibles :

Traiter les citations
: Traiter les clés de citation et ajouté la bibliographie aux fiches.

CSS personnalisé
: Appliquer les même modifications d'interface (via CSS) de l'application au cosmoscope exporté.

::: note
Si les options sont grisées, c'est que les paramètres correspondants dans Préférences ne sont pas renseignés.
:::

Les cosmoscopes exportés via le menu Partager intègrent les métadonnées (titre, auteur, description, mots-clés) éventuellement renseignées dans la configuration du projet. Elles sont affichées dans le panneau « À propos ». Elles sont également incluses dans le code source du cosmoscope sous la forme de balises `meta`, afin d'améliorer la description d'un cosmoscope destiné à être publié sur le Web.

La barre d'outils présente au sommet du menu latéral gauche ne fonctionne que dans l'application Cosma. Elle est donc masquée dans les cosmoscopes exportés via Partager. Si un titre a été renseigné dans Préférences › Métadonnées, il s'affiche à l'emplacement qu'occupe habituellement la barre d'outils.

Le fichier `cosmoscope.html` exporté peut être partagé comme n'importe quel fichier informatique : email, transfert de fichiers, messagerie, mise en ligne sur un serveur…

Si vous publiez un cosmoscope sur le Web, notez qu'il est possible de créer un lien directement vers une fiche en ajoutant son identifiant précédé d'un croisillon `#` en fin d'URL. Exemple :

`https://domaine.fr/cosmoscope.html#20210427185546`

## Configuration

Cliquez sur Configuration (`Ctrl + o` ou `Cmd + ,`) pour configurer le projet actuellement ouvert.

::: important
La majorité des options de configuration ne fonctionnent que si une source de données est renseignée au préalable.
:::

### Général

Langue
: Vous pouvez régler ici la langue du cosmoscope indépendamment de la langue de l'application.

Source des données
: Emplacement de la source des données (fichiers Markdown ou fichiers CSV). Dans le cas es nouvelles fiches créées via Cosma sont ajoutées dans ce répertoire.

Répertoire des images
: Emplacement des images utilisées dans le cosmoscope. Renseigner ce paramètre permet d'utiliser des images stockées à cet emplacement en indiquant uniquement leur chemin relatif (ex : `image.jpg`).

Métadonnées supplémentaires
: Champs YAML autres que ceux prédéfinis (titre, type, mots-clés) et à inclure dans le cosmoscope.

Enregistrer automatiquement les cosmoscopes dans l’historique
: Par défaut, Cosma exporte automatiquement chaque cosmoscope dans un répertoire `cosma-history` situé dans les répertoires temporaires du système d'exploitation. Décochez cette option pour désactiver cet export automatique.
: Le cosmocope actif est toujours enregistré dans l'historique comme dernière entrée. C'est cette dernière entrée qui est ouverte lors du lancement de l'application. Si l'enregistrement automatique des cosmoscopes est désactivé, cette dernière entrée sera simplement écrasée à chaque nouvelle génération de cosmoscope.

Symbole de lien
: Saisissez ici une chaîne de caractères Unicode arbitraire. Elle remplacera les identifiants entre les crochets dans le rendu HTML des fiches. Ceci permet d'alléger visuellement le texte de vos fiches en remplaçant les longs identifiants numériques par une convention personnelle (par exemple une petite manicule : ☞).

### Types de fiches

Cette section permet de définir différents types de fiches. Pour chaque type de fiche, renseignez un nom, une couleur de fond et une couleur de bordure. Cette dernière du contour du type de nœud (utilisée lorsque le nœud est rempli par une image.

Une fiche peut avoir un ou plusieurs types. Si le champ `type` n'est pas spécifié, ou bien que sa valeur ne correspond aux types enregistrés dans la configuration, Cosma interprètera le type de la fiche comme non défini (« undefined »).

::: important
Le type « undefined » peut être modifié (par exemple pour en changer la couleur) mais il ne peut pas être supprimé.
:::

### Types de liens

Cette section permet de définir différent types de liens. Pour chaque type de lien, renseignez un nom, une couleur et un tracé. Les tracés disponibles sont :

- continu (*simple*)
- double (*double*)
- tirets (*dash*)
- pointillés (*dotted*)

Pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points.

::: important
Le type « undefined » peut être modifié (par exemple pour en changer la couleur) mais il ne peut pas être supprimé.
:::

::: astuce
Le paramétrage visuel des liens a une incidence sur leur lisibilité au sein du graphe. Par exemple, si vous définissez les liens non qualifiés (`undefined`) en pointillés (`dotted`) gris (`grey`) et un type de lien spécial en trait continu (`simple`) noir (`black`), les liens spéciaux seront plus visibles dans le graphe.
:::

### Graphe

Les paramètres du graphe peuvent être modifiés en direct dans le cosmoscope. Vous pouvez ainsi tester différentes valeurs avant de les reporter dans la configuration. Ce sont les valeurs définies dans la configuration qui sont rétablies à chaque rechargement du cosmoscope, et chaque nouvelle génération d'un cosmoscope.

Couleur de fond
: La couleur de fond du graphe.

Couleur de surbrillance
: La couleur qui s'applique aux nœuds ainsi qu'aux liens lors du survol et de la sélection.

::: note
Les deux paramètres de couleur ci-dessus sont accessibles via l'interface car ils sont susceptibles d'être modifiés par de nombreux utilisateurs. Mais toutes les couleurs de l'interface peuvent être modifiées via une feuille de style CSS personnalisée (voir Configuration › Avancé).
:::

Taille du texte des étiquettes
: Définit la taille du texte des étiquettes des nœuds du graphe, c'est-à-dire la place que prend le titre de chaque fiche sous le nœud correspondant. L'unité implicite est le pixel. Les valeurs possibles sont comprises entre 2 et 15.

Niveau maximum de focus
: Le mode focus restreint l'affichage au nœud sélectionné et à ses connexions directes (1 nœud de distance). Il est possible de faire varier la distance d'affichage du mode focus : passer à 2 affiche les connexions jusqu'à 2 nœuds de distance ; passer à 3 étend l'affichage à 3 nœuds de distance ; etc. La valeur indiquée dans Niveau maximum de focus définit le seuil maximum pour cette fonctionnalité. Une valeur élevée consomme plus de ressources à l'affichage.

Afficher des flèches sur les liens
: Permet d'obtenir un graphe orienté ou non orienté.

#### Spatialisation

Force d'attraction
: Correspond à la puissance globale de l'attraction simulée. Plus la valeur est faible, plus les liens entre les nœuds sont relâchés.

Distance maximum entre les nœuds
: Correspond au seuil maximal de répulsion entre les nœuds, quelle que soit la force. Au-delà d'une valeur de 1000, ce paramètre n'a pas d'effet mesurable.

Attraction verticale/horizontale
: Force d'attraction vers l'axe vertical/horizontal, de 0 à 1. Une valeur de 0 signifie que le paramètre est désactivé. Appliquer une force verticale/horizontale resserre le graphe et permet de ramener plus près du centre les nœuds isolés.

### Métadonnées

Vous pouvez définir des métadonnées globales pour le projet :

- titre
- auteur
- mots-clés
- description

Les cosmoscopes exportés via le menu Partager intègrent ces métadonnées si elles sont renseignées. Le titre vient remplacer les boutons situés en haut à gauche du menu, et qui ne s'affichent que dans l'application. Les métadonnées sont affichées dans le panneau « À propos ». Elles sont également incluses dans le code source du cosmoscope sous la forme de balises `meta`.

### Bibliographie

Indiquez ici les chemins des fichiers de données, style et localisation bibliographique. Les trois fichiers sont requis pour le traitement des citations.

Données bibliographiques
: Fichier contenant les métadonnées décrivant des références bibliographiques. Le format requis est CSL JSON (extension `.json`).

Style bibliographique
: Fichier contenant les règles de mise en forme des citations et bibliographies. Le format requis est CSL (extension `.csl`). Vous pouvez télécharger des fichiers de style depuis le [répertoire de styles CSL de Zotero](https://www.zotero.org/styles).

Localisation bibliographique
: Fichier contenant les traductions dans une certaine langue des termes employés en bibliographie (ex : éditeur, numéro…). Le format requis est XML (extension `.xml`). Vous pouvez télécharger des fichiers de localisation depuis le [dépôt GitHub du projet CSL](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

### Vues

Gérez ici les [vues](#vues) enregistrées dans le cosmoscope.

### Filtrage des fiches

Cette section permet de créer des filtres pour exclure des fiches lors de la création d'un cosmoscope. Pour chaque filtre, indiquez la nature du critère d'exclusion (type, mot-clé, ou métadonnée supplémentaire) et la valeur à filtrer.

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

Cette fiche pourrait être exclue lors de la génération du cosmoscope via différents filtres :

- un filtrage par type sur la valeur « personne » ;
- un filtrage par mot-clé sur les valeurs « documentation » ou « pacifisme » ;
- un filtrage par la métadonnée « groupe » (si vous l'avez déclarée dans Configuration › Général › Métadonnées supplémentaires) sur la valeur « auteurs ».

### Avancé

CSS personnalisée
: Indiquez ici le chemin d'un fichier CSS pour personnaliser l'interface du cosmocope. Il est nécessaire de re-générer un cosmoscope pour que la CSS personnalisée soit prise en compte.

::: astuce
Pour connaître les sélecteurs à utiliser pour telle ou telle déclaration, vous pouvez :

- cliquer sur Affichage › Outils de développement (nécessite d'avoir activé Afficher les outils de développement) ;
- ouvrir le cosmoscope dans un navigateur web et utiliser les outils de développement du navigateur ;
- consulter le code source de Cosma, spécifiquement `/cosma-core/template.njk` (pour connaître la structure HTML du cosmoscope), `/cosma-core/styles.css` et `/cosma-core/print.css` (pour les styles d'impression activés lors de l'impression d'une fiche).

Les feuilles de style du cosmoscope utilisent notamment des variables CSS pour définir les couleurs et les polices utilisées. Vous pouvez redéfinir uniquement ces variables pour modifier tous les éléments d'interface auxquels elles s'appliquent. Dans l'exemple ci-dessous, le fichier `custom.css` contient des déclarations qui modifient les polices utilisées dans le cosmoscope :

```css
:root {
  --sans: "IBM Plex Sans", sans-serif;
  --serif: "IBM Plex Serif", serif;
  --mono: "IBM Plex Mono", monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```
:::

Afficher les outils de développement
: Cette option permet d'afficher les outils de développement du logiciel depuis Affichage › Outils de développement. Cliquez sur Afficher l'inspecteur web pour inspecter le code de l'interface de Cosma.

## Crédits

### Équipe

- [Arthur Perret](https://www.arthurperret.fr/) (porteur du projet)
- [Guillaume Brioudes](https://myllaume.fr/) (développeur)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (chercheur)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (chercheur)

Ont également contribué au développement de Cosma :

- [David Pucheu](https://mica.u-bordeaux-montaigne.fr/pucheu-david/) (chercheur)

### Bibliothèques utilisées

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement a recouru aux bibliothèques suivantes :

- [D3.js](https://d3js.org/) v4.13.0 (BSD 3-Clause) : Génération du graphe
- [Nunjucks](https://mozilla.github.io/nunjucks/) v3.2.3 (BSD 2-Clause) : Génération du template du cosmoscope
- [Js-yaml](https://github.com/nodeca/js-yaml) v4.1.0 (MIT License) : Lecture du fichier de configuration et écriture de l'en-tête YAML
- [Js-yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter) v4.1.1 (MIT License) : Lecture de l'en-tête YAML des fichiers Markdown
- [Markdown-it](https://github.com/markdown-it/markdown-it) v12.3.0 (MIT License) : Conversion Markdown → HTML
- [Markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) v4.0.0  (MIT License) : Traitement des hyperliens Markdown au sein des fiches
- [Citeproc-js](https://github.com/Juris-M/citeproc-js) v2.4.62 (CPAL et AGPL) : Conversion des clés de citation
- [Fuse.js](https://fusejs.io/) v6.4.6 (Apache License 2.0) : Moteur de recherche

## Changelog

### v2-beta-2

Ce patch corrige les problèmes suivants avec le mode Chronologique dans la v2.0-beta-1 :

- Interagir avec la frise chronologique n'avait aucun effet. Elle fonctionne maintenant comme attendu.
- Les métadonnées `begin` et `end` des fiches étaient ignorées. Elles fonctionnent maintenant comme attendu aussi.

### v2-beta-1

Ceci est la première bêta de Cosma GUI v2. Elle comprend trois changements majeurs :

1. Cosma s'imprègne de l'esprit de l'[Otletosphere](https://hyperotlet.huma-num.fr/otletosphere/) : en plus de fichiers Markdown, les cosmoscopes peuvent désormais être créés à partir de données tabulaires, et nous avons ajouté de nouvelles options graphiques telles que régler les nœuds sur une taille fixe, et utiliser des images comme vignettes/portraits sur les nœuds et dans les fiches.
2. Les projets ! Cosma est maintenant capable de gérer plusieurs projets, chacun correspondant à une source de données.
3. Le mode chronologique est un nouveau filtre d'affichage basé sur des métadonnées temporelles. C'est un curseur qui permet de faire apparaître et disparaître les nœuds en fonction des métadonnées `begin` et `end`. *Work-in-progress*.

#### Ajouts

- Gérer plusieurs projets
- Utiliser une syntaxe alternative pour les liens
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
- Le rapport d'erreurs et d'avertissements est plus informatif
- Les mots-clés au sommet des fiches dans le cosmoscope ne débordent plus de la mise en page
- Cosma lit désormais les répertoires de fiches de manière récursive (ticket [#4](https://github.com/graphlab-fr/cosma/issues/4))

#### Bugs résolus

- Les infobulles de contexte des liens/rétroliens mettent correctement en évidence la fiche cible (ticket [#23](https://github.com/graphlab-fr/cosma/issues/23))
- Les espaces dans les noms de fichiers générés par Cosma sont correctement remplacés par des tirets

#### Bugs connus

- Le traitement des citations échoue parfois dans les infobulles de contexte des rétroliens

### v1.2

Cette mise à jour ajoute quelques fonctionnalités de lecture et d'écriture des fiches :

- Le répertoire de fiches est désormais lu de manière récursive. Ceci permet de prendre en compte toutes les fiches, quel que soit leur emplacement dans une éventuelle structure de sous-répertoires.
- Les éléments HTML insérés dans le corps des fiches sont désormais reconnus et interprétés.

Des bugs ont également été résolus :

- Les infobulles de contexte ne sont plus vides lorsque le lien est qualifié (ticket #15).
- Le fonctionnement des vues enregistrées est rétabli (ticket #16).
- Le réglage de l'attraction verticale et horizontale n'est plus inversé (ticket #18).

### v1.1

Cette mise à jour ajoute la possibilité de changer de langue (anglais ou français), résout des bugs et améliore l'interface, notamment au niveau de la configuration.

- L'application est traduite en anglais, il est possible de changer de langue dans Préférences.
- Créer une fiche sans spécifier de répertoire ne cause plus d'erreur mais renvoie un message informatif (ticket #6).
- Créer une fiche avec un titre déjà utilisé n'écrase plus silencieusement la fiche existante mais demande une confirmation (ticket #5).
- Il est possible d'utiliser `keywords` au lieu de `tags` dans l'en-tête YAML des fiches (ticket #3).
- Il n'est plus nécessaire de déclarer un type de fiche dans la configuration avant de pouvoir l'assigner à une nouvelle fiche.
- La fenêtre Préférences a été réorganisée en sections.
- La lisibilité des rapports d'erreur a été améliorée.
- L'option `minify` permettant de réduire la taille des exports, non fonctionnelle en v1.0, a été supprimée.
- L'application est distribuée avec sa documentation, accessible via Aide › Manuel ou bien en cliquant sur le bouton Aide en bas à gauche dans le cosmoscope.
- Le code source a été réorganisé pour permettre le développement simultané d'une version exécutable en ligne de commande ([cosma-cli](https://github.com/graphlab-fr/cosma-cli)) à partir de la même base de code ([cosma-core](https://github.com/graphlab-fr/cosma-core)).
- Mise à jour de Electron v13 vers v15.

