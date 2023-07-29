---
title: Configuration
id: 20210901145632
type: documentation
---

Le fonctionnement de Cosma peut être modifié via la configuration.

La configuration de la version CLI s'effectue dans un fichier YAML `config.yml`. Ce fichier est généré par l'application lors de la première exécution, à la racine du répertoire de l'application :

- Windows : `%USERPROFILE%\AppData\Roaming\npm\node_modules\@graphlab-fr\cosma\config.yml`
- macOS, Linux : `/usr/local/lib/node_modules/@graphlab-fr/cosma/config.yml`

Le fichier `config.yml` généré par Cosma contient les valeurs par défaut des différents paramètres. Ces paramètres sont identiques à la version GUI. Si vous retirez un paramètre du fichier, Cosma considère qu'il a sa valeur par défaut.

La configuration de la version CLI s'effectue depuis la fenêtre Préférences de l'application.

La majorité des options de configuration ne fonctionnent que si un répertoire de fiches est renseigné.

## Général

### Langue d'affichage

Permet de choisir la langue que vous souhaitez appliquer à l'interface de l'application ainsi qu'aux cosmoscopes générés et exportés.

Un redémarrage de l'application est nécessaire pour que le changement de langue prenne effet dans l'interface. De plus, Cosma ne re-génère pas automatiquement un cosmoscope suite au changement de langue : il faut donc re-générer manuellement un cosmoscope pour voir le changement prendre effet.

### Répertoire des fiches

Chemin du répertoire contenant les fichiers Markdown. Les nouvelles fiches créées via Cosma sont ajoutées dans ce répertoire.

### Enregistrer automatiquement les cosmoscopes dans l’historique

Par défaut, Cosma exporte automatiquement chaque cosmoscope dans un répertoire `cosma-history` situé dans les répertoires temporaires du système d'exploitation. Décochez cette option pour désactiver cet export automatique.

Le cosmocope actif est toujours enregistré dans l'historique comme dernière entrée. C'est cette dernière entrée qui est ouverte lors du lancement de l'application. Si l'enregistrement automatique des cosmoscopes est désactivé, cette dernière entrée sera simplement écrasée à chaque nouvelle génération de cosmoscope.

### Symbole de lien

Saisissez ici une chaîne de caractères Unicode arbitraire. Elle remplacera les identifiants entre les crochets dans le rendu HTML des fiches. Ceci permet d'alléger visuellement le texte de vos fiches en remplaçant les longs identifiants numériques par une convention personnelle (par exemple une petite manicule : ☞).

## Types de fiches

Cette section permet de définir différents types de fiches. Pour chaque type de fiche, renseignez un nom et une couleur.

Ajoutez `type: nom` à l'en-tête en YAML d'une fiche pour lui attribuer ce type. Un seul type peut être assigné à une fiche. Si le champ `type` n'est pas spécifié ou bien que sa valeur ne correspond à l'un des types enregistrés dans la configuration, Cosma interprètera le type de la fiche comme non défini (`undefined`).

**Note :** le type `undefined` (couleur par défaut des nœuds) peut être modifié, mais ne peut être retiré.

## Types de liens

Cette section permet de définir différent types de liens. Pour chaque type de lien, renseignez un nom, une couleur et un tracé. Les tracés disponibles sont :

- continu (_simple_)
- double (_double_)
- tirets (_dash_)
- pointillés (_dotted_)

Pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points.

**Note :** le type `undefined` (couleur et type de trait par défaut des liens) peut être modifié, mais ne peut être retiré.

**Astuce :** le paramétrage visuel des liens a une incidence sur leur lisibilité au sein du graphe. Par exemple, si vous définissez les liens non qualifiés (`undefined`) en pointillés (`dotted`) gris (`grey`) et un type de lien spécial en trait continu (`simple`) noir (`black`), les liens spéciaux seront plus visibles dans le graphe.

## Graphe

Les paramètres du graphe peuvent être modifiés en direct dans le cosmoscope. Vous pouvez ainsi tester différentes valeurs avant de les reporter dans la configuration. Ce sont les valeurs définies dans la configuration qui sont rétablies à chaque rechargement du cosmoscope, et chaque nouvelle génération d'un cosmoscope.

### Couleur de fond

La couleur de fond du graphe.

### Couleur de surbrillance

La couleur qui s'applique aux nœuds ainsi qu'aux liens lors du survol et de la sélection.

**Note :** les deux paramètres de couleur ci-dessus sont accessibles via l'interface car ils sont susceptibles d'être modifiés par de nombreux utilisateurs. Mais toutes les couleurs de l'interface peuvent être modifiées en utilisant une feuille de style CSS personnalisée (voir Configuration › Avancé).

### Taille du texte des étiquettes

Définit la taille du texte des étiquettes des nœuds du graphe, c'est-à-dire la place que prend le titre de chaque fiche sous le nœud correspondant. L'unité implicite est le pixel. Les valeurs possibles sont comprises entre 5 et 15.

### Niveau maximum de focus

Le mode focus restreint l'affichage au nœud sélectionné et à ses connexions directes (1 nœud de distance).

Il est possible de faire varier la distance d'affichage du mode focus : passer à 2 affiche les connexions jusqu'à 2 nœuds de distance ; passer à 3 étend l'affichage à 3 nœuds de distance ; etc. La valeur indiquée dans Niveau maximum de focus définit le seuil maximum pour cette fonctionnalité. Une valeur élevée consomme plus de ressources à l'affichage.

### Afficher des flèches sur les liens

Permet d'obtenir un graphe orienté ou non orienté.

### Spatialisation

- Force d'attraction : correspond à la puissance globale de l'attraction simulée. Plus la valeur est faible, plus les liens entre les nœuds sont relâchés.
- Distance maximum entre les nœuds : correspond au seuil maximal de répulsion entre les nœuds, quelle que soit la force. Au-delà d'une valeur de 1000, ce paramètre n'a pas d'effet mesurable.
- Attraction verticale/horizontale : force d'attraction vers l'axe vertical/horizontal, de 0 à 1. Une valeur de 0 signifie que le paramètre est désactivé. Appliquer une force verticale/horizontale resserre le graphe et permet de ramener plus près du centre les nœuds isolés.

## Métadonnées

Vous pouvez définir des métadonnées globales pour le cosmoscope :

- titre
- auteur
- mots-clés
- description

Les cosmoscopes exportés via le menu Partager intègrent ces métadonnées si elles sont renseignées. Le titre vient remplacer les boutons situés en haut à gauche du menu, et qui ne s'affichent que dans l'application. Les métadonnées sont affichées dans le panneau « À propos ». Elles sont également incluses dans le code source du cosmoscope sous la forme de balises `meta`.

## Bibliographie

Indiquez ici les chemins des fichiers de données, style et localisation bibliographique. Les trois fichiers sont requis pour le [[20210901134745]] traitement des citations.

### Données bibliographiques

Fichier contenant les métadonnées décrivant des références bibliographiques. Le format requis est CSL JSON (extension `.json`).

### Style bibliographique

Fichier contenant les règles de mise en forme des citations et bibliographies. Le format requis est CSL (extension `.csl`). Vous pouvez télécharger des fichiers de style depuis le [répertoire de styles CSL de Zotero](https://www.zotero.org/styles).

### Localisation bibliographique

Fichier contenant les traductions dans une certaine langue des termes employés en bibliographie (ex : éditeur, numéro…). Le format requis est XML (extension `.xml`). Vous pouvez télécharger des fichiers de localisation depuis le [dépôt GitHub du projet CSL](https://github.com/citation-style-language/locales/tree/6b0cb4689127a69852f48608b6d1a879900f418b).

## Vues

Gérez ici les vues enregistrées dans le cosmoscope.

## Avancé

### Afficher les outils de développement

Cette option permet d'afficher les outils de développement du logiciel depuis Affichage › Outils de développement. Cliquez sur Afficher l'inspecteur web pour inspecter le code de l'interface de Cosma.

### CSS personnalisée

Indiquez ici le chemin d'un fichier CSS pour personnaliser l'interface du cosmocope. Il est nécessaire de re-générer un cosmoscope pour que la CSS personnalisée soit prise en compte.

**Astuce :** pour connaître les sélecteurs à utiliser pour telle ou telle déclaration, vous pouvez :

- cliquer sur Affichage › Outils de développement (nécessite d'avoir activé Afficher les outils de développement) ;
- ouvrir le cosmoscope dans un navigateur web et utiliser les outils de développement du navigateur ;
- consulter le code source de Cosma, spécifiquement `/cosma-core/template.njk` (pour connaître la structure HTML du cosmoscope), `/cosma-core/styles.css` et `/cosma-core/print.css` (pour les styles d'impression activés lors de l'impression d'une fiche).

Les feuilles de style du cosmoscope utilisent notamment des variables CSS pour définir les couleurs et les polices utilisées. Vous pouvez redéfinir uniquement ces variables pour modifier tous les éléments d'interface auxquels elles s'appliquent. Dans l'exemple ci-dessous, le fichier `custom.css` contient des déclarations qui modifient les polices utilisées dans le cosmoscope :

```css
:root {
  --sans: 'IBM Plex Sans', sans-serif;
  --serif: 'IBM Plex Serif', serif;
  --mono: 'IBM Plex Mono', monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```
