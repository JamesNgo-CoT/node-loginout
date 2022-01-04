const dotenv = require('dotenv');

const nodeLoginout = require('./index');

dotenv.config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const httpsOptions = {
	host: process.env.BASE_HOST,
	path: process.env.BASE_PATH
};

nodeLoginout.prompt('.login.json', httpsOptions, 'app').then((loginResult) => {
	console.log('SUCCESS', loginResult);
	return nodeLoginout.logout(httpsOptions, loginResult);
}).catch((error) => {
	console.error('ERROR', error);
});
