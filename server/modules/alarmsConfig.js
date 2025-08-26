const { fakeUUID, randArr } = require('./../fakeData');

const ALARMS_COUNT = 1500;

let alarmsConfig = [...Array(ALARMS_COUNT).keys()].map(number => {
	return {
		code: fakeUUID(),
		name: `AC_C2_Com_${number}`,
		priority: randArr(['NONE', 'INFORMATION', 'URGENT', 'CRITICAL', 'LIFE_SAFETY']),
		isBlocking: Math.random() > 0.3 ? true : false,
	};
});

const ALARMS_CONFIG_DATA = {
	alarmsConfig: alarmsConfig,
	countAll: alarmsConfig.length,
	count: alarmsConfig.length,
};

const sort = (param, dir) => (a, b) => {
	return a[param] > b[param] ? (dir === 'desc' ? -1 : 1) : b[param] > a[param] ? (dir === 'desc' ? 1 : -1) : 0;
};

const generateTempData = settings => {
	const { d, p } = settings;
	let data = { ...ALARMS_CONFIG_DATA };
	data.countAll = ALARMS_CONFIG_DATA.alarmsConfig.length;
	data.alarmsConfig = data.alarmsConfig.sort(sort(p, d));
	data.count = data.alarmsConfig.length;

	return data;
};

const getAlarmsConfig = (req, res) => {
	const data = generateTempData(req.query);
	res.status(200).send(data);
};

const getAlarmConfig = (req, res) => {
	const code = req.params.code;
	let alarmConfig = ALARMS_CONFIG_DATA.alarmsConfig.find(alarmConfig => alarmConfig.code === code);

	if (alarmConfig) {
		res.status(200).json({ alarmConfig });
	} else {
		res.status(500);
	}
};

const updateAlarmConfig = (req, res) => {
	const { alarmConfig } = req.body;
	const code = req.params.code;
	ALARMS_CONFIG_DATA.alarmsConfig = ALARMS_CONFIG_DATA.alarmsConfig.map(b => (b && b.code === code ? alarmConfig : b));
	setTimeout(() => res.status(200).send({ alarmConfig }), 1000);
};

const deleteAlarmConfig = (req, res) => {
	const code = req.params.code;
	ALARMS_CONFIG_DATA.alarmsConfig = ALARMS_CONFIG_DATA.alarmsConfig.filter(alarmConfig => alarmConfig.code !== code);
	res.status(200).send({ code });
};

const addAlarmConfig = (req, res) => {
	const { alarmConfig } = req.body;
	ALARMS_CONFIG_DATA.alarmsConfig.push(alarmConfig);
	res.status(200).send({ alarmConfig });
};

module.exports = {
	useAlarmsConfig: router => {
		router.get('/alarms-config', getAlarmsConfig);
		router.get('/alarms-config/:code', getAlarmConfig);
		router.post('/alarms-config', addAlarmConfig);
		router.put('/alarms-config/:code', updateAlarmConfig);
		router.delete('/alarms-config/:code', deleteAlarmConfig);
	},
};
