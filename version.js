const fs = require('fs');
const version = require('./src/version.json');

fs.writeFileSync(
	'./src/version.json',
	JSON.stringify(
		{
			...version,
			build: version.build + 1,
			date: new Date(Date.now()).toString(),
		},
		null,
		2
	)
);
