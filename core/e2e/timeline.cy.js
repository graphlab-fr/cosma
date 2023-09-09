const { getTimestamp } = require('../utils/misc');

describe('Timeline', () => {
  beforeEach(() => {
    cy.visit('/cosmocopeTimeline.html');
  });

  it('should display timeline on click on checkbox', () => {
    cy.get('#timeline-form').should('not.be.visible');
    cy.get('#timeline-checkbox').click();
    cy.get('#timeline-form').should('be.visible');
  });

  it('should display begin and end', () => {
    cy.get('#timeline-checkbox').click();

    cy.get('#timeline-form output').should('have.text', '1/1/2020');

    cy.get('#timeline-ticks option').first().should('have.text', '1/1/2020');
    cy.get('#timeline-ticks option').last().should('have.text', '1/1/2025');
  });

  it('should display selected date on output', () => {
    cy.get('#timeline-checkbox').click();

    const date = '12/31/2020';

    cy.get('[name="timeline_range"]').invoke('val', getTimestamp(date)).trigger('input');
    cy.get('#timeline-form output').should('have.text', date);
  });

  it('should filter nodes and display selected date on output', () => {
    cy.get('#timeline-checkbox').click();

    cy.get('[name="timeline_range"]').invoke('val', getTimestamp('1/1/2020')).trigger('input');
    cy.get('[data-node]:visible').should('have.length', 1);
    cy.get('#timeline-form output').should('have.text', '1/1/2020');

    cy.get('[name="timeline_range"]').invoke('val', getTimestamp('1/1/2021')).trigger('input');
    cy.get('[data-node]:visible').should('have.length', 2);
    cy.get('#timeline-form output').should('have.text', '1/1/2021');

    cy.get('[name="timeline_range"]').invoke('val', getTimestamp('1/1/2023')).trigger('input');
    cy.get('[data-node]:visible').should('have.length', 4);
    cy.get('#timeline-form output').should('have.text', '1/1/2023');

    cy.get('[name="timeline_range"]')
      .invoke('val', getTimestamp('1/1/2024') + 1)
      .trigger('input');
    cy.get('[data-node]:visible').should('have.length', 3);
    cy.get('#timeline-form output').should('have.text', '1/1/2024');

    cy.get('[name="timeline_range"]').invoke('val', getTimestamp('1/1/2025')).trigger('input');
    cy.get('[data-node]:visible').should('have.length', 4);
    cy.get('#timeline-form output').should('have.text', '1/1/2025');
  });

  it('should change date on click on ticks', () => {
    cy.get('#timeline-checkbox').click();
    cy.get('#timeline-ticks').contains('9/1/2021').click();
    cy.get('#timeline-form output').should('have.text', '9/1/2021');
  });

  it('should reduce ticks number if window width reduce', () => {
    cy.get('#timeline-checkbox').click();

    cy.viewport(1000, 750);
    cy.wait(200);
    cy.get('#timeline-ticks option').its('length').should('eq', 7);

    cy.viewport(800, 750);
    cy.wait(200);
    cy.get('#timeline-ticks option').its('length').should('eq', 5);
  });
});
