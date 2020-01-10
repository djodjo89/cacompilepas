describe('First Test', function () {
    it('Visits the connection page', function () {
        // Private route redirection test
        localStorage.setItem('token', '');
        cy.visit('http://localhost:3000/lobby/12');

        // Bad credentials test
        cy.get('#inputMail')
            .type('fake@email.com')
            .should('have.value', 'fake@email.com');

        cy.get('#inputPassword')
            .type('pass')
            .should('have.value', 'pass');

        cy.contains('Connexion').click();

        cy.get('connection-error')
            .should('not.be.empty');

        cy.get('disconnect-button')
            .should('not.exist');

        cy.get('#connectForm')
            .submit();

        cy.get('connection-error')
            .should('not.be.empty');

        cy.visit('http://localhost:3000/lobby/12');

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/connexion/login');

        // Good credentials test
        cy.get('#inputMail')
            .type('thomas@cacompilepas.com');

        cy.get('#inputPassword')
            .type('root');

        cy.get('#connectForm')
            .submit();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/lobby/12');

        // Disconnect button test
        cy.contains('Connecté')
            .parent()
            .first()
            .click();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/');

        // Connect button test
        cy.get('#user')
            .click();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/connexion/login');
    })
})
