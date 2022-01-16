/**
 * @file Script on doc window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

window.addEventListener("DOMContentLoaded", () => {
    const toHide = document.querySelector('.nav-lang');
    toHide.setAttribute('hidden', true);
});