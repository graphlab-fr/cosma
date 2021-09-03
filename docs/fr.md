---
title: Documentation de Cosma
author:
- Guillaume Brioudes <https://myllaume.fr/>
- Arthur Perret <https://www.arthurperret.fr/>
date: 2021-08-31
lang: fr-FR
---

::: sommaire
#. [Présentation](#presentation)
#. [Installation](#installation)
#. [Configuration](#configuration)
#. [Utilisation du cosmographe](#utilisation-du-cosmographe)
#. [Utilisation du cosmoscope](#utilisation-du-cosmoscope)
#. [Développement](#developpement)
#. [Crédits](#credits)
:::

# Présentation

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web. Le logiciel est conçu pour fonctionner avec des fichiers texte en Markdown et s’adapte aussi bien à une petite collection (centaine de documents) qu’à une vaste documentation (jusqu'à plusieurs milliers de documents).

Cosma est développé dans le cadre du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/).

[![L'interface de Cosma](https://hyperotlet.huma-num.fr/cosma/img/cosma-main-screenshot.png)](https://hyperotlet.huma-num.fr/cosma/img/cosma-main-screenshot.png)

## Spécificités de Cosma

Dans le vaste champ des outils qui servent à penser (*tools for thought*), Cosma se démarque par **trois originalités** :

D'abord, **Cosma n'est pas lui-même un logiciel de prise de notes**. Il est pensé pour fonctionner en complémentarité avec ces logiciels. Nous nous sommes inspirés ici du fonctionnement de logiciels comme [Deckset](https://www.deckset.com), qui applique ce principe aux présentations.

Ensuite, **Cosma repose sur des normes d'écriture interopérables, ouvertes et standardisées**. Ceci accroît la pérennité des données, facilite l'utilisation combinée avec des outils qui partagent ces normes (comme [Zettlr](https://www.zettlr.com)), tout en laissant la possibilité de changer d'outil à tout moment.

Enfin, **Cosma permet de partager simultanément les données et les outils pour les explorer**. La plupart des outils de visualisation concentrent leurs fonctionnalités dans une application à interface graphique, à partir de laquelle il est possible d'exporter des données structurées ou des images statiques. Cosma inverse cette logique : l'application installée, surnommée **cosmographe**, est un simple outil de création et d'affichage qui accueille un fichier HTML surnommé **cosmoscope** ; c'est ce dernier qui constitue la véritable interface de visualisation, avec un graphe interactif, des outils de navigation interne (index, moteur de recherche, filtres) et le texte intégral des fiches. Or il s'agit d'un fichier autonome, qui inclut aussi les données sources au format JSON et peut être utilisé hors connexion. Ainsi dans Cosma, l'export est aussi puissant que l'application : **en partageant un cosmoscope vous ne transmettez pas seulement des données mais des capacités heuristiques**.

[![Le cosmoscope au cœur de Cosma est un fichier HTML autonome](https://hyperotlet.huma-num.fr/cosma/img/cosma-cosmoscope-html.png)](https://hyperotlet.huma-num.fr/cosma/img/cosma-cosmoscope-html.png)

## Un degré élevé de contrôle utilisateur

Cosma est conçu pour laisser un degré élevé de contrôle à ses utilisateurs.

Premièrement, le logiciel fonctionne avec un répertoire de fichiers au format texte qu'il se contente de lire : utiliser ou désinstaller le logiciel n'altérera pas vos fichiers et vous permet donc de mettre en œuvre les pratiques de stockage, de versionnement et d'édition de votre choix. De cette manière, **si le logiciel s'envole les données restent**.

Deuxièmement, **de nombreux éléments d'interface sont personnalisables** : algorithme de dessin de réseau, couleurs des nœuds, tracé des liens, raccourcis vers des vues particulières, etc.

Troisièmement, **des enrichissements documentaires (métadonnées) et sémantiques (qualification des liens) sont possibles** et se font par des mécanismes génériques : l'utilisateur est libre d'appliquer les typologies et ontologies de son choix.

Quatrièmement, Cosma est un logiciel modulaire, interopérable et portable mais surtout, **c'est un logiciel libre** : le code est public, son développement est documenté, il est accessible et réutilisable gratuitement sous licence MIT. Le travail peut ainsi être évalué, archivé et continué par d'autres.

## Un logiciel expérimental

Enfin, Cosma est un logiciel expérimental, développé dans le cadre d'une démarche de recherche-conception.

L'idée de Cosma est née dans le cadre d'une recherche doctorale conduite par Arthur Perret sous la direction d'Olivier Le Deuff. Ce logiciel reste donc un travail expérimental, son utilisation est soumise à caution et aucune garantie de suivi ou de maintenance ne peut être donnée à ce jour.

Néanmoins, des efforts importants ont été entrepris dès le prototype pour concevoir soigneusement les différents aspects de l'outil, qu'il s'agisse de la visualisation de données ou de l'interaction humain-machine, notamment grâce à la participation de chercheurs spécialistes de ces domaines. Et Cosma est au cœur d'une dynamique de recherche que nous espérons inscrire dans la durée.

La version actuelle de Cosma est encore en bêta. Elle sera citable via DOI prochainement.

La première version de Cosma, rétroactivement libellée alpha, est archivée sur Zenodo. Elle peut être citée dans une bibliographie de la manière suivante :

> Arthur Perret, Guillaume Brioudes, Clément Borel, & Olivier Le Deuff. (2021). Cosma (alpha). Zenodo. <https://doi.org/10.5281/zenodo.4734377>


# Installation

Cosma est disponible pour macOS et Windows. [Visitez la page Releases pour obtenir la dernière version du logiciel.](https://github.com/graphlab-fr/cosma/releases/latest) L'application n'est pas signée avec un certificat de sécurité, vous devez disposer des privilèges administrateurs sur votre session pour pouvoir l'exécuter.

Sur macOS
: Téléchargez puis décompressez le fichier `Cosma.app.zip` et placez le le fichier `Cosma.app` dans `~/Applications`. Au premier lancement, faites clic droit › Ouvrir sur l'application pour l'exécuter.

Sur Windows
: Téléchargez puis décompressez le fichier `Cosma-win32-x64`, renommez le dossier « Cosma » et placez-le dans `C:\Programmes` ou `C:\Programmes (86)`.

::: important
Pour créer du contenu dans Cosma, il faut d'abord indiquer un répertoire dans Préférences › Répertoire de fiches. Le répertoire peut être vide ou contenir des fiches.
:::

::: astuce
Sur la page Releases du dépôt GitHub, téléchargez et décompressez le fichier `cosma-fiches-aide.zip` pour obtenir un répertoire `cosma-fiches-aide` contenant une documentation utilisateur sous forme de fiches. Ceci vous permet de tester le logiciel : au premier lancement de Cosma, indiquez le chemin du répertoire `cosma-fiches-aides` dans Préférences › Répertoire de fiches.
:::

# Créer du contenu

## Créer une fiche

Cliquez sur Nouvelle fiche pour ouvrir le formulaire de création de fiche de Cosma.

Le titre est obligatoire. Vous pouvez aussi assigner un type à la fiche, à définir préalablement dans la configuration. Vous pouvez également ajouter des mots-clés arbitraires à la fiche, en les séparant par des virgules.

Cliquez sur OK crée une fiche dans le répertoire indiqué dans Préférences › Répertoire des fiches (ou dans le répertoire par défaut si aucun répertoire n'a été renseigné).

## Format de données

Cosma ne prescrit pas l'utilisation d'un logiciel d'écriture particulier. En revanche, créer du contenu pour Cosma passe par l'utilisation du format texte <!-- Quelles extensions sont acceptées par Cosma ? juste .md ou bien aussi .txt et d'autres ? --> et la mise en pratique de plusieurs normes d'écriture :

- YAML pour les métadonnées inscrites au début des fichiers ;
- Markdown pour le reste du contenu des fichiers ;
- une syntaxe de type wiki (doubles crochets `[[ ]]`) pour créer des liens internes ;
- des identifiants uniques qui servent de cible aux liens internes.

Cette combinaison de normes d'écriture correspond au croisement de plusieurs cultures textuelles : la documentation (enrichir et indexer le contenu avec des métadonnées) ; les wikis (interrelier des connaissances) ; la méthode Zettelkasten (organiser ses notes) ; l'écriture académique avec Pandoc (utiliser le format texte comme source pour plusieurs autres formats). Cosma fonctionne donc particulièrement bien lorsqu'il est utilisé en tandem avec des environnements d'écriture qui adoptent également cette approche, comme [Zettlr](https://zettlr.com) ou l'extension [Foam](https://foambubble.github.io/foam/) pour Visual Studio Code et VSCodium.

Vous pouvez créer un fichier conforme pour Cosma via le formulaire de l'application (cliquez sur Fichier › Nouvelle fiche) ou bien en passant directement par votre éditeur de texte préféré. Certains éditeurs de texte peuvent vous faire gagner du temps en vous permettant d'enregistrer des modèles de documents, ce que vous pouvez utiliser pour créer rapidement des fiches à destination de Cosma.

### Métadonnées

Pour être correctement interprétés par Cosma, les fichiers Markdown doivent respecter une certaine structure, et notamment la présence d'un en-tête en [YAML](http://yaml.org) au début du fichier.

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

::: note
Certains logiciels établissent une série de présupposés qui servent à identifier les métadonnées d'un fichier de manière **heuristique**. Par exemple, si la première ligne du fichier est un titre de niveau 1, alors il s'agit du titre du fichier ; si la seconde ligne contient des mots préfixés par un croisillon `#`, alors il s'agit de mots-clés.

L'inconvénient de ce fonctionnement est qu'il n'est pas interopérable : chaque logiciel a ses propres conventions, ce qui limite la capacité de l'utilisateur à changer d'outil.

Utiliser un en-tête en YAML permet de déclarer des métadonnées comme le titre et l'identifiant unique d'une fiche de manière **explicite**. Ceci présente l'avantage de rendre triviale la détection et la manipulation de ces métadonnées, aussi bien par une machine que par un humain. L'utilisation d'un format commun (comme YAML) augmente le nombre d'outils compatibles avec un même ensemble de fichiers. Et des outils informatiques très répandus comme les expressions régulières et les scripts *shell* permettent aux utilisateurs de convertir eux-mêmes leurs données de manière relativement simple si besoin.
:::

### Contenu

Cosma interprète les fichiers comme étant rédigés en Markdown (syntaxe originelle, pas de variante). <!-- confirmer ? -->

[Référence et tutoriel Markdown](https://www.arthurperret.fr/tutomd/)

Le rendu des fichiers Markdown sous forme de fiche HTML dans le cosmoscope est limité aux éléments textuels. Les images par exemple ne sont pas incluses et seront remplacées par leur texte alternatif le cas échéant. <!-- Peut-on mettre du code svg inline ? -->

### Liens

À l'intérieur des fiches, vous pouvez créer des liens avec l'identifiant de la fiche cible entre double crochets. Cosma reconnaît ces liens et les utilise pour modéliser le graphe des fiches.

Exemple :

```
Un lien vers [[20201209111625]] une fiche.
```

Vous pouvez également paramétrer Cosma avec des types de liens ayant une couleur et un type de trait particuliers (voir [Configuration](#configuration)). Pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points.

Exemple :

```
Le concept B dérive du [[générique:20201209111625]] concept A.

La personne D a écrit contre [[opposant:20201209111625]] la personne C.
```

::: astuce
Cosma inclut également une option pour personnaliser l'apparence des liens dans le texte des fiches. Dans Préférences › Symbole de lien, entrez n'importe quelle chaîne de caractères Unicode qui remplacera l'identifiant entre les crochets dans le rendu HTML des fiches.
:::

### Identifiants uniques

De nombreux logiciels de prise de notes interreliées proposent d'établir les liens entre fichiers via leurs noms, et de gérer automatiquement la maintenance des liens lorsque les noms de fichiers sont modifiés.

Cosma adopte un fonctionnement plus classique, proche de celui du Web. Chaque fiche possède un identifiant unique qui sert de cible aux liens. Par ailleurs Cosma n'intervient pas sur le contenu des fiches après leur création : il n'y a pas de maintenance automatique des liens susceptible de dysfonctionner. Ceci diminue le risque de [lien mort](https://fr.wikipedia.org/wiki/Lien_mort) quel que soit le devenir des données.

Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com).

::: astuce
L'inconvénient d'un lien basé sur un identifiant unique, c'est qu'il peut gêner la lecture du contenu, notamment lorsque l'identifiant est une longue série de chiffres. Utilisez Préférences › Symbole de lien pour alléger visuellement le texte de vos fiches en remplaçant les identifiants par une convention personnelle (par exemple une petite manicule : ☞).
:::

### Citations et bibliographies

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

# Créer un cosmoscope

Cliquez sur Nouveau cosmoscope (raccourci : `Cmd`/`Ctrl` + `R`) pour lancer la génération d'un nouveau cosmoscope.

Cliquez sur Nouveau cosmoscope avec citations (raccourci : `Maj` + `Cmd`/`Ctrl` + `R`) pour lancer la génération d'un nouveau cosmoscope en activant le traitement des citations. Ceci nécessite de renseigner au moins un fichier de données bibliographiques dans Préférences › [Paramètres facultatifs](#parametres-facultatifs).

Cosma crée automatiquement un rapport d'erreurs qui décrit les problèmes éventuellement rencontrés durant la génération d'un cosmoscope. Les erreurs peuvent être de deux types :

- des données empêchent le traitement d'un fichier (titre manquant, identifiant non unique) ;
- des données sont inconnues (type de fiche ou de lien non reconnu, lien vers un identifiant non reconnu).

Cliquez sur Afficher l'historique pour consulter les rapports d'erreurs associés à chaque cosmoscope généré.

# Historique

Par défaut, Cosma exporte automatiquement chaque cosmoscope dans un sous-répertoire horodaté du répertoire temporaire défini par le système d'exploitation. Cliquez sur Préférences › Enregistrer automatiquement les cosmoscopes dans l'historique pour activer ou désactiver l'enregistrement automatique.

Cliquez sur Afficher l'historique pour consulter et gérer les entrées de l'historique.

Dans le panneau Historique, cliquez sur une entrée pour la sélectionner puis cliquez sur l'un des boutons situés sur la droite pour effectuer l'action correspondante sur l'entrée sélectionnée.

Ajouter la version actuelle à l'historique
: Permet d'ajouter manuellement le cosmoscope actuel à l'historique lorsque l'enregistrement automatique est désactivé.

Modifier
: Permet de modifier la description.

Ouvrir dans Cosma
: Ouvre le cosmoscope dans Cosma.

Localiser le fichier
: Révèle le cosmoscope dans l'explorateur de fichier du système d'exploitation.

Rapport d'erreurs
: Affiche le rapport d'erreurs créé lors de la génération du cosmoscope.

Supprimer
: Vous pouvez supprimer les entrées d'historique une par une, ou bien supprimer tout l'historique.

# Utilisation du cosmoscope

## Description générale de l'interface

L'interface de Cosma est organisée en trois colonnes :

Panneau latéral gauche (Menu)
: Regroupe les fonctionnalités permettant de chercher de l'information et de modifier l'affichage de manière globale.

Zone centrale (Graphe)
: Affiche le graphe et les contrôles associés (zoom, focus).

Panneau latéral droit (Fiche)
: Affiche les fiches (métadonnées et contenu) ainsi qu'une liste des liens sortants (Liens) et entrants (Rétroliens).

<!-- [![Interface de Cosma (cliquez sur l'image pour l'afficher en grand)](https://hyperotlet.huma-num.fr/cosma/img/cosma-interface-schema.png)](https://hyperotlet.huma-num.fr/cosma/img/cosma-interface-schema.png)

Refaire ce schéma annoté avec les nouvelles captures d'écran
-->

## Graphe

Le graphe située dans la zone centrale de l'interface affiche des nœuds étiquetés et interreliés. Chaque nœud correspond à une fiche ; l'étiquette correspond au titre de la fiche. Les liens correspondent aux liens établis entre les fiches via leur identifiant entre doubles crochets.

Survoler un nœud le met temporairement en surbrillance lui et ses connexions. Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

Vous pouvez zoomer librement dans le graphe à la souris, au pavé tactile, en double cliquant sur le fond du graphe ou bien avec les boutons dédiés situés en bas à gauche. Appuyez sur la touche `C` pour zoomer sur un nœud sélectionné. Le bouton Recentrer (raccourci : touche `R`) réinitialise le zoom.

Les nœuds sont organisés dans l'espace par un algorithme de simulation de forces. Une barre colorée sous le logo Cosma témoigne de l'état de la simulation. Cliquez dessus (raccourci : touche `Espace`) pour lancer un cycle de simulation supplémentaire.

::: astuce
Quelques pressions sur la touche `Espace` permettent de « déplier » progressivement un graphe emmêlé.
:::

Le graphe n'est pas figé, les nœuds peuvent donc être déplacés par cliquer-glisser. Ils restent soumis en permanence à la simulation, donc il n'est pas possible de les disposer manuellement de manière arbitraire.

L'affichage du graphe peut être modifié de manière temporaire via les contrôles placés sous Paramètres du graphe dans le panneau latéral gauche. Pour modifier l'affichage de manière permanente, modifiez les valeurs par défaut des paramètres correspondants dans Préférences › [Paramètres du graphe](#parametres-du-graphe).

::: astuce
Modifiez la force et la distance maximale entre les nœuds pour adapter l'affichage à la résolution et la taille de votre écran. Ajoutez une force d'attraction vers l'axe vertical/horizontal pour resserrer le graphe et ramener les nœuds isolés plus près du centre.
:::

L'affichage est possible sur tous types d'écrans mais n'est pas optimisé pour les terminaux mobiles : le tactile ne donne pas accès à certaines interactions comme le survol, et les petits écrans restreignent l'utilité du graphe.

## Fiches

Les fiches peuvent êtres ouvertes en cliquant sur un nœud, une entrée de l'index, une suggestion du moteur de recherche, ou un lien dans le corps d'une fiche. Ouvrir une fiche affiche son contenu dans le panneau latéral droit. Dans un navigateur, cela met aussi à jour l'URL de la page avec l'identifiant de la fiche : ceci permet de naviguer entre les fiches visitées via les fonctionnalités Précédent / Suivant du navigateur, mais aussi de les retrouver dans l'historique ou encore d'obtenir un lien direct vers la fiche. Par rapport à un navigateur, Cosma inclut seulement la navigation via les boutons Précédent / Suivant (ainsi que les raccourcis correspondants qui utilisent les flèches du clavier).

Cliquer sur le bouton « Fermer » referme le volet et désélectionne le nœud correspondant dans le graphe.

Les liens présents dans les fiches sont cliquables. Vous pouvez ouvrir ces liens dans un nouvel onglet via un clic droit. Le titre du lien (affiché en infobulle après 1-2 secondes de survol) est celui de la fiche correspondante.

::: astuce
Cliquez sur Préférences › Symbole de lien pour saisir une chaîne de caractères Unicode arbitraire qui remplacera l'identifiant entre les crochets dans le rendu HTML des fiches. Ceci permet d'alléger visuellement le texte de vos fiches en remplaçant les longs identifiants numériques par une convention personnelle (par exemple une petite manicule : ☞)
:::

En bas de la fiche se trouve une liste des fiches vers lesquelles elle renvoie (liens sortants), ainsi que des fiches qui pointent vers elles (liens entrants ou rétroliens). Les liens et rétroliens sont contextualisés : au survol, une infobulle s'affiche, montrant le paragraphe dans lequel ce lien se trouve dans la fiche correspondante.

## Mode focus

Le bouton Activer le focus (raccourci : touche `F`) situé en bas à gauche du graphe permet de restreindre l'affichage au nœud sélectionné : en mode focus, seules les connexions directes à la fiche sélectionnée sont affichées dans l'interface. Le mode focus ne fonctionne que si vous avez sélectionné une fiche.

Une fois le mode focus activé, vous zoomez automatiquement sur le nœud sélectionné.

Le curseur qui apparaît sous le bouton Activer le focus permet de faire varier la distance d'affichage, jusqu'au maximum indiqué dans Préférences › Niveau maximum de focus.

::: astuce
Le curseur du niveau de focus est contrôlable via les flèches du clavier. Vous pouvez enchaîner les raccourcis : `F` pour activer le focus, puis les flèches pour augmenter le niveau de focus.
:::

## Moteur de recherche

Le champ de texte situé en haut du panneau latéral gauche est un moteur de recherche qui fonctionne sur les titres de fiches. Il suggère une liste de fiches dont le titre est le plus proche de ce que vous saisissez dans la barre de recherche (*fuzzy search*). Cliquer sur une suggestion sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante dans le panneau latéral de droite.

::: important
Les suggestions disponibles sont contraintes par les [filtres](#filtrer-laffichage-par-types) et le [mode focus](#mode-focus) : une fiche masquée par l'une l'autre de ces fonctionnalités ne sera pas accessible via le moteur de recherche. Lorsque vous voulez repartir de zéro pour une nouvelle requête, vous pouvez cliquer sur Réinitialiser l'affichage (raccourci : `Alt` + `R`).
:::

## Filtrer l'affichage par types

La liste des types de fiches située en haut du panneau latéral gauche permet de filtrer l'affichage. Cliquer sur un type permet de masquer et réafficher les fiches du type correspondant dans le graphe, l'index et les suggestions du moteur de recherche. Cliquer sur un type en maintenant la touche `Alt` enfoncée permet de masquer et réafficher les fiches des autres types.

Pour qu'un type apparaisse, il doit être déclaré dans Préférences › Types de fiches et être attribué à au moins une fiche.

## Mots-clés

La liste des mots-clés située dans le panneau latéral gauche permet de mettre en évidence les fiches qui utilisent chaque mot-clé. Sélectionner un mot-clé met en surbrillance l'étiquette des nœuds correspondants dans le graphe et restreint l'index aux fiches correspondantes. Vous pouvez activer simultanément plusieurs mots-clés. Pour désactiver un mot-clé, cliquez à nouveau sur le bouton correspondant.

Pour qu'un mot-clé apparaisse, il suffit qu'il ait été déclaré dans au moins une fiche via le champ `tags`.

## Index

L'index alphabétique des fiches situé dans le panneau latéral gauche permet d'accéder directement à une fiche sans passer par le graphe. Cliquer sur un titre sélectionne le nœud correspondant dans le graphe et ouvre la fiche correspondante. L'index peut être trié par ordre alphabétique croissant ou décroissant. Les filtres, les mots-clés et le mode focus modifient l'affichage de l'index.

## Vues

À tout moment, l'état du graphe (fiche sélectionnée, filtres actifs, mode focus) peut être sauvegardé pour un accès rapide. Ceci fonctionne comme un marque-page. Cliquez sur le bouton Sauvegarder la vue et indiquez un nom. Ceci ajoute un bouton éponyme dans la section Vues du panneau latéral gauche. Cliquer sur ce bouton applique tous les paramètres qui étaient actifs au moment de l'enregistrement de la vue. Cliquer à nouveau sur le bouton rétablit l'affichage normal.

# Partager un cosmoscope

Cliquez sur Partager pour lancer la génération d'un cosmoscope destiné à être partagé. Cochez Traiter les citations pour activer le traitement des citations.

Le volet À propos du cosmoscope intègre automatiquement les métadonnées (titre, auteur, description, mots-clés) éventuellement renseignées dans Préférences › [Paramètres facultatifs](#parametres-facultatifs).

La barre d'outils présente au sommet du menu latéral gauche ne fonctionne que dans l'application Cosma. Elle est donc masquée dans les cosmoscopes exportés via Partager. Si un titre a été renseigné dans Préférences › Métadonnées, il s'affiche à l'emplacement qu'occupe habituellement la barre d'outils.

Le fichier `cosmoscope.html` peut être partagé comme n'importe quel fichier informatique : email, transfert de fichiers, messagerie, mise en ligne sur un serveur…

Vous pouvez envoyer un lien vers une fiche en particulier en ajoutant son identifiant précédé d'un croisillon `#` en fin d'URL. Exemple :

`https://domaine.fr/cosmoscope.html#20210427185546`

# Configuration

Cliquez sur Préférences pour configurer Cosma.

## Paramètres requis

Répertoire des fiches
: Chemin du répertoire contenant les fichiers Markdown à lire.

Enregistrer automatiquement les cosmoscopes dans l'historique
: Lorsque cette option est active, Cosma exporte automatiquement chaque cosmoscope dans un sous-répertoire horodaté du répertoire temporaire défini par le système d'exploitation. <!-- Prévoir la possibilité de choisir le répertoire ? --> Cliquez sur Afficher l'historique pour consulter et gérer les entrées de l'historique.

Types de fiches
: Liste des types de fiches. Chaque type est défini par un nom et une couleur. Ajoutez `type: nom` à l'en-tête en YAML d'une fiche pour lui attribuer ce type.

Types de liens
: Liste des types de liens. Chaque type est défini par un nom, une couleur et un type de trait. Les types de traits disponibles sont : continu (*simple*), double (*double*), tirets (*dash*), pointillés (*dotted*). Pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points. Exemple : `[[type_de_lien:ID]]`.

::: important
Le type par défaut `undefined` doit obligatoirement être défini, que ce soit pour les types de fiches ou pour les types de liens.
:::

::: astuce
Le paramétrage visuel des liens a une incidence sur leur lisibilité au sein du graphe. La capture d'écran ci-dessous montre la configuration d'un utilisateur qui a défini trois types de liens qualifiés à la manière d'un thésaurus (`s` pour spécifique, `g` pour générique et `a` pour associé). Les couleurs et les types de traits ont été choisis de manière à renforcer la visibilité des liens qualifiés : les liens non qualifiés (`undefined`) sont en pointillés (`dotted`) gris (`grey`), tandis que les liens qualifiés sont plus lisibles, grâce à des traits continus (`simple`) et une couleur plus foncée (`black`).
:::

![Exemple de configuration des types de liens](https://hyperotlet.huma-num.fr/cosma/img/link-types.png)

## Paramètres du graphe

Les paramètres du graphe peuvent être modifiés en direct dans le cosmoscope. Vous pouvez ainsi tester différentes valeurs avant de les reporter dans la configuration. Ce sont les valeurs définies dans la configuration qui sont rétablies à chaque rechargement du cosmoscope, et chaque nouvelle génération d'un cosmoscope.

Afficher des flèches sur les liens
: Permet d'obtenir un graphe orienté ou non orienté.

Niveau maximum de focus
: Le mode focus restreint l'affichage au nœud sélectionné et à ses connexions directes (1 nœud de distance). Il est possible de faire varier la distance d'affichage du mode focus : passer à 2 affiche les connexions à 1 et 2 nœuds de distance ; passer à 3 étend l'affichage à 3 nœuds de distance ; etc. La valeur indiquée dans Niveau maximum de focus définit le seuil maximum pour cette fonctionnalité.

Taille du texte des étiquettes
: Définit la taille du texte des étiquettes des nœuds du graphe, c'est-à-dire de la place que prend le titre de chaque fiche sous le nœud correspondant. L'unité implicite est le pixel. La valeur minimale est 5 et la valeur maximale est 15.

Couleur de fond
: La couleur de fond du graphe.

Couleur de surbrillance
: La couleur qui s'applique aux nœuds ainsi qu'aux liens lors du survol et de la sélection.

<!-- 
`highlight_on_hover`
: Survoler un nœud le met temporairement en surbrillance, ainsi que ses connexions.

J'ai enlevé ce paramètre de la configuration car je ne vois pas de cas d'usage dans lequel on a envie ou besoin de désactiver cette fonctionnalité.
-->

Force d'attraction
: Correspond à la puissance globale de l'attraction simulée. Plus la valeur est faible, plus les liens entre les nœuds sont relâchés.

Distance maximum entre les nœuds
: Correspond au seuil maximal de répulsion entre les nœuds, quelle que soit la force. Au-delà d'une valeur de 1000, ce paramètre n'a pas d'effet mesurable.

Attraction verticale/horizontale
: Force d'attraction vers l'axe vertical/horizontal, de 0 à 1. Une valeur de `0` signifie que le paramètre est désactivé. Appliquer une force verticale/horizontale resserre le graphe et permet de ramener plus près du centre les nœuds isolés.

## Paramètres additionnels

Métadonnées
: Ces métadonnées facultatives sont ajoutées au volet À propos des cosmoscopes exportés en cliquant sur Partager.

Bibliographie
: Indiquez ici les chemins des fichiers de données, style et localisation bibliographique. Les trois fichiers sont requis pour le traitement des citations.

<!-- 
`minify`
: Réduit le poids du fichier `cosmoscope.html`, au détriment de la lisibilité du code source. Désactivé par défaut.

Actuellement désactivé.
 -->

Vues
: Gérez ici les vues enregistrées dans le cosmoscope.

Symbole de lien
: Saisissez ici une chaîne de caractères Unicode arbitraire. Elle remplacera l'identifiant entre les crochets dans le rendu HTML des fiches. Ceci permet d'alléger visuellement le texte de vos fiches en remplaçant les longs identifiants numériques par une convention personnelle (par exemple une petite manicule : ☞).

Activer les outils de développement
: Cette option permet d'afficher le menu Développement dans la barre des menus du système d'exploitation. Cliquez sur Développement › Afficher l'inspecteur web pour afficher les outils de développement du moteur Chromium et inspecter le code de l'interface de Cosma.

CSS personnalisée
: Indiquez ici le chemin d'un fichier CSS.

Utiliser une CSS personnalisée
: Applique le contenu du fichier indiqué dans CSS personnalisée aux cosmoscopes générés par Cosma.

Pour connaître les sélecteurs à utiliser pour telle ou telle déclaration, vous pouvez :

- cliquer sur Développement › Afficher l'inspecteur web (nécessite de cliquer sur Préférences › Activer les outils de développement) ;
- ouvrir le cosmoscope dans votre navigateur web et utiliser les outils de développement du navigateur ;
- consulter le code source de Cosma, spécifiquement `/cosmoscope/template.njk` (pour connaître la structure HTML du cosmoscope), `/cosmoscope/styles.css` et `/cosmoscope/print.css` (pour les styles d'impression activés lors de l'impression d'une fiche).

::: astuce
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

# Développement

🚧 En construction 🚧

<!-- 
Cette partie de la documentation s'adresse à des développeurs expérimentés en JavaScript. Elle présente l'arborescence et les concepts sur lesquels reposent les deux parties formant Cosma, le **cosmographe** et le **cosmoscope**.

Nous vous recommandons vivement de lire le reste de la documentation pour bien saisir l'ensemble des usages en jeu dans le code source présenté ci-dessous.

## Terminologie

Les fichiers Markdown interprétés par Cosma sont qualifiés ici de « fiches » plutôt que de « notes », en référence à la tradition de la fiche érudite et à l'histoire de la documentation. L'acception documentaire de « fiche » n'a pas de traduction directe en anglais (sinon *index card*). En revanche, elle est conceptuellement proche du mot « *record* » issu du [*records management*](https://fr.wikipedia.org/wiki/Records_management). Le code de Cosma emploie donc le mot record pour désigner une fiche.

## Description générale de l'architecture

Cosma est principalement implémenté en JavaScript. Le logiciel repose sur deux systèmes distincts, le cosmographe et le cosmoscope.

Le **cosmographe** repose sur l'environnement Node.js. Une série de scripts permettent de :

- vérifier et actualiser le fichier de configuration ;
- générer des fichiers Markdown et leur entête ;
- lire un répertoire pour en extraire les fichiers Markdown et analyser leur contenu (Markdown, métadonnées YAML et liens style wiki) afin de générer :
	- des fichiers JSON ;
	- le cosmoscope (ses données et variables CSS).

Le **cosmoscope** est un fichier HTML exécuté sur navigateurs web, créé à partir d'un *template* [Nunjucks](https://mozilla.github.io/nunjucks/) (`template.njk`). Il intègre :

- les métadonnées web et styles issus de la configuration ;
- les scripts et bibliothèques JavaScript ;
- des index (mots-clés, titre de fiche, vues) ;
- les fiches.

## Arborescence

Vous trouverez ci-dessous une description complète de l'arborescence du logiciel. Vous pourrez ainsi distinguer les fichiers concernant le cosmographe et ceux du cosmoscope.

```
.
├── docs/                   | répertoire de la documentation
│   ├── api/                | répertoire des index des API
│   │   └── [x].md          | introduction à l'index [x] de l'API
│   └── api-config-[x].json | config. de l'index [x] de l'API
├── functions/              | fonctions du cosmographe
│   ├── autorecord.js       | création de fichiers Markdown formatés
│   ├── history.js          | création répertoires de l'historique des exports
│   ├── links.js            | analyse des liens wiki et de leurs attributs
│   ├── log.js              | affichage des alertes et création des registres
│   ├── modelize.js         | analyse des fichiers Markdown et création modèle de données
│   ├── record.js           | formulaire du terminal pour création des fichiers Md
│   ├── template.js         | intégration données, style et corps du cosmoscope
│   └── verifconfig.js      | validation et modification de la configuration
├── template/               | 
│   ├── libs/               | bibliothèques JavaScript
│   ├── scripts/            | fonctions du cosmoscope
│   │   ├── bibliography.js | téléchargement des données bibliographiques
│   │   ├── counter.js      | actualiser les compteurs d'entités
│   │   ├── filter.js       | appliquer filtres
│   │   ├── focus.js        | appliquer focus
│   │   ├── graph.js        | affichage du graphe et intéractions
│   │   ├── history.js      | historique de navigation entre les fiches
│   │   ├── index.js        | contrôle des volets et boutons du menu gauche
│   │   ├── keyboard.js     | affectation des raccourcis clavier
│   │   ├── main.js         | variables globales et animation logo
│   │   ├── record.js       | ouvrir/fermer le volet latéral droit
│   │   ├── search.js       | paramétrage moteur de recherche
│   │   ├── tag.js          | appliquer tags
│   │   ├── view.js         | enregistrer et appliquer une vue
│   │   └── zoom.js         | paramétrer les déplacement (latéral, zoom) au sein du graphe
│   ├── cosmalogo.svg       | logo du logiciel
│   ├── template.njk        | structure du cosmoscope
│   ├── print.css           | styles d'impression du cosmoscope
│   └── styles.css          | styles du cosmoscope
├── app.js                  | adressage des commandes du terminal
└── package.json            | liste des dépendances Node.js
```

## Index des fonctions

Cliquez sur les liens ci-dessous pour consulter la liste des fonctions utilisées par le cosmographe et le cosmoscope :

- [Consulter l'API du cosmographe](./api/cosmographe/index.html)
- [Consulter l'API du cosmoscope](./api/cosmoscope/index.html)

## Fonctionnement du cosmographe

Il a trois utilisations possibles via le terminal. Ces différentes requêtes sont réceptionnées par `app.js` qui les renvoie :

- extraire et modéliser (`modelize.js`) puis intégrer (`template.js`) les données dans un cosmoscope ;
- générer des fichiers Markdown formatés (`record.js` et `autorecord.js`) ;
- modifier la configuration (`verifconfig.js`).

La configuration (le contenu du fichier `config.yml` devenu un objet JavaScript) est exportée de manière globale (depuis `verifconfig.js`). Elle peut être appelée comme ci-dessous.

```javascript
const config = require('./verifconfig').config;

const folderToExport = config.export_target;
```

## Lecture des fichiers

Depuis le fichier `modelize.js`, on extrait de chaque fichier Markdown les métadonnées (l'entête YAML) et le contenu (suivant l'entête YAML) (fichier `modelize.js`).

[`catchLinksFromContent()`](./api/cosmographe/global.html#catchLinksFromContent)
: Le contenu est lu une première fois par une série d'expressions régulières pour en extraire les paragraphes, et pour chaque paragraphe les *wikilinks* contenus. Le paragraphe devient le contexte de ses liens et est transpilé en HTML.

[`convertLinks()`](./api/cosmographe/global.html#convertLinks)
: Le contenu du fichier est ensuite transformé pour y transformer les *wikilinks* en liens Markdown

[`cosmoscope()`](./api/cosmographe/global.html#cosmoscope)
: Le contenu du fichier est intégralement transpilé du Markdown à l'HTML.

La première et la troisième fonction font appel à la bibliothèque markdown-it. Elle peut être remplacée.

## Génération du cosmoscope

Le cosmoscope est généré grâce à la fonction [`cosmoscope()`](./api/cosmographe/global.html#cosmoscope).

Celle-ci instancie le modèle Nunjucks `/template/template.njk` et y injecte les données relatives à la configuration, aux fiches et aux entités du graphe ainsi que leurs styles (sérialisés par la fonction [`colors()`](./api/cosmographe/global.html#colors)).

Nunjucks importe par ailleurs dans son `head` les fichiers de style CSS et les bibliothèques JavaScript ainsi que les fonctions JavaScript dans des balises `script` en fin de document. Les données relatives aux fiches et à la configuration sont intégrées via des boucles et autres structures de contrôle de Nunjucks.

Le tout est enregistré dans un fichier `cosmoscope.html` et est [exporté](#export).

## Affichage du graphe

La génération et l'animation du graphe reposent sur la bibliothèque [D3.js](https://d3js.org/). Celle-ci perçoit ses données depuis l'objet global `graph`. Cet object est composé de deux tableaux.

`graph.nodes`
: Ce tableau contient toutes les données relatives aux nœuds, y compris une série de booléens permettant de connaître leur état d'affichage (voir la sérialisation par la fonction [`registerNodes()`](./api/cosmographe/global.html#registerNodes)). Cet état indiqué est actualisé à chaque modification d'affichage.

`graph.links`
: Ce tableau contient toutes les données relatives aux liens (voir la sérialisation par la fonction [`registerLinks()`](./api/cosmographe/global.html#registerLinks)).

## Affichage via d'autres bibliothèques

Les tableaux présentés dans la section précédente peuvent être injectés dans d'autres bibliothèques JavaScript de génération de graphe.

**Exemple 1 :** Vis.js Network ([dépôt](https://github.com/visjs/vis-network), [exemple](https://github.com/visjs/vis-network#example)).

Extrait du fichier `/functions/modelize.js` :

```javascript
function registerLinks(file) {
// ...
  for (const link of file.links) {
  // ...
    entities.links.push({
      // ...
      from: Number(link.source.id),
      to: Number(link.target.id),
      // ...
    });
  }
}
```

Extrait du fichier `/template/scripts/graph.js`

```javascript
const network = new vis.Network(
  document.getElementById('network')
  , data = {
    nodes: new vis.DataSet(graph.nodes),
    edges: new vis.DataSet(graph.links)
  }
  , {  } // options
);
```

**Exemple 2 :** Sigma.js ([dépôt](https://github.com/jacomyal/sigma.js/), [exemple](https://github.com/jacomyal/sigma.js/blob/master/examples/basic.html#L70)).

```javascript
const network = new sigma({
  graph: {
    nodes: graph.nodes,
    edges: graph.links
  },
  container: 'network'
});
```

## Paramètres du graphe

Les paramètres du graphe sont extraits de la partie `graph_config` du fichier de configuration `config.yml`. Elle est injectée dans le modèle Nunjucks `/template/template.njk` via la fonction [`cosmoscope()`](./api/cosmographe/global.html#cosmoscope). Dans le modèle, elle est à la fois utilisée comme valeur par défaut des formulaires du menu « Paramètres du graphe » et implémentée comme objet global JavaScript `graphProperties`.

Ce même objet global est actualisé par les différents formulaires du menu « Paramètres du graphe ». Ils font ensuite appel à la fonction [`updateForces()`](./api/cosmographe/global.html#updateForces) pour relancer l'évaluation de ces paramètres par la bibliothèque de visualisation D3.js.

## Raccourcis clavier

L'ensemble des raccourcis clavier du cosmoscope sont implémentés dans le fichier `/template/scripts/keyboard.js`. L'objet global `pressedKeys` contient la liste des touches surveillées pour modifier un comportement. D'autres touches (des lettres) sont listées pour appeler certaines fonctions et ne sont pas ajoutées à l'objet global `pressedKeys`.

Le booléen global `keyboardShortcutsAreWorking` définit si les raccourcis peuvent être utilisés ou non. Lors de la saisie dans un champ, il ne faut pas que les lettres servent à autre chose qu'écrire.

# Crédits

## Équipe

- [Arthur Perret](https://www.arthurperret.fr/) (porteur du projet)
- [Guillaume Brioudes](https://myllaume.fr/) (développeur)
- [Clément Borel](https://mica.u-bordeaux-montaigne.fr/borel-clement/) (chercheur)
- [Olivier Le Deuff](http://www.guidedesegares.info/) (chercheur)

## Bibliothèques utilisées

Pour améliorer la maintenabilité et la lisibilité du code source, l’équipe de développement a recouru aux bibliothèques suivantes.

- [D3.js](https://d3js.org/) v4.13.0 (BSD 3-Clause) : Génération du graphe
- [Nunjucks](https://mozilla.github.io/nunjucks/) v3.2.3 (BSD 2-Clause) : Génération du template du Cosmoscope
- [Js-yaml](https://github.com/nodeca/js-yaml) v3.14.0 (MIT License) : Lecture du fichier de configuration et écriture des YAML Front Matter
- [Js-yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter) v4.1.0 (MIT License) : Lecture des YAML Front Matter des fichiers Markdown
- [Markdown-it](https://github.com/markdown-it/markdown-it) v12.0.2 (MIT License) : Conversion Markdown → HTML
- [Markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) v4.0.0  (MIT License) : Traitement des hyperliens Markdown au sein des fiches
- [Citeproc-js](https://github.com/Juris-M/citeproc-js) v2.4.59 (CPAL et AGPL) : Conversion des clés de citation
- [Minify-html](https://github.com/wilsonzlin/minify-html) v0.4.3 (MIT License) : Allègement du Cosmoscope
- [Fuse.js](https://fusejs.io/) v6.4.6 (Apache License 2.0) : Moteur de recherche
- [Moment](https://momentjs.com/) v2.29.1 (MIT License) : Gestion de l'horodatage
 -->
