describe('Search', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should get search result after type record name', () => {
    cy.get('#search').type('Evergreen notes');
    cy.get('.search-result-item .record-title').first().should('have.text', 'Evergreen notes');
  });

  it('should key "s" focus on search', () => {
    cy.get('#search').should('not.have.focus');
    cy.get('body').trigger('keydown', { keyCode: 83 });
    cy.get('#search').should('have.focus');
  });

  it('should change outlined result on click on arrow and open outlined record on enter', () => {
    cy.get('#search').type('notes');
    cy.get('.search-result-item').should('have.length', 5);
    cy.get('.search-result-item').eq(0).should('have.class', 'outline');

    cy.get('#search').type('{downArrow}');
    cy.get('#search').should('not.have.focus');
    cy.get('.search-result-item').eq(0).should('not.have.class', 'outline');
    cy.get('.search-result-item')
      .eq(1)
      .should('have.class', 'outline')
      .find('.record-title')
      .then((elt) => {
        const recordName = elt.text();

        cy.get('#search').type('{enter}');
        cy.get('.record.active .record-title').should('have.text', recordName);
      });

    cy.get('#search').type('{downArrow}');
    cy.get('#search').type('{downArrow}');
    cy.get('#search').type('{downArrow}');
    cy.get('.search-result-item').eq(4).should('have.class', 'outline');

    cy.get('#search').type('{upArrow}');
    cy.get('#search').type('{upArrow}');
    cy.get('#search').type('{upArrow}');
    cy.get('#search').type('{upArrow}');
    cy.get('#search').should('have.focus');
  });

  it('should open record on outline', () => {
    cy.get('#search').type('a');
    cy.get('#search').type('{downArrow}');
    cy.get('#search').type('{downArrow}');

    cy.get('.search-result-item.outline .record-title').then((elt) => {
      const recordName = elt.text();

      cy.get('#search').type('{enter}');
      cy.get('.record.active .record-title').should('have.text', recordName);
    });
  });

  /** @type {string[]} */
  function shouldSearchHasRecords(labels) {
    cy.get('.search-result-item span:nth-child(2)')
      .should('have.length', labels.length)
      .each((elt, i) => {
        expect(elt.text()).to.equal(labels[i]);
      });
  }

  it('should search only from unfiltered records', () => {
    cy.get('#search').type('atomic');
    shouldSearchHasRecords(['Evergreen notes should be atomic']);

    cy.get('#search').type('{selectAll}{backspace}');

    cy.get('#types-form').contains('insight').click();

    cy.get('#search').type('atomic');
    shouldSearchHasRecords([]);
  });
});
