describe('tags', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
    cy.get('#tags-form').as('tagsContainer');
  });

  /** @param {string[]} names */
  function assertTagsAreChecked(names) {
    cy.get('@tagsContainer')
      .find('input:checked')
      .should('have.length', names.length)
      .each((elt) => {
        expect(elt.attr('name')).to.be.oneOf(names);
      });
  }

  it('should display tags from list', () => {
    cy.contains('Mots-clés').click();
    cy.get('#tags-form').find('label').should('have.length', 2);
  });

  it('should display nodes has selected tag from list', () => {
    assertTagsAreChecked([]);

    cy.contains('Mots-clés').click();

    cy.contains('wip').click();
    assertTagsAreChecked(['wip']);
    cy.shouldGraphHasNodes(['Evergreen notes should beconcept-oriented', 'Tools for thought']);
    cy.contains('wip').click();
    assertTagsAreChecked([]);

    cy.contains('quotes').click();
    assertTagsAreChecked(['quotes']);
    cy.shouldGraphHasNodes(['Tools for thought']);
  });

  it('should display tags from URL params', () => {
    cy.visit('temp/citeproc.html?tags=quotes');
    assertTagsAreChecked(['quotes']);
    cy.shouldGraphHasNodes(['Tools for thought']);
  });

  it('should apply tags as URL params on click on view action', () => {
    cy.contains('Mots-clés').click();

    cy.contains('wip').click();

    cy.contains("Appliquer la vue actuelle à l'URL").click();

    cy.location('search').should((loc) => {
      expect(loc).to.equal('?filters=insight-concept-reference&tags=wip');
    });
  });

  it('should display nodes has selected tag from node', () => {
    cy.get('[data-node="tools for thought"]').click();
    cy.get('.record.active .record-tags').contains('wip').click();
    cy.shouldGraphHasNodes(['Evergreen notes should beconcept-oriented', 'Tools for thought']);
  });
});
