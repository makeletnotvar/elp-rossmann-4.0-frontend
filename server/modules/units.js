let units = [
	{
		xid: 'PC1',
		name: 'Pompa ciepła 1',
		params: [
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
		],
		online: true,
	},
	{
		xid: 'PC2',
		name: 'Pompa ciepła 2',
		params: [
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
		],
		online: false,
	},
	{
		xid: 'PC3',
		name: 'Pompa ciepła 3',
		params: [
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
		],
		online: false,
	},
	{
		xid: 'PC4',
		name: 'Pompa ciepła 4',
		params: [
			{
				param: 'Model',
				value: 'HMI120 12kW',
			},
		],
		online: true,
	},
	{
		xid: 'TCWU',
		name: 'Ciepła woda CWU',
		params: [],
		online: true,
	},
	{
		xid: 'Kociol',
		name: 'Kocioł',
		params: [
			{
				param: 'Model',
				value: 'BHP_W',
			},
		],
	},
	{
		xid: 'CO1',
		name: 'Obieg CO1',
		params: [],
		online: true,
	},
	{
		xid: 'CO2',
		name: 'Obieg CO2',
		params: [],
		online: true,
	},
	{
		xid: 'CO3',
		name: 'Obieg CO3',
		params: [],
	},
	{
		xid: 'CO4',
		name: 'Obieg CO4',
		params: [],
		online: true,
	},
];

const getUnits = (req, res) => {
	res.send({ units });
};

const addUnit = (req, res) => {
	const unit = req.body.unit;
	if (unit) {
		units.push(unit);
		res.send({ unit });
	}
};

const updateUnit = (req, res) => {
	const updatedUnit = req.body.unit;
	units = units.map(unit => {
		if (unit.xid === req.params.unitXid) {
			return updatedUnit;
		} else {
			return unit;
		}
	});
	res.send({ unit: updatedUnit });
};

const removeUnit = (req, res) => {
	units = units.filter(unit => {
		return req.param.gropXid !== unit.xid;
	});
	res.send(204);
};

module.exports = {
	useUnits: router => {
		router.get('/units/:buildingUUID', getUnits);
		router.post('/units/:buildingUUID', addUnit);
		router.put('/units/:buildingUUID/:unitXid', updateUnit);
		router.delete('/units/:buildingUUID/:unitXid', removeUnit);
	},
};
