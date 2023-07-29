---
title: Keywords
id: 20210901143845
type: documentation
---

The list of keywords in Menu allows you to highlight records that use the selected keywords. Selecting a keyword highlights the label of the corresponding nodes in the graph and restricts the index to the corresponding records. You can activate several keywords simultaneously. To deactivate a keyword, click the corresponding button again.

For a keyword to appear, it must have been declared in the `tags` field of the YAML header of at least one record. The value must be a list. A record can have as many keywords as you wish. You can use `keywords` instead of `tags`, for compatibility with Pandoc. If a record has a `tags` field and a `keywords` field, only the keywords declared in the `tags` field are interpreted by Cosma.
