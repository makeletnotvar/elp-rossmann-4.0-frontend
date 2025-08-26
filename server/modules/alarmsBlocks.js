let alarmsBlocks = [];

const sort = (param, dir) => (a, b) => {
	return a[param] > b[param]
		? dir === 'desc'
			? -1
			: 1
		: b[param] > a[param]
		? dir === 'desc'
			? 1
			: -1
		: 0;
};

const getAlarmsBlocks = (req, res) => {
	const { dir: d, q, p, F_building, F_type } = req.query;
	const offset = Number(req.query.o);
	const rowsPerPage = Number(req.query.s);

	let data = { alarmsBlocks };
	data.countAll = alarmsBlocks.length;

	if (q && q.length > 2) {
		data.alarmsBlocks = data.alarmsBlocks.filter(event =>
			`${event.name}`.toLowerCase().includes(q.toLowerCase())
		);
	}

	if (F_building) {
		data.alarmsBlocks = data.alarmsBlocks.filter(alarmBlock =>
			`${alarmBlock.building.uuid}`
				.toLowerCase()
				.includes(F_building.toLowerCase())
		);
	}

	if (F_type && F_type !== 'ALL') {
		data.alarmsBlocks = data.alarmsBlocks.filter(alarmBlock =>
			`${alarmBlock.type}`.toLowerCase().includes(F_type.toLowerCase())
		);
	}

	data.alarmsBlocks = data.alarmsBlocks.sort(sort(p, d));

	data.count = data.alarmsBlocks.length;

	data.alarmsBlocks = data.alarmsBlocks.slice(
		offset * rowsPerPage,
		(offset + 1) * rowsPerPage
	);

	res.send(data);
};

const addAlarmBlock = data => {
	alarmsBlocks.push(data);
};

const update = (req, res) => {
	const { alarmBlock } = req.body;
	const alarmBlockIndex = alarmsBlocks.findIndex(
		s => s.code === alarmBlock.code
	);
	if (alarmBlockIndex === -1)
		return Promise.reject(new Error('Event not found'));
	alarmsBlocks[alarmBlockIndex] = {
		...alarmsBlocks[alarmBlockIndex],
		...alarmBlock,
	};
	const alarmBlockObject = alarmsBlocks.find(
		e => e.code === alarmBlock.code && e.deviceUUID === alarmBlock.deviceUUID
	);
	res.send({ alarmBlock: alarmBlockObject });
};

module.exports = {
	useAlarmsBlocks: router => {
		router.get('/alarms/blocks', getAlarmsBlocks);
		router.put('/alarms/blocks', update);
	},
	addAlarmBlock,
};
