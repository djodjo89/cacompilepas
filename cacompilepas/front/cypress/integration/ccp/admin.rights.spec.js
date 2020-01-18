import connect from '../../plugins/bundle';

describe('Admin Rights Test', () => {
    it('Add course sheets Test', () => {
        cy.visit('http://localhost:3000/admin/1');

        connect();

        addUser('nabila@cacompilepas.com');
        // Lobby should be private by default
        makePrivate();
        checkIfPrivate();
        toggleVisibility();
        checkIfPublic();
        toggleVisibility();
    })
})

const addUser = (email) => {
    cy.get('.nav-item')
        .eq(2)
        .should('contain.text', 'Droits')
        .click();

    cy.get('#friend-input')
        .clear()
        .type(email)
        .should('have.value', email);

    cy.get('.add-usr-button')
        .last()
        .click();

    let usersNumber;
    cy.get('.users-section')
        .children('.user-card')
        .its('length')
        .then(size => usersNumber = size)
        .then(
            () => {
                cy.get('#user-1')
                    .should('not.be.undefined');
                cy.get('.user-rights-checkbox')
                    .first()
                    .click();
                cy.get('.user-rights-checkbox')
                    .first()
                    .should('be.checked');
                cy.get('.remove-button')
                    .first()
                    .click();
                cy.get('.users-section')
                    .children('.user-card').its('length')
                    .should('be.equal', usersNumber);

            });
}

const checkIfPublic = () => {
    cy.get('#visibility-input')
        .should('not.be.checked');
}

const checkIfPrivate = () => {
    cy.get('#visibility-input')
        .should('be.checked');
}

const toggleVisibility = () => {
    cy.get('#visibility-input')
        .click();
}

const makePrivate = () => {
    cy.get('#visibility-input').check();
}
