---
title: Graphe
id: 20210901142644
type: documentation
---

Le graphe située dans la zone centrale de l'interface affiche des nœuds étiquetés et interreliés. Chaque nœud correspond à une fiche ; l'étiquette correspond au titre de la fiche. Les liens correspondent aux liens établis entre les fiches via leur identifiant entre doubles crochets.

Survoler un nœud le met temporairement en surbrillance lui et ses connexions. Cliquer sur un nœud le met en surbrillance, ainsi que ses connexions, et ouvre la fiche correspondante.

Vous pouvez zoomer librement dans le graphe à la souris, au pavé tactile, en double cliquant sur le fond du graphe ou bien avec les boutons dédiés situés en bas à gauche. Appuyez sur la touche `C` pour zoomer sur un nœud sélectionné. Le bouton Recentrer (raccourci : touche `R`) réinitialise le zoom.

Les nœuds sont organisés dans l'espace par un algorithme de simulation de forces. Une barre colorée sous le logo Cosma témoigne de l'état de la simulation. Cliquez dessus (raccourci : touche `Espace`) pour lancer un cycle de simulation supplémentaire.

**Astuce :** quelques pressions sur la touche `Espace` permettent de « déplier » progressivement un graphe emmêlé.

Le graphe n'est pas figé, les nœuds peuvent donc être déplacés par cliquer-glisser. Ils restent soumis en permanence à la simulation, donc il n'est pas possible de les disposer manuellement de manière arbitraire.

L'affichage du graphe peut être modifié de manière temporaire via les contrôles placés sous Paramètres du graphe dans le panneau latéral gauche. Pour modifier l'affichage de manière permanente, modifiez les valeurs par défaut des paramètres correspondants dans Préférences › [Paramètres du graphe](#parametres-du-graphe).

**Astuce :** modifiez la force et la distance maximale entre les nœuds pour adapter l'affichage à la résolution et la taille de votre écran. Ajoutez une force d'attraction vers l'axe vertical/horizontal pour resserrer le graphe et ramener les nœuds isolés plus près du centre.

L'affichage est possible sur tous types d'écrans mais n'est pas optimisé pour les terminaux mobiles : le tactile ne donne pas accès à certaines interactions comme le survol, et les petits écrans restreignent l'utilité du graphe.