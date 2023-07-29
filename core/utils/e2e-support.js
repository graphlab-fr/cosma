Cypress.Commands.add('shouldGraphHasNodes', (nb) =>
  cy.get('[data-node]').filter(':visible').its('length').should('equal', nb)
);

Cypress.Commands.add('openARecord', () => {
  cy.get('[data-node]').first().click();
  const record = cy.get('.record-container').filter(':visible').first();
  record.should('have.class', 'active');
  return record;
});
