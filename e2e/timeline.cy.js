describe('Timeline', () => {
  beforeEach(() => {
    cy.visit('temp/timeline.html');
  });

  it('should display timeline', () => {
    cy.get('#timeline-checkbox').should('not.be.checked');
    cy.get('#timeline-form').should('not.be.visible');

    cy.contains('Mode chronologique').click();

    cy.get('#timeline-checkbox').should('be.checked');
    cy.get('#timeline-form').should('be.visible');
  });

  describe('timeline is visible', () => {
    beforeEach(() => {
      cy.contains('Mode chronologique').click();
    });

    it('should output display date', () => {
      cy.get('#timeline-form output').should('have.text', '31/12/1853');
      cy.get('#timeline-form option')
        .eq(1)
        .then((elt) => {
          elt.click();
          cy.get('#timeline-form output').should('have.text', elt.text());
        });
    });

    it('should hide nodes', () => {
      cy.get('[data-node="20210801132906"]').should('be.visible');
      cy.get('[data-node="20210901132906"]').should('not.be.visible');
      cy.get('[data-node="20210101132906"]').should('not.be.visible');

      cy.get('#timeline-form input').trigger('value', -2228347880);

      cy.get('[data-node="20210801132906"]').should('be.visible');
      cy.get('[data-node="20210901132906"]').should('be.visible');
      cy.get('[data-node="20210101132906"]').should('not.be.visible');

      cy.get('#timeline-form option').last().click();

      cy.get('[data-node="20210801132906"]').should('not.be.visible');
      cy.get('[data-node="20210901132906"]').should('not.be.visible');
      cy.get('[data-node="20210101132906"]').should('be.visible');
    });
  });
});
