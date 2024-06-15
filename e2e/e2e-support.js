Cypress.Commands.add('shouldGraphHasNodes', (labels) =>
  cy
    .get('[data-node]:visible')
    .should('have.length', labels.length)
    .each((elt) => {
      expect(elt.text()).to.be.oneOf(labels);
    }),
);

Cypress.Commands.add('openARecord', () => {
  cy.get('[data-node]').first().click();
  const record = cy.get('.record-container').filter(':visible').first();
  record.should('have.class', 'active');
  return record;
});
