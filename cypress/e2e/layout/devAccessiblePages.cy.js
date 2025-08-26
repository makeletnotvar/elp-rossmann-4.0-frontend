/* eslint-disable no-undef */
const { pages } = require('../../fixtures/pages');
const { devCredentials } = require('../../fixtures/credentials');

const uuid = 'test-uuid';
const tab = 'info';

const checkAccess = (page, user) => {
	if (page.devOnly && user.type !== 'DEV') return false;
	if (page.devOrAdminOnly && user.type !== 'DEV' && user.type !== 'ADMIN') return false;

	if (typeof page.customAuth === 'function') {
		return page.customAuth(user);
	}

	return true;
};

describe('Check all dev-accessible pages', () => {
	beforeEach(() => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(devCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(devCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
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
		const expectedAccess = checkAccess(page, devCredentials);
		const baseRoute = `/${cleanedRoute.split(':')[0]}`;

		if (expectedAccess) {
			it(`should allow access to ${key} -> /${cleanedRoute}`, () => {
				cy.visit(`/${cleanedRoute}`);
				cy.location('pathname').should('include', baseRoute);
			});
		} else {
			it(`should redirect ${key} -> /${cleanedRoute} to /buildings`, () => {
				cy.visit(`/${cleanedRoute}`);
				cy.location('pathname').should('eq', '/buildings');
			});
		}
	});
});
