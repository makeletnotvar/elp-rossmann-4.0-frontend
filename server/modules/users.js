const usersData = require('./../mocks/users.json');
const jwt = require('jsonwebtoken');
const config = require('./../config.json');
const { fakeUUID } = require('../fakeData');

const auditEvents = [
	{
		user: { uuid: 'xxxx-user-abcd-efgh-0dev', username: 'dev@el-piast.com' },
		ts: 1715850987000,
		type: 'VIRTUAL_HMI_SETPOINT',
		details: {
			building: { uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'Budynek' },
			point: { uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3eba', name: 'Punkt' },
			previousValue: '22.8',
			nextValue: '23.1',
			param: 'NASTAWA TEMP. (TSET)',
			path: ['MENU GŁÓWNE'],
			regName: 'Tset',
			device: { uuid: 'e1b77c29-b2da', name: 'Urządzenie' },
		},
	},
];

for (let i = 1; i < 20; i++) {
	const ts = Math.round(Date.now() - Math.random() * (1000 * 60 * 60 * 24 * 31));
	const type = ['LOGIN', 'SETPOINT', 'VIRTUAL_HMI', 'BUILDING_UPDATE', 'EVENT_ACKNOWLEDGE'][i > 4 ? 1 : i];
	const refs = {
		LOGIN: null,
		SETPOINT: {
			building: { uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'Budynek' },
			point: {
				uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3eba',
				name: 'Punkt',
				customRender: {
					states: {
						0: 'Stop',
						1: 'Praca-dyżurna',
						2: 'Praca',
						4: '-',
						8: 'Wygrz.wstępne',
						16: 'Schładzanie',
						32: 'Wygrzewanie',
						64: 'Stop-awaria',
						128: 'Tryb serwisowy',
					},
				},
				type: 'enum',
			},
			previousValue: 1,
			nextValue: 2,
		},
		VIRTUAL_HMI: { building: { uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'Budynek' } },
		BUILDING_UPDATE: { building: { uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'Budynek' } },
		EVENT_ACKNOWLEDGE: { building: { uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'Budynek' }, name: 'Alarm falownika wywiewu' },
	};

	auditEvents.push({
		user: {
			uuid: 'xxxx-user-abcd-efgh-0dev',
			username: 'dev@el-piast.com',
		},
		ts: ts,
		type: type,
		details: refs[type],
	});
}

let users = usersData.map(user => ({
	...user,
	lastLoginTs: Date.now(),
	addTs: Date.now(),
	editTs: Date.now(),
	buildingsAdministrator: [
		{
			uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd',
			name: 'B - Wrocław',
		},
	],
}));
const verifyPermissions = async (req, userTypes) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.signedCookies.__t;
	return jwt.verify(token, config.secret, function (err, decodedToken) {
		if (err) {
			return Promise.resolve(false);
		} else {
			return Promise.resolve(userTypes.some(userType => userType === decodedToken.type));
		}
	});
};

const verifyToken = async req => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.signedCookies.__t;
	return jwt.verify(token, config.secret, function (err, decodedToken) {
		if (err) {
			return Promise.resolve(false);
		} else {
			return Promise.resolve(decodedToken);
		}
	});
};

const getUsers = async (req, res) => {
	const token = await verifyToken(req);
	const { username, type } = token;
	if (type === 'DEV') {
		res.send({ users });
	} else if (type === 'ADMIN') {
		res.send({ users: users.filter(user => user.type !== 'DEV') });
	} else {
		res.send({ users: users.filter(user => user.username === username) });
	}
};

const getUser = async (req, res, next) => {
	const { uuid } = req.params;
	const user = users.find(user => user.uuid === uuid);
	const isPermitted = await verifyPermissions(req, ['DEV', 'ADMIN', 'USER']);

	if (isPermitted) {
		if (user) {
			res.send({ user });
		} else {
			res.status(404).send({ message: 'users.events.not_exists' });
		}
	} else {
		res.status(400).send({ message: 'users.events.forbidden' });
	}
};

const createUser = async (req, res) => {
	const { user } = req.body;
	const isPermitted = await verifyPermissions(req, ['DEV', 'ADMIN']);

	if (user) {
		if (isPermitted) {
			if (user.mail && user.mail.indexOf('@') > -1) {
				const newUser = {
					...user,
					username: user.mail,
					uuid: fakeUUID(),
				};

				users.push(newUser);
				res.send({ user: newUser });
			} else {
				res.status(405).send({ message: 'users.events.forbidden' });
			}
		} else {
			res.status(403).send({ message: 'users.events.forbidden' });
		}
	} else {
		res.status(400).send({ message: 'users.events.incorrect_mail' });
	}
};

const deleteUser = async (req, res) => {
	const isPermitted = await verifyPermissions(req, ['DEV', 'ADMIN']);
	const { uuid } = req.params;
	const index = users.findIndex(user => user.uuid === uuid);
	if (isPermitted) {
		if (uuid && index > 0) {
			try {
				users = users.filter(user => user.uuid !== uuid);
				res.status(204).send({});
			} catch (err) {
				res.status(500);
			}
		} else {
			res.status(404).send({ message: 'users.events.not_exists' });
		}
	} else {
		res.status(403).send({ message: 'users.events.forbidden' });
	}
};

const updateUser = (req, res) => {
	users = users.map(user => (user.uuid === req.body.user.uuid ? { ...user, ...req.body.user } : user));
	setTimeout(() => {
		res.send({ user: req.body.user });
	}, 2000);
};

const updateOwnPassword = (req, res) => {
	res.status(200).send({});
};

const updatePassword = (req, res) => {
	res.status(200).send({});
};

const getAuditEvents = (req, res) => {
	res.status(200).send({
		events: auditEvents,
		count: auditEvents.length,
		countAll: auditEvents.length,
	});
};

const getUsersListAll = (req, res) => {
	res.status(200).send({
		users: [{ uuid: 'xxxx-user-abcd-efgh-0dev', name: 'dev@el-piast.com' }],
	});
};

module.exports = {
	useUsers: router => {
		router.get('/users/', getUsers);
		router.get('/users-audits', getAuditEvents);
		router.get('/users/audit', getAuditEvents);
		router.get('/users/list', getUsersListAll);
		router.get('/users/:uuid', getUser);
		router.post('/users', createUser);
		router.put('/users/:uuid', updateUser);
		router.delete('/users/:uuid', deleteUser);
		router.put('/user/password', updateOwnPassword);
		router.put('/users/:uuid/password', updatePassword);
	},
};
