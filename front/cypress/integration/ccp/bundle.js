let connect = () => {
    cy.get('#input-mail')
        .type('thomas@cacompilepas.com');

    cy.get('#input-password')
        .type('root');

    cy.contains('Connexion').click();
}

export default connect;
