describe('Filters', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should uncheck input on filter label click', () => {
    const item = cy.get('.menu-types .filter').first();
    item.click();
    item.find('input').should('not.be.checked');
  });

  it('should check only filter in search params if set', () => {
    cy.visit('/?filters=task,note');

    cy.get('.menu-types .filter input:checked').should('have.length', 2);
    cy.get('.menu-types .filter:contains("task") input').should('is.checked');
    cy.get('.menu-types .filter:contains("note") input').should('is.checked');
  });

  describe('with alt key', () => {
    it('should uncheck all inputs but not clicked one if alt key is pressed', () => {
      let clickedFilterName;

      cy.get('.menu-types .filter input:checked').should('have.length', 9);

      const itemToClick = cy.get('.menu-types .filter').first();
      itemToClick
        .find('.label')
        .click({ altKey: true })
        .then((elt) => {
          const name = elt.find('input').attr('name');
          clickedFilterName = name;
        });

      cy.get('.menu-types .filter input:checked').should('have.length', 1);
    });

    it('should check all inputs if alt key is pressed on a second click on same filter', () => {
      const itemToClick = cy.get('.menu-types .filter').first();
      itemToClick.find('.label').click({ altKey: true }).click({ altKey: true });
      cy.get('.menu-types .filter').each((elt) => {
        const input = elt.find('input');
        expect(input.is(':checked')).to.be.true;
      });
    });
  });
});
