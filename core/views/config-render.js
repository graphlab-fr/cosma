const form = document.getElementById('form-config');

/**
 * Form submition & feedback : send data and after display the response
 */

(function () {

const output = form.querySelector('output');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = new FormData(form);
    data = Object.fromEntries(data);
    data = serializeData(data);

    window.api.send("sendConfigOptions", data);

    window.api.receive("confirmConfigRegistration", (response) => {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;
    });
})

})();

/**
 * Serialize data for the Config model
 * Assign form fields to config options
 * Several input must be serialize to an array for one option like types
 * @param {object} - Data from config form
 * @return {object} - Data serialized
 */

function serializeData (data) {

    if (data['graph_highlight_on_hover'] !== undefined && data['graph_highlight_on_hover'] === 'on') {
        data['graph_highlight_on_hover'] = true;
    } else {
        data['graph_highlight_on_hover'] = false;
    }

    if (data['graph_arrows'] !== undefined && data['graph_arrows'] === 'on') {
        data['graph_arrows'] = true;
    } else {
        data['graph_arrows'] = false;
    }

    return data;
}

/**
 * Add NODE TYPE field
 * On click on the button, add a fieldset for input a node type
 */

(function () {

const addTypeField = document.getElementById('add-type-record')
    , addTypeAddBtn = addTypeField.querySelector('button');

let counter = 1;

addTypeAddBtn.addEventListener('click', () => {
    counter++;

    addTypeField.insertAdjacentHTML('beforeend', 
`<fieldset>
    <legend>Type fiches ${counter}</legend>

    <label>
        Nom
        <input type="text" name="${counter}_record_types_name">
    </label>

    <label>
        Couleur
        <input type="color" name="${counter}_record_types_color">
    </label>
</fieldset>`)
});
    
})();

/**
 * Add LINK TYPE field
 * On click on the button, add a fieldset for input a link type
 */

(function () {

const addTypeField = document.getElementById('add-type-link')
    , addTypeAddBtn = addTypeField.querySelector('button');

let counter = 1;

addTypeAddBtn.addEventListener('click', () => {
    counter++;

    addTypeField.insertAdjacentHTML('beforeend', 
`<fieldset>
<legend>Type liens ${counter}</legend>

<label>
    Nom
    <input type="text" name="${counter}_link_types_name" value="undefined" readonly>
</label>

<label>
    Couleur
    <input type="color" name="${counter}_link_types_color">
</label>

<label>
    Trait
    <select name="${counter}_link_types_stroke">
        <option value="simple">simple</option>
        <option value="double">double</option>
        <option value="dash">tirets</option>
        <option value="dotted">pointillé</option>
    </select>
</label>
</fieldset>`)
});
    
})();