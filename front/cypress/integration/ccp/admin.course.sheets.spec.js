import connect from './bundle';

describe('Admin Course Sheets Test', () => {
    it('Add course sheets Test', () => {
        cy.visit('http://localhost:3000/admin/1');

        connect();

        addAndRemoveCourseSheet('Test course sheet', 'Test course sheet description', 'UndoCinema.pdf', ['java', 'programmation', 'streams']);
        addAndRemoveCourseSheet('Second test course sheet', 'Second test course sheet description', 'TP13AbrSortedSet.pdf', ['java', 'programmation', 'arbres', 'sets']);
    })
})

const addAndRemoveCourseSheet = (newTitle, newDescription, newFileName, hashtags) => {
    cy.get('.nav-item')
        .eq(1)
        .should('contain.text', 'Fiches')
        .click();

    cy.get('#title-input')
        .clear()
        .type(newTitle)
        .should('have.value', newTitle);

    cy.get('#description-input')
        .clear()
        .type(newDescription)
        .should('have.value', newDescription);

    let fileName = '../fixtures/' + newFileName;
    let courseSheetsNumber;
    cy.get('.course-sheets-section')
        .children('.course-sheet')
        .its('length')
        .then(size => courseSheetsNumber = size)
        .then(
            () => cy.fixture(fileName).then(fileContent => {
                cy.get('#course-sheet-input')
                    .upload({fileContent, fileName, mimeType: 'application/pdf'});
                cy.get('.sc-bdVaJa.thXdN')
                    .contains('Fiche déposée !');
                cy.get('.plus-icon')
                    .last()
                    .click();
                cy.get('.remove-button')
                    .first()
                    .click();
                cy.get('.course-sheets-section')
                    .children('.course-sheet').its('length')
                    .should('be.equal', courseSheetsNumber);

            })
        );
}
