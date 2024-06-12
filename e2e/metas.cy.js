describe('metas', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should display cosmoscope title', () => {
    cy.get('.title').should('have.text', 'Cosma demo: Evergreen notes');
  });

  describe('"about" panel', () => {
    beforeEach(() => cy.get('#credits').as('creditPanel'));

    it('should display "about" panel on click', () => {
      cy.get('@creditPanel').should('not.have.class', 'active');
      cy.contains('À propos').click();
      cy.get('@creditPanel').should('have.class', 'active');
    });

    describe('is open', () => {
      beforeEach(() => cy.contains('À propos').click());

      it('should display title', () => {
        cy.get('@creditPanel')
          .find('.metas-title')
          .should('be.visible')
          .should('have.text', 'Cosma demo: Evergreen notes');
      });

      it('should display author', () => {
        cy.get('@creditPanel')
          .find('.metas-author')
          .should('be.visible')
          .should('have.text', 'Arthur Perret');
      });

      it('should display description', () => {
        cy.get('@creditPanel')
          .find('.metas-description')
          .should('be.visible')
          .should('have.text', 'Notes by Andy Matuschak; presentation by Arthur Perret');
      });
    });
  });

  describe('"data" panel', () => {
    beforeEach(() => cy.get('#citation-references').as('dataPanel'));

    it('should display "data" panel on click', () => {
      cy.get('@dataPanel').should('not.have.class', 'active');
      cy.contains('Données').click();
      cy.get('@dataPanel').should('have.class', 'active');
    });
  });
});

it('should not have "data" panel if no citeproc', () => {
  cy.visit('temp/batch.html');
  cy.contains('Données').should('not.exist');
});
