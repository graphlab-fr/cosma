---
title: Configuration
id: 20210901145632
type: documentation
---

## Paramètres requis

- Répertoire des fiches : chemin du répertoire contenant les fichiers Markdown à lire.
- Enregistrer automatiquement les cosmoscopes dans l'historique : lorsque cette option est active, Cosma exporte automatiquement chaque cosmoscope dans un sous-répertoire horodaté du répertoire temporaire défini par le système d'exploitation. Cliquez sur Afficher l'historique pour consulter et gérer les entrées de l'historique.
- Types de fiches : liste des types de fiches. Chaque type est défini par un nom et une couleur. Ajoutez `type: nom` à l'en-tête en YAML d'une fiche pour lui attribuer ce type.
- Types de liens : liste des types de liens. Chaque type est défini par un nom, une couleur et un type de trait. Les types de traits disponibles sont : continu (*simple*), double (*double*), tirets (*dash*), pointillés (*dotted*). Pour qualifier un lien dans une fiche, préfixez l'identifiant par le nom d'un type de lien suivi d'un deux-points. Exemple : `[[type_de_lien:ID]]`.

**Attention !** Le type par défaut `undefined` doit obligatoirement être défini, que ce soit pour les types de fiches ou pour les types de liens.

**Astuce :** le paramétrage visuel des liens a une incidence sur leur lisibilité au sein du graphe. La capture d'écran ci-dessous montre la configuration d'un utilisateur qui a défini trois types de liens qualifiés à la manière d'un thésaurus (`s` pour spécifique, `g` pour générique et `a` pour associé). Les couleurs et les types de traits ont été choisis de manière à renforcer la visibilité des liens qualifiés : les liens non qualifiés (`undefined`) sont en pointillés (`dotted`) gris (`grey`), tandis que les liens qualifiés sont plus lisibles, grâce à des traits continus (`simple`) et une couleur plus foncée (`black`).

## Paramètres du graphe

Les paramètres du graphe peuvent être modifiés en direct dans le cosmoscope. Vous pouvez ainsi tester différentes valeurs avant de les reporter dans la configuration. Ce sont les valeurs définies dans la configuration qui sont rétablies à chaque rechargement du cosmoscope, et chaque nouvelle génération d'un cosmoscope.

- Afficher des flèches sur les liens : permet d'obtenir un graphe orienté ou non orienté.
- Niveau maximum de focus : le mode focus restreint l'affichage au nœud sélectionné et à ses connexions directes (1 nœud de distance). Il est possible de faire varier la distance d'affichage du mode focus : passer à 2 affiche les connexions à 1 et 2 nœuds de distance ; passer à 3 étend l'affichage à 3 nœuds de distance ; etc. La valeur indiquée dans Niveau maximum de focus définit le seuil maximum pour cette fonctionnalité.
- Taille du texte des étiquettes : définit la taille du texte des étiquettes des nœuds du graphe, c'est-à-dire de la place que prend le titre de chaque fiche sous le nœud correspondant. L'unité implicite est le pixel. La valeur minimale est 5 et la valeur maximale est 15.
- Couleur de fond : la couleur de fond du graphe.
- Couleur de surbrillance : la couleur qui s'applique aux nœuds ainsi qu'aux liens lors du survol et de la sélection.
- Force d'attraction : correspond à la puissance globale de l'attraction simulée. Plus la valeur est faible, plus les liens entre les nœuds sont relâchés.
- Distance maximum entre les nœuds : correspond au seuil maximal de répulsion entre les nœuds, quelle que soit la force. Au-delà d'une valeur de 1000, ce paramètre n'a pas d'effet mesurable.
- Attraction verticale/horizontale : force d'attraction vers l'axe vertical/horizontal, de 0 à 1. Une valeur de `0` signifie que le paramètre est désactivé. Appliquer une force verticale/horizontale resserre le graphe et permet de ramener plus près du centre les nœuds isolés.

## Paramètres additionnels

- Métadonnées : ces métadonnées facultatives sont ajoutées au volet À propos des cosmoscopes exportés en cliquant sur Partager.
- Bibliographie : indiquez ici les chemins des fichiers de données, style et localisation bibliographique. Les trois fichiers sont requis pour le traitement des citations.
- Vues : gérez ici les vues enregistrées dans le cosmoscope.
- Symbole de lien : saisissez ici une chaîne de caractères Unicode arbitraire. Elle remplacera l'identifiant entre les crochets dans le rendu HTML des fiches. Ceci permet d'alléger visuellement le texte de vos fiches en remplaçant les longs identifiants numériques par une convention personnelle (par exemple une petite manicule : ☞).
- Activer les outils de développement : cette option permet d'afficher le menu Développement dans la barre des menus du système d'exploitation. Cliquez sur Développement › Afficher l'inspecteur web pour afficher les outils de développement du moteur Chromium et inspecter le code de l'interface de Cosma.
- CSS personnalisée : indiquez ici le chemin d'un fichier CSS.
- Utiliser une CSS personnalisée : applique le contenu du fichier indiqué dans CSS personnalisée aux cosmoscopes générés par Cosma.

Pour connaître les sélecteurs à utiliser pour telle ou telle déclaration, vous pouvez :

- cliquer sur Développement › Afficher l'inspecteur web (nécessite de cliquer sur Préférences › Activer les outils de développement) ;
- ouvrir le cosmoscope dans votre navigateur web et utiliser les outils de développement du navigateur ;
- consulter le code source de Cosma, spécifiquement `/cosmoscope/template.njk` (pour connaître la structure HTML du cosmoscope), `/cosmoscope/styles.css` et `/cosmoscope/print.css` (pour les styles d'impression activés lors de l'impression d'une fiche).

**Astuce :** les feuilles de style du cosmoscope utilisent notamment des variables CSS pour définir les couleurs et les polices utilisées. Vous pouvez redéfinir uniquement ces variables pour modifier tous les éléments d'interface auxquels elles s'appliquent. Dans l'exemple ci-dessous, le fichier `custom.css` contient des déclarations qui modifient les polices utilisées dans le cosmoscope :

```css
:root {
  --sans: "IBM Plex Sans", sans-serif;
  --serif: "IBM Plex Serif", serif;
  --mono: "IBM Plex Mono", monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```
