let connect = () => {
    cy.get('#input-email')
        .type('thomas@cacompilepas.com');

    cy.get('#input-password')
        .type('root');

    cy.contains('Connexion').click();
}

export default connect;
