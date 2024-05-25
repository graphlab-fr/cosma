describe('Filters', () => {
  beforeEach(() => {
    cy.visit('temp/batch.html');
  });

  const filters = ['concept', 'note', 'personne', 'objet', 'idée'];

  it('should display filter for each type', () => {
    filters.forEach((filterName) => {
      cy.get('#types-form').contains(filterName).should('be.visible');
    });
  });

  it('should uncheck input on filter label click', () => {
    cy.get('#types-form .filter').first().as('filter');
    cy.get('@filter').find('input').should('be.checked');
    cy.get('@filter').click();
    cy.get('@filter').find('input').should('not.be.checked');
  });

  it('should toggle filter toggle node visibility', () => {
    cy.get('[data-node="concept"]').should('be.visible');
    cy.get('#types-form .filter')
      .first()
      .as('filter')
      .find('.label')
      .should('have.text', 'concept');
    cy.get('@filter').click();
    cy.get('[data-node="concept"]').should('not.be.visible');
    cy.get('@filter').click();
    cy.get('[data-node="concept"]').should('be.visible');
  });

  it.skip('should check only filter in search params if set', () => {
    cy.visit('temp/batch.html?filters=concept,note');

    cy.get('#types-form input:checked').should('have.length', 2);
    ['concept', 'note'].forEach((filterName) => {
      cy.get(`#types-form .filter:contains("${filterName}") input`).should('is.checked');
    });
  });

  describe('with alt key', () => {
    it('should uncheck all inputs but not clicked one if alt key is pressed', () => {
      let clickedFilterName;

      cy.get('#types-form .filter input:checked').should('have.length', filters.length);

      const itemToClick = cy.get('#types-form .filter').first();
      itemToClick
        .find('.label')
        .click({ altKey: true })
        .then((elt) => {
          const name = elt.find('input').attr('name');
          clickedFilterName = name;
        });

      cy.get('#types-form .filter input:checked').should('have.length', 1);
    });

    it('should check all inputs if alt key is pressed on a second click on same filter', () => {
      const itemToClick = cy.get('#types-form .filter').first();
      itemToClick.find('.label').click({ altKey: true }).click({ altKey: true });
      cy.get('#types-form .filter').each((elt) => {
        const input = elt.find('input');
        expect(input.is(':checked')).to.be.true;
      });
    });
  });
});
