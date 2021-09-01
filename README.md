# Cosma

Cosma est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web.

[La documentation utilisateur est à jour et en ligne.](https://graphlab-fr.github.io/cosma/fr.html) La documentation de développement sera mise à jour et publiée prochainement.

## Installation

Cosma est disponible pour macOS et Windows. Visitez la page Releases pour obtenir la dernière version du logiciel. Celui-ci se présente sous la forme d'un simple exécutable (`.app` pour macOS, `.exe` pour Windows). Téléchargez la version correspondant à votre plateforme et placez-la dans le répertoire approprié (`~/Applications` sur macOS, `C:\Program Files` sur Windows).

## Développement

Pré-requis : [Node.js](https://nodejs.org/fr/) version 16 ou supérieure.

1. Clonez le dépôt.
2. Via un terminal, installez les dépendances : `npm i`.
3. Lancez Electron : `npm start`.

L'application se compose de deux principaux éléments : un fichier HTML appelé « cosmoscope », et une interface graphique qui se déploie autour. Les fichiers permettant de générer le cosmoscope sont dans le répertoire `/cosmoscope`. Les fichiers permettant de construire l'application sont dans le répertoire `/core`.
