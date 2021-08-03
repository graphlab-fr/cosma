/**
 * @file Default parameters and values for the minimal Cosma's config
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

module.exports = {
    files_origin: '',
    export_target: '',
    focus_max: 2,
    record_types: { undefined: 'grey' },
    link_types: { undefined: { stroke: 'simple', color: 'rgb(225, 225, 225)' } },
    graph: {
        background_color: 'white',
        highlight_color: 'red',
        highlight_on_hover: true,
        text_size: 10,
        attraction: { force: -50, distance_max: 250, verticale: 0, horizontale: 0 },
        arrows: false
    }
}