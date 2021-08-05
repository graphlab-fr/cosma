/**
 * @file Generate nodes, labels & links for graph. Highlight, hide & display nodes & links. Set mouse graph events.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

(function() {

/** Data serialization
------------------------------------------------------------*/

data.nodes = data.nodes.map(function (node) {
    node.hidden = false;
    node.isolated = false;
    node.highlighted = false;
    return node;
});

/** Box sizing
------------------------------------------------------------*/

window.svg = d3.select("#graph-canvas");

let svgSize = svg.node().getBoundingClientRect();

const width = svgSize.width;
const height = svgSize.height;

svg
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "xMinYMin meet");

/** Force simulation
------------------------------------------------------------*/

const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter())
    .force("forceX", d3.forceX())
    .force("forceY", d3.forceY());

simulation.force("center")
    .x(width * 0.5)
    .y(height * 0.5);

window.updateForces = function () {
    // get each force by name and update the properties

    simulation.force("charge")
        // turn force value to negative number
        .strength(-Math.abs(graphProperties.attraction.force))
        .distanceMax(graphProperties.attraction.distance_max);

    simulation.force("forceX")
        .strength(graphProperties.attraction.horizontale)

    simulation.force("forceY")
        .strength(graphProperties.attraction.verticale)

    // restarts the simulation
    simulation.alpha(1).restart();
}

updateForces();

simulation
    .on("tick", function() {
        elts.links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        elts.nodes.attr("transform", function(d) {
            d.x = Math.max(d.size, Math.min(width - d.size, d.x));
            d.y = Math.max(d.size, Math.min(height - d.size, d.y));
    
            return "translate(" + d.x + "," + d.y + ")";
        });

        d3.select('#load-bar-value')
            .style('flex-basis', (simulation.alpha() * 100) + '%');
    });

/** Elements
------------------------------------------------------------*/

const elts = {};

elts.links = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("class", (d) => 'l_' + d.type)
    .attr("title", (d) => d.title)
    .attr("data-source", (d) => d.source)
    .attr("data-target", (d) => d.target)
    .attr("stroke-dasharray", function(d) {
        if (d.shape.stroke === 'dash' || d.shape.stroke === 'dotted') {
            return d.shape.dashInterval }
        return false;
    })
    .attr("filter", function(d) {
        if (d.shape.stroke === 'double') {
            return 'url(#double)' }
        return false;
    });

if (graphProperties.arrows === true) {
    elts.links
        .attr("marker-end", 'url(#arrow)');
}

elts.nodes = svg.append("g")
    .selectAll("g")
    .data(data.nodes)
    .enter().append("g")
    .attr("data-node", (d) => d.id)
    .on('click', function(d) {
        openRecord(d.id);
    });

elts.circles = elts.nodes.append("circle")
    .attr("r", (d) => d.size)
    .attr("class", (d) => "n_" + d.type)
    .call(d3.drag()
        .on("start", function(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y; })
        .on("drag", function(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y; })
        .on("end", function(d) {
            if (!d3.event.active) simulation.alphaTarget(0.0001);
            d.fx = null;
            d.fy = null; })
        )
    .on('mouseenter', function(nodeMetas) {
        if (!graphProperties.highlight_on_hover) { return; }

        let nodesIdsHovered = [nodeMetas.id];

        const linksToModif = elts.links.filter(function(link) {
            if (link.source.id === nodeMetas.id || link.target.id === nodeMetas.id) {
                nodesIdsHovered.push(link.source.id, link.target.id);
                return false;
            }
            return true;
        })

        const nodesToModif = elts.nodes.filter(function(node) {
            if (nodesIdsHovered.includes(node.id)) {
                return false;
            }
            return true;
        })

        const linksHovered = elts.links.filter(function(link) {
            if (link.source.id !== nodeMetas.id && link.target.id !== nodeMetas.id) {
                return false;
            }
            return true;
        })

        const nodesHovered = elts.nodes.filter(function(node) {
            if (!nodesIdsHovered.includes(node.id)) {
                return false;
            }
            return true;
        })

        nodesHovered.classed('hover', true);
        linksHovered.classed('hover', true);
        nodesToModif.classed('translucent', true);
        linksToModif.classed('translucent', true);
    })
    .on('mouseout', function() {
        if (!graphProperties.highlight_on_hover) { return; }

        elts.nodes.classed('hover', false);
        elts.nodes.classed('translucent', false);
        elts.links.classed('hover', false);
        elts.links.classed('translucent', false);
    });

elts.labels = elts.nodes.append("text")
    .each(function(d) {
        const words = d.label.split(' ')
            , max = 25
            , text = d3.select(this);
        let label = '';

        for (let i = 0; i < words.length; i++) {
            // combine words and seperate them by a space caracter into label
            label += words[i] + ' ';

            // if label (words combination) is longer than max & not the single iteration
            if (label.length < max && i !== words.length - 1) { continue; }

            text.append("tspan")
                .attr('x', 0)
                .attr('dy', '1.2em')
                .text(label.slice(0, -1)); // remove last space caracter

            label = '';
        }
    })
    .attr('font-size', graphProperties.text_size)
    .attr('x', 0)
    .attr('y', (d) => d.size)
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle');

/** Functions
------------------------------------------------------------*/

/**
 * Get nodes and their links
 * @param {array} nodeIds - List of nodes ids
 * @returns {array} - DOM elts : nodes and their links
 */

function getNodeNetwork(nodeIds) {
    const diplayedNodes = elts.nodes
        .filter(item => item.hidden === false)
        .data()
        .map(item => item.id);

    const nodes = elts.nodes.filter(node => nodeIds.includes(node.id));

    const links = elts.links.filter(function(link) {
        if (!nodeIds.includes(link.source.id) && !nodeIds.includes(link.target.id)) {
            return false; }
        if (!diplayedNodes.includes(link.source.id) || !diplayedNodes.includes(link.target.id)) {
            return false; }

        return true;
    });

    return {
        nodes: nodes,
        links: links
    }
}

/**
 * Hide some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

window.hideNodes = function (nodeIds) {
    let nodesToHideIds;

    nodesToHideIds = data.nodes.filter(function(item) {
        if (nodeIds.includes(item.id) && item.hidden === false) {
            return true;
        }
    });

    if (view.focusMode) {
        nodesToHideIds = nodesToHideIds.filter(function(item) {
            if (item.isolated === true) {
                return true;
            }
        })
    }

    nodesToHideIds = nodesToHideIds
        .map(node => node.id);

    hideNodeNetwork(nodesToHideIds);
    hideFromIndex(nodesToHideIds);

    elts.nodes.data(
        elts.nodes
            .data()
            .map(function(node) {
                if (nodesToHideIds.includes(node.id)) {
                    node.hidden = true; }

                return node;
            })
    );
}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

window.displayNodes = function (nodeIds) {
    let nodesToDisplayIds;

    nodesToDisplayIds = data.nodes.filter(function(item) {
        if (nodeIds.includes(item.id) && item.hidden === true) {
            return true;
        }
    });

    if (view.focusMode) {
        nodesToDisplayIds = nodesToDisplayIds.filter(function(item) {
            if (item.isolated === true) {
                return true;
            }
        })
    }

    nodesToDisplayIds = nodesToDisplayIds
        .map(node => node.id);

    elts.nodes.data(
        elts.nodes
            .data()
            .map(function(node) {
                if (nodesToDisplayIds.includes(node.id)) {
                    node.hidden = false; }

                return node;
            })
    );

    displayNodeNetwork(nodesToDisplayIds);
    displayFromIndex(nodesToDisplayIds);
}

/**
 * Zoom to a node from its coordinates
 * @param {number} nodeId
 */

window.zoomToNode = function (nodeId) {
    const nodeToZoomMetas = elts.nodes.filter(node => node.id === nodeId).datum()
        , zoom = 2
        , recordWidth = recordContainer.offsetWidth;

    let x = nodeToZoomMetas.x
        , y = nodeToZoomMetas.y

    // coordonates to put the node at the graph top-left corner
    x = width / 2 - zoom * x;
    y = height / 2 - zoom * y;

    // add px to put the node to the graph center
    x += (window.innerWidth - recordWidth) / 2;
    y += window.innerHeight / 2;

    view.position = {
        zoom: zoom,
        x: x,
        y: y
    };

    translate();
}

/**
 * Display none nodes and their link
 * @param {array} nodeIds - List of nodes ids
 */

window.hideNodeNetwork = function (nodeIds) {
    const ntw = getNodeNetwork(nodeIds);

    ntw.nodes.style('display', 'none');
    ntw.links.style('display', 'none');
}

/**
 * Reset display nodes and their link
 * @param {array} nodeIds - List of nodes ids
 */

window.displayNodeNetwork = function (nodeIds) {
    const ntw = getNodeNetwork(nodeIds);

    ntw.nodes.style('display', null);
    ntw.links.style('display', null);
}

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {array} nodeIds - List of nodes ids
 */

window.highlightNodes = function (nodeIds) {
    const ntw = getNodeNetwork(nodeIds);

    ntw.nodes.classed('highlight', true);
    ntw.links.classed('highlight', true);

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
}

/**
 * remove highlightColor from all highlighted nodes and their links
 */

window.unlightNodes = function() {
    if (view.highlightedNodes.length === 0) { return; }

    const ntw = getNodeNetwork(view.highlightedNodes);

    ntw.nodes.classed('highlight', false);
    ntw.links.classed('highlight', false);

    view.highlightedNodes = [];
}

/**
 * Toggle display/hide nodes links
 * @param {bool} isChecked - 'checked' value send by a checkbox input
 */

window.linksDisplayToggle = function (isChecked) {
    if (isChecked) {
        elts.links.style('display', null);
    } else {
        elts.links.style('display', 'none');
    }
}

/**
 * Toggle display/hide nodes label
 * @param {bool} isChecked - 'checked' value send by a checkbox input
 */

window.labelDisplayToggle = function (isChecked) {
    if (isChecked) {
        elts.labels.style('display', null);
    } else {
        elts.labels.style('display', 'none');
    }
}

/**
 * Add 'highlight' class to texts linked to nodes ids
 * @param {array} nodeIds - List of node ids
 */

window.labelHighlight = function (nodeIds) {
    const labelsToHighlight = elts.nodes
        .filter(node => nodeIds.includes(node.id)).select('text');

    data.nodes = data.nodes.map(function(node) {
        if (nodeIds.includes(node.id)) {
            node.highlighted = true; }
        return node;
    });

    labelsToHighlight.classed('highlight', true);
}

/**
 * Change the font size of graph labels
 */

window.updateFontsize = function () {
    elts.labels.attr('font-size', graphProperties.text_size);
}

/**
 * Remove 'highlight' class from texts linked to nodes ids
 * @param {array} nodeIds - List of node ids
 */

window.labelUnlight = function (nodeIds) {
    const labelsToHighlight = elts.nodes
        .filter(node => nodeIds.includes(node.id)).select('text');

    data.nodes = data.nodes.map(function(node) {
        if (nodeIds.includes(node.id)) {
            node.highlighted = false; }
        return node;
    });

    labelsToHighlight.classed('highlight', false);
}

/**
 * Remove 'highlight' class from all texts
 */

window.labelUnlightAll = function () {
    data.nodes = data.nodes.map(function(node) {
        node.highlighted = false;
        return node;
    });

    elts.labels.classed('highlight', false);
}

})();