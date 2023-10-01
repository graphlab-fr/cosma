---
title: Changelog
---

# v2.1.0

## Improvements

### Links can now be based on titles

If a record has e.g. `title: Evergreen notes` **and** no `id` parameter, then it can be linked to based on the title.

Text case is ignored when parsing but preserved when rendering, so you can write `[[Evergreen notes]]`, `[[evergreen notes]]` or even `[[eVerGReeN NotEs]]`: the link will work regardless, with the text being rendered the way you wrote it.

A new required parameter has been added to the configuration: `generate_id`. It modifies the behavior of `cosma record` according to three values:

- when `generate_id: always`, `cosma record` automatically generates identifiers in new records;
- when `generate_id: never`, `cosma record` doesn't add identifiers in new records;
- when `generate_id: ask`, `cosma record` asks you to type `y` (yes) or `n` (no) for each new record to choose if you want an identifier to be automatically added or not

### The graph is now displayed on an infinite canvas

The graph is no longer constrained (and truncated) by the edges of the window. This makes it possible to view graphs that are larger than the screen, without having to “shrink” the graph so that it fits the window.

### Cosma no longer rewrites configuration files

Cosma sometimes encounters a problem when reading a configuration file (e.g. a missing parameter such as the `undefined` record type). Instead of silently rewriting the configuration file, Cosma now tries to fall back on internal default configuration values and displays a warning message in the terminal, with the names of the problematic configuration parameters.

### Chronological mode has been simplified

Chronological mode now works in only one way: by using the values for `begin` and `end` metadata from the YAML header of records. (Future updates will provide the ability to customize chronological metadata.) The `chronological_record_meta` parameter is deprecated and removed from the configuration

## Bug fixes

- Fixed the visual indicator for suggestions that appear when typing into the search bar
- Fixed the warning displayed by Cosma when attempting to create a duplicate record
- Automatically terminate `modelize` when the task has been completed but the process keeps running (issue encountered on macOS)

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