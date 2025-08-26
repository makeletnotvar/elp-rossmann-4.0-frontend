/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('User (DEV) data operations', () => {
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
	});

	it('should navigate to /data, configure chart, and generate a plot', () => {
		cy.visit('/data');
		cy.get('[data-testid="chart-settings-button"]').click();
		cy.get('[data-testid="add-chart-point-button"]').click();
		cy.get('[data-testid="options-select"] div').eq(7).click({ force: true });
		cy.get('#react-select-3-option-0').should('be.visible').click({ force: true });
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait(3000);
		cy.get('[data-testid="chart-date-picker-last-day"]').click();
		cy.get('[data-testid="generate-chart-button"]').click();
		cy.get('[data-testid="chart-display"]').should('be.visible');
	});
});
