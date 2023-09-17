describe('Links', () => {
  it('should change visible record on click on link and display it links lists', () => {
    cy.visit('/');
    cy.openARecord();

    cy.get('.record:visible').as('firstRecord');
    cy.get('.record-link:visible').first().as('link');

    cy.get('@link')
      .first()
      .then((elt) => {
        const title = elt.attr('title');
        // assert record link is on link list
        cy.get('@firstRecord')
          .find('.record-links')
          .find(`li:contains("${title}")`)
          .should('exist');
        // assert click on record link change visible record
        cy.get('@link').click().get('.record-title:visible').should('have.text', title);
      });

    cy.get('@firstRecord')
      .find('.record-title')
      .then((elt) => {
        // assert previous record is on backlinks list
        cy.get('.record:visible .record-backlinks')
          .find(`li:contains("${elt.text()}")`)
          .should('exist');
      });
  });

  it('should title based links redirect to same record even of uppercase', () => {
    cy.visit('/cosmocopeTitleId.html#toto');

    cy.get('.record-link:visible').should('contain.text', 'Tata').click();
    cy.location().should(({ hash }) => {
      expect(hash).to.equal('#tata');
    });

    cy.visit('/cosmocopeTitleId.html#tutu');

    cy.get('.record-link:visible').should('contain.text', 'tata').click();
    cy.location().should(({ hash }) => {
      expect(hash).to.equal('#tata');
    });

    cy.visit('/cosmocopeTitleId.html#tata');
    cy.get('.record-backlinks-list:visible').find('.id-context').as('contexts');
    cy.get('@contexts').eq(0).should('contain.text', 'Tata');
    cy.get('@contexts').eq(1).should('contain.text', 'tata');
  });
});
