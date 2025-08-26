/* eslint-disable no-undef */
const { devCredentials } = require('../../fixtures/credentials');

describe('User (DEV) CRUD Operations', () => {
	let loginCredentials = {
		...devCredentials,
	};

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
		installationCompany: 'El-Piast',
		serviceCompany: 'El-Piast',
		administrator: 'DEV',
		hpCount: 1,
		readyForAllUsers: true,
		lat: 51.2,
		long: 51.2,
	};

	let createdBuilding = {
		...newBuilding,
	};

	const newGroup = {
		name: 'Test Group',
		xid: 'Test_Group_Xid',
	};

	let createdGroup = {
		...newGroup,
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
		cy.visit('/buildings');
	});

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

		cy.get('[data-testid="building-installationCompany-select"]').click();
		cy.get('[data-testid="options-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.installationCompany}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.installationCompany}"]`).click();
		cy.get('[data-testid="dialog-confirm"]').click();

		cy.get('[data-testid="building-serviceCompany-select"]').click();
		cy.get('[data-testid="options-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.serviceCompany}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.serviceCompany}"]`).click();
		cy.get('[data-testid="dialog-confirm"]').click();

		cy.get('[data-testid="building-administrator-select"]').click();
		cy.get('[data-testid="options-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.administrator}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.administrator}"]`).click();
		cy.get('[data-testid="dialog-confirm"]').click();

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
	});

	it('check added building data', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get('[data-testid="building-city-value"]').contains(newBuilding.city);
		cy.get('[data-testid="building-address-value"]').contains(newBuilding.address);
		cy.get('[data-testid="building-province-value"]').contains(newBuilding.province);
		cy.get('[data-testid="building-area-value"]').contains(newBuilding.area);
		cy.get('[data-testid="building-installationCompany-value"]').contains(newBuilding.installationCompany);
		cy.get('[data-testid="building-serviceCompany-value"]').contains(newBuilding.installationCompany);
		cy.get('[data-testid="building-administrator-value"]').contains(newBuilding.installationCompany);
		cy.get('[data-testid="building-placeType-value"]').contains('Galeria');
		cy.get('[data-testid="building-heatSource-value"]').contains('Własne');
		cy.get('[data-testid="building-ventTechnical-value"]').contains('Własne');
		cy.get('[data-testid="building-status-value"]').contains('Gotowy');
	});

	it('should update building', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get('[data-testid="building-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-edit-button"]').click();
		cy.intercept('PUT', `/api/building/${createdBuilding.uuid}`).as('updateBuilding');
		cy.get('[data-testid="building-city-input"] input').clear().type('City Update');
		cy.get('[data-testid="building-save-button"]').scrollIntoView().click();
		cy.wait('@updateBuilding').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdBuilding = { ...createdBuilding, ...interception.response.body.building };
		});
	});

	it('should create building group', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get(`[data-testid="building-units-button`).click();
		cy.get('[data-testid="building-add-group-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-add-group-button"]').click();
		cy.intercept('PUT', `/api/units/${createdBuilding.uuid}/new_0`).as('createGroup');
		cy.get('[data-testid="building-units-name-input"] input').clear().type(newGroup.name);
		cy.get('[data-testid="building-units-xid-input"] input').clear().type(newGroup.xid);
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait('@createGroup').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdGroup = { ...createdGroup, ...interception.response.body.unit };
		});
	});

	it('should update building group', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get(`[data-testid="building-units-button`).click();
		cy.get(`[data-testid="building-units-list-${createdGroup.xid}"]`).should('exist').and('be.visible');
		cy.get(`[data-testid="building-units-list-${createdGroup.xid}"]`).click();
		cy.get('[data-testid="building-units-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-units-edit-button"]').click();
		cy.intercept('PUT', `/api/units/${createdBuilding.uuid}/${createdGroup.xid}`).as('updateGroup');
		cy.get('[data-testid="building-units-name-input"] input').clear().type(`${newGroup.name} Updated`);
		cy.get('[data-testid="building-units-xid-input"] input').clear().type(`${newGroup.xid}_Updated`);
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.wait('@updateGroup').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdGroup = { ...createdGroup, ...interception.response.body.unit };
		});
	});

	it('should delete building group', () => {
		cy.get('[data-testid="building-search"] input').clear().type(1337);
		cy.get('[data-testid="building-search-button"]').click();
		cy.get(`[data-testid="building-more-button-${createdBuilding.uuid}"]`).click({ force: true });
		cy.get(`[data-testid="building-units-button`).click();
		cy.get(`[data-testid="building-units-list-${createdGroup.xid}"]`).should('exist').and('be.visible');
		cy.get(`[data-testid="building-units-list-${createdGroup.xid}"]`).click();
		cy.get('[data-testid="building-units-edit-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="building-units-edit-button"]').click();
		cy.intercept('DELETE', `/api/units/${createdBuilding.uuid}/${createdGroup.xid}`).as('deleteGroup');
		cy.get('[data-testid="building-units-dialog-delete"]').click();
		cy.get('[data-testid="building-units-dialog-confirm"]').click();
		cy.wait('@deleteGroup').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
		});
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
	});
});
