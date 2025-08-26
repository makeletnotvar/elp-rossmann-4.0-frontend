module.exports = {
	enabled: true,
	hashingMethod: 'sha256',
	policy: {
		'base-uri': 'self',
		'object-src': 'none',
		'script-src': ['unsafe-eval', 'self'],
		'font-src': ['self', 'data:'],
		'style-src': ['unsafe-inline', 'self'],
	},
	hashEnabled: {
		'script-src': true,
		'style-src': false,
		'script-src-attr': true,
		'style-src-attr': false,
	},
	nonceEnabled: {
		'script-src': true,
		'style-src': false,
	},
};
