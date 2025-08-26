const { fakeUUID, randArr } = require('./../fakeData');
const { points } = require('./devices');

let _buildings = [
	{
		uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd',
		name: 'B - Wrocław',
		description: 'Budynek Wrocław',
		type: '',
		tags: '',
		addTs: Date.now(),
		editTs: Date.now(),
		user: {
			uuid: 'xxxx-user-abcd-efgh-0dev',
			name: 'dev@el-piast.com',
		},
		devices: [
			{
				uuid: 'b945db1a-d84e-488c-96fc-7e9464986659',
				name: 'S - Wrocław',
			},
		],
		code: '1337',
		area: 550,
		city: 'Wrocław',
		province: 'dolnoslaskie',
		address: 'ul. Bolesława Krzywoustego 126',
		status: 'WORKING',
		alarmsCount: 5,
		alarmsMaxPriority: 4,
		connection: true,
		tset: 'aaaa',
		tmain: 'bbbb',
		lastSync: Date.now(),
		placeType: 'SMALL_SHOP_CENTER',
		ventTechnical: 'OWN',
		ventBrand: 'KLIMOR',
		bypass: false,
		fancoils: 'MULTI',
		curtains: 'ELECTRIC',
		heatSource: 'OWN',
		acBrand: 'Fujitsu',
		acCount: 4,
		curtainsCount: 2,
		fancoilsCount: 4,
		powerConnectionType: 'OWN',
		powerConnectionPower: 50,
		permissions: 2,
		deploymentDateTs: null,
		techDepartmentDateTs: null,
		additionals: null,
		consumptions: {
			last1: 158,
			last7: 158 * 7,
			last30: 158 * 30,
		},
		installationCompany: {
			uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebn',
			name: 'FI - Wrocław',
		},
		serviceCompany: {
			uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebb',
			name: 'FS - Wrocław',
		},
	},
];

const pointsXidsRefs = (Object.values(points) || []).map(point => [point.xid, point.uuid]).reduce((ob, [xid, uuid]) => ({ ...ob, [xid]: uuid }), {});

_buildings = _buildings.map(building => ({
	...building,
	pointsXidsRefs,
}));

const TEMP_DATA = {
	buildings: _buildings,
	countAll: _buildings.length,
	count: _buildings.length,
};

const sort = (param, dir) => (a, b) => {
	return a[param] > b[param] ? (dir === 'desc' ? -1 : 1) : b[param] > a[param] ? (dir === 'desc' ? 1 : -1) : 0;
};

const generateTempData = settings => {
	const { dir: d, q, p } = settings;
	const offset = Number(settings.o);
	const rowsPerPage = Number(settings.s);

	let data = { ...TEMP_DATA };
	data.countAll = TEMP_DATA.buildings.length;

	if (q && q.length > 2) {
		data.buildings = data.buildings.filter(building => `${building.city}${building.province}`.toLowerCase().includes(q.toLowerCase()));
	}

	data.buildings = data.buildings.sort(sort(p, d));
	data.count = data.buildings.length;
	data.buildings = data.buildings.slice(offset * rowsPerPage, (offset + 1) * rowsPerPage);

	return data;
};

const getBuildings = (req, res) => {
	const data = generateTempData(req.query);
	res.status(200).send(data);
};

const getPoints = (req, res) => {
	res.status(200).send({ points: Object.values(points) });
};

const getBuilding = (req, res) => {
	const uuid = req.params.uuid;
	let building = TEMP_DATA.buildings.find(building => building.uuid === uuid);

	if (building) {
		res.status(200).json({ building });
	} else {
		res.status(500);
	}
};

const updateBuilding = (req, res) => {
	const { building } = req.body;
	const uuid = req.params.uuid;
	TEMP_DATA.buildings = TEMP_DATA.buildings.map(b => (b && b.uuid === uuid ? building : b));
	setTimeout(() => res.status(200).send({ building }), 1000);
};

const removeBuilding = (req, res) => {
	const uuid = req.params.uuid;
	TEMP_DATA.buildings = TEMP_DATA.buildings.filter(building => building.uuid !== uuid);
	res.status(200).send({});
};

const addBuilding = (req, res) => {
	const { building } = req.body;
	const newBuilding = {
		...building,
		uuid: fakeUUID(),
		addTs: Date.now(),
		editTs: Date.now(),
	};
	TEMP_DATA.buildings.push(newBuilding);
	res.status(200).send({ building: newBuilding });
};

const getBuildingsList = (req, res) => {
	res.send({
		buildings: TEMP_DATA.buildings.slice(0, 50).map((building, index) => ({
			name: building.code + ' ' + building.name + index,
			uuid: building.uuid,
		})),
	});
};

const getBuildingAsCode = (req, res) => {
	res.send({
		uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd',
	});
};

const minLatitude = 50.8;
const maxLatitude = 54;
const minLongitude = 16;
const maxLongitude = 22;

const pins = Array.from({ length: 300 }, (_, i) => {
	const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
	const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;

	return {
		uuid: 'Budynek' + i,
		name: 'Budynek' + ` [${i}]`,
		data: [i % 2 === 0 ? randArr([0, 1, 2, 3, 4]) : null, i % 2 === 0 ? randArr([0, 1, 2, 3, 4]) : null, i % 2 === 0 ? 0 : 1],
		pos: [latitude, longitude],
	};
});

const groups = Array.from({ length: 15 }, (_, i) => {
	const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
	const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;

	return {
		id: i,
		data: [i % 2 === 0 ? randArr([0, 1, 2, 3, 4]) : null, i % 2 === 0 ? randArr([0, 1, 2, 3, 4]) : null, i % 2 === 0 ? 0 : 1],
		pos: [latitude, longitude],
	};
});

const getMap = (req, res) => {
	res.send({
		data: { pins, groups },
	});
};

const getMapPin = (req, res) => {
	const pinDetails = {
		uuid: 'Budynek',
		code: '1337',
		name: 'Wrocław',
		city: 'Wrocław',
		address: 'ul. Wrocławska',
		workmode: 'Praca',
		tsetactual: 24,
		tavr: 22,
		alarmsCount: randArr([0, 1, 2, 3, 4]),
		alarmsMaxPriority: randArr([0, 1, 2, 3, 4]),
		connection: true,
		administrator: {
			uuid: 'xxxx-user-abcd-efgh-0dev',
			name: 'dev@el-piast.com',
		},
	};

	res.send({
		details: pinDetails,
	});
};

module.exports = {
	useBuildings: router => {
		router.get('/maps/data', getMap);
		router.get('/maps/details/:uuid', getMapPin);
		router.get('/buildings/as-code/:code', getBuildingAsCode);
		router.get('/buildings/', getBuildings);
		router.get('/building/:uuid', getBuilding);
		router.post('/building', addBuilding);
		router.put('/building/:uuid', updateBuilding);
		router.delete('/building/:uuid', removeBuilding);
		router.get('/building/:uuid/points', getPoints);
		router.get('/buildings/list', getBuildingsList);
	},
	points,
	buildings: _buildings,
};
