/* eslint-disable no-undef */
const { pages } = require('../../fixtures/pages');
const { devCredentials, adminCredentials } = require('../../fixtures/credentials');

const uuid = 'test-uuid';
const tab = 'info';
let createdAdmin;

const checkAccess = (page, user) => {
	if (page.devOnly && user.type !== 'DEV') return false;
	if (page.devOrAdminOnly && user.type !== 'DEV' && user.type !== 'ADMIN') return false;

	if (typeof page.customAuth === 'function') {
		return page.customAuth(user);
	}

	return true;
};

describe('Admin setup and access tests', () => {
	it('should create an ADMIN user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/users');
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
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/users');
		cy.get('[data-testid="user-search"] input').clear().type(createdAdmin.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdAdmin.uuid}"]`).click({ force: true });
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
});

describe('Check all admin-accessible pages', () => {
	const loginAsAdmin = () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(adminCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(adminCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
	};

	beforeEach(() => {
		loginAsAdmin();
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
		const expectedAccess = checkAccess(page, adminCredentials);
		const baseRoute = `/${cleanedRoute.split(':')[0]}`;

		if (expectedAccess) {
			it(`✅ ADMIN should access ${key} -> /${cleanedRoute}`, () => {
				cy.visit(`/${cleanedRoute}`);
				cy.location('pathname').should('include', baseRoute);
			});
		} else {
			it(`🚫 ADMIN should be redirected from ${key} -> /${cleanedRoute} to /buildings`, () => {
				cy.visit(`/${cleanedRoute}`);
				cy.location('pathname').should('eq', '/buildings');
			});
		}
	});
});

describe('Admin setup and access tests', () => {
	it('should delete ADMIN user', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit('/users');
		cy.get('[data-testid="user-search"] input').clear().type(adminCredentials.username);
		cy.get('[data-testid="user-search-button"]').click();
		cy.get(`[data-testid="user-more-button-${createdAdmin.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-user-button"]').click();
		cy.get('[data-testid="delete-user-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="delete-user-button"]').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
	});
});
