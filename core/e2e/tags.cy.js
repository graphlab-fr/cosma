describe('Tags', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should check input on tag label click', () => {
    const label = cy.get('.menu-tags-container label').first();
    label.click({ force: true });
    label.find('input').should('be.checked');
  });

  it('should display has nodes has badge number', () => {
    const label = cy.get('.menu-tags-container label').first();
    label.click({ force: true });

    label.find('.badge').then((elt) => {
      const number = Number(elt.text());
      cy.wait(200);
      cy.shouldGraphHasNodes(number);
    });
  });

  it('should check input on tag label click', () => {
    const record = cy.openARecord();
    const recordTagButton = record.get('.record-tags button').filter(':visible').first();

    recordTagButton.click().then((elt) => {
      const label = cy.get('.menu-tags-container').contains(elt.text());
      label.find('input').should('be.checked');
    });
  });
});
