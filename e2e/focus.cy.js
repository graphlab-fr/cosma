describe('focus', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  describe('have select node', () => {
    beforeEach(() => cy.get('[data-node="evergreen notes should be densely linked"]').click());

    function assertFocusIsActive() {
      cy.get('#focus-check').should('be.checked');
      cy.get('#focus-input').should('have.focus');
    }

    it('should active focus on click if record selected', () => {
      cy.get('.graph-control-label').click();
      assertFocusIsActive();
    });

    it('should active focus on press "f" key if record selected', () => {
      cy.get('body').trigger('keydown', { keyCode: 70 });
      assertFocusIsActive();
    });

    describe('have active focus', () => {
      beforeEach(() => {
        cy.get('.graph-control-label').click();
        assertFocusIsActive();
      });

      it('should display more nodes if range inscrease', () => {
        cy.shouldGraphHasNodes([
          'Evergreen notes should beconcept-oriented',
          'Evergreen notes should bedensely linked',
        ]);

        cy.get('#focus-input')
          .should('have.attr', 'max', 2)
          .should('have.attr', 'value', 1)
          .invoke('val', 2)
          .trigger('input');

        cy.shouldGraphHasNodes([
          'Evergreen notes should beconcept-oriented',
          'Evergreen notes should bedensely linked',
          'Evergreen notes',
        ]);
      });
    });
  });

  function assertFocusIsNotActive() {
    cy.get('#focus-check').should('not.be.checked');
  }

  it('should not active focus on click if no record selected', () => {
    cy.get('.graph-control-label').click();
    assertFocusIsNotActive();
  });

  it('should not active focus on press "f" key if no record selected', () => {
    cy.get('body').trigger('keydown', { keyCode: 70 });
    assertFocusIsNotActive();
  });
});
