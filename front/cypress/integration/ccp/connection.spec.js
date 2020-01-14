import generatePassword from 'generate-password';

describe('Connection Test', () => {
    it('Login page', () => {
        // Private route redirection test
        localStorage.setItem('token', '');
        cy.visit('http://localhost:3000/lobby/1');

        // Bad credentials test
        cy.get('#input-email')
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
        cy.get('#input-email')
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
    it('Go to login page', () => {
        // Connect button test
        cy.get('.connect-button')
            .last()
            .click();

        cy.location('href')
            .should('be.equal', 'http://localhost:3000/connexion/login');
    })
    it('Register page', () => {
        cy.visit('http://localhost:3000/connexion/register');

        // Bad credentials test
        cy.get('#input-first-name')
            .type('Test')
            .should('have.value', 'Test');

        cy.get('#input-last-name')
            .type('Test')
            .should('have.value', 'Test');

        cy.get('#input-pseudo')
            .type('Test')
            .should('have.value', 'Test');

        let fileName = '../fixtures/icon-female-user.png';
        cy.fixture(fileName).then(fileContent => {
            cy.get('#input-icon')
                .upload({fileContent, fileName, mimeType: 'application/image'});

            cy.get('#dragged-logo')
                .should('have.attr', 'src');
        });

        let testEmail = generatePassword.generate({length: 8}) + '@email.com';

        cy.get('#input-email')
            .type(testEmail)
            .should('have.value', testEmail);

        let incorrectRandomPassword = generatePassword.generate({
            length: 7,
            numbers: true,
            uppercase: true,
            symbols: false,
            strict: true,
        });

        cy.get('#input-password')
            .type(incorrectRandomPassword)
            .should('have.value', incorrectRandomPassword);

        cy.get('#input-password-confirmation')
            .type(incorrectRandomPassword)
            .should('have.value', incorrectRandomPassword);

        cy.contains('Inscris-toi !').click();

        cy.get('.swal-icon--error')
            .should('not.be.empty');

        cy.get('.swal-button--confirm')
            .click();

        let correctRandomPassword = generatePassword.generate({
            length: 8,
            numbers: true,
            uppercase: true,
            symbols: true,
            strict: true,
        });

        cy.get('#input-password')
            .clear()
            .type(correctRandomPassword)
            .should('have.value', correctRandomPassword);

        cy.get('#input-password-confirmation')
            .clear()
            .type(correctRandomPassword)
            .should('have.value', correctRandomPassword);

        cy.get('#register-form')
            .submit();

        cy.get('.swal-icon--success__ring')
            .should('not.be.empty');

        cy.location('href', {timeout: 10000})
            .should('be.equal', 'http://localhost:3000/connexion/login');
    })
})
