---
title: Changelog
---

# v2.0.3

## Additions

- `chronological_record_meta` can be set to `manual` in order to use `begin` and `end` metadata from records for Chronological mode

## Bug fixes

- Links work correctly when identifiers contain spaces and/or dots
- Type color is displayed correctly when the type name contains dots

## Known bugs

- `chronological_record_meta` reverts to `created` when set to `last_edit` or `last_open`
- the `created` setting for `chronological_record_meta` does not work as expected

# v2.0.2

- Added a man page, which can be displayed by running `man cosma` in the terminal

# v2.0.1

## Bug fixes

- Modelization no longer fails on Windows
- Windows style carriage return and line feeds hidden characters (CR LF) are now parsed correctly
- Citations are now processed as expected in backlink context tooltips

# v2.0.0

## Additions

- Manage multiple configurations (global and local)
- Use alternative syntax for links
- Include user-defined metadata in batch creation
- Display user-defined metadata in records in the cosmoscope
- Exclude certain records when generating the cosmoscope, based on types, keywords and user-defined metadata
- Display nodes in chronological mode
- Embed images in the cosmoscope (in base64). Supported formats: JPG, PNG
- Use an image as default thumbnail for a record type
- Use an image as thumbnail for a record
- Define an outline color for node types
- Choose between fixed size nodes and nodes proportional to their degree

## Improvements

- Links in bibliography are now clickable
- Messages displayed at command execution are more informative
- The error and warning report is more informative
- Keywords at the top of cards in the cosmoscope no longer overflow the layout
- Cosma now reads directories recursively (issue [#4](https://github.com/graphlab-fr/cosma/issues/4))
- When `history: true`, cosmoscopes are saved in a `history` subdirectory, either in the user data directory for global configurations, or in the same directory as the local configuration.

## Fixed bugs

- Link/backlink context tooltips now correctly highlight the target record (issue [#23](https://github.com/graphlab-fr/cosma/issues/23))

## Known bugs

- Citations are processed in link context tooltips but not in backlink context tooltips
- Windows style carriage return and line feeds hidden characters (CR LF) are not parsed correctly
- When the data comes from online CSV files, the `modelize` command does not terminate after generating the cosmoscope
- If a record's identifier is not a string of numbers, links to that record do not work
- Links to records with spaces in their identifier are not rendered correctly in the record's body