/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('Buildings visibility as user', () => {
	let visitPage = '/users';

	let loginCredentials = {
		...devCredentials,
	};

	let userCredentials = {
		username: 'user_user@test.com',
		password: 'UserPass123!',
	};

	let createdUser = {};

	let allBuildingsCount = 0;

	it('get all buildings count', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/buildings');
		cy.intercept('GET', '/api/buildings/?o=0&s=20').as('getBuildings');
		cy.wait('@getBuildings').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			allBuildingsCount = interception.response.body.count || 0;
		});
	});

	it('should create an USER user', () => {
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

	it('should be fewer buildings than all', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(userCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/buildings');
		cy.intercept('GET', '/api/buildings/?o=0&s=20').as('getBuildings');
		cy.wait('@getBuildings').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			const userBuildingsCount = interception.response.body.count || 0;
			expect(userBuildingsCount).to.be.lessThan(allBuildingsCount);
		});
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
