---
title: Identifiants uniques
id: 20210901134136
type: documentation
---

De nombreux logiciels de prise de notes interreliées proposent d'établir les liens entre fichiers via leurs noms, et de gérer automatiquement la maintenance des liens lorsque les noms de fichiers sont modifiés.

Cosma adopte un fonctionnement plus classique, proche de celui du Web. Chaque fiche possède un identifiant unique qui sert de cible aux liens. Par ailleurs Cosma n'intervient pas sur le contenu des fiches après leur création : il n'y a pas de maintenance automatique des liens susceptible de dysfonctionner. Ceci diminue le risque de [lien mort](https://fr.wikipedia.org/wiki/Lien_mort) quel que soit le devenir des données.

Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes) sur le modèle de certains logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) ou [Zettlr](https://www.zettlr.com).

**Astuce :** L'inconvénient d'un lien basé sur un identifiant unique, c'est qu'il peut gêner la lecture du contenu, notamment lorsque l'identifiant est une longue série de chiffres. Utilisez Configuration › Symbole de lien pour alléger visuellement le texte de vos fiches en remplaçant les identifiants par une convention personnelle (par exemple une petite manicule : ☞).