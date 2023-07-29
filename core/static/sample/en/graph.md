---
title: Graph
id: 20210901142644
type: documentation
---

The central area of the cosmoscope is an interactive graph of labelled nodes. Each node corresponds to a record; the label corresponds to the title of the record. The links correspond to the links established between the records via their identifiers.

Hovering over a node temporarily highlights it and its connections. Clicking on a node highlights it and its connections and opens the corresponding record.

You can zoom in and out of the graph freely with a mouse or touchpad, by double-clicking on the graph background or with the dedicated buttons at the bottom left. Press `C` to zoom in on a selected node (whose record is open). The Reset button (shortcut: `R`) resets the zoom.

Nodes are organised in space by a force simulation algorithm. A coloured bar at the top of the Menu indicates the state of the drawing process (active or finished). Click on this bar (shortcut: `Space`) to start an additional simulation cycle. This does not reset the graph but re-runs the algorithm on the existing graph, improving its layout.

If you have a particularly tangled graph, pressing `Space` a few times will progressively untangle it.

The graph is not fixed: nodes can be moved by click and drag. However, the nodes and links remain permanently subject to the simulation, so it is not possible to arrange them manually. Modifying the records may change the arrangement of the nodes in space.

The way the graph is displayed can be changed temporarily via the controls under Graph settings in the Menu. To change the display permanently, change the default values of the corresponding settings in Preferences › Graph.

Change the strength and maximum distance between nodes to adapt the display to your screen resolution and size. Add vertical/horizontal attraction to tighten the graph and bring isolated nodes closer to the center.

The graph can be displayed on all types of screens but is not optimised for mobile devices: touch does not give access to certain interactions such as hovering, and small screens greatly limit the usefulness of the graph.
