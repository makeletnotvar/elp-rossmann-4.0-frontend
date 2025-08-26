/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('Create building view as dev', () => {
	let visitPage = '/buildings';

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

	const newBuilding = {
		name: 'Test Building',
		code: 1337,
		city: 'City',
		address: 'Address',
		province: 'dolnoslaskie',
		area: 55,
		placeType: 'SHOP_CENTER',
		status: 'READY',
		powerConnectionType: 'OWN',
		ventTechnical: 'OWN',
		heatSource: 'OWN',
		fancoils: 'NONE',
		curtains: 'NONE',
		powerConnectionPower: 1,
		ventBrand: 12,
		fancoilsCount: 1,
		curtainsCount: 1,
		acBrand: 'Test',
		acCount: 1,
		hpBrand: 'Test',
		hpCount: 1,
		readyForAllUsers: true,
		lat: 51.2,
		long: 51.2,
	};

	let createdBuilding = {
		...newBuilding,
	};

	it('should create a new building', () => {
		cy.get('[data-testid="buildings-add-button"]').click();
		cy.intercept('POST', '/api/building').as('createBuilding');
		cy.get('[data-testid="building-code-input"] input').clear().type(newBuilding.code);
		cy.get('[data-testid="building-city-input"] input').clear().type(newBuilding.city);
		cy.get('[data-testid="building-address-input"] input').clear().type(newBuilding.address);
		cy.get('[data-testid="building-province-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.province}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.province}"]`).click();
		cy.get('[data-testid="building-lat-input"] input').clear().type(newBuilding.lat);
		cy.get('[data-testid="building-long-input"] input').clear().type(newBuilding.long);

		cy.get('[data-testid="building-area-input"] input').clear().type(newBuilding.area);

		cy.get('[data-testid="building-placeType-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.placeType}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.placeType}"]`).click();

		cy.get('[data-testid="building-status-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.status}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.status}"]`).click();
		cy.get('[data-testid="building-readyForAllUsers-checkbox"]').find('input[type="checkbox"]').check();
		cy.get('[data-testid="building-readyForAllUsers-checkbox"]').find('input[type="checkbox"]').should('be.checked');

		cy.get('[data-testid="building-powerConnectionType-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.powerConnectionType}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.powerConnectionType}"]`).click();
		cy.get('[data-testid="building-powerConnectionPower"] input').clear().type(newBuilding.powerConnectionPower);

		cy.get('[data-testid="building-ventTechnical-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.ventTechnical}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.ventTechnical}"]`).click();
		cy.get('[data-testid="building-ventBrand"] input').clear().type(newBuilding.ventBrand);

		cy.get('[data-testid="building-heatSource-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.heatSource}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.heatSource}"]`).click();

		cy.get('[data-testid="building-fancoils-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.fancoils}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.fancoils}"]`).click();
		cy.get('[data-testid="building-fancoilsCount"] input').clear().type(newBuilding.fancoilsCount);

		cy.get('[data-testid="building-curtains-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.curtains}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.curtains}"]`).click();
		cy.get('[data-testid="building-curtainsCount"] input').clear().type(newBuilding.curtainsCount);

		cy.get('[data-testid="building-acBrand"] input').clear().type(newBuilding.acBrand);
		cy.get('[data-testid="building-acCount"] input').clear().type(newBuilding.acCount);
		cy.get('[data-testid="building-hpBrand"] input').clear().type(newBuilding.hpBrand);
		cy.get('[data-testid="building-hpCount"] input').clear().type(newBuilding.hpCount);

		cy.get('[data-testid="building-save-button"]').scrollIntoView().click();
		cy.wait('@createBuilding').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdBuilding = { ...createdBuilding, ...interception.response.body.building };
		});
		visitPage = '/buildings';
	});

	it('should update building', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get('[data-testid="building-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-edit-button"]').click();
		cy.intercept('PUT', `/api/building/${createdBuilding.uuid}`).as('updateBuilding');
		cy.get('[data-testid="building-readyForAllUsers-checkbox"]').find('input[type="checkbox"]').check();
		cy.get('[data-testid="building-readyForAllUsers-checkbox"]').find('input[type="checkbox"]').should('be.checked');
		cy.get('[data-testid="building-save-button"]').scrollIntoView().click();
		cy.wait('@updateBuilding').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdBuilding = { ...createdBuilding, ...interception.response.body.building };
		});
		visitPage = '/buildings';
	});

	it('should see button to create view', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get('[data-testid="building-views-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-views-button"]').click();
		cy.get('[data-testid="add-building-view"]').should('exist').and('be.visible');
		visitPage = '/buildings';
	});

	it('should delete building', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get('[data-testid="building-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-edit-button"]').click();
		cy.get('[data-testid="building-delete-button"]').should('exist').scrollIntoView().and('be.visible');
		cy.get('[data-testid="building-delete-button"]').click();
		cy.intercept('DELETE', `/api/building/${createdBuilding.uuid}`).as('deleteBuilding');
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait('@deleteBuilding').then(interception => {
			expect(interception.response.statusCode).to.eq(204);
		});
		visitPage = '/users';
	});
});
