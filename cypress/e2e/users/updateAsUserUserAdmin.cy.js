/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('Update as admin user admin', () => {
	let visitPage = '/users';

	let loginCredentials = {
		...devCredentials,
	};

	let adminCredentials = {
		username: 'admin_user@test.com',
		password: 'AdminPass123!',
	};

	let userCredentials = {
		username: 'user_user@test.com',
		password: 'UserPass123!',
	};

	let createdAdmin = {};
	let createdUser = {};

	it('should create an ADMIN user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="add-user-button"]').click();
		cy.intercept('POST', '/api/users').as('createAdmin');
		cy.get('[data-testid="user-username"] input').clear().type(adminCredentials.username);
		cy.get('[data-testid="user-label"] input').clear().type('ADMIN-TEST');
		cy.get('[data-testid="user-type"]').click();
		cy.get('[data-testid="menu-item-ADMIN"]').click();
		cy.get('[data-testid="user-active-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="save-user-button"]').click();
		cy.wait('@createAdmin').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdAdmin = interception.response.body.user;
		});
	});

	it('should update ADMIN user password', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="user-search"] input').clear().type(createdAdmin.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdAdmin.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="edit-user-button"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.intercept('PUT', `/api/users/${createdAdmin.uuid}/password`).as('updateUserPassword');
		cy.get('[data-testid="user-password"]').type(adminCredentials.password);
		cy.get('[data-testid="user-repeat-password"]').type(adminCredentials.password);
		cy.get('[data-testid="save-user-password-button"]').click();
		cy.wait('@updateUserPassword').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
		});
	});

	it('should create a USER user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="add-user-button"]').click();
		cy.intercept('POST', '/api/users').as('createUser');
		cy.get('[data-testid="user-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="user-label"] input').clear().type('USER-TEST');
		cy.get('[data-testid="user-type"]').click();
		cy.get('[data-testid="menu-item-USER"]').click();
		cy.get('[data-testid="user-active-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="save-user-button"]').click();
		cy.wait('@createUser').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdUser = interception.response.body.user;
		});
	});

	it('should update USER user password', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="user-search"] input').clear().type(createdUser.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="edit-user-button"]').click({ force: true });
		cy.get('[data-testid="edit-user-password-button"]').click();
		cy.intercept('PUT', `/api/users/${createdUser.uuid}/password`).as('updateUserPassword');
		cy.get('[data-testid="user-password"]').type(userCredentials.password);
		cy.get('[data-testid="user-repeat-password"]').type(userCredentials.password);
		cy.get('[data-testid="save-user-password-button"]').click();
		cy.wait('@updateUserPassword').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
		});
	});

	it('should not access to the update ADMIN as USER', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(userCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid^="user-more-button-"]').should('not.exist');
	});

	it('should delete ADMIN user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="user-search"] input').clear().type(adminCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdAdmin.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').click();
		cy.get('[data-testid="delete-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="delete-user-button"]').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
	});

	it('should delete USER user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="user-search"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').click();
		cy.get('[data-testid="delete-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="delete-user-button"]').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
	});
});
