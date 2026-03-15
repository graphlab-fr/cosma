Cypress.Commands.add('shouldGraphHasNodes', (labels) =>
  cy
    .get('[data-node]:visible')
    .should('have.length', labels.length)
    .each((elt) => {
      expect(elt.text()).to.be.oneOf(labels);
    }),
);

Cypress.Commands.add('shouldIndexHasItems', (labels) =>
  cy
    .get('[data-index]:visible')
    .should('have.length', labels.length)
    .find('span:nth-child(2)')
    .each((elt, i) => {
      expect(elt.text()).to.equal(labels[i]);
    }),
);

Cypress.Commands.add('openARecord', () => {
  cy.get('[data-node]').first().click();
  cy.get('.record-container').filter(':visible').first().should('have.class', 'active');
});
