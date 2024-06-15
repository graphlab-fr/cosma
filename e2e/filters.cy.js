const data = require('./batch/data.json');

describe('Filters', () => {
  beforeEach(() => {
    cy.visit('temp/batch.html');
    cy.get('#types-form').as('filtersContainer');
  });

  /** @param {string[]} names */
  function assertFiltersAreChecked(names) {
    cy.get('@filtersContainer')
      .find('.filter input:checked')
      .should('have.length', names.length)
      .each((elt) => {
        expect(elt.attr('name')).to.be.oneOf(names);
      });
  }

  /** @param {string} name */
  function clickOnFilter(name) {
    cy.get('@filtersContainer').contains(name).click();
  }

  const filters = ['œuvre', 'personne', 'institution', 'otlet'];

  it('should display filter for each type', () => {
    filters.forEach((filterName) => {
      cy.get('@filtersContainer').contains(filterName).should('be.visible');
    });
  });

  it('should check all filters if no URL params', () => {
    assertFiltersAreChecked(filters);
  });

  it('should apply filters as URL params on click on view action', () => {
    clickOnFilter('œuvre');
    clickOnFilter('personne');
    clickOnFilter('institution');

    cy.contains("Appliquer la vue actuelle à l'URL").click();

    cy.location('search').should((loc) => {
      expect(loc).to.equal('?filters=otlet');
    });
  });

  it('should check only filters from URL params', () => {
    cy.visit('temp/batch.html?filters=personne-otlet');
    assertFiltersAreChecked(['personne', 'otlet']);
  });

  it('should uncheck input on filter label click', () => {
    cy.get('@filtersContainer').find('.filter').first().as('filter');
    cy.get('@filter').find('input').should('be.checked');
    cy.get('@filter').click();
    cy.get('@filter').find('input').should('not.be.checked');
  });

  it('should toggle filter toggle node visibility', () => {
    const allTitles = data.map(({ title }) => title);

    cy.shouldGraphHasNodes(allTitles);

    clickOnFilter('œuvre');
    assertFiltersAreChecked(['personne', 'institution', 'otlet']);

    cy.shouldGraphHasNodes(allTitles.filter((title) => title !== 'CDU'));

    clickOnFilter('œuvre');
    assertFiltersAreChecked(['personne', 'œuvre', 'institution', 'otlet']);

    cy.shouldGraphHasNodes(allTitles);

    clickOnFilter('personne');
    assertFiltersAreChecked(['œuvre', 'institution', 'otlet']);

    cy.shouldGraphHasNodes(['Mundaneum', 'CDU', 'Paul Otlet']);

    clickOnFilter('otlet');
    assertFiltersAreChecked(['œuvre', 'institution']);

    cy.shouldGraphHasNodes(['Mundaneum', 'CDU']);
  });

  describe('with alt key', () => {
    it('should uncheck all inputs but not clicked one if alt key is pressed', () => {
      assertFiltersAreChecked(filters);

      cy.get('@filtersContainer').contains('personne').click({ altKey: true });

      assertFiltersAreChecked(['personne']);
    });

    it('should check all inputs if alt key is pressed on a second click on same filter', () => {
      assertFiltersAreChecked(filters);

      cy.get('@filtersContainer').contains('personne').click({ altKey: true });

      assertFiltersAreChecked(['personne']);

      cy.get('@filtersContainer').contains('personne').click({ altKey: true });

      assertFiltersAreChecked(filters);
    });
  });
});
