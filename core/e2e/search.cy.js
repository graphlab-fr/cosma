describe('Search', () => {
  beforeEach(() => {
    cy.visit('/temp/cosmoscope.html');
  });

  it('should get search result after type record name', () => {
    cy.get('.record-title')
      .first()
      .then((elt) => {
        const recordName = elt.text();

        cy.get('#search').type(recordName);
        cy.get('#search-result-list li').should('include.text', recordName);
      });
  });

  it('should change outlined search result', () => {
    cy.get('.record-title')
      .first()
      .then((elt) => {
        const recordName = elt.text();

        cy.get('#search').type(`${recordName}{downArrow}`);
        cy.get('#search-result-list li').eq(1).should('have.class', 'outline');
        cy.get('#search').type(`{enter}`);

        cy.get('.record.active .record-title').then((elt) => {
          cy.get('#search-result-list .outline').should('include.text', elt.text());
        });
      });
  });
});
