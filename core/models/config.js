/**
 * @file Manage the user config
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const { app } = require('electron')
    , path = require('path')
    , fs = require('fs');

const baseConfig = require('../data/base-config');

/** Class to manage the user config */

module.exports = class Config {

    static minValues = {
        focus_max: 0,
        graph_text_size: 1,
        graph_attraction_force: 50,
        graph_attraction_distance_max: 200,
        graph_attraction_verticale: 0,
        graph_attraction_horizontale: 0
    };

    /**
     * Create a user config.
     * @param {object} opts - Options to change from the default config.
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
     * Get the config options from the (file) path
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
     * @return {object} - Ordered object.
     */

    serialize () {
        const template = {
            graph: {
                attraction: {}
            }
        }

        for (const opt in this.opts) {
            let optionLabels = opt.split('_');

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
     * Verif if the config options from the (file) path exist
     * @return {boolean} - True if the config file exist.
     */

    isSet () {
        if (fs.existsSync(this.path)) {
            return true;
        }
        return false;
    }

    /**
     * Verif if the config inform the system about essentials options
     * @return {boolean} - True if the config contains essentials options.
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

        if (this.opts.graph_highlight_on_hover !== true && this.opts.graph_highlight_on_hover !== false) {
            errs.push('L\'option de surbrillance est une valeur binaire.'); }

        if (Config.confirmNumberValue(this.opts.graph_text_size, Config.minValues.graph_text_size)) {
            errs.push(`La taille de étiquettes du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_text_size}.`); }

        if (this.opts.graph_arrows !== true && this.opts.graph_arrows !== false) {
            errs.push('L\'option des liens flèchés est une valeur binaire.'); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_force, Config.minValues.graph_attraction_force)) {
            errs.push(`La force de répulsion du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_force}.`); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_distance_max, Config.minValues.graph_attraction_distance_max)) {
            errs.push(`La force de répulsion maximum du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_distance_max}.`); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_verticale, Config.minValues.graph_attraction_verticale)) {
            errs.push(`La force de répulsion verticale du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_verticale}.`); }

        if (Config.confirmNumberValue(this.opts.graph_attraction_horizontale, Config.minValues.graph_attraction_horizontale)) {
            errs.push(`La force de répulsion horizontale du graphe doit être un nombre supérieur ou égal à ${Config.minValues.graph_attraction_horizontale}.`); }

        return errs;
    }

    /**
     * Verif if the value is a number and upper than its min value
     * @return {boolean} - True of it is correct.
     */

    static confirmNumberValue (value, valueMin) {
        value = Number(value);

        if (isNaN(value) === false && value < valueMin) {
            return true; }

        return false;
    }
}