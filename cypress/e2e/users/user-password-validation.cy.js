/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('User change password validation', () => {
	let loginCredentials = {
		...devCredentials,
	};

	beforeEach(() => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear();
		cy.get('[data-testid="login-password"] input').clear();
		cy.get('[data-testid="login-username"]').type(loginCredentials.username);
		cy.get('[data-testid="login-password"]').type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.getCookie('__t').should('exist');
		cy.visit('/users');
	});

	it('should show error for password without uppercase letter', () => {
		cy.get('[data-testid="user-search"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get('[data-testid^="user-more-button-"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.get('[data-testid="user-current-password"]').type('dev');
		cy.get('[data-testid="user-password"]').type('r27.t%rti');
		cy.get('[data-testid="user-repeat-password"]').type('r27.t%rti');
		cy.get('.Mui-error').should('be.visible');
	});

	it('should show error for password without lowercase letter', () => {
		cy.get('[data-testid="user-search"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get('[data-testid^="user-more-button-"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.get('[data-testid="user-current-password"]').type('dev');
		cy.get('[data-testid="user-password"]').type('R27.T%RTI');
		cy.get('[data-testid="user-repeat-password"]').type('R27.T%RTI');
		cy.get('.Mui-error').should('be.visible');
	});

	it('should show error for password without a number', () => {
		cy.get('[data-testid="user-search"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get('[data-testid^="user-more-button-"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.get('[data-testid="user-current-password"]').type('dev');
		cy.get('[data-testid="user-password"]').type('R.T%RTIdiK');
		cy.get('[data-testid="user-repeat-password"]').type('R.T%RTIdiK');
		cy.get('.Mui-error').should('be.visible');
	});

	it('should show error for password less than 8 characters', () => {
		cy.get('[data-testid="user-search"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get('[data-testid^="user-more-button-"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.get('[data-testid="user-current-password"]').type('dev');
		cy.get('[data-testid="user-password"]').type('R.T%RTIdiK');
		cy.get('[data-testid="user-repeat-password"]').type('R2%tK');
		cy.get('.Mui-error').should('be.visible');
	});

	it('should show error when passwords do not match', () => {
		cy.get('[data-testid="user-search"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get('[data-testid^="user-more-button-"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.get('[data-testid="user-current-password"]').type('dev');
		cy.get('[data-testid="user-password"]').type('R27.T%RTIdiK');
		cy.get('[data-testid="user-repeat-password"]').type('DifferentPassword');
		cy.get('.Mui-error').should('be.visible');
	});
});
