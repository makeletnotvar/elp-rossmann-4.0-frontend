/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('User creation and conflict handling', () => {
	let visitPage = '/users';

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
		cy.visit(visitPage);
	});

	const newUser = {
		uuid: 'UUID-USER-1',
		username: 'USERTEST@ADMINTEST.com',
		label: 'USER-TEST',
		type: 'USER',
		active: true,
		userBuildingsAll: false,
	};

	let createdUser = { ...newUser };

	it('should create user 1', () => {
		cy.get('[data-testid="add-user-button"]').click();
		cy.intercept('POST', '/api/users').as('createUser');
		cy.get('[data-testid="user-username"] input').clear().type(newUser.username);
		cy.get('[data-testid="user-label"] input').clear().type(newUser.label);
		cy.get('[data-testid="user-type"]').click();
		cy.get(`[data-testid="menu-item-${newUser.type}"]`).should('be.visible');
		cy.get(`[data-testid="menu-item-${newUser.type}"]`).click();
		cy.get('[data-testid="user-active-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="user-userBuildingsAll-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="save-user-button"]').click();
		cy.wait('@createUser').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdUser = { ...createdUser, ...interception.response.body.user };
		});
	});

	it('should fail to create user 2 with same email', () => {
		cy.get('[data-testid="add-user-button"]').click();
		cy.intercept('POST', '/api/users').as('createUserConflict');
		cy.get('[data-testid="user-username"] input').clear().type(newUser.username); // Ten sam e-mail
		cy.get('[data-testid="user-label"] input').clear().type('DUPLICATE-USER');
		cy.get('[data-testid="user-type"]').click();
		cy.get(`[data-testid="menu-item-${newUser.type}"]`).should('be.visible');
		cy.get(`[data-testid="menu-item-${newUser.type}"]`).click();
		cy.get('[data-testid="user-active-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="user-userBuildingsAll-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="save-user-button"]').click();
		cy.wait('@createUserConflict').then(interception => {
			expect(interception.response.statusCode).to.eq(409);
		});
	});

	it('should delete user 1', () => {
		cy.get('[data-testid="user-search"] input').clear().type(createdUser.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').click();
		cy.get('[data-testid="delete-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="delete-user-button"]').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
	});
});
