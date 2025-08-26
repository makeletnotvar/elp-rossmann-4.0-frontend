const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./server/config');
const router = express.Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
router.use(bodyParser.json({ limit: '50mb' }));

const tokenList = {};
const validUsernames = [`admin@el-piast.com`, `dev@el-piast.com`, `user@el-piast.com`];

router.post('/auth/login', (req, res) => {
	const username = req.body.username;
	const type = username.split('@')[0].toUpperCase();

	const user = {
		uuid: 'xxxx-user-abcd-efgh-0dev',
		username,
		userType: 'DEV',
		type: 'DEV',
		accountType: 'FREE',
		label: type,
		isCustomerMode: true,
	};

	if (validUsernames.includes(username)) {
		const token = jwt.sign(user, config.secret, {
			expiresIn: config.tokenLife,
		});
		const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
			expiresIn: config.refreshTokenLife,
		});
		tokenList[refreshToken] = { username, token };
		res.status(200).cookie('__t', token, { httpOnly: true, signed: true });
		res.status(200).cookie('__r', refreshToken, { httpOnly: true, signed: true });
		res.status(200).json({ user });
	} else {
		res.status(200).clearCookie('__t');
		res.status(200).clearCookie('__r');
		res.status(401).send({ message: 'auth.events.login_incorrect' });
	}
});

router.post('/auth/verify', (req, res) => {
	const username = req.body.username;
	const type = username.split('@')[0].toUpperCase();

	const user = {
		uuid: 'xxxx-user-abcd-efgh-0dev',
		username,
		userType: 'DEV',
		type: 'DEV',
		accountType: 'FREE',
		label: type,
		isEnergyPermitted: true,
	};

	if (validUsernames.includes(username) && req.signedCookies.__r && req.signedCookies.__t) {
		res.status(200).json({ user });
	} else {
		res.status(200).clearCookie('__t');
		res.status(200).clearCookie('__r');
		res.status(401).send({ message: 'auth.events.login_icorrect' });
	}
});

router.post('/auth/logout', (req, res) => {
	res.status(200).clearCookie('__t');
	res.status(200).clearCookie('__r');
	res.status(200).send({ message: 'auth.events.logout' });
});

let i = 0;
router.post('/auth/token', (req, res) => {
	i++;
	console.log('>> Token reload request', i);
	const username = req.body.username;
	const currentRefreshToken = req.signedCookies.__r;
	const isCorrectUsername = Boolean(username);
	const hasRefreshToken = currentRefreshToken && currentRefreshToken in tokenList;
	const hasCorrectRefreshToken = hasRefreshToken && tokenList[currentRefreshToken].username === username;

	console.log('>> User check informations: ', { username, isCorrectUsername, hasRefreshToken, hasCorrectRefreshToken });

	if (isCorrectUsername) {
		const type = username.split('@')[0].toUpperCase();
		const user = {
			uuid: 'xxxx-user-abcd-efgh-0dev',
			username,
			userType: 'DEV',
			type: 'DEV',
			accountType: 'FREE',
			label: type,
			isCustomerMode: true,
		};
		tokenList[currentRefreshToken] = null;
		const token = jwt.sign(user, config.secret, {
			expiresIn: config.tokenLife,
		});
		const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
			expiresIn: config.refreshTokenLife,
		});
		tokenList[refreshToken] = { username, token };
		res.status(200).cookie('__t', token, { httpOnly: true, signed: true });
		res.status(200).cookie('__r', refreshToken, { httpOnly: true, signed: true });
		res.send({ ok: true });
	} else {
		console.log('Wrong data');
		res.status(403).send({ message: 'Invalid request' });
	}
});

router.use(require('./server/tokenChecker'));
router.get('/secure', (req, res) => {
	res.send('I am secured...');
});

const { useBuildings } = require('./server/modules/buildings');
useBuildings(router);
const { useAlarmsConfig } = require('./server/modules/alarmsConfig');
useAlarmsConfig(router);
const { useFiles } = require('./server/modules/files/files.routes');
useFiles(router);
const { useViews } = require('./server/modules/views');
useViews(router);
const { useDevices } = require('./server/modules/devices');
useDevices(router);
const { useNotifications } = require('./server/modules/notifications');
useNotifications(router);
const { useEvents } = require('./server/modules/events');
useEvents(router);
const { useData } = require('./server/modules/data');
useData(router);
const { useUsers } = require('./server/modules/users');
useUsers(router);
const { useUnits } = require('./server/modules/units');
useUnits(router);
const { useMedia } = require('./server/modules/media');
useMedia(router);
const { useAlarmsBlocks } = require('./server/modules/alarmsBlocks');
useAlarmsBlocks(router);
const { useCompanies } = require('./server/modules/companies/companies.routes');
useCompanies(router);

const corsOptions = {
	origin: [
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:5173',
		'http://127.0.0.1:3000',
		'http://127.0.0.1:3001',
		'http://127.0.0.1:5173',
		'http://192.168.1.111:3000',
		'http://192.168.1.123:3001',
		'http://192.168.1.111:5173',
	],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser('some-secret-cookie-code'));
app.use('/api', router);
app.listen(8080);

console.log('|========= Server started =========|');
console.log('>> Ip:   ', '127.0.0.1');
console.log('>> Port: ', '8080');
console.log('|========= Server started =========|');
