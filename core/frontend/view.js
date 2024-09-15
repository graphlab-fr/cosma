window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('view-save').addEventListener('click', () => {
    const url = new URL(window.location);

    const activeFilters = Array.from(document.querySelectorAll('#types-form input:checked')).map(
      ({ name }) => name,
    );
    const activeTags = Array.from(document.querySelectorAll('#tags-form input:checked')).map(
      ({ name }) => name,
    );
    const focusLevel = document.getElementById('focus-input').value;

    if (activeFilters.length > 0) {
      url.searchParams.set('filters', activeFilters.join('-'));
    }
    if (activeTags.length > 0) {
      url.searchParams.set('tags', activeTags.join('-'));
    }
    if (document.querySelector('#focus-check:checked')) {
      url.searchParams.set('focus', focusLevel);
    }

    window.location.replace(url);
  });
});
