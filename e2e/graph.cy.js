describe('graph', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should get one node per record', () => {
    const numberOfRecord = 6;
    const numberOfBibliographicRecord = 2;
    cy.get('[data-node]').should('have.length', numberOfRecord + numberOfBibliographicRecord);
  });

  it('should open record on click on node', () => {
    cy.get('[data-node="evergreen notes"]').as('node');
    cy.get('@node').find('text').should('have.text', 'Evergreen notes').click();
    cy.get('.record.active .record-title').should('have.text', 'Evergreen notes');
  });

  it('should hilight links from and to clicked node', () => {
    cy.get('[data-node="evergreen notes"]').as('node');
    cy.get('@node').click();
    cy.get('[data-source="evergreen notes"]')
      .should('have.length', 1)
      .each((elt) => expect(elt.attr('style')).to.contain('highlight'));
    cy.get('[data-target="evergreen notes"]')
      .should('have.length', 3)
      .each((elt) => expect(elt.attr('style')).to.contain('highlight'));
  });
});
