---
title: Data format
id: 20210901133701
type: documentation
---

Cosma does not require the use of any particular writing application. On the other hand, creating content for Cosma requires the use of plain text and the adoption of several writing conventions, which may be facilitated by some writing applications. These conventions are:

- YAML for the [[20210901133736]] metadata written at the beginning of each record ;
- Markdown for the rest of the [[20210901133951]] file contents;
- wiki-like syntax (double brackets `[[ ]]`) for creating [[20210901134026]] internal links;
- unique [[20210901134136]] identifiers that serve as anchors for internal links.

Cosma also features automatic [[20210901134745]] citation processing. This relies on the CSL standard and the Pandoc citation syntax.

This combination of writing standards combines several textual cultures: documentation (enriching and indexing content with metadata); wikis (interrelating documents); the Zettelkasten method (organising one's notes); academic writing with Pandoc (using plain text as a source for exporting in various formats). Therefore, Cosma works particularly well when used in tandem with writing environments that also adopt this approach, such as Zettlr or the Foam extension for Visual Studio Code and VSCodium.

You can create a Cosma-compliant file via the application's record creation form (click File › New record, or type `Ctrl + N`) or manually with the text editor of your choice. Some text editors can save you time with document templates, which you can use to quickly create records for Cosma.
