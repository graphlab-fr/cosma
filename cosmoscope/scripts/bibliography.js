/**
 * @file Download data from the cosmoscope.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

/**
 * Download data of the bibliography
 */

(function() {
    const bibliographyContainer = document.getElementById('citation-references')
        , btn = bibliographyContainer.querySelector('button')
        , code = bibliographyContainer.querySelector('code');

    btn.addEventListener('click', () => {
        const virtualLink = document.createElement('a');
        virtualLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code.textContent));
        virtualLink.setAttribute('download', 'bibliography.json');
        virtualLink.style.display = 'none';
        document.body.appendChild(virtualLink);
    
        virtualLink.click();
        virtualLink.remove();
    });

})();