---
title: Metadata
id: 20210901133736
type: documentation
---

In order to be correctly interpreted by Cosma, Markdown files (`.md`) must include a [YAML](http://yaml.org) header at the beginning of the file.

This header is created automatically when you create a file via Cosma. You can also create it manually, or with the help of a template in certain text editors.

Example:

```
---
title: Title of the record
id: 20201209111625
type: undefined
tags:
- keyword 1
- keyword 2
---
```

The YAML header is delimited by two sets of three single dashes on a line (`---`).

In YAML, a field consists of a name and a value separated by a colon. Cosma recognises and uses the following four fields:

`title` (mandatory): title of the record.

`id` (mandatory): unique identifier of the record. By default, Cosma generates 14-digit identifiers in the form of a timestamp (year, month, day, hours, minutes and seconds). This is inspired by Zettelkasten note-taking applications such as [The Archive](https://zettelkasten.de/the-archive/) and [Zettlr](https://www.zettlr.com).

`type` (optional): record type. Only one type can be assigned to a record. If the `type` field is not specified or its value does not match one of the types declared in the configuration, Cosma will interpret the type of the record as `undefined`.

`tags` (optional): keywords assigned to the record. The value must be a list. A record can have as many keywords as you wish. You can use `keywords` instead of `tags`, for compatibility with Pandoc. If a record has a `tags` field and a `keywords` field, only the keywords declared in the `tags` field are interpreted by Cosma.

In accordance with the YAML specification, the list of keywords can be written in _block_ mode:

```yaml
tags:
  - keyword 1
  - keyword 2
```

Or in _flow_ mode:

```yaml
tags: [keyword 1, keyword 2]
```

You can add additional YAML fields arbitrarily. You may for example include fields recognized by Pandoc.

## Why a YAML header?

Some applications opt to recognize file metadata heuristically. For example, if the first line of the file is a level 1 heading, then it will be interpreted as the title of the file; if the second line contains words prefixed with a `#` pound sign, then they will be interpreted as keywords.

This method is not interoperable: each program has its own conventions, which limits the user's ability to change tools.

Using a YAML header allows writers to declare different metadata explicitly and separately. This has the advantage of making the detection and manipulation of this metadata trivial, both by machines and humans. The use of a common format (such as YAML) increases the number of tools that can be used seamlessly with the same set of files. And widely used computer tools such as regular expressions and _shell_ scripts allow people to convert their data themselves in a relatively simple way if needed.
