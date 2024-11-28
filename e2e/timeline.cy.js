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
      cy.get('#timeline-form option')
        .eq(1)
        .then((elt) => {
          elt.click();
          cy.get('#timeline-form output').should('have.text', elt.text());
        });
    });

    it('should hide nodes', () => {
      cy.shouldGraphHasNodes(['Henry La Fontaine']);

      cy.get('#timeline-form input').invoke('val', -2228347880).trigger('input');

      cy.shouldGraphHasNodes(['Henry La Fontaine', 'Paul Otlet']);

      cy.get('#timeline-form option').last().click();

      cy.shouldGraphHasNodes(['Robert Pagès']);
    });
  });
});
