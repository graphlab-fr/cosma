/**
 * @file Set keyboard shortcuts. Global var if keyboard shortcuts are activated and which ones.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

let keyboardShortcutsAreWorking = true;

/**
 * Keyboard shortcuts
 * @type {object}
 * @default
 */

const pressedKeys = {
    Control: false,
    Alt: false,
    Shift: false
};

document.onkeydown = (e) => {
 
    if (keyboardShortcutsAreWorking) {
 
        switch (e.key) {
            case 's':
                if (pressedKeys['Control'] === true) { return; }
                e.preventDefault();

                searchInput.focus();
                return;

            case 'r':
                if (pressedKeys['Control'] === true) { return; }
                e.preventDefault();

                zoomReset();

                if (pressedKeys.Alt) {
                    resetView();
                }

                return;

            case '®': // [Alt + R] on Mac OS
                if (pressedKeys['Control'] === true) { return; }
                e.preventDefault();

                resetView();

                return;

            case 'c':
                console.log(pressedKeys['Control']);
                if (pressedKeys['Control'] === true) { return; }
                e.preventDefault();

                if (view.openedRecordId !== undefined && Number(view.openedRecordId) !== NaN) {
                    zoomToNode(Number(view.openedRecordId)); }
                return;

            case 'f':
                if (pressedKeys['Control'] === true) { return; }
                e.preventDefault();

                if (focus.isActive) {
                    focus.disable();
                } else {
                    focus.init();
                }
                return;

            case ' ':
                if (pressedKeys['Control'] === true) { return; }
                e.preventDefault();

                document.querySelector('.load-bar').click();
                return;
        }
    }
 
    switch (e.key) {
        case 'Escape':
            closeRecord();
            return;

        case 'Control':
            pressedKeys[e.key] = true;
            return;

        case 'Meta':
            pressedKeys['Control'] = true;
            return;

        case 'Alt':
            pressedKeys[e.key] = true;
            return;

        case 'Shift':
            pressedKeys[e.key] = true;
            return;
    }
 };
 
window.onkeyup = function(e) {
    switch (e.key) {
        case 'Control':
            pressedKeys[e.key] = false;
            return;

        case 'Meta':
            pressedKeys['Control'] = false;
            return;

        case 'Alt':
            pressedKeys[e.key] = false;
            return;

        case 'Shift':
            pressedKeys[e.key] = false;
            return;
    }
}