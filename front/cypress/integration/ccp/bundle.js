let connect = () => {
    cy.get('#inputMail')
        .type('thomas@cacompilepas.com');

    cy.get('#inputPassword')
        .type('root');

    cy.contains('Connexion').click();
}

export default connect;
