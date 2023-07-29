describe('Focus', () => {
  beforeEach(() => {
    cy.visit('/temp/cosmoscope.html');
  });

  function openRecord() {
    cy.get('[data-node]').first().click();
  }

  function activateFocus() {
    openRecord();
    cy.get('#focus-check').click();
  }

  function assertIsActivated() {
    cy.get('#focus-input').should('be.visible');
    cy.focused().should('have.attr', 'name', 'focus_range');
  }

  it('should focus range on activate', () => {
    activateFocus();
    cy.focused().should('have.attr', 'name', 'focus_range');
  });

  it('should display range on click on checkbox and opened record', () => {
    cy.get('#focus-input').should('not.be.visible');
    openRecord();
    cy.get('#focus-check').click();
    assertIsActivated();
  });

  it('should not display range on click on checkbox withtout opened record', () => {
    cy.get('#focus-input').should('not.be.visible');
    cy.get('#focus-check').click();
    cy.get('#focus-input').should('not.be.visible');
  });

  it('should key "f" activate', () => {
    openRecord();
    cy.get('body').trigger('keydown', { keyCode: 70 });
    assertIsActivated();
  });
});
