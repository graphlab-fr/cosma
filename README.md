# Cosma

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web.

[La documentation utilisateur est à jour et en ligne.](https://graphlab-fr.github.io/cosma/fr.html) La documentation de développement sera mise à jour et publiée prochainement.

## Installation

Cosma est disponible pour macOS et Windows. [Visitez la page Releases pour obtenir la dernière version du logiciel.](https://github.com/graphlab-fr/cosma/releases/latest)

**macOS :** téléchargez puis décompressez le fichier `Cosma.app.zip` et placez le le fichier `Cosma.app` dans `~/Applications`.

**Windows :** téléchargez puis décompressez le fichier `Cosma-win32-x64`, renommez le dossier « Cosma » et placez-le dans `C:\Programmes` ou `C:\Programmes (86)`.

**Pour toutes les plateformes :** vous pouvez également télécharger et décompresser le fichier `cosma-fiches-aide.zip` pour obtenir un répertoire `cosma-fiches-aide` contenant une documentation utilisateur sous forme de fiches. Ceci vous permet de tester le logiciel : dans Cosma, indiquez le chemin de ce répertoire dans Préférences › Répertoire de fiches.

## Développement

Pré-requis : [Node.js](https://nodejs.org/fr/) version 16 ou supérieure.

1. Clonez le dépôt.
2. Via un terminal, installez les dépendances : `npm i`.
3. Lancez Electron : `npm start`.

L'application se compose de deux principaux éléments : un fichier HTML appelé « cosmoscope », et une interface graphique qui se déploie autour. Les fichiers permettant de générer le cosmoscope sont dans le répertoire `/cosmoscope`. Les fichiers permettant de construire l'application sont dans le répertoire `/core`.
