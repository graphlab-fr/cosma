describe('left panel', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
    cy.get('#menu-container').as('leftPanel');
  });

  it('should close on click on left close button', () => {
    cy.get('@leftPanel').should('have.class', 'active');
    cy.get('#close-left-side').click();
    cy.get('@leftPanel').should('not.have.class', 'active');
    cy.get('#close-left-side').click();
    cy.get('@leftPanel').should('have.class', 'active');
  });
});
