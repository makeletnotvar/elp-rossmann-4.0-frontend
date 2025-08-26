/* eslint-disable no-undef */
const { pages } = require('../../fixtures/pages');
const { devCredentials, userCredentials } = require('../../fixtures/credentials');

const uuid = 'test-uuid';
const tab = 'info';
let createdUser;

const checkAccess = (page, user) => {
	if (page.devOnly && user.type !== 'DEV') return false;
	if (page.devOrAdminOnly && user.type !== 'DEV' && user.type !== 'ADMIN') return false;

	if (typeof page.customAuth === 'function') {
		return page.customAuth(user);
	}

	return true;
};

describe('User setup and access tests', () => {
	it('should create an USER user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/users');
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
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/users');
		cy.get('[data-testid="user-search"] input').clear().type(createdUser.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
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
});

describe('Check all user-accessible pages', () => {
	const loginAsUser = () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(userCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
	};

	beforeEach(() => {
		loginAsUser();
	});

	Object.entries(pages).forEach(([key, page]) => {
		const { routeWithParams, route, absoluteRoute } = page;

		const rawRoute = routeWithParams || route || absoluteRoute;
		if (!rawRoute) return;

		let filledRoute = rawRoute
			.replace(':uuid', uuid)
			.replace(':uuid?', uuid)
			.replace(':buildingUUID', uuid)
			.replace(':buildingUUID?', uuid)
			.replace(':userUUID', uuid)
			.replace(':tab', tab)
			.replace(':tab?', tab);

		const cleanedRoute = filledRoute.replaceAll('?', '');
		const expectedAccess = checkAccess(page, userCredentials);
		const baseRoute = `/${cleanedRoute.split(':')[0]}`;

		if (key === 'users') {
			it(`🔀 USER should be redirected from /users to /user/${createdUser?.uuid}/info`, () => {
				cy.visit('/users');
				cy.location('pathname').should('eq', `/user/${createdUser?.uuid}/info`);
			});
			return;
		}

		if (expectedAccess) {
			it(`✅ USER should access ${key} -> /${cleanedRoute}`, () => {
				cy.visit(`/${cleanedRoute}`);
				cy.location('pathname').should('include', baseRoute);
			});
		} else {
			it(`🚫 USER should be redirected from ${key} -> /${cleanedRoute} to /buildings`, () => {
				cy.visit(`/${cleanedRoute}`);
				cy.location('pathname').should('eq', '/buildings');
			});
		}
	});
});

describe('Admin setup and access tests', () => {
	it('should delete USER user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/users');
		cy.get('[data-testid="user-search"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdUser.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').click();
		cy.get('[data-testid="delete-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="delete-user-button"]').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
	});
});
