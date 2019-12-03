describe('First Test', function() {
  it('Visits the connection page', function() {
    cy.visit('http://localhost:3000/connexion/login')

    cy.get('#InputMailPseudo')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')

    cy.get('#InputPassword')
      .type('pass')
      .should('have.value', 'pass')

    cy.contains('Connexion').click()
  })
})