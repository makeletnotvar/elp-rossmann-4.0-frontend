const { fakeUUID, randArr } = require('./../fakeData');
const { buildings } = require('./buildings');

const getName = () => {
	const buildingsNames = buildings.map(b => b.name);
	const detailed = randArr([
		'Alarm czujnika temperatury nawiewu B1',
		'Alarm czujnika temperatury wywiewu B2',
		'Alarm falownika nawiewu',
		'Alarm falownika wywiewu',
		'Alarm braku komunikacji z klimatyzatorem',
		'Alarm braku komunikacji z falownikiem',
		'Alarm forsowania wyjść sterownika',
		'Alarm czujnika temperatury sali 1',
		'Alarm zewnętrznego czujnika temperatury (B3)',
		'Alarm termostatu nagrzewnicy',
	]);
	return `${randArr(buildingsNames)} - ${detailed}`;
};

let notifications = [
	{
		uuid: fakeUUID(),
		name: getName(),
		event: fakeUUID(),
		read: false,
		activeTs: Date.now() - 10000000,
	},
	{
		uuid: fakeUUID(),
		name: getName(),
		event: fakeUUID(),
		read: false,
		activeTs: Date.now() - 290939483,
	},
	{
		uuid: fakeUUID(),
		name: getName(),
		event: fakeUUID(),
		read: false,
		activeTs: Date.now() - 3423432,
	},
	{
		uuid: fakeUUID(),
		name: getName(),
		event: fakeUUID(),
		read: true,
		activeTs: Date.now() - 4334232,
		readTs: Date.now() - 1233342,
	},
];

setInterval(() => {
	notifications.push({
		uuid: fakeUUID(),
		name: getName(),
		event: fakeUUID(),
		read: false,
		activeTs: Date.now(),
	});
}, 30000);

const getActiveNotificationsCount = (req, res) => {
	res.send({ count: notifications.filter(n => !n.read).length });
};

const getActiveNotifications = (req, res) => {
	res.send({ notifications });
};

const makeNoficationsRead = (req, res) => {
	const uuids = req.query.n instanceof Array ? req.query.n || [] : [req.query.n];
	const newNotifications = [];
	notifications = notifications.map(_notification => {
		const notification = { ..._notification };
		if (uuids.includes(notification.uuid)) {
			notification.read = true;
			notification.readTs = Date.now();
			newNotifications.push(notification);
		}
		return notification;
	});
	res.send({ notifications: newNotifications });
};

module.exports = {
	useNotifications: router => {
		router.get('/notifications/count', getActiveNotificationsCount);
		router.get('/notifications', getActiveNotifications);
		router.put('/notifications/read', makeNoficationsRead);
	},
};
