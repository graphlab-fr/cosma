describe('Record', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  function assertRecordPanelIsOpened() {
    cy.get('.record-container').should('have.class', 'active');
  }

  function assertRecordPanelIsClosed() {
    cy.get('.record-container').should('not.have.class', 'active');
  }

  it('should display empty record container if do not select record and click on right side button', () => {
    assertRecordPanelIsClosed();
    cy.get('#close-right-side').click();
    assertRecordPanelIsOpened();
    cy.contains(
      "Cliquez sur un nœud du graphe ou dans un élément de l'index pour ouvrir une fiche.",
    ).should('be.visible');
  });

  it('should right side button toggle record display', () => {
    cy.get('.record-container').should('not.have.class', 'active');
    cy.get('#close-right-side').click();
    cy.get('.record-container').should('have.class', 'active');
    cy.get('#close-right-side').click();
    cy.get('.record-container').should('not.have.class', 'active');
  });

  function assertRecordIsOpened() {
    cy.get('.record-container').should('have.class', 'active');

    cy.get('.record.active')
      .should('have.length', 1)
      .as('record')
      .find('.record-title')
      .should('have.text', 'Evergreen notes should be concept-oriented');

    cy.hash().should('eq', '#' + encodeURI('evergreen notes should be concept-oriented'));
  }

  it('should display record container on click on node', () => {
    cy.get('[data-node="evergreen notes should be concept-oriented"]').click();

    assertRecordIsOpened();
  });

  it('should display record container on click on index item ', () => {
    cy.contains('Index').click();
    cy.get('#index').contains('Evergreen notes should be concept-oriented').click();

    assertRecordIsOpened();
  });

  describe('Have click on node', () => {
    beforeEach(() => {
      cy.get('[data-node="evergreen notes should be concept-oriented"]').click();

      assertRecordIsOpened();
    });

    it('should display record title', () => {
      cy.get('@record')
        .find('.record-title')
        .should('have.text', 'Evergreen notes should be concept-oriented');
    });

    it('should display record type', () => {
      cy.get('@record').find('.record-type').should('contain.text', 'insight');
    });

    it('should display record tags', () => {
      cy.get('@record').find('.record-tags').should('contain.text', 'wip');
    });

    it('should display record custom meta', () => {
      cy.get('@record')
        .find('.record-see')
        .should('be.visible')
        .should('contain.text', 'https://notes.andymatuschak.org/Evergreen_notes');
    });

    it('should display content', () => {
      cy.get('@record')
        .find('.record-content')
        .should('contain.text', 'It’s best to factor evergreen notes by concept');
    });

    it('should display links', () => {
      cy.get('@record')
        .find('.record-links-list li')
        .should('have.length', 1)
        .should('have.attr', 'data-target-id', 'evergreen notes')
        .as('link');

      cy.get('@link').find('a').should('have.attr', 'href', '#evergreen notes');
      cy.get('@link')
        .find('.record-links-context ')
        .should('contain.text', 'It’s best to factor evergreen notes by concept');
    });

    it('should display backlinks', () => {
      cy.get('@record')
        .find('.record-backlinks-list li')
        .should('have.length', 1)
        .should('have.attr', 'data-target-id', 'evergreen notes should be densely linked')
        .as('link');

      cy.get('@link')
        .find('a')
        .should('have.attr', 'href', '#evergreen notes should be densely linked');
      cy.get('@link')
        .find('.record-links-context ')
        .should('contain.text', '(see Evergreen notes should be concept-oriented)');
    });

    it('should no more display record if have click on right side button', () => {
      cy.get('#close-right-side').click();

      assertRecordPanelIsClosed();
      cy.get('[data-node="tools for thought"]').click();
      assertRecordPanelIsClosed();
    });
  });
});
