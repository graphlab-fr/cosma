describe('i18n', () => {
  const translations = [
    { fr: 'Mots-clés', en: 'Keywords' },
    { fr: 'Réinitialiser', en: 'Reset' },
    { fr: 'Aide', en: 'Help' },
  ];

  it('should find some french words', () => {
    cy.visit('temp/citeproc.html');

    translations.forEach((translation) => {
      cy.contains(translation.fr).should('be.visible');
    });
  });

  it('should find some english words', () => {
    cy.visit('temp/csv.html');

    translations.forEach((translation) => {
      cy.contains(translation.en).should('be.visible');
    });
  });
});
