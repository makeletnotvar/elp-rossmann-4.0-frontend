/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('User (DEV) CRUD Operations', () => {
	let loginCredentials = {
		...devCredentials,
	};

	let createdDevice = {};

	beforeEach(() => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear();
		cy.get('[data-testid="login-password"] input').clear();
		cy.get('[data-testid="login-username"]').type(loginCredentials.username);
		cy.get('[data-testid="login-password"]').type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.getCookie('__t').should('exist');
		cy.visit('/devices');
	});

	it('should update device', () => {
		cy.get(`[data-testid="device-more-button-f9a72245-56b9-4c5f-a797-00a7d772c505"]`).click({ force: true });
		cy.get('[data-testid="device-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="device-edit-button"]').click();
		cy.intercept('PUT', `/api/device/f9a72245-56b9-4c5f-a797-00a7d772c505`).as('updateDevice');
		cy.get('[data-testid="device-name-input"] input').clear().type('1486 Wrocław Updated');
		cy.get('[data-testid="device-save-button"]').click();
		cy.wait('@updateDevice').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdDevice = { ...createdDevice, ...interception.response.body.device };
		});
	});

	it('check updated device', () => {
		cy.get('[data-testid="device-more-button-f9a72245-56b9-4c5f-a797-00a7d772c505"]').click({ force: true });
		cy.get('[data-testid="device-name-value"]').contains('1486 Wrocław Updated');
	});

	it('should update device', () => {
		cy.get(`[data-testid="device-more-button-f9a72245-56b9-4c5f-a797-00a7d772c505"]`).click({ force: true });
		cy.get('[data-testid="device-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="device-edit-button"]').click();
		cy.intercept('PUT', `/api/device/f9a72245-56b9-4c5f-a797-00a7d772c505`).as('updateDevice');
		cy.get('[data-testid="device-name-input"] input').clear().type('1486 Wrocław');
		cy.get('[data-testid="device-save-button"]').click();
		cy.wait('@updateDevice').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdDevice = { ...createdDevice, ...interception.response.body.device };
		});
	});
});
