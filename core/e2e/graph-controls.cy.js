describe('Graph controls', () => {
  before(() => {
    cy.visit('/temp/cosmoscope.html');
  });

  describe.skip('zoom', () => {
    let scale = 1,
      step = 0.3;
    it('should scale on click on zoom "+" button', () => {
      scale += step;
      cy.get('[onclick="zoomMore()"]').contains('+');
      cy.get('[onclick="zoomMore()"]').click();
      cy.get('#graph-canvas svg')
        .should('have.attr', 'style')
        .and('contain', `translate(0px, 0px) scale(${scale});`);
    });

    it('should scale on click on zoom "-" button', () => {
      scale -= step;
      cy.get('[onclick="zoomLess()"]').contains('-');
      cy.get('[onclick="zoomLess()"]').click();
      cy.get('#graph-canvas svg')
        .should('have.attr', 'style')
        .and('contain', `translate(0px, 0px) scale(${scale});`);
    });

    it('should scale on click on zoom "reset" button', () => {
      scale = 1;
      cy.get('[onclick="zoomReset()"]').contains('Reset (R)');
      cy.get('[onclick="zoomReset()"]').click();
      cy.get('#graph-canvas svg')
        .should('have.attr', 'style')
        .and('contain', `translate(0px, 0px) scale(${scale});`);
    });
  });
});
