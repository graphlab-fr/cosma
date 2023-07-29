---
title: Contenu des fichiers
id: 20210901133951
type: documentation
---

Cosma interprète les fichiers comme étant rédigés en [CommonMark](https://spec.commonmark.org/0.30/), une version strictement définie du langage de balisage léger Markdown.

**Astuce :** le [tutoriel CommonMark traduit en français](https://www.arthurperret.fr/tutomd/) permet d'apprendre les bases de Markdown en 10 minutes. Si vous souhaitez découvrir l'utilisation conjointe de Markdown et Pandoc, vous pouvez consulter le cours en ligne [Markdown et vous](https://infolit.be/md/).

Cosma génère un rendu des fichiers Markdown en HTML. Par conséquent, les fichiers Markdown peuvent également inclure du code HTML, ainsi que des images vectorielles en SVG. Des images _bitmap_ peuvent être incluses dans le rendu via la syntaxe Markdown. Cependant, les fichiers images ne sont pas intégrés à l'export. Pour que les images s'affichent à l'export, privilégiez donc les images hébergées sur le Web et incluses via une URL. Exemple :

```markdown
![Texte alternatif](http://domaine.fr/image.jpg)
```
