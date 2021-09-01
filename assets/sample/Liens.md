---
title: Liens
id: 20210901134026
type: documentation
---

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

**Astuce :** Cosma inclut également une option pour personnaliser l'apparence des liens dans le texte des fiches. Dans Configuration › Symbole de lien, entrez n'importe quelle chaîne de caractères Unicode qui remplacera l'identifiant entre les crochets dans le rendu HTML des fiches.