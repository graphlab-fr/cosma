---
title: Identifiants
id: 20210901134136
type: documentation
---

Pour être correctement interprétée par Cosma, chaque fiche doit avoir un identifiant unique. Cet identifiant sert de cible aux liens internes.

Par défaut, Cosma génère des identifiants à 14 chiffres par horodatage (année, mois, jour, heures, minutes et secondes). Nous nous inspirons ici du fonctionnement de logiciels de prise de notes type Zettelkasten comme [The Archive](https://zettelkasten.de/the-archive/) et [Zettlr](https://www.zettlr.com).

**Note :** de nombreux logiciels de prise de notes interreliées proposent d'établir les liens entre fichiers via leurs noms, et de gérer automatiquement la maintenance des liens lorsque les noms de fichiers sont modifiés. En choisissant plutôt d'utiliser des identifiants uniques, nous avons donné à Cosma un fonctionnement plus classique, plus strict, proche de celui du Web. Nous pensons qu'il s'agit de la manière la plus simple d'éviter les [liens morts](https://fr.wikipedia.org/wiki/Lien_mort) de façon pérenne. Le fait de ne pas recourir à une maintenance automatique des liens notamment rend les données moins dépendantes d'une solution logicielle en particulier.

**Astuce :** l'inconvénient d'un lien basé sur un identifiant unique, c'est qu'il peut gêner la lecture du contenu, notamment lorsque l'identifiant est une longue série de chiffres. Dans Préférences › Symbole de lien, vous pouvez définir une convention personnelle, comme par exemple une petite manicule (☞), qui allège visuellement le rendu HTML des fiches en remplaçant les identifiants par une chaîne de caractères arbitraire.
