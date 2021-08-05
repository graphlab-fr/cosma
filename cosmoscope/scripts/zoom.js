/**
 * @file Controls & apply zoom from graph.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

(function () {

    const zoomInterval = 0.3 // interval between two (de)zoom
        , zoomMax = 3
        , zoomMin = 1;
    
    svg.call(d3.zoom().on('zoom', function () {
        // for each move one the SVG

        if (d3.event.sourceEvent === null) {
            zoomMore();
            return;
        }

        switch (d3.event.sourceEvent.type) {
            case 'wheel':
                // by mouse wheel
                if (d3.event.sourceEvent.deltaY >= 0) {
                    zoomLess();
                } else {
                    zoomMore();
                }
                break;

            case 'mousemove':
                // by drag and move with mouse
                view.position.x += d3.event.sourceEvent.movementX;
                view.position.y += d3.event.sourceEvent.movementY;
        
                translate();
                break;
        }
    }));

    function zoomMore() {
        view.position.zoom += zoomInterval;
    
        if (view.position.zoom >= zoomMax) {
            view.position.zoom = zoomMax; }
    
        translate();
    }
    
    function zoomLess() {
        view.position.zoom -= zoomInterval;
    
        if (view.position.zoom <= zoomMin) {
            view.position.zoom = zoomMin; }
    
        translate();
    }
    
    function zoomReset() {
        view.position.zoom = 1;
        view.position.x = 0;
        view.position.y = 0;
    
        translate();
    }
    
    // export functions on global namespace
    window.zoomMore = zoomMore;
    window.zoomLess = zoomLess;
    window.zoomReset = zoomReset;
    
})();

/**
 * Change 'style' attribute of SVG to change view
 */
    
function translate() {
    svg.attr('style', `transform:translate(${view.position.x}px, ${view.position.y}px) scale(${view.position.zoom});`);
}