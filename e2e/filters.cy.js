const data = require('./batch/data.json');

const allTitles = data.map(({ title }) => title);

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

  it('should display number of types', () => {
    cy.get('.menu-types .menu-title').find('.badge').should('contain.text', filters.length);
  });

  it('should display number of records for each filter', () => {
    cy.get('@filtersContainer').find('.badge').as('badges');

    cy.get('@badges').should('have.length', filters.length);
    cy.get('@badges').eq(0).should('contain', '1');
    cy.get('@badges').eq(1).should('contain', '6');
    cy.get('@badges').eq(2).should('contain', '1');
    cy.get('@badges').eq(3).should('contain', '1');
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

  it('should filter node with several types', () => {
    cy.shouldGraphHasNodes(allTitles);

    clickOnFilter('otlet');
    cy.shouldGraphHasNodes(allTitles);

    clickOnFilter('personne');
    cy.shouldGraphHasNodes(['Mundaneum', 'CDU']);

    clickOnFilter('otlet');
    cy.shouldGraphHasNodes(['Paul Otlet', 'Mundaneum', 'CDU']);

    clickOnFilter('otlet');
    cy.shouldGraphHasNodes(['Mundaneum', 'CDU']);

    clickOnFilter('personne');
    cy.shouldGraphHasNodes(allTitles);
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
