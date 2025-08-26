const { fakeUUID, randArr } = require('./../fakeData');
const { points } = require('./devices');
const { buildings } = require('./buildings');

let configs = [
	{
		uuid: fakeUUID(),
		name: 'lista 1',
		points: ['aaaa', 'bbbb'],
		addTs: Date.now(),
	},
	{
		uuid: fakeUUID(),
		name: 'lista 2',
		points: ['aaaa', 'bbbb', 'hihoud93w8-alarm'],
		addTs: Date.now(),
	},
	{
		uuid: fakeUUID(),
		name: 'lista 3',
		points: ['aaaa', 'bbbb', 'ea1f0d22-mode'],
		addTs: Date.now(),
	},
];

const valuesGenerator = (n, generator) => {
	let arr = [];

	for (let i = 0; i <= n; i++) {
		arr.push({
			ts: Date.now() - i * 1000 * 60 * 60,
			value: generator(arr[i - 1] ? arr[i - 1].value : undefined),
		});
	}

	return arr;
};

const getChartData = (req, res) => {
	const { from, to, p } = req.query;
	let out = {};
	const pointsUUIDs = p instanceof Array ? p : [p];
	pointsUUIDs.forEach(pointUUID => {
		const point = points[pointUUID];
		let gen = () => 20 + Math.random() * 3;

		if (point.type === 'enum') {
			const render = point.customRender;
			if (render) {
				const keys = Object.keys(render.states).map(Number);
				gen = () => randArr(keys);
			} else {
				gen = () => Math.round(Math.random() * 3);
			}
		}
		if (point.customRender && point.customRender.suffix === '°C') {
			gen = prevTemp => (prevTemp ? prevTemp + (-0.2 + 0.5 * Math.random()) : 19 + Math.random() * 3);
		}
		const values = valuesGenerator(200 + Math.random() * 300, gen);
		out[pointUUID] = values;
	});
	res.send({ values: out });
};

const getChartPreview = (req, res) => {
	const { from, to, p, limit } = req.query;
};

const getChartStats = (req, res) => {
	const { from, to, p } = req.query;
	const statistics = {};
	const pointsUUIDs = p instanceof Array ? p : [p];
	pointsUUIDs.forEach(pointUUID => {
		let pointStats = {};
		const point = points[pointUUID];
		pointStats.count = Math.round(Math.random() * 1000);
		pointStats.countAll = Math.round(Math.random() * 1000);
		if (point.type === 'enum') {
			pointStats.avg = 0;
			pointStats.min = 0;
			pointStats.max = 0;
		} else {
			if (point.customRender && point.customRender.suffix === '°C') {
				pointStats.min = Math.random() + 20;
				pointStats.max = Math.random() + 23;
				pointStats.avg = Math.random() + 21;
			} else {
				pointStats.min = Math.random() + 12;
				pointStats.max = Math.random() + 98;
				pointStats.avg = Math.random() + 48;
			}
		}
		statistics[pointUUID] = pointStats;
	});

	res.send({ statistics });
};
const getChartConfigs = (req, res) => {
	res.send({ configs });
};

const addChartConfig = (req, res) => {
	const { config: preConfig } = req.body;
	const config = {
		...preConfig,
		addTs: Date.now(),
		uuid: fakeUUID(),
	};
	configs.push(config);
	res.send({ config });
};

const updateChartConfig = (req, res) => {
	const { config } = req.body;
	const index = configs.findIndex(conf => config.uuid === config.uuid);
	if (index > 0) {
		configs[index] = config;
	}
	res.send({ config });
};

const removeChartConfig = (req, res) => {
	const { uuid } = req.params;
	configs = configs.filter(conf => conf.uuid !== uuid);
	res.status(203).send({ configs });
};

const getDataConsumption = (req, res) => {
	const { building, period: _period, from: _from, to: _to, offset: _offset } = req.query;
	const to = Number(_to);
	const from = Number(_from);
	const offset = Number(_offset);
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
	for (let i = offset; i <= count; i++) {
		let startDate = Date.now() - period * j;
		let startValue = i * (100 + Math.random() * 100);
		let endValue = startValue + 100 + Math.random() * 100;
		let endDate = startDate + period;
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
	const buildingOb = buildings.find(b => b.uuid === building) || {};
	res.status(200).send({
		building: {
			uuid: building,
			name: `[${buildingOb.code}] ${buildingOb.city}`,
		},
		data,
	});
};

module.exports = {
	useData: router => {
		router.get('/data', getChartData);
		router.get('/data/preview', getChartPreview);
		router.get('/data/stats', getChartStats);

		router.get('/data/configs', getChartConfigs);
		router.post('/data/config', addChartConfig);
		router.put('/data/config/:uuid', updateChartConfig);
		router.delete('/data/config/:uuid', removeChartConfig);

		router.get('/data/consumption', getDataConsumption);
	},
};
