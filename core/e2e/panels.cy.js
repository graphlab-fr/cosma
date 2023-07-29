describe('Panels', () => {
  before(() => {
    cy.visit('/temp/cosmoscope.html');
  });

  describe('help', () => {
    it('should button contains "help"', () => {
      cy.get('.btn-help').contains('Help');
    });

    it('should button open reader', () => {
      cy.get('.btn-help').click();
      cy.get('#record-container').should('have.class', 'active');
    });

    it('should reader contains a valid link to the documentation', () => {
      cy.get('.link-documentation').should('have.attr', 'href').and('not.be.empty');
    });

    it('should button close reader', () => {
      cy.get('.record-btn-close').click();
      cy.get('#record-container').should('not.have.class', 'active');
    });
  });

  describe('data', () => {
    it('should button contains "Data"', () => {
      cy.get('.bibliography-open').contains('Data');
    });

    it('should button open reader', () => {
      cy.get('.bibliography-open').click();
      cy.get('#record-container').should('have.class', 'active');
    });

    it('should button close reader', () => {
      cy.get('.record-btn-close').click();
      cy.get('#record-container').should('not.have.class', 'active');
    });
  });
});
