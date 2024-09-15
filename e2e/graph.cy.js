const data = require('./batch/data.json');

describe('graph', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should get one node per record', () => {
    cy.visit('temp/batch.html');

    const allTitles = data.map(({ title }) => title);
    cy.shouldGraphHasNodes(allTitles);

    cy.visit('temp/csv.html');
    cy.get('[data-node]:visible').should('have.length', 128);
  });

  it('should get bibliographic nodes with citeproc', () => {
    cy.shouldGraphHasNodes([
      'Evergreen note titles arelike APIs',
      'Evergreen notes should beatomic',
      'Evergreen notes should beconcept-oriented',
      'Evergreen notes should bedensely linked',
      'Evergreen notes',
      'Tools for thought',
      // bibliographic nodes
      'Augmenting Human Intellect:A Conceptual Framework',
      'How can we develop transformativetools for thought?',
    ]);

    cy.visit('temp/no-citeproc.html');

    cy.shouldGraphHasNodes([
      'Evergreen note titles arelike APIs',
      'Evergreen notes should beatomic',
      'Evergreen notes should beconcept-oriented',
      'Evergreen notes should bedensely linked',
      'Evergreen notes',
      'Tools for thought',
    ]);
  });

  it('should open record on click on node', () => {
    cy.get('[data-node="evergreen notes"]').as('node');
    cy.get('@node').find('text').should('have.text', 'Evergreen notes').click();
    cy.get('.record.active .record-title').should('have.text', 'Evergreen notes');
  });

  it('should hilight links from and to clicked node', () => {
    cy.get('[data-node="evergreen notes"]').as('node');
    cy.get('@node').click();
    cy.get('[data-source="evergreen notes"]')
      .should('have.length', 1)
      .each((elt) => expect(elt.attr('class')).to.contain('highlight'));
    cy.get('[data-target="evergreen notes"]')
      .should('have.length', 3)
      .each((elt) => expect(elt.attr('class')).to.contain('highlight'));
  });

  it('should apply link shape', () => {
    cy.visit('temp/csv.html');
    cy.get('line[data-source="24"][data-target="1"]').should('have.attr', 'filter', 'url(#double)');
    cy.get('line[data-source="97"][data-target="1"]').should('have.attr', 'stroke-dasharray');
  });

  it('should hide all link', () => {
    cy.get('line:visible').should('have.length', 7);

    cy.contains('Paramètres du graphe').click();
    cy.contains('Afficher les liens').click();

    cy.get('line:visible').should('have.length', 0);
  });

  it('should hide all labels', () => {
    cy.get('text:visible').should('have.length', 8);

    cy.contains('Paramètres du graphe').click();
    cy.contains('Afficher les étiquettes').click();

    cy.get('text:visible').should('have.length', 0);
  });

  it('should change label size', () => {
    cy.contains('Paramètres du graphe').click();
    cy.get('form:contains("taille du texte")').as('form');

    cy.get('[data-node] text').should('have.attr', 'font-size', 7);

    cy.get('@form').find('input[type="number"]').invoke('val', 8).trigger('input');
    cy.get('[data-node] text').should('have.attr', 'font-size', 8);

    cy.get('@form').find('input[type="range"]').invoke('val', 10).trigger('input');
    cy.get('[data-node] text').should('have.attr', 'font-size', 10);
  });

  it('should highlight selected node, hovered node and connected nodes, links', () => {
    cy.get('[data-node], [data-link]').should('not.have.class', 'highlight');

    cy.get('[data-node="evergreen notes should be densely linked"]').click();

    cy.get('[data-node="evergreen notes"]').trigger('mouseover');

    const highlightNodes = [
      'evergreen notes',
      'tools for thought',
      'evergreen notes should be atomic',
      'evergreen note titles are like apis',
      'evergreen notes should be concept-oriented',
      'evergreen notes should be densely linked',
    ];

    cy.get('[data-node].highlight').should('have.length', highlightNodes.length);
    highlightNodes.forEach((name) =>
      cy.get(`[data-node="${name}"]`).should('have.class', 'highlight'),
    );

    cy.get('[data-link].highlight').should('have.length', 5);
  });

  describe('change node opacity', () => {
    it('should for no connected nodes to hovered node', () => {
      cy.get('[data-node], [data-link]').should('not.have.class', 'translucent');

      cy.get('[data-node="evergreen notes"]').trigger('mouseover');

      const translucentNodes = [
        'matuschak2019',
        'engelbart1962',
        'evergreen notes should be densely linked',
      ];

      cy.get('[data-node].translucent').should('have.length', translucentNodes.length);
      translucentNodes.forEach((name) =>
        cy.get(`[data-node="${name}"]`).should('have.class', 'translucent'),
      );

      cy.get('[data-link].translucent').should('have.length', 3);
    });

    it('should not if option is unactivated', () => {
      cy.contains('Paramètres du graphe').click();
      cy.contains('Surbrillance au survol').as('option');

      cy.get('@option').find('input').should('have.checked');
      cy.get('@option').click();
      cy.get('@option').find('input').should('not.have.checked');

      cy.get('[data-node], [data-link]').should('not.have.class', 'translucent');

      cy.get('[data-node="evergreen notes"]').trigger('mouseover');

      cy.get('[data-node], [data-link]').should('not.have.class', 'translucent');
    });
  });
});
