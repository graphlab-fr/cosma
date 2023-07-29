---
title: Configuration
id: 20210901145632
type: documentation
---

[[20210901131627]] Cosma can be configured extensively. The GUI version includes a Preferences window. The CLI version reads configuration text files written in YAML.

## Required parameters

- Records directory: path to the directory containing your Markdown files.
- Auto-save in history: when this option is active, Cosma automatically exports each cosmoscope to a time-stamped subdirectory of the temporary directory defined by your operating system. Click on View History to view and manage entries.
- Record types: list of record types. Each type is defined by a name and a color. To assign a type to a record, add `type: name` to its YAML header.
- Link types: list of link types. Each type is defined by a name, a color and a stroke type. Stroke types are predefined: single, double, dash and dotted. To assign a type to a link in a record, prefix the identifier with the name of a link type followed by a colon. Example: `[[link_type:ID]]`.

**Warning:** The default type `undefined` is required for both record types and link types. You may not delete it from the configuration.

**Tip:** The links' visual settings have a strong impact on their readability within the graph. For example, a user may define three link types in the manner of a thesaurus (`s` for “specific”, `g` for “generic” and `a` for “associated with”). The colors and stroke types can be set to enhance the visibility of certain types of links: if undefined links are in dotted gray and qualified links are in darker solid strokes, the latter will stand out.

## Graph parameters

The graph parameters can be changed live in the cosmoscope. This allows you to test different values before transferring them to the configuration. The values defined in the configuration are applied each time the cosmoscope is reloaded, and each time a new cosmoscope is generated.

- Show arrows on links: choose between directed or non-directed graph.
- Maximum focus level: Focus mode restricts the display to the selected node and its direct connections. Direct means a distance of only 1 node. It is possible to vary this distance by changing Maximum focus level: with a value of 2, Focus mode will display all connections up to a distance of 2 nodes; changing the value to 3 extends it further; etc.
- Label text size: defines the size of the nodes' labels, in pixels. Minimum value is 5; maximum value is 15.
- Background color : the background color of the graph.
- Highlight color: the color that is applied to nodes and links when hovering and selecting them.
- Repulsion: this is the overall strength of the simulated force. The higher the value, the longer the links between nodes are.
- Maximum distance between nodes: this is the maximum threshold for repulsion between nodes.
- Vertical/horizontal attraction: force of attraction to the vertical/horizontal axis, from 0 to 1. A value of 0 means that the parameter is disabled. Applying a vertical/horizontal force “tightens” the graph and brings isolated nodes closer to the center.

## Additional parameters

- Metadata: this optional metadata is added to the About pane of exported cosmoscopes.
- Bibliography: load your bibliographic data, style and localization files here. All three files are required for citation processing.
- Views: manage the views saved in the cosmoscope.
- Link symbol: enter an arbitrary Unicode string which will replace the bracketed identifiers in the HTML rendering of the files. This allows you to visually lighten the text by replacing long numeric identifiers with a personal convention (for example a small manicule: ☞).
- Enable developer tools: this option activates the Development menu in the operating system menu bar. Click on Development then Show Web Inspector to display the Chromium engine development tools and inspect the source code to Cosma's interface.
- Custom CSS: load a custom CSS for the cosmoscope.

In order to design your custom CSS, you can :

- click on Development then Show Web Inspector (requires clicking on Preferences then Enable Development Tools) ;
- open the cosmoscope in your web browser and use the browser's development tools;
- or you can examine Cosma's source code, specifically `/cosmoscope/template.njk` (for the HTML structure of the cosmoscope), `/cosmoscope/styles.css` and `/cosmoscope/print.css` (for the print styles).

**Tip:** cosmoscope styles use CSS variables to define the colors and fonts. You can redefine these variables to change all the interface elements they apply to. In the example below, the `custom.css` file contains declarations that change the fonts used in the cosmoscope:

```css
:root {
  --sans: 'IBM Plex Sans', sans-serif;
  --serif: 'IBM Plex Serif', serif;
  --mono: 'IBM Plex Mono', monospace;
  --condensed: 'Avenir Next Condensed', sans-serif;
}
```
