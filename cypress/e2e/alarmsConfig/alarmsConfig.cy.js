/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('User (DEV) alarms config Operations', () => {
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
		cy.visit('/alarmsConfig');
	});

	it('should create alarm config', () => {
		cy.get('[data-testid="alarmConfig-add-button"]').click();
		cy.intercept('POST', '/api/alarms-config').as('createAlarmConfig');
		cy.get('#code').clear().type('TEST_CODE');
		cy.get('#name').clear().type('Test Alarm Name');
		cy.get('#unitXid').clear().type('TestGroupXid');
		cy.get('#priority').click();
		cy.get('[role="listbox"] [role="option"]').contains('Pilny').click();
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait(1000)
			.wait('@createAlarmConfig')
			.then(interception => {
				expect(interception.response.statusCode).to.eq(201);
			});
	});

	it('should update alarm config', () => {
		cy.get('[data-testid="alarm-search"] input').clear().type('TEST_CODE');
		cy.get('[data-testid="alarm-search-button"]').click();
		cy.get(`[data-testid="more-alarmConfig-TEST_CODE"]`).click({ force: true });
		cy.intercept('PUT', '/api/alarms-config/TEST_CODE').as('updateAlarmConfig');
		cy.get('#name').clear().type('Test Alarm Name Updated');
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait(1000)
			.wait('@updateAlarmConfig')
			.then(interception => {
				expect(interception.response.statusCode).to.eq(200);
			});
	});

	it('should delete alarm config', () => {
		cy.get('[data-testid="alarm-search"] input').clear().type('TEST_CODE');
		cy.get('[data-testid="alarm-search-button"]').click();
		cy.get(`[data-testid="more-alarmConfig-TEST_CODE"]`).click({ force: true });
		cy.intercept('DELETE', '/api/alarms-config/TEST_CODE').as('deleteAlarmConfig');
		cy.get('[data-testid="dialog-delete"]').click();
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait('@deleteAlarmConfig').then(interception => {
			expect(interception.response.statusCode).to.eq(204);
		});
		cy.get('[data-testid="dialog-confirm"]').should('not.exist');
	});
});
