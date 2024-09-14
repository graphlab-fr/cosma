describe('focus', () => {
  function assertFocusIsActive() {
    cy.get('#focus-check').should('be.checked');
    cy.get('#focus-input').should('have.focus');
  }

  function assertFocusIsNotActive() {
    cy.get('#focus-check').should('not.be.checked');
  }

  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  describe('have select node', () => {
    beforeEach(() => cy.get('[data-node="evergreen notes should be densely linked"]').click());

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

        cy.shouldGraphHasNodes([
          'Evergreen notes should beconcept-oriented',
          'Evergreen notes should bedensely linked',
        ]);
      });

      it('should toggle hide nodes', () => {
        cy.get('.graph-control-label').click();

        cy.shouldGraphHasNodes([
          'Augmenting Human Intellect:A Conceptual Framework',
          'Evergreen note titles arelike APIs',
          'Evergreen notes',
          'Evergreen notes should beatomic',
          'Evergreen notes should beconcept-oriented',
          'Evergreen notes should bedensely linked',
          'How can we develop transformativetools for thought?',
          'Tools for thought',
        ]);
      });

      it('should display more nodes if range inscrease', () => {
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

  it('should not active focus on click if no record selected', () => {
    cy.get('.graph-control-label').click();
    assertFocusIsNotActive();
  });

  it('should not active focus on press "f" key if no record selected', () => {
    cy.get('body').trigger('keydown', { keyCode: 70 });
    assertFocusIsNotActive();
  });
});
