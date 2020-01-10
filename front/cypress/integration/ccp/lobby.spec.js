import connect from './bundle';

describe('Lobby Test', () => {
    it('Visits normal lobby', () => {
        cy.visit('http://localhost:3000/lobby/1');

        connect();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/lobby/1');

        cy.get('lobby-label').should('not.be.empty');
        cy.get('lobby-page-description').should('not.be.empty');
        cy.get('#lobby-logo1')
            .should('be.visible')
            .and(img => expect(img[0].naturalWidth).to.be.greaterThan(0));
        cy.get('lobby-summary-list').should('not.be.empty');
        cy.get('course-sheets-section').should('not.be.empty');
        cy.get('messages-list').should('not.be.empty');
    })

    it('Visit empty lobby', () => {
        cy.visit('http://localhost:3000/lobby/3');
        connect();
        cy.location('href')
            .should('be.equal', 'http://localhost:3000/lobby/3');
        cy.get('#lobby-logo1')
            .should('not.be.visible');
        cy.get('lobby-summary-list').should('not.exist');
        cy.get('course-sheets-section').should('not.exist');
        cy.get('no-coursesheet-message').should('not.be.empty');
        cy.get('messages-list').should('not.exist');
        cy.get('no-messages-message').should('not.be.empty');
    })
})
