/**
 * @file Cosmoscope generator
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright MIT License ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs');

const baseConfig = require('../data/base-config');

/**
 * Class to manage the user config
 */

module.exports = class Config {

    /**
     * Min value for each number options
     * Apply to config form and to verif values from this class
     * @static
     */

    static minValues = {
        focus_max: 0,
        graph_text_size: 1,
        graph_attraction_force: 50,
        graph_attraction_distance_max: 200,
        graph_attraction_verticale: 0,
        graph_attraction_horizontale: 0
    };

    /**
     * List of valid values for the links stroke
     * Apply to config form
     * @static
     */

    static linkStrokes = ['simple', 'double', 'dotted', 'dash'];

    /**
     * Create a user config.
     * @param {object} opts - Options to change from the last
     * (or default config if config file does not exist).
     */

    constructor (opts) {
        // path to save config file
        this.path = path.join(app.getPath('userData'), 'config.json');

        this.get();

        if (!opts) { return; }

        this.opts = Object.assign(this.opts, opts);
    }

    /**
     * Save the config options to the (file) path
     * @return {mixed} - True if the config file is saved, false if fatal error
     * or the errors array
     */

    save () {
        try {
            const errs = this.getErrors();

            if (errs.length !== 0) {
                return errs;
            }

            fs.writeFileSync(this.path, JSON.stringify(this.opts));

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get the last config options from the (config file) path
     * or default config if config file does not exist
     * @return {boolean} - True if the config file is gotten.
     */

    get () {
        if (this.isSet() === false) {
            this.opts = baseConfig;
            return false;
        }

        try {
            const configFileContent = fs.readFileSync(this.path, 'utf8');
            this.opts = JSON.parse(configFileContent);

            return true;
        } catch (error) {
            this.opts = baseConfig;
            console.log('lecture error');
            return false;
        }
    }

    /**
     * Get config options in an ordered object with categories (ex: graph)
     * for Template object
     * @return {object} - Ordered object.
     */

    serializeForTemplate () {
        const template = {
            metas: {},
            graph: {
                attraction: {}
            }
        }

        for (const opt in this.opts) {
            let optionLabels = opt.split('_');

            if (optionLabels[0] === 'metas') {
                optionLabels = optionLabels.slice(1);

                const fullLabel = optionLabels.join('_');
                template.metas[fullLabel] = this.opts[opt];
                continue;
            }

            if (optionLabels[0] === 'graph') {
                optionLabels = optionLabels.slice(1);

                if (optionLabels[0] === 'attraction') {
                    optionLabels = optionLabels.slice(1);

                    const fullLabel = optionLabels.join('_');
                    template.graph.attraction[fullLabel] = this.opts[opt];
                    continue;
                }

                const fullLabel = optionLabels.join('_');
                template.graph[fullLabel] = this.opts[opt];
                continue;
            }

            const fullLabel = optionLabels.join('_');

            template[fullLabel] = this.opts[opt];
        }

        return template;
    }

     /**
     * Get config options in an ordered object with categories (ex: graph)
     * for Graph object
     * @return {object} - Ordered object.
     */

    serializeForGraph () {
        let template = {};

        [
            'files_origin', 'focus_max', 'record_types', 'link_types',
            'bibliography', 'csl', 'bibliography_locales'
        ].forEach(key => {
            template[key] = this.opts[key];
        });

        return template;
    }

    /**
     * Verif if the config options from the (file) path exist
     * @return {boolean} - True if the config file exist.
     */

    isSet () {
        if (fs.existsSync(this.path) === true) {
            return true;
        }
        return false;
    }

    /**
     * Verif if the config contains values for each options from default config
     * @return {boolean} - True if the config contains default config options.
     */

    isCompleted () {
        for (const opt in baseConfig) {
            if (this.opts[opt] === '' ||
                this.opts[opt] === undefined ||
                this.opts[opt] === null)
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Verif if the config options are correct
     * @return {array} - Error message for each correction to do.
     */

    getErrors () {
        let errs = [];

        if (!fs.existsSync(this.opts.files_origin)) {
            errs.push('Vous devez indiquer un chemin valide vers votre répertoire de fichiers Markdown.'); }

        if (Config.confirmNumberValue(this.opts.focus_max, Config.minValues.focus_max)) {
            errs.push(`Le niveau de focus doit être un nombre supérieur ou égal à ${Config.minValues.focus_max}.`); }

        if (!this.opts.record_types.undefined) {
            errs.push('Le type de fiche "undefined" doit être défini comme valeur par défaut.'); }

        if (!this.opts.link_types.undefined) {
            errs.push('Le type de lien "undefined" doit être défini comme valeur par défaut.'); }
        for (const type in this.opts.link_types) {
            if (!this.opts.link_types[type].stroke || !this.opts.link_types[type].color) {
                errs.push('Tous les types de lien doivent renseigner une couleur et un type de trait.'); }
        }

        if (typeof this.opts.graph_highlight_on_hover !== 'boolean') {
            errs.push('L\'option de surbrillance est une valeur binaire.'); }

        if (Config.confirmNumberValue(this.opts.graph_text_size, Config.minValues.graph_text_size)) {
            errs.push(`La taille de étiquettes du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_text_size}.`); }

        if (typeof this.opts.graph_arrows !== 'boolean') {
            errs.push('L\'option des liens flèchés est une valeur binaire.'); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_force, Config.minValues.graph_attraction_force)) {
            errs.push(`La force de répulsion du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_force}.`); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_distance_max, Config.minValues.graph_attraction_distance_max)) {
            errs.push(`La force de répulsion maximum du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_distance_max}.`); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_verticale, Config.minValues.graph_attraction_verticale)) {
            errs.push(`La force de répulsion verticale du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_verticale}.`); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_horizontale, Config.minValues.graph_attraction_horizontale)) {
            errs.push(`La force de répulsion horizontale du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_horizontale}.`); }

        if (typeof this.opts.custom_css !== 'boolean') {
            errs.push('L\'option CSS personnalisé est une valeur binaire.'); }
        else if (this.opts.custom_css === true && (!this.opts['custom_css_path'] || !fs.existsSync(this.opts['custom_css_path']))) {
            errs.push('Vous devez indiquer un chemin valide vers le fichier CSS personnalisé.');
        }

        if (typeof this.opts.devtools !== 'boolean') {
            errs.push('L\'option des outils de développement est une valeur binaire.'); }

        if (typeof this.opts.minify !== 'boolean') {
            errs.push('L\'option des minification est une valeur binaire.'); }

        // optionnals

        if (this.opts['bibliography'] && !fs.existsSync(this.opts['bibliography'])) {
            errs.push('Vous devez indiquer un chemin valide vers le fichier de références bibliographiques.'); }

        if (this.opts['csl'] && !fs.existsSync(this.opts['csl'])) {
            errs.push('Vous devez indiquer un chemin valide vers le fichier de styles bibliographiques.'); }

        if (this.opts['bibliography_locales'] && !fs.existsSync(this.opts['bibliography_locales'])) {
            errs.push('Vous devez indiquer un chemin valide vers le fichier de formatage des références bibliographiques.'); }

        return errs;
    }

    /**
     * Verif if the value is a number and upper than its min value
     * @return {boolean} - True if it is correct.
     */

    static confirmNumberValue (value, valueMin) {
        value = Number(value);

        if (isNaN(value) === false && value < valueMin) {
            return true; }

        return false;
    }
}