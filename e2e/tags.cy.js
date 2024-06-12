describe('tags', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should display tags from list', () => {
    cy.contains('Mots-clés').click();
    cy.get('#tags-form').find('label').should('have.length', 2);
  });

  it('should display nodes has selected tag from list', () => {
    cy.contains('Mots-clés').click();

    cy.contains('wip').click();
    cy.shouldGraphHasNodes(['Evergreen notes should beconcept-oriented', 'Tools for thought']);
    cy.contains('wip').click();

    cy.contains('quotes').click();
    cy.shouldGraphHasNodes(['Tools for thought']);
  });

  it('should display nodes has selected tag from node', () => {
    cy.get('[data-node="tools for thought"]').click();
    cy.get('.record.active .record-tags').contains('wip').click();
    cy.shouldGraphHasNodes(['Evergreen notes should beconcept-oriented', 'Tools for thought']);
  });
});
