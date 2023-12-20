window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('view-save').addEventListener('click', () => {
    const url = new URL(window.location);

    const activeFilters = Array.from(document.querySelectorAll('#types-form input:checked')).map(
      ({ name }) => name,
    );
    const linkForm = document.getElementById('link-types-form');
    const activeLinkFilters = linkForm ? Array.from(linkForm.querySelectorAll('input:checked')).map(
        ({ name }) => name,
    ) : [];
    const tagForm = document.getElementById('tags-form');
    const activeTags = tagForm ? Array.from(tagForm.querySelectorAll('input:checked')).map(
        ({ name }) => name,
    ) : [];
    const focusLevel = document.getElementById('focus-input').value;

    if (activeFilters.length > 0) {
      url.searchParams.set('filters', activeFilters.join('-'));
    }

    if (activeLinkFilters.length > 0 && activeLinkFilters.length < Object.keys(linkTypeList).length) {
      url.searchParams.set('link-filters', activeLinkFilters.join('-'));
    } else {
      url.searchParams.delete('link-filters');
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
