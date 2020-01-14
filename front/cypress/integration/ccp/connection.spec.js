describe('Connection Test', () => {
    it('Visit connection page', () => {
        // Private route redirection test
        localStorage.setItem('token', '');
        cy.visit('http://localhost:3000/lobby/1');

        // Bad credentials test
        cy.get('#input-mail')
            .type('fake@email.com')
            .should('have.value', 'fake@email.com');

        cy.get('#input-password')
            .type('pass')
            .should('have.value', 'pass');

        cy.contains('Connexion').click();

        cy.get('connection-error')
            .should('not.be.empty');

        cy.get('disconnect-button')
            .should('not.exist');

        cy.get('#connect-form')
            .submit();

        cy.get('connection-error')
            .should('not.be.empty');

        cy.visit('http://localhost:3000/lobby/1');

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/connexion/login');

        // Good credentials test
        cy.get('#input-mail')
            .type('thomas@cacompilepas.com');

        cy.get('#input-password')
            .type('root');

        cy.get('#connect-form')
            .submit();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/lobby/1');

        // Disconnect button test
        cy.get('.disconnect-button')
            .last()
            .parent()
            .first()
            .click();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/');
    })
    it('Go to connection page', () => {
        // Connect button test
        cy.get('.connect-button')
            .last()
            .click();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/connexion/login');
    })
})
