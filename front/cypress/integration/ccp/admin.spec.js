import connect from './bundle';

describe('Admin Test', function () {
    it('Description', function () {
        cy.visit('http://localhost:3000/admin/1');

        connect();

        updateDescription('Test title', 'Test description', 'new-logo.png');
        updateDescription('Second test title', 'Second test description', 'logo.png');
    })
})

const updateDescription = (newTitle, newDescription, newLogoName) => {
    cy.get('#label-input')
        .clear()
        .type(newTitle)
        .should('have.value', newTitle);

    cy.get('#new-description-input')
        .clear()
        .type(newDescription)
        .should('have.value', newDescription);

    let fileName = '../../src/img/' + newLogoName;
    let oldFileSrc;
    cy.get('#lobby-logo-1')
        .then(image => {
            oldFileSrc = image[0].src;
            cy.fixture(fileName).then(fileContent => {
                cy.get('#logo-input')
                    .upload({ fileContent, fileName, mimeType: 'application/image'});
                cy.get('.sc-bdVaJa.thXdN')
                    .contains('Logo déposé !');
                cy.get('.plus-icon')
                    .click();
                cy.get('.lobby-title')
                    .contains(newTitle);
                cy.get('#current-description-input')
                    .should('have.attr', 'placeholder','Description actuelle du lobby\n' +
                        newDescription);
                cy.get('#lobby-logo-1')
                    .should(img => expect(img[0].src).not.to.be.equal(oldFileSrc));
            });
        });
}
