/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('Company (DEV) CRUD Operations', () => {
	let loginCredentials = {
		...devCredentials,
	};

	const newCompany = {
		name: 'COMPANY',
	};

	let createdCompany = {
		...newCompany,
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
		cy.visit('/companies');
	});

	it('should create a new company', () => {
		cy.intercept('POST', '/api/companies').as('createcompany');
		cy.get('[data-testid="add-company-button"]').click();
		cy.get('[data-testid="company-name"] input').clear().type(newCompany.name);
		cy.get('[data-testid="save-company-button"]').click();
		cy.wait('@createcompany').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdCompany = { ...createdCompany, ...interception.response.body.company };
		});
	});

	it('check added company data', () => {
		cy.get('[data-testid="company-search"] input').clear().type(createdCompany.name);
		cy.get('[data-testid="company-search-button"]').click();
		cy.get(`[data-testid="company-more-button-${createdCompany.uuid}"]`).click({ force: true });
		cy.get('[data-testid="company-name-value"]').contains(newCompany.name);
	});

	it('should update company data', () => {
		cy.intercept('PUT', `/api/companies/${createdCompany.uuid}`).as('updatecompany');
		cy.get('[data-testid="company-search"] input').clear().type(createdCompany.name);
		cy.get('[data-testid="company-search-button"]').click();
		cy.get(`[data-testid="company-more-button-${createdCompany.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-company-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="edit-company-button"]').click();
		cy.get('[data-testid="company-name"] input').clear();
		cy.get('[data-testid="company-name"]').type('COMPANY UPDATED');
		cy.get('[data-testid="save-company-button"]').click();
		cy.wait('@updatecompany').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdCompany = { ...createdCompany, ...interception.response.body.company };
		});
	});

	it('should delete company', () => {
		cy.get('[data-testid="company-search"] input').clear().type(createdCompany.name);
		cy.get('[data-testid="company-search-button"]').click();
		cy.get(`[data-testid="company-more-button-${createdCompany.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-company-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="edit-company-button"]').click();
		cy.get('[data-testid="delete-company-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="delete-company-button"]').click();
		cy.get('[data-testid="confirm-delete-company-button"]').click();
	});
});
