/* eslint-disable no-undef */
const { apiUrl } = require('../../fixtures/api');
const { devCredentials } = require('../../fixtures/credentials');

describe('Users visibility VHMI', () => {
	let visitPage = '/companies';

	let loginCredentials = {
		...devCredentials,
	};

	let userCredentials = {
		username: 'user_user@test.com',
		password: 'UserPass123!',
	};

	let createdUser = {};

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
		serviceCompany: 'COMPANY',
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

	const newCompany = {
		name: 'COMPANY',
	};

	let createdCompany = {
		...newCompany,
	};

	let buildingsCountByServiceCompany = 0;

	it('should create a new company', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.intercept('POST', '/api/companies').as('createCompany');
		cy.get('[data-testid="add-company-button"]').click();
		cy.get('[data-testid="company-name"] input').clear().type(newCompany.name);
		cy.get('[data-testid="save-company-button"]').click();
		cy.wait('@createCompany').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			createdCompany = { ...createdCompany, ...interception.response.body.company };
		});
		visitPage = '/buildings';
	});

	it('should create a new building', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
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

		cy.get('[data-testid="building-serviceCompany-select"]').click();
		cy.get('[data-testid="options-select"]').click();
		cy.get(`[data-testid="menu-item-${newBuilding.serviceCompany}"]`).scrollIntoView().should('be.visible');
		cy.get(`[data-testid="menu-item-${newBuilding.serviceCompany}"]`).click();
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
		visitPage = '/buildings';
	});

	it('should update building', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
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
	});

	it('should get all buildings count by service company', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(`/buildings/list?F_service_company=${createdCompany.uuid}&o=0&s=1000`);
		cy.intercept('GET', `/api/buildings/?F_service_company=${createdCompany.uuid}&o=0&s=1000`).as('getBuildings');
		cy.wait('@getBuildings').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			buildingsCountByServiceCompany = (interception.response.body.buildings || []).filter(
				building => building?.serviceCompany?.name.toLocaleLowerCase() === 'COMPANY'
			).length;
		});
		visitPage = '/users';
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
		cy.get('[data-testid="add-company-button"]').click();
		cy.get('[data-testid="options-select"]').click();
		cy.get(`[data-testid="menu-item-COMPANY"]`).scrollIntoView().should('be.visible');
		cy.get('[data-testid="menu-item-COMPANY"]').click();
		cy.get('[data-testid="dialog-confirm"]').click();
		cy.get('[data-testid="user-type"]').click();
		cy.get('[data-testid="menu-item-USER"]').click();
		cy.get('[data-testid="user-active-checkbox"] input[type="checkbox"]').check();
		cy.get('[data-testid="user-userBuildingsAll-checkbox"] input[type="checkbox"]').check();
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
		visitPage = '/buildings';
	});

	it('should be equal by service company', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(userCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(`/buildings/list?F_service_company=${createdCompany.uuid}&o=0&s=1000`);
		cy.intercept('GET', `/api/buildings/?F_service_company=${createdCompany.uuid}&o=0&s=1000`).as('getBuildings');
		cy.wait('@getBuildings').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			const buildingsCountByServiceCompanyAsUser = (interception.response.body.buildings || []).filter(
				building => building?.serviceCompany?.name.toLocaleLowerCase() === 'COMPANY'
			).length;
			expect(buildingsCountByServiceCompanyAsUser).to.equal(buildingsCountByServiceCompany);
		});
		visitPage = '/map';
	});

	it('should get created building details in map and permissions must equal 1', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(userCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.request('GET', `${apiUrl}/api/maps/details/${createdBuilding.uuid}`).then(response => {
			expect(response.status).to.eq(200);
			const buildingDetailsMapPermissions = response.body.details?.permissions;
			expect(buildingDetailsMapPermissions).to.equal(1);
		});
		visitPage = '/buildings';
	});

	it('should not see virtual hmi button in building', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(userCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(userCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.get(`[data-testid^="building-more-button-"]`).first().click({ force: true });
		cy.get(`[data-testid="building-vhmi-button"`).should('not.exist');
		visitPage = '/buildings';
	});

	it('should delete building', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
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
		visitPage = '/companies';
	});

	it('should delete company', () => {
		cy.visit('/login');
		cy.get('[data-testid="login-username"] input').clear().type(loginCredentials.username);
		cy.get('[data-testid="login-password"] input').clear().type(loginCredentials.password);
		cy.get('[data-testid="login-button"]').click();
		cy.wait(1000);
		cy.visit(visitPage);
		cy.get('[data-testid="company-search"] input').clear().type(createdCompany.username);
		cy.get('[data-testid="company-search-button"]').click();
		cy.get(`[data-testid="company-more-button-${createdCompany.uuid}"]`).click({ force: true });
		cy.get('[data-testid="edit-company-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="edit-company-button"]').click();
		cy.get('[data-testid="delete-company-button"]').should('exist').and('be.visible');
		cy.get('[data-testid="delete-company-button"]').click();
		cy.get('[data-testid="confirm-delete-company-button"]').click();
		visitPage = '/users';
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
