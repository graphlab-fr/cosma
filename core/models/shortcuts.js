const {
    globalShortcut,
    BrowserWindow
} = require('electron');

globalShortcut.register('Escape', () => {
    const window = BrowserWindow.getFocusedWindow();

    if (!window) {
        return; }

    if (window.isModal() === false) {
        return; }

    window.close();
})