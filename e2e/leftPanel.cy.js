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

  describe('records index', () => {
    beforeEach(() => {
      cy.contains('Index').click();
      cy.get('#menu-container').scrollTo('bottom');
    });

    it('should display each record with alphabetical order', () => {
      cy.shouldIndexHasItems([
        'Augmenting Human Intellect: A Conceptual Framework',
        'Evergreen note titles are like APIs',
        'Evergreen notes',
        'Evergreen notes should be atomic',
        'Evergreen notes should be concept-oriented',
        'Evergreen notes should be densely linked',
        'How can we develop transformative tools for thought?',
        'Tools for thought',
      ]);
    });

    it('should display each unfliterd record', () => {
      cy.get('#types-form').contains('insight').click();

      cy.shouldIndexHasItems([
        'Augmenting Human Intellect: A Conceptual Framework',
        'Evergreen notes',
        'How can we develop transformative tools for thought?',
        'Tools for thought',
      ]);

      cy.get('#types-form').contains('insight').click();

      cy.shouldIndexHasItems([
        'Augmenting Human Intellect: A Conceptual Framework',
        'Evergreen note titles are like APIs',
        'Evergreen notes',
        'Evergreen notes should be atomic',
        'Evergreen notes should be concept-oriented',
        'Evergreen notes should be densely linked',
        'How can we develop transformative tools for thought?',
        'Tools for thought',
      ]);
    });
  });
});
