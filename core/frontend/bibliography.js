/**
 * @file Download references data from the cosmoscope.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

/**
 * Download data of the bibliography
 */

window.addEventListener('DOMContentLoaded', () => {
  const bibliographyContainer = document.getElementById('citation-references'),
    btn = bibliographyContainer?.querySelector('button'),
    code = bibliographyContainer?.querySelector('code');

  if (!btn) {
    return;
  }

  btn.addEventListener('click', () => {
    const virtualLink = document.createElement('a');
    virtualLink.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(code.textContent),
    );
    virtualLink.setAttribute('download', 'bibliography.json');
    virtualLink.style.display = 'none';
    document.body.appendChild(virtualLink);

    virtualLink.click();
    virtualLink.remove();
  });
});
