describe('First Test', function () {
    it('Visits the connection page', function () {
        localStorage.setItem('token', '');
        cy.visit('http://localhost:3000/connexion/login');

        cy.get('#inputMail')
            .type('fake@email.com')
            .should('have.value', 'fake@email.com');

        cy.get('#inputPassword')
            .type('pass')
            .should('have.value', 'pass');

        cy.contains('Connexion').click();

        cy.contains('Identifiants incorrects')
            .should('not.be.empty');

        cy.get('#connectForm')
            .submit();

        cy.contains('Identifiants incorrects')
            .should('not.be.empty');

        cy.visit('http://localhost:3000/lobby/12');

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/connexion/login');

        cy.get('#inputMail')
            .type('thomas@cacompilepas.com');

        cy.get('#inputPassword')
            .type('root');

        cy.get('#connectForm')
            .submit();

        cy.visit('http://localhost:3000/lobby/12');
        //cy.visit('http://localhost:3000/connexion/login');

        cy.location('href')
          .should('be.equal', 'http://localhost:3000/lobby/12');
    })
})
