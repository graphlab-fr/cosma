---
title: Changelog
---

# v2.3.1

## Improvements

- Improved the wording (and documentation) of the “views” feature, which will be called the view (singular) until we re-implement the ability for users to save views in the cosmoscope.

## Bug fixes

- Links in bibliographies now work properly again ([issue 80](https://github.com/graphlab-fr/cosma/issues/80)).
- `cosma batch` now generates identifiers properly again.

# v2.3.0

## Additions

- Multi-type nodes are now multi-colored in the graph, and have multiple type indicators in front of their name in the index as well as the Links and Backlinks section of records.

## Bug fixes

- Opening and closing records is no longer broken ([issue 91](https://github.com/graphlab-fr/cosma/issues/91)).
- Lists in records are no longer flush with the margin but indented. This improves the rendering of multiline list items, line breaks inside list items, etc. ([issue 86](https://github.com/graphlab-fr/cosma/issues/86))

# v2.2.1

## Additions

- Added an `AUTHORS` file.

# v2.2.0

## Additions

- New configuration setting: `citations_as_nodes`. When set to `true`, this setting modifies the behavior of the `--citeproc` option of `cosma modelize`, making it so that bibliographic references become nodes in the graph: each cited reference is treated as a node and each citation is treated as a link; for each cited reference, a bibliographic record is automatically generated in the cosmoscope; each bibliographic record is presented with contextualized backlinks which correspond to citations of that bibliographic reference in other records.

To use this new feature, you must do three things:

1. set `citations_as_nodes` to `true` in the project's configuration;
2. define a value for `references_type_label` (this is a new setting introduced alongside `citations_as_nodes` in this release);
3. create a record type with the same name as the value for `references_type_label`.

For instance:

```
citations_as_nodes: true
references_type_label: "référence"
record_types:
  référence:
    stroke: "#6C6C6C"
    fill: "#6C6C6C"
```

(You can replace “référence” with whatever you want.)

Then run `cosma modelize --citeproc` as usual to generate the cosmoscope.

## Improvements

- When a record has no value for a particular metadata field (e.g. no keywords), that field is hidden from the record in the cosmoscope.

# v2.1.2

- Reverted a change from v2.1.1: the Links section in the record panel of the cosmoscope is now uncollapsed again.

# v2.1.1

## Additions

- Links and backlinks context is now shown inline by default. This is set by the new `link_context` parameter in the configuration. Set `link_context` to `tooltip` instead of `inline` to show link context in a tooltip on hover, as in previous versions of Cosma.
- Link type now appears between parentheses before the name of a link or backlink at the bottom of the record. 

## Improvements

- `begin` and `end` metadata are now known by Cosma as default metadata and do not need to be declared in `record_metas`

## Known bugs

- Links in bibliographies are broken due to an extra `</div>` tag in the `href` attribute (issue [80](https://github.com/graphlab-fr/cosma/issues/80)).

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

We are still ironing the kinks (see Known issues below). Feedback is welcome as always.

### Cosma no longer rewrites configuration files

Cosma sometimes encounters a problem when reading a configuration file (e.g. a missing parameter such as the `undefined` record type). Instead of silently rewriting the configuration file, Cosma now tries to fall back on internal default configuration values and displays a warning message in the terminal, with the names of the problematic configuration parameters.

### Chronological mode has been simplified

Chronological mode now works in only one way: by using the values for `begin` and `end` metadata from the YAML header of records. (Future updates will provide the ability to customize chronological metadata.) The `chronological_record_meta` parameter is deprecated and removed from the configuration

## Bug fixes

- Fixed the visual indicator for suggestions that appear when typing into the search bar
- Fixed the warning displayed by Cosma when attempting to create a duplicate record
- Automatically terminate `modelize` when the task has been completed but the process keeps running (issue encountered on macOS)

## Known issues

- In the graph view, zooming doesn't center on the pointer's position
- `batch` generates identifiers with extra digits (more than the expected 14), which can mess up writing setups. This doesn't affect projects with `generate_id: never`, for which `batch` correctly generates records without identifiers

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