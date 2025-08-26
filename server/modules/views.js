const { fakeUUID } = require('./../fakeData');

let views = [
	{
		uuid: '84d258e4-3210-4f27-815a-3a3c4bd31e3c',
		name: 'W - Wrocław',
		subtitle: 'Standard',
		building: {
			uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd',
			name: 'B - Wrocław',
		},
		user: {
			uuid: 'xxxx-user-abcd-efgh-0dev',
			name: 'dev@el-piast.com',
		},
		config: {
			width: 1500,
			height: 800,
			zoom: 100,
			items: [],
		},
		type: 'draw',
	},
];

const getView = (req, res) => {
	const { uuid } = req.params;
	const view = views.find(view => view.uuid === uuid);
	res.send({ view });
};

const getBuildingViews = (req, res) => {
	res.send({ views });
};

const addView = (req, res) => {
	const { view } = req.body;
	const uuid = fakeUUID();
	const nextView = { ...view, uuid, user: { name: 'dev@el-piast.com', uuid: 'xxxx-user-abcd-efgh-0dev' } };
	views.push(nextView);
	res.status(200).send({ view: nextView });
};

const updateView = (req, res) => {
	const { view } = req.body;
	const { uuid } = req.params;
	const nextView = { ...view, uuid };
	views = views.map(_view => (_view.uuid === uuid ? nextView : _view));
	res.status(200).send({ view: nextView });
};

const removeView = (req, res) => {
	const { uuid } = req.params;
	views = views.filter(view => view.uuid !== uuid);
	res.status(200).send();
};

const selectPoints = (req, res) => {
	const { uuid } = req.params;
	const { q = '' } = req.query;
	res.send({
		points: [
			{
				uuid: 'aaaa',
				name: 'a1',
			},
			{
				uuid: 'bbbb',
				name: 'b1',
			},
			{
				uuid: 'ea1f0d22-mode',
				name: 'ssss',
			},
			{
				uuid: 'hihoud93w8-alarm',
				name: 'dfs',
			},
		],
	});
};

module.exports = {
	useViews: router => {
		router.get('/view/:uuid', getView);
		router.get('/building/:uuid/views', getBuildingViews);
		router.post('/views', addView);
		router.put('/view/:uuid', updateView);
		router.delete('/view/:uuid', removeView);
		router.get('/view/:uuid/points', selectPoints);
	},
};
