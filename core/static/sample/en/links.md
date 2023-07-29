---
title: Links
id: 20210901134026
type: documentation
---

Within a record, you link to another record by writing its identifier between double brackets.

Example:

```
A link to [[20201209111625]] record B.
```

Cosma allows you to define link types. Each link type is defined by a name, a colour and a stroke pattern. To apply a type to a link, add the name of the type followed by a colon before the identifier.

Example:

```
Concept B is derived from [[generic:20201209111625]] concept A.

Person D wrote against [[opponent:20201209111625]] person C.
```

To improve the readability of records in the cosmoscope, Cosma includes an option to customise the text of the links. Under Preferences › Link symbol, enter one or more Unicode characters (letters, numbers, symbols…). Example: ☞. This string replaces the identifier and square brackets in the HTML rendering of the records.
