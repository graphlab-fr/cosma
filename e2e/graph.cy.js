const data = require('./batch/data.json');

describe('graph', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should get one node per record', () => {
    cy.visit('temp/batch.html');

    const allTitles = data.map(({ title }) => title);
    cy.shouldGraphHasNodes(allTitles);
  });

  it('should get bibliographic nodes with citeproc', () => {
    cy.shouldGraphHasNodes([
      'Evergreen note titles arelike APIs',
      'Evergreen notes should beatomic',
      'Evergreen notes should beconcept-oriented',
      'Evergreen notes should bedensely linked',
      'Evergreen notes',
      'Tools for thought',
      'Augmenting Human Intellect:A Conceptual Framework',
      'How can we develop transformativetools for thought?',
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
      .each((elt) => expect(elt.attr('style')).to.contain('highlight'));
    cy.get('[data-target="evergreen notes"]')
      .should('have.length', 3)
      .each((elt) => expect(elt.attr('style')).to.contain('highlight'));
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

  it('should on node hover change opacity of no connected nodes', () => {
    cy.get('[data-node="evergreen notes"]').trigger('mouseover');

    ['matuschak2019', 'engelbart1962', 'evergreen notes should be densely linked'].forEach((name) =>
      cy.get(`[data-node="${name}"]`).find('a').should('have.attr', 'opacity', '0.5'),
    );
  });
});
