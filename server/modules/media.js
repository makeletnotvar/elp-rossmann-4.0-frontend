const { devices, points } = require('./devices');

const TEMP_DATA = {
	mediaDevices: devices,
	countAll: devices.length,
	count: devices.length,
};

const sort = (param, dir) => (a, b) => {
	return a[param] > b[param] ? (dir === 'desc' ? -1 : 1) : b[param] > a[param] ? (dir === 'desc' ? 1 : -1) : 0;
};

const generateTempDataDevices = settings => {
	const { dir: d, q, p } = settings;
	const offset = Number(settings.o);
	const rowsPerPage = Number(settings.s);

	let data = { ...TEMP_DATA };
	data.countAll = TEMP_DATA.mediaDevices.length;

	if (q && q.length > 2) {
		data.mediaDevices = data.mediaDevices.filter(device => `${device.city}${device.province}`.toLowerCase().includes(q.toLowerCase()));
	}
	data.mediaDevices = data.mediaDevices.sort(sort(p, d));
	data.count = data.mediaDevices.length;
	data.mediaDevices = data.mediaDevices.slice(offset * rowsPerPage, (offset + 1) * rowsPerPage);

	return data;
};

const getDevices = (req, res) => {
	const data = generateTempDataDevices(req.query);
	res.send(data);
};

const generateData = (fromTs, toTs, _period, type) => {
	const to = Number(toTs);
	const from = Number(fromTs);
	const DAY = 1000 * 60 * 60 * 24;

	const periods = {
		DAY: DAY,
		WEEK: DAY * 7,
		MONTH: DAY * 31,
	};

	const period = periods[_period] || periods.DAY;
	const count = Math.round((to - from) / period);
	let data = [];
	let j = 0;

	for (let i = 0; i <= count; i++) {
		let ts = Date.now() - period * j;
		let value = type === 'enum' ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 40);
		j++;

		data.push({ value, ts });
	}
	return data;
};

const generateDataConsumption = (fromTs, toTs, period) => {
	const to = Number(toTs);
	const from = Number(fromTs);
	const DAY = 1000 * 60 * 60 * 24;

	const periods = {
		QUARTER: 15 * 60 * 1000,
		HOUR: 60 * 60 * 1000,
		DAY: DAY,
		WEEK: DAY * 7,
		MONTH: DAY * 31,
	};

	const periodType = periods[period] || periods.DAY;
	const count = Math.round((to - from) / periodType);
	let data = [];
	let j = 0;
	for (let i = 0; i <= count; i++) {
		let startDate = Date.now() + periodType * j;
		let startValue = i * (100 + Math.random() * 100);
		let endValue = startValue + 100 + Math.random() * 100;
		let endDate = startDate + periodType;
		let consumption = endValue - startValue;
		j++;

		data.push({
			dateKey: i,
			consumption,
			startValue: {
				value: startValue,
				ts: startDate,
			},
			endValue: {
				value: endValue,
				ts: endDate,
			},
		});
	}

	return data;
};

const getDevicePointData = (req, res) => {
	const { p, deviceUUID, fromTs, toTs } = req.query;
	const device = devices.find(device => device.uuid === deviceUUID);
	if (!device) {
		return res.status(404).json({ error: 'Device not found' });
	}
	const devicePoints = device.points.filter(point => Array(p).flat().includes(point.uuid));
	const fakeData = {
		data: {},
	};
	devicePoints.forEach(devicePoint => {
		const point = points[devicePoint.uuid];

		if (point) {
			const generatedData = generateData(fromTs, toTs, 'DAY', point.type);
			fakeData.data[devicePoint.uuid] = {
				name: 'Licznik energii - Główny - Suma energii czynnej',
				uuid: point.uuid,
				xid: 'em_1_act_sum',
				values: generatedData,
			};
		}
	});
	res.status(200).send(fakeData);
};

const getDevicePointConsumptionData = (req, res) => {
	const { deviceUUID, fromTs, toTs, period } = req.query;
	const device = devices.find(device => device.uuid === deviceUUID);
	if (!device) {
		return res.status(404).json({ error: 'Device not found' });
	}
	const generatedData = generateDataConsumption(fromTs, toTs, period);
	const consumptionData = {
		name: device.name,
		uuid: device.uuid,
		values: generatedData,
	};
	const fakeData = {
		data: consumptionData,
	};
	res.status(200).send(fakeData);
};

module.exports = {
	useMedia: router => {
		router.get('/media/list', getDevices);
		router.get('/media/data', getDevicePointData);
		router.get('/media/consumption-data', getDevicePointConsumptionData);
	},
};
