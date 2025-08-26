module.exports = {
	pages: {
		map: {
			route: 'map',
		},
		buildings: {
			route: 'buildings',
		},
		building: {
			routeWithParams: 'building/:uuid',
			route: 'building',
		},
		views: {
			route: 'building/:buildingUUID/views',
		},
		viewEditor: {
			routeWithParams: 'viewEditor/:uuid/:buildingUUID?',
			route: 'viewEditor',
			devOnly: true,
		},
		data: {
			route: 'data',
		},
		consumption: {
			routeWithParams: 'consumption/:uuid?',
			route: 'consumption',
		},
		events: {
			route: 'events-v2',
		},
		devices: {
			route: 'devices',
			devOnly: true,
		},
		device: {
			routeWithParams: 'device/:uuid',
			route: 'device',
			devOnly: true,
		},
		alarmsConfig: {
			route: 'alarmsConfig',
			devOnly: true,
		},
		users: {
			route: 'users',
		},
		user: {
			routeWithParams: 'user/:userUUID/:tab?',
			route: 'user',
		},
		audits: {
			route: 'users-audits',
			customAuth: 'devOrAdminOnly',
		},
		files: {
			route: 'files',
			devOnly: true,
		},
		companies: {
			routeWithParams: 'companies/:uuid?/:tab?',
			route: 'companies',
			customAuth: 'devOrAdminOnly',
		},
		energy: {
			absoluteRoute: 'energy',
			customAuth: 'energyPermitted',
		},
		info: {
			route: 'info',
		},
	},
};
