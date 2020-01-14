import connect from '../../plugins/bundle';

describe('Admin Test', function () {
    it('Update description', function () {
        cy.visit('http://localhost:3000/admin/1');

        connect();

        updateDescription('Test title', 'Test description', 'new-logo.png');
        updateDescription('Second test title', 'Second test description', 'logo.png');
    })
})

const updateDescription = (newLabel, newDescription, newLogoName) => {
    cy.get('.nav-item')
        .first()
        .should('contain.text', 'Description')
        .click();

    cy.get('#label-input')
        .clear()
        .type(newLabel)
        .should('have.value', newLabel);

    cy.get('#new-description-input')
        .clear()
        .type(newDescription)
        .should('have.value', newDescription);

    let fileName = '../fixtures/' + newLogoName;
    let oldFileSrc;
    cy.get('#lobby-logo-1')
        .then(image => {
            oldFileSrc = image[0].src;
            cy.fixture(fileName).then(fileContent => {
                cy.get('#input-logo')
                    .upload({fileContent, fileName, mimeType: 'application/image'});
                cy.get('.sc-bdVaJa.thXdN')
                    .contains('Logo déposé !');
                cy.get('.plus-icon')
                    .click();
                cy.get('.lobby-title')
                    .contains(newLabel);
                cy.get('#current-description-input')
                    .should('have.attr', 'placeholder', 'Description actuelle du lobby\n' +
                        newDescription);
                cy.get('#lobby-logo-1')
                    .should(img => expect(img[0].src).not.to.be.equal(oldFileSrc));
            });
        });
}
