---
title: Creating a cosmoscope
id: 20210901141048
type: documentation
---

The main functionality of the cosmographer is to create [[20210901140150]] cosmoscopes. After being generated, the most recent cosmoscope is displayed in the main window of Cosma.

## Plain cosmoscope

Click on New cosmoscope (shortcut: `Cmd`/`Ctrl` + `R`) to generate a new cosmoscope.

## Cosmoscope with citations

Click on New cosmoscope with citations (shortcut: `Shift` + `Cmd`/`Ctrl` + `R`) to generate a new cosmoscope with citations. This requires that all appropriate files be loaded in Preferences › Bibliography.

## Error handling

Cosma automatically logs a report that describes any problems encountered during the generation of a cosmoscope. Errors can be of two types:

- something prevents a file from being processed (missing title, non-unique identifier) ;
- something is unknown (unrecognized record or link type, link to an unrecognized identifier).

Click View History to check the logs for each cosmoscope.
