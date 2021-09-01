---
title: Présentation
id: 20210901132721
type: documentation
---

[[20210901131627]] Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web. Le logiciel est conçu pour fonctionner avec des fichiers texte en Markdown et s’adapte aussi bien à une petite collection (centaine de documents) qu’à une vaste documentation (jusqu'à plusieurs milliers de documents).

Cosma est développé dans le cadre du programme de recherche ANR [HyperOtlet](https://hyperotlet.hypotheses.org/).

## Spécificités de Cosma

Dans le vaste champ des outils qui servent à penser (*tools for thought*), Cosma se démarque par **trois originalités** :

D'abord, **Cosma n'est pas lui-même un logiciel de prise de notes**. Il est pensé pour fonctionner en complémentarité avec ces logiciels. Nous nous sommes inspirés ici du fonctionnement de logiciels comme [Deckset](https://www.deckset.com), qui applique ce principe aux présentations.

Ensuite, **Cosma repose sur des normes d'écriture interopérables, ouvertes et standardisées**. Ceci accroît la pérennité des données, facilite l'utilisation combinée avec des outils qui partagent ces normes (comme [Zettlr](https://www.zettlr.com)), tout en laissant la possibilité de changer d'outil à tout moment.

Enfin, **Cosma permet de partager simultanément les données et les outils pour les explorer**. La plupart des outils de visualisation concentrent leurs fonctionnalités dans une application à interface graphique, à partir de laquelle il est possible d'exporter des données structurées ou des images statiques. Cosma inverse cette logique : l'application installée, surnommée **cosmographe**, est un simple outil de création et d'affichage qui accueille un fichier HTML surnommé **cosmoscope** ; c'est ce dernier qui constitue la véritable interface de visualisation, avec un graphe interactif, des outils de navigation interne (index, moteur de recherche, filtres) et le texte intégral des fiches. Or il s'agit d'un fichier autonome, qui inclut aussi les données sources au format JSON et peut être utilisé hors connexion. Ainsi dans Cosma, l'export est aussi puissant que l'application : **en partageant un cosmoscope vous ne transmettez pas seulement des données mais des capacités heuristiques**.

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
