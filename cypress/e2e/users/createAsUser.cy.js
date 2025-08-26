/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('Create as user', () => {
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
		uuid: 'UUID-USER-TEST',
		username: 'USERTEST@USERTEST.com',
		label: 'USER-TEST',
		type: 'USER',
		active: true,
		userBuildingsAll: false,
	};

	let createdUser = {
		...newUser,
	};

	it('should create a new user', () => {
		cy.get('[data-testid="add-user-button"]').click();
		cy.intercept('POST', '/api/users').as('createUser');
		cy.get('[data-testid="user-username"] input').clear().type(newUser.username);
		cy.get('[data-testid="user-label"] input').clear().type(newUser.label);
		cy.get('[data-testid="user-type"]').click();
		cy.get(`[data-testid="menu-item-${newUser.type}"]`).should('be.visible');
		cy.get(`[data-testid="menu-item-${newUser.type}"]`).click();
		cy.get('[data-testid="user-active-checkbox"]').find('input[type="checkbox"]').check();
		cy.get('[data-testid="user-active-checkbox"]').find('input[type="checkbox"]').should('be.checked');
		cy.get('[data-testid="user-userBuildingsAll-checkbox"]').find('input[type="checkbox"]').check();
		cy.get('[data-testid="user-userBuildingsAll-checkbox"]').find('input[type="checkbox"]').should('be.checked');
		cy.get('[data-testid="save-user-button"]').click();
		cy.wait('@createUser').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdUser = { ...createdUser, ...interception.response.body.user };
		});
		visitPage = '/users';
	});

	it('should update user password', () => {
		cy.get('[data-testid="user-search"] input').clear().type(createdUser.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="edit-user-button"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.intercept('PUT', `/api/users/${createdUser.uuid}/password`).as('updateUserPassword');
		cy.get('[data-testid="user-password"]').type('R27.T%RTIdiJ');
		cy.get('[data-testid="user-repeat-password"]').type('R27.T%RTIdiJ');
		cy.get('[data-testid="save-user-password-button"]').click();
		cy.wait('@updateUserPassword').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
		});
		loginCredentials = {
			username: 'USERTEST@USERTEST.com',
			password: 'R27.T%RTIdiJ',
		};
		visitPage = '/users';
	});

	it('should not be able to access the add user', () => {
		cy.get('[data-testid="users-add-button"]').should('not.exist');
		loginCredentials = {
			...devCredentials,
		};
		visitPage = '/users';
	});

	it('should delete user', () => {
		cy.get('[data-testid="user-search"] input').clear().type(createdUser.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').click();
		cy.get('[data-testid="delete-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="delete-user-button"]').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
	});
});
