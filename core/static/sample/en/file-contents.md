---
title: File contents
id: 20210901133951
type: documentation
---

Cosma interprets files as being written in [CommonMark](https://spec.commonmark.org/0.30/), a strictly defined version of Markdown, a popular lightweight markup language. Check out the [CommonMark tutorial](https://commonmark.org/help/) to learn Markdown in 10 minutes.

Cosma renders Markdown files into HTML. Therefore, Markdown files can also include HTML code, as well as vector images in SVG.

Bitmap images can also be rendered using the Markdown syntax. However, the actual image files are not included when exporting a cosmoscope. To ensure that images are displayed in the export, you should use images hosted on the web, including them via their URL. Example:

```markdown
![Alternative text](http://domain.com/image.jpg)
```
