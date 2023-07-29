describe('Timeline', () => {
  beforeEach(() => {
    cy.visit('/temp/cosmoscope.html');
  });

  it('should display timline on click on checkbox', () => {
    cy.get('#timeline-form').should('not.be.visible');
    cy.get('#timeline-checkbox').click();
    cy.get('#timeline-form').should('be.visible');
  });

  it('should output display same value as first option at first display', () => {
    cy.get('#timeline-checkbox').click();

    let value;
    cy.get('#timeline-form output').then((output) => {
      value = output.val();
    });
    cy.get('#timeline-ticks option')
      .first()
      .then((option) => {
        expect(option.text()).to.be.equal(value);
      });
  });

  it.skip('should input in range change output', () => {
    cy.get('#timeline-checkbox').click();

    let value, text;
    cy.get('#timeline-ticks option')
      .eq(1)
      .then((option) => {
        value = option.val();
        text = option.text();
      });

    cy.get('#timeline-form input[type="range"]').invoke('val', value).trigger('input');

    cy.get('#timeline-form output').then((output) => {
      expect(output.text()).to.be.equal(text);
    });
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
