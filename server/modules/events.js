const { fakeUUID, randArr } = require('./../fakeData');
const { buildings } = require('./buildings');
const { devices } = require('./devices');
const { addAlarmBlock } = require('./alarmsBlocks');

let events = [];

const generateAcknowledge = () => {
	const active = Math.random() > 0.5;
	const acknowledgeable = !active && Math.random() > 0.5;
	const acknowledged = acknowledgeable && Math.random() > 0.25;

	return {
		active,
		acknowledgeable,
		acknowledged,
		acknowledgeTs: acknowledged ? Math.round(Date.now() - Math.random() * (1000 * 60 * 60 * 24 * 31)) : null,
		acknowledgeUser: acknowledged ? 'admin' : '',
	};
};

for (let i = 0; i <= 4; i++) {
	const buildingIndex = Math.floor(Math.random() * buildings.length);
	const building = buildings[buildingIndex];
	const deviceIndex = Math.floor(Math.random() * devices.length);
	const device = devices[deviceIndex];

	const activeTs = Math.round(Date.now() - Math.random() * (1000 * 60 * 60 * 24 * 31));
	const deactiveTs = activeTs + Math.round(Math.random() * (1000 * 60 * 60 * 24 * 7));

	events.push({
		code: fakeUUID(),
		uuid: fakeUUID(),
		name: ['Alarm obiegu 1', 'Niskie ciśnienie obieg1', 'Alarm obiegu 2', 'Niskie ciśnienie obieg2', 'Alarm obiegu 3'][i],
		isActive: Math.random() > 0.5,
		activeTs: activeTs,
		deactiveTs: Math.random() > 0.5 ? deactiveTs : null,
		priority: ['NONE', 'INFORMATION', 'URGENT', 'CRITICAL', 'LIFE_SAFETY'][i],
		type: 'DEVICE_POINT_ALARM',
		registerName: 'A_SOME' + i,
		point: fakeUUID(),
		building: {
			uuid: building.uuid,
			name: building.city,
		},
		device: {
			uuid: device.uuid,
			name: device.name,
		},
		...generateAcknowledge(),
	});
}

const sort = (param, dir) => (a, b) => {
	return a[param] > b[param] ? (dir === 'desc' ? -1 : 1) : b[param] > a[param] ? (dir === 'desc' ? 1 : -1) : 0;
};

const generateTempData = settings => {
	const { dir: d, q, p, F_building } = settings;
	const offset = Number(settings.o);
	const rowsPerPage = Number(settings.s);

	let data = { events };
	data.countAll = events.length;

	if (q && q.length > 2) {
		data.events = data.events.filter(event => `${event.name}`.toLowerCase().includes(q.toLowerCase()));
	}

	if (F_building) {
		data.events = data.events.filter(event => `${event.building.uuid}`.toLowerCase().includes(F_building.toLowerCase()));
	}
	data.events = data.events.sort(sort(p, d));
	data.count = data.events.length;
	data.events = data.events.slice(offset * rowsPerPage, (offset + 1) * rowsPerPage);

	return data;
};

const getEvents = (req, res) => {
	const data = generateTempData(req.query);
	res.send(data);
};

const confirmEvents = (req, res) => {
	setTimeout(() => res.send({ ts: Date.now(), user: 'admin' }), Math.round(1000 + Math.random() * 3000));
};

const confirm = (req, res) => {
	const { alarmBlock } = req.body;
	const event = events.find(e => e.code === alarmBlock.code);
	const eventIndex = events.findIndex(e => e.code === alarmBlock.code);
	if (eventIndex === -1) return Promise.reject(new Error('Event not found'));
	events.splice(eventIndex, 1);

	const alarmBlockData = {
		...alarmBlock,
		name: event.name,
		lastOccurTs: Date.now(),
		isActive: Math.random() > 0.7 ? true : false,
		building: event.building,
		device: event.device,
		startTs: Date.now(),
		user: 'admin',
	};

	addAlarmBlock(alarmBlockData);
	res.status(201).send({ alarmBlock: alarmBlockData });
};

const getSummary = (req, res) => {
	res.send({
		eventsSummary: {
			alarmsCount: 5,
			alarmsMaxPriority: 4,
			events: events.map(event => ({
				date_time_start: event.activeTs,
				name: event.name,
				description: event.description,
				priority: event.priority,
				registerName: event.registerName,
				unitXid: 'PC1',
				building: {
					uuid: event.building.uuid,
					name: event.building.name,
				},
			})),
		},
	});
};

const getInstance = (req, res) => {
	res.send({
		event: {
			uuid: '123-456-789',
			building: {
				uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd',
				name: 'B - Wrocław',
			},
			device: {
				uuid: 'b945db1a-d84e-488c-96fc-7e9464986659',
				name: 'S - Wrocław',
			},
			start: new Date().getTime(),
			deviceTime: new Date().getTime(),
			end: new Date().getTime(),
			durationInMinutes: 12,
			unitXid: 'PC1',
			acknowledge: {
				user: {
					uuid: 'xxxx-user-abcd-efgh-0dev',
					name: 'dev@el-piast.com',
				},
				time: new Date().getTime(),
			},
		},
	});
};

const getHistory = (req, res) => {
	res.send({
		event: {
			totalDurationInMinutes: 720,
			timeSinceLastOccurrenceInMinutes: 120,
			occurrences: {
				total: 45,
				lastWeek: 5,
				lastMonth: 15,
				lastYear: 45,
				averageWeekly: 1.25,
				averageMonthly: 3.75,
			},
			durations: {
				longest: {
					duration: 180,
					start: new Date(new Date().setDate(new Date().getDate() - 30)),
					end: new Date(new Date().setDate(new Date().getDate() - 29)),
				},
				shortest: {
					duration: 10,
					start: new Date(new Date().setDate(new Date().getDate() - 3)),
					end: new Date(new Date().setDate(new Date().getDate() - 3)),
				},
				average: 16,
			},
		},
	});
};

module.exports = {
	useEvents: router => {
		router.get('/events', getEvents);
		router.put('/events/confirm', confirmEvents);
		router.get('/events/summary', getSummary);
		router.get('/events/instance/:uuid', getInstance);
		router.get('/events/stats/data', getHistory);
		router.post('/alarms/blocks', confirm);
	},
};
