---
title: Identifiers
id: 20210901134136
type: documentation
---

To be correctly interpreted by Cosma, each record must have a unique identifier. This identifier serves as a target for links between records.

By default, Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This is inspired by Zettelkasten note-taking applications such as [The Archive](https://zettelkasten.de/the-archive/) and [Zettlr](https://www.zettlr.com).

Many interrelated note-taking applications use file names as targets for links between files. They maintain links automatically when file names are changed. By choosing to use unique identifiers instead, we have designed Cosma with a more traditional, stricter, WWW-like approach. We believe this is the easiest way to avoid [link rot](https://en.wikipedia.org/wiki/Link_rot) in a sustainable way. Avoiding the reliance on automatic link maintenance is especially important if you wish to make your data less dependent on specific applications.

Links based on unique identifiers have disadvantages, mainly in terms of user experience: they are cumbersome to write and to read, especially when the identifier is a long series of numbers. In Preferences › Link symbol, you can define a string of characters (as small and visually distinct as the manicle ☞), which Cosma will display instead of the identifiers as the text of links in the cosmoscope.
