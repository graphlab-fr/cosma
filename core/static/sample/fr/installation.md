---
title: Installation
id: 20210901132906
type: documentation
---

[[20210901131627]] Cosma est disponible en deux versions : une application à interface graphique (_graphical user interface_, GUI) et une application exécutable en ligne de commande (_command line interface_, CLI).

## Version GUI

La version GUI de Cosma est disponible pour macOS et Windows. [Visitez la page Releases pour obtenir la dernière version du logiciel](https://github.com/graphlab-fr/cosma/releases/latest). L'application n'est pas signée avec un certificat de sécurité, vous devez disposer des privilèges administrateurs sur votre session pour pouvoir l'exécuter.

Sur macOS, téléchargez puis décompressez le fichier `Cosma.app.zip` et placez le le fichier `Cosma.app` dans `~/Applications`. Au premier lancement, faites clic droit › Ouvrir sur l'application pour l'exécuter.

Sur Windows, téléchargez puis décompressez le fichier `Cosma-win32-x64.zip`, renommez le dossier « Cosma » et placez-le dans `C:\Programmes` ou `C:\Programmes (86)`.

## Version CLI

La version CLI de Cosma est disponible sur macOS, Windows et Linux.

L'installation de [NodeJS](https://nodejs.org/) version 15 minimum est requise.

Entrez la commande suivante dans votre terminal pour installer Cosma CLI :

```
npm i @graphlab-fr/cosma -g
```
