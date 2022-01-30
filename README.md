# Cosma [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.5920616.svg)](https://doi.org/10.5281/zenodo.5920616)

*(Texte en français plus bas)*

**Cosma** is a document graph visualization tool. It modelizes interlinked Markdown files and renders them as an interactive network in a web interface.

Visit <https://cosma.graphlab.fr/en/about/> to learn more about the project.

## Installation

Cosma is available for macOS and Windows. [Click here to access the latest release.](https://github.com/graphlab-fr/cosma/releases/latest) The application is not signed with a security certificate, so you must have administrator privileges on your session to be able to run it.

**macOS :** download then unzip `Cosma.app.zip` in your Applications folder. For the first launch, right click the application and select Open.

**Windows :** download then unzip `Cosma-win32-x64.zip`. Rename the folder `Cosma` and place it in your `C:\Programs` or `C:\Programs (86)` folder.

**All platforms:** you can also download `cosma-help.zip` which contains sample records for you to test Cosma with. When first launching the application, visit Preferences and set Records directory to the `cosma-help` folder.

[User documentation](https://cosma.graphlab.fr/docs/) is online and updated periodically.

## Development

Developing Cosma requires [Node.js](https://nodejs.org/fr/) v16 or higher.

1. Clone the repository.
2. In your command-line application, run `npm i` to install dependencies.
3. Run `npm start` to start Cosma.

Cosma consists of two main elements: an HTML file called a *cosmoscope*, and a graphical user interface built around it. The files used to build the cosmoscope are located in the `/cosmoscope` directory. The files to build the application are located in the `/core` directory.

Developer documentation is not available yet but will be made published progressively in 2022.

***

**Cosma** est un logiciel de visualisation de graphe documentaire. Il permet de représenter des notes interreliées sous la forme d’un réseau interactif dans une interface web.

Consultez <https://cosma.graphlab.fr/a-propos/> pour plus d'informations sur le projet.

## Installation

Cosma est disponible pour macOS et Windows. [Visitez la page Releases pour obtenir la dernière version du logiciel.](https://github.com/graphlab-fr/cosma/releases/latest) L'application n'est pas signée avec un certificat de sécurité, vous devez disposer des privilèges administrateurs sur votre session pour pouvoir l'exécuter.

**macOS :** téléchargez puis décompressez le fichier `Cosma.app.zip` et placez le le fichier `Cosma.app` dans `~/Applications`. Au premier lancement, faites clic droit › Ouvrir sur l'application pour l'exécuter.

**Windows :** téléchargez puis décompressez le fichier `Cosma-win32-x64.zip`, renommez le dossier « Cosma » et placez-le dans `C:\Programmes` ou `C:\Programmes (86)`.

**Pour toutes les plateformes :** vous pouvez également télécharger et décompresser le fichier `cosma-fiches-aide.zip` pour obtenir un répertoire `cosma-fiches-aide` contenant une documentation utilisateur sous forme de fiches. Ceci vous permet de tester le logiciel : au premier lancement de Cosma, indiquez le chemin du répertoire `cosma-fiches-aides` dans Préférences › Répertoire de fiches.

[La documentation utilisateur est à jour et en ligne.](https://graphlab-fr.github.io/cosma/fr.html)

## Développement

Pré-requis : [Node.js](https://nodejs.org/fr/) version 16 ou supérieure.

1. Clonez le dépôt.
2. Via un terminal, installez les dépendances : `npm i`.
3. Lancez Electron : `npm start`.

L'application se compose de deux principaux éléments : un fichier HTML appelé « cosmoscope », et une interface graphique qui se déploie autour. Les fichiers permettant de générer le cosmoscope sont dans le répertoire `/cosmoscope`. Les fichiers permettant de construire l'application sont dans le répertoire `/core`.

La documentation de développement sera mise à jour et publiée prochainement.
